<script lang="ts">
    import TodoApp from "$lib/components/TodoApp.svelte";
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">My Test Applications</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Todo App -->
        <div class="bg-white rounded-lg shadow-lg ">
            <TodoApp />
        </div>
        
        <!-- Placeholder for additional apps -->
        <div class="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 min-h-[300px] ">
            <p class="text-gray-500 text-center">App Placeholder 1</p>
        </div>
        
        <div class="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 min-h-[300px] ">
            <p class="text-gray-500 text-center">App Placeholder 2</p>
        </div>
        
        <div class="flex items-center justify-center bg-white rounded-lg shadow-lg p-6 min-h-[300px] ">
            <p class="text-gray-500 text-center">App Placeholder 3</p>
        </div>
    </div>
</div>


