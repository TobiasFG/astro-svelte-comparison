<script lang="ts">
    import TodoApp from "$lib/components/TodoApp/TodoApp.svelte";
    import * as TimerAppModule from "$lib/components/TimerApp/TimerApp.svelte";
    import NotificationApp from "$lib/components/NotificationApp/NotificationApp.svelte";
    
    const TimerApp = TimerAppModule.default || TimerAppModule;
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">My Test Applications</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Todo App -->
        <div class="bg-white rounded-lg shadow-lg ">
            <TodoApp />
        </div>
        
        <!-- Timer App -->
        <div class="bg-white rounded-lg shadow-lg ">
            <TimerApp />
        </div>
        
        <div class="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 min-h-[300px] ">
            <NotificationApp />
        </div>
        
        <div class="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 min-h-[300px] ">
            <p class="text-gray-500 text-center">App Placeholder 3</p>
        </div>
    </div>
</div>


