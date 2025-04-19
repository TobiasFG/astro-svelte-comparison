// This file extends the PerformanceResourceTiming interface with additional properties
interface PerformanceResourceTiming extends PerformanceEntry {
    deliveryType?: "cache" | "network";
    renderBlockingStatus?: "blocking" | "non-blocking";
}
