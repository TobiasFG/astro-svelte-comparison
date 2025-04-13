<script lang="ts">
    import type { RandomData } from "../../../routes/api/test/+server";

    type PageData = {
        random?: RandomData;
        renderedAt?: string;
        loadTime?: number;
        error?: string | null;
    };

    export let data: PageData = {};
</script>

<div class="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
    <h3 class="text-lg font-semibold mb-4">Server-Side Rendering</h3>

    <div class="mt-6 border-t pt-4">
        <p class="text-sm text-gray-600 mb-2">SSR Benefits:</p>
        <ul class="text-xs text-gray-500 list-disc pl-5 space-y-1">
            <li>Better SEO as content is in initial HTML</li>
            <li>Faster initial content display</li>
            <li>Works without JavaScript</li>
            <li>Consistent rendering across devices</li>
        </ul>
    </div>

    <div class="mt-4 text-center">
        <a href="/ssr-demo" class="text-blue-500 hover:underline"
            >View Full SSR with streaming Demo →</a
        >
    </div>
</div>
