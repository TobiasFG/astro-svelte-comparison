// This file extends built-in TypeScript types with modern browser APIs
interface PerformanceResourceTiming {
    /**
     * Indicates how the resource was delivered, e.g., "cache" or "network"
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/deliveryType
     */
    deliveryType?: "cache" | "network" | string;
}
