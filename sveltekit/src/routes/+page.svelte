<script lang="ts">
    import { initTodoStore } from "$lib/stores/todo-store.svelte";
    import { enhance } from "$app/forms";

    const TodoStore = initTodoStore();
    
    // State for the new todo input
    let newTodo = $state("");
    
    // Form action handler
    function addTodo() {
        if (newTodo.trim()) {
            TodoStore.add(newTodo.trim());
            newTodo = ""; // Clear the input after submission
        }
    }
</script>


<div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Todo List</h1>
    
    <!-- Todo input form -->
    <form 
        class="mb-6 flex gap-2" 
        onsubmit={(e) => {
            e.preventDefault();
            addTodo();
        }}
        use:enhance
    >
        <input
            type="text"
            bind:value={newTodo}
            placeholder="Add a new todo..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Add
        </button>
    </form>
    
    <div class="space-y-3">
        {#if TodoStore.isLoading}
            <!-- Loading skeleton UI -->
            <div class="animate-pulse">
                {#each Array(3) as _, i}
                    <div class="p-3 bg-gray-100 rounded-md shadow mb-3">
                        <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                {/each}
            </div>
        {:else}
            {#each TodoStore.todos as todo}
                <div class="p-3 bg-gray-50 rounded-md shadow hover:shadow-md transition-shadow flex items-center justify-between">
                    <h2 class="text-lg font-medium text-gray-700" class:line-through={todo.completed}>{todo.title}</h2>
                    <div class="flex gap-2">
                        <button 
                            class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            onclick={() => TodoStore.toggleComplete(todo.id)}
                        >
                            {#if todo.completed}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                            {/if}
                        </button>
                        <button 
                            aria-label="Delete todo"
                            class="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            onclick={() => TodoStore.remove(todo.id)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            {/each}

            {#if TodoStore.todos.length === 0}
                <p class="text-gray-500 text-center py-4">No todos available.</p>
            {/if}
        {/if}
    </div>
</div>

