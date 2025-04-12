<script lang="ts">
    import type { Todo } from '$lib/stores/todo-store.svelte';
    
    const { todo, onToggleComplete, onRemove } = $props<{
        todo: Todo;
        onToggleComplete: (id: string) => void;
        onRemove: (id: string) => void;
    }>();
</script>

<div class="p-3 bg-gray-50 rounded-md shadow hover:shadow-md transition-shadow flex items-center justify-between">
    <h2 class="text-lg font-medium text-gray-700" class:line-through={todo.completed}>{todo.title}</h2>
    <div class="flex gap-2">
        <button 
            class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            onclick={() => onToggleComplete(todo.id)}
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
            onclick={() => onRemove(todo.id)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
</div>
