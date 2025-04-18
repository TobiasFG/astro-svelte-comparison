<script lang="ts">
    import {
        colorMapBg,
        colorMapBorder,
        colorMapText,
        colorMapTextDark,
    } from "$lib/helpers/ColorMaps";
    import { type PerformanceTracker } from "$lib/hooks/usePerformanceTracking.svelte";

    // Define color type based on the available colors in the color maps
    type Color = "indigo" | "blue" | "green" | "red" | "yellow" | "purple";

    // Add server metrics types
    interface ServerTimingPhase {
        name: string;
        start: Date;
        end?: Date;
        duration?: number;
    }

    interface ExternalRequestMetrics {
        url: string;
        method: string;
        startTime: Date;
        endTime: Date;
        duration: number;
        status?: number;
        success: boolean;
    }

    interface ServerMetrics {
        serverRenderStart: Date;
        serverRenderEnd?: Date;
        totalRenderTime?: number;
        phases: ServerTimingPhase[];
        externalRequests: ExternalRequestMetrics[];
        resourceUsage?: {
            start?: any;
            end?: any;
            delta?: any;
        };
    }

    // Define the props using $props() helper
    const props = $props<{
        serverRenderStart: Date | null;
        serverRenderEnd: Date | null;
        renderingType: string;
        color?: Color;
        performance?: PerformanceTracker | null;
        serverMetrics?: ServerMetrics | null;
    }>();

    // Destructure props with defaults
    const {
        serverRenderStart,
        serverRenderEnd,
        renderingType = "Client-side",
        color = "indigo",
        performance = null,
        serverMetrics = null,
    } = props;

    // Track the current time for time elapsed calculations
    let now = $state(new Date());

    // Update current time for elapsed time calculations
    $effect(() => {
        const interval = setInterval(() => {
            now = new Date();
        }, 1000); // Update once per second for better performance

        return () => clearInterval(interval);
    });

    // Calculate time elapsed since server rendered the page
    let timeElapsedSinceServerRender = $derived(
        serverRenderEnd ? now.getTime() - serverRenderEnd.getTime() : null,
    );

    // Format time with the performance tracker's formatter if available, or fall back to our own
    function formatTime(ms: number | null | undefined): string {
        if (ms === null || ms === undefined) return "N/A";
        if (performance?.formatTime) {
            return performance.formatTime(ms);
        }
        return `${Math.round(ms)}ms`;
    }

    // Format bytes to a human-readable string
    function formatBytes(bytes: number | null | undefined): string {
        if (bytes === null || bytes === undefined) {
            return "N/A";
        }

        const units = ["B", "KB", "MB", "GB"];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    // Helper to get a friendly name for server phases
    function getPhaseFriendlyName(name: string): string {
        const nameMap: Record<string, string> = {
            "route-resolution": "Route Resolution",
            "data-fetching": "Data Fetching",
            "template-preparation": "Template Preparation",
            "error-handling": "Error Handling",
        };

        return (
            nameMap[name] ||
            name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        );
    }

    // Determine if detailed server metrics are available
    const hasDetailedServerMetrics = $derived(
        serverMetrics?.phases && serverMetrics.phases.length > 0,
    );

    // Get server phases sorted by start time
    const sortedServerPhases = $derived(
        !serverMetrics?.phases
            ? []
            : [...serverMetrics.phases].sort(
                  (a, b) =>
                      new Date(a.start).getTime() - new Date(b.start).getTime(),
              ),
    );

    // Get external requests sorted by start time
    const sortedExternalRequests = $derived(
        !serverMetrics?.externalRequests
            ? []
            : [...serverMetrics.externalRequests].sort(
                  (a, b) =>
                      new Date(a.startTime).getTime() -
                      new Date(b.startTime).getTime(),
              ),
    );
</script>

<div
    class={`${colorMapBg[color]} p-5 rounded-md border ${colorMapBorder[color]} shadow-sm`}
    aria-labelledby="performance-metrics-heading"
>
    <div class="flex items-center gap-2 mb-3">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class={`h-5 w-5 ${colorMapText[color]}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            aria-label="Performance metrics icon"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
        </svg>
        <h3 id="performance-metrics-heading" class="font-medium text-gray-800">
            Performance Metrics
        </h3>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
        <!-- General Stats -->
        <div class="col-span-2">
            <p class="text-gray-600 font-semibold mb-2">General Stats</p>
            <ul class="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <li class="flex justify-between">
                    <span class="font-medium text-gray-600"
                        >Rendering technique:</span
                    >
                    <span class={colorMapText[color]}>{renderingType}</span>
                </li>
                <li class="flex justify-between">
                    <span class="font-medium text-gray-600">JavaScript:</span>
                    {#if performance?.isHydrated}
                        <span class="text-green-600">Hydrated</span>
                    {:else}
                        <span class="text-yellow-600">Not Hydrated</span>
                    {/if}
                </li>
            </ul>
        </div>

        <!-- Server Stats -->
        <div aria-labelledby="server-stats-heading">
            <p
                id="server-stats-heading"
                class="text-gray-600 font-semibold mb-2"
            >
                Server Stats
            </p>
            <ul class="space-y-2 text-sm">
                <li class="flex justify-between">
                    <span class="font-medium text-gray-600">Load time:</span>
                    {#if serverRenderStart && serverRenderEnd}
                        <span class={`font-mono ${colorMapTextDark[color]}`}>
                            {Math.round(
                                serverRenderEnd.getTime() -
                                    serverRenderStart.getTime(),
                            )}ms
                        </span>
                    {:else}
                        <span class="text-gray-400">Not applicable</span>
                    {/if}
                </li>

                <li class="flex justify-between">
                    <span class="font-medium text-gray-600"
                        >Render started:</span
                    >
                    {#if serverRenderStart}
                        <time
                            datetime={new Date(serverRenderStart).toISOString()}
                        >
                            {new Date(serverRenderStart).toLocaleTimeString(
                                undefined,
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                },
                            )}
                        </time>
                    {:else}
                        <span class="text-gray-400">Not applicable</span>
                    {/if}
                </li>

                <li class="flex justify-between">
                    <span class="font-medium text-gray-600">Render ended:</span>
                    {#if serverRenderEnd}
                        <time
                            datetime={new Date(serverRenderEnd).toISOString()}
                        >
                            {new Date(serverRenderEnd).toLocaleTimeString(
                                undefined,
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                },
                            )}
                        </time>
                    {:else}
                        <span class="text-gray-400">Not applicable</span>
                    {/if}
                </li>

                {#if timeElapsedSinceServerRender !== null}
                    <li class="flex justify-between">
                        <span class="font-medium text-gray-600"
                            >Time since render:</span
                        >
                        <span>{formatTime(timeElapsedSinceServerRender)}</span>
                    </li>
                {/if}

                <!-- Detailed Server Metrics -->
                {#if hasDetailedServerMetrics}
                    <li class="mt-4 pt-3 border-t border-gray-200">
                        <span class="font-semibold text-gray-700"
                            >Server Phases</span
                        >
                    </li>

                    {#each sortedServerPhases as phase}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title={phase.name}
                                >{getPhaseFriendlyName(phase.name)}:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(phase.duration)}
                            </span>
                        </li>
                    {/each}

                    {#if sortedExternalRequests.length > 0}
                        <li class="mt-4 pt-3 border-t border-gray-200">
                            <span class="font-semibold text-gray-700"
                                >External Requests</span
                            >
                        </li>

                        {#each sortedExternalRequests as request}
                            <li class="flex justify-between">
                                <span
                                    class="font-medium text-gray-600"
                                    title={`${request.method} ${request.url}`}
                                >
                                    {request.method}
                                    {request.url.split("/").pop() ||
                                        request.url}:
                                </span>
                                <span
                                    class={`font-mono ${request.success ? colorMapTextDark[color] : "text-red-600"}`}
                                >
                                    {formatTime(request.duration)}
                                </span>
                            </li>
                        {/each}
                    {/if}

                    {#if serverMetrics?.resourceUsage?.delta}
                        <li class="mt-4 pt-3 border-t border-gray-200">
                            <span class="font-semibold text-gray-700"
                                >Server Resources</span
                            >
                        </li>

                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="Memory used during server rendering"
                                >Memory delta:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatBytes(
                                    serverMetrics.resourceUsage.delta.used,
                                )}
                            </span>
                        </li>
                    {/if}
                {/if}
            </ul>
        </div>

        <!-- Client Stats -->
        <div aria-labelledby="client-stats-heading">
            <p
                id="client-stats-heading"
                class="text-gray-600 font-semibold mb-2"
            >
                Client Stats
            </p>
            <ul class="space-y-2 text-sm">
                <!-- Initial render timing -->
                <li class="flex justify-between">
                    <span class="font-medium text-gray-600"
                        >Initial render time:</span
                    >
                    <span class={`font-mono ${colorMapTextDark[color]}`}>
                        {formatTime(performance?.initialRenderTime)}
                    </span>
                </li>

                <li class="flex justify-between">
                    <span class="font-medium text-gray-600"
                        >Render started:</span
                    >
                    {#if performance?.initialRenderStart}
                        <time
                            datetime={performance.initialRenderStart.toISOString()}
                        >
                            {performance.initialRenderStart.toLocaleTimeString(
                                undefined,
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    fractionalSecondDigits: 3,
                                },
                            )}
                        </time>
                    {:else}
                        <span class="text-gray-400">N/A</span>
                    {/if}
                </li>

                <li class="flex justify-between">
                    <span class="font-medium text-gray-600"
                        >Render completed:</span
                    >
                    {#if performance?.initialRenderComplete}
                        <time
                            datetime={performance.initialRenderComplete.toISOString()}
                        >
                            {performance.initialRenderComplete.toLocaleTimeString(
                                undefined,
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    fractionalSecondDigits: 3,
                                },
                            )}
                        </time>
                    {:else}
                        <span class="text-gray-400">N/A</span>
                    {/if}
                </li>

                <!-- Web Vitals Section -->
                {#if performance?.performanceEntries && Object.keys(performance.performanceEntries).length > 0}
                    <li class="mt-4 pt-3 border-t border-gray-200">
                        <span class="font-semibold text-gray-700"
                            >Web Vitals</span
                        >
                    </li>

                    {#if performance.performanceEntries.ttfb !== null}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="Time To First Byte">TTFB:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(
                                    performance.performanceEntries.ttfb,
                                )}
                            </span>
                        </li>
                    {/if}

                    {#if performance.performanceEntries.fcp !== null}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="First Contentful Paint">FCP:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(performance.performanceEntries.fcp)}
                            </span>
                        </li>
                    {/if}

                    {#if performance.performanceEntries.lcp !== null}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="Largest Contentful Paint">LCP:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(performance.performanceEntries.lcp)}
                            </span>
                        </li>
                    {/if}

                    {#if performance.domContentLoaded !== null}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="DOM Content Loaded event">DCL:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(performance.domContentLoaded)}
                            </span>
                        </li>
                    {/if}

                    {#if performance.fullPageLoad !== null}
                        <li class="flex justify-between">
                            <span
                                class="font-medium text-gray-600"
                                title="Full Page Load time">Load complete:</span
                            >
                            <span
                                class={`font-mono ${colorMapTextDark[color]}`}
                            >
                                {formatTime(performance.fullPageLoad)}
                            </span>
                        </li>
                    {/if}
                {/if}
            </ul>
        </div>
    </div>
</div>
