/**
 * ServerPerformanceMetrics - A class to track server-side rendering performance
 * 
 * This class provides detailed measurement of server-side rendering phases
 * including route resolution, data fetching, and template rendering.
 */

export interface ServerTimingPhase {
    name: string;      // Name of the phase (e.g., "data-fetch", "render")
    start: Date;       // When this phase started
    end?: Date;        // When this phase ended (optional until completed)
    duration?: number; // Duration in ms (calculated when phase ends)
}

export interface ServerResourceUsage {
    memory?: {
        heapUsed: number;    // Memory used in bytes
        heapTotal: number;   // Total heap size in bytes
    };
    cpu?: {
        user: number;        // User CPU time in ms
        system: number;      // System CPU time in ms
    };
}

export interface ExternalRequestMetrics {
    url: string;
    method: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    status?: number;
    success: boolean;
}

export class ServerPerformanceMetrics {
    // Main timestamps
    serverRenderStart: Date;
    serverRenderEnd?: Date;

    // Optional: process start time (for total server time calculation)
    processStartTime?: Date;

    // Detailed timing phases
    phases: ServerTimingPhase[] = [];

    // Current active phase
    private currentPhase?: ServerTimingPhase;

    // External requests (API calls, DB queries)
    externalRequests: ExternalRequestMetrics[] = [];

    // Resource usage before/after
    startResourceUsage?: ServerResourceUsage;
    endResourceUsage?: ServerResourceUsage;

    constructor() {
        this.serverRenderStart = new Date();

        // Try to capture resource usage if available in the environment
        this.captureInitialResourceUsage();
    }

    /**
     * Safe method to capture initial resource usage that works in multiple environments
     * TypeScript-safe implementation that doesn't require Node.js types
     */
    private captureInitialResourceUsage(): void {
        try {
            // Use a type assertion to avoid TypeScript errors with Node.js process
            // Safely access globalThis without referencing global which doesn't exist in browsers
            const _global = (typeof globalThis !== 'undefined' ? globalThis : {}) as any;
            const _process = _global.process as any;

            if (_process && typeof _process.memoryUsage === 'function') {
                const mem = _process.memoryUsage();

                this.startResourceUsage = {
                    memory: {
                        heapUsed: mem.heapUsed,
                        heapTotal: mem.heapTotal
                    }
                };

                if (typeof _process.cpuUsage === 'function') {
                    const cpu = _process.cpuUsage();
                    this.startResourceUsage.cpu = {
                        user: cpu.user / 1000, // Convert to ms
                        system: cpu.system / 1000 // Convert to ms
                    };
                }
            }
        } catch (e) {
            // Ignore if not in Node.js environment or if process API not available
            // This makes the class work in any environment
        }
    }

    /**
     * Start measuring a specific phase of server rendering
     */
    startPhase(name: string): ServerTimingPhase {
        // First, end the current phase if there is one
        if (this.currentPhase && !this.currentPhase.end) {
            this.endPhase();
        }

        const phase: ServerTimingPhase = {
            name,
            start: new Date()
        };

        this.phases.push(phase);
        this.currentPhase = phase;

        return phase;
    }

    /**
     * End the current phase being measured
     */
    endPhase(): ServerTimingPhase | undefined {
        if (!this.currentPhase) {
            return undefined;
        }

        const now = new Date();
        this.currentPhase.end = now;
        this.currentPhase.duration = now.getTime() - this.currentPhase.start.getTime();

        const completedPhase = this.currentPhase;
        this.currentPhase = undefined;

        return completedPhase;
    }

    /**
     * Record an external request (API fetch, database query, etc.)
     */
    recordRequest(request: Omit<ExternalRequestMetrics, 'duration'>): ExternalRequestMetrics {
        const duration = request.endTime.getTime() - request.startTime.getTime();

        const metrics: ExternalRequestMetrics = {
            ...request,
            duration
        };

        this.externalRequests.push(metrics);
        return metrics;
    }

    /**
     * Complete all server-side measurements
     */
    complete(): void {
        // End any current phase
        if (this.currentPhase) {
            this.endPhase();
        }

        // Record server render end time
        this.serverRenderEnd = new Date();

        // Try to capture final resource usage
        this.captureFinalResourceUsage();
    }

    /**
     * Safe method to capture final resource usage
     * TypeScript-safe implementation that doesn't require Node.js types
     */
    private captureFinalResourceUsage(): void {
        try {
            // Use a type assertion to avoid TypeScript errors with Node.js process
            const _global = (typeof globalThis !== 'undefined' ? globalThis : {}) as any;
            const _process = _global.process as any;

            if (_process && typeof _process.memoryUsage === 'function') {
                const mem = _process.memoryUsage();

                this.endResourceUsage = {
                    memory: {
                        heapUsed: mem.heapUsed,
                        heapTotal: mem.heapTotal
                    }
                };

                if (typeof _process.cpuUsage === 'function') {
                    const cpu = _process.cpuUsage();
                    this.endResourceUsage.cpu = {
                        user: cpu.user / 1000, // Convert to ms
                        system: cpu.system / 1000 // Convert to ms
                    };
                }
            }
        } catch (e) {
            // Ignore if not in Node.js environment
        }
    }

    /**
     * Get the total server rendering time in milliseconds
     */
    get totalRenderTime(): number | undefined {
        if (!this.serverRenderEnd) {
            return undefined;
        }

        return this.serverRenderEnd.getTime() - this.serverRenderStart.getTime();
    }

    /**
     * Get metrics for a specific phase by name
     */
    getPhase(name: string): ServerTimingPhase | undefined {
        return this.phases.find(phase => phase.name === name);
    }

    /**
     * Get duration of a specific phase in milliseconds
     */
    getPhaseDuration(name: string): number | undefined {
        const phase = this.getPhase(name);
        return phase?.duration;
    }

    /**
     * Get memory usage difference
     */
    getMemoryDelta(): { used: number, total: number } | undefined {
        if (
            !this.startResourceUsage?.memory ||
            !this.endResourceUsage?.memory
        ) {
            return undefined;
        }

        return {
            used: this.endResourceUsage.memory.heapUsed - this.startResourceUsage.memory.heapUsed,
            total: this.endResourceUsage.memory.heapTotal - this.startResourceUsage.memory.heapTotal
        };
    }

    /**
     * Format a time value in milliseconds
     */
    formatTime(ms: number | null | undefined): string {
        if (ms === null || ms === undefined) {
            return 'N/A';
        }
        return `${Math.round(ms)}ms`;
    }

    /**
     * Format a file size in bytes to a human-readable string
     */
    formatBytes(bytes: number | null | undefined): string {
        if (bytes === null || bytes === undefined) {
            return 'N/A';
        }

        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Get a summary of the server performance metrics
     */
    getSummary(): Record<string, string> {
        const summary: Record<string, string> = {
            totalRenderTime: this.formatTime(this.totalRenderTime)
        };

        // Add phase durations
        this.phases.forEach(phase => {
            if (phase.duration !== undefined) {
                summary[`phase_${phase.name}`] = this.formatTime(phase.duration);
            }
        });

        // Add memory usage if available
        const memDelta = this.getMemoryDelta();
        if (memDelta) {
            summary.memoryUsed = this.formatBytes(memDelta.used);
            summary.memoryTotal = this.formatBytes(memDelta.total);
        }

        return summary;
    }

    /**
     * Create a serializable version of the metrics for passing to the client
     */
    toJSON() {
        return {
            serverRenderStart: this.serverRenderStart,
            serverRenderEnd: this.serverRenderEnd,
            totalRenderTime: this.totalRenderTime,
            phases: this.phases,
            externalRequests: this.externalRequests,
            resourceUsage: {
                start: this.startResourceUsage,
                end: this.endResourceUsage,
                delta: this.getMemoryDelta()
            }
        };
    }
}

/**
 * Helper function to wrap an async function and track its performance
 */
export async function trackServerOperation<T>(
    metrics: ServerPerformanceMetrics,
    phaseName: string,
    operation: () => Promise<T>
): Promise<T> {
    metrics.startPhase(phaseName);
    try {
        return await operation();
    } finally {
        metrics.endPhase();
    }
}

/**
 * Helper function to track an external request like API fetch
 */
export async function trackExternalRequest<T>(
    metrics: ServerPerformanceMetrics,
    url: string,
    method: string,
    requestFn: () => Promise<T>
): Promise<T> {
    const startTime = new Date();
    try {
        const result = await requestFn();
        const endTime = new Date();

        metrics.recordRequest({
            url,
            method,
            startTime,
            endTime,
            success: true
        });

        return result;
    } catch (error) {
        const endTime = new Date();

        metrics.recordRequest({
            url,
            method,
            startTime,
            endTime,
            success: false
        });

        throw error;
    }
}
