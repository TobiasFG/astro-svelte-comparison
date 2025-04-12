<script lang="ts">
    import type { Todo } from '$lib/stores/todo-store.svelte';
    import TodoItem from './TodoItem.svelte';
    
    const { todos, isLoading, onToggleComplete, onRemove } = $props<{
        todos: Todo[];
        isLoading: boolean;
        onToggleComplete: (id: string) => void;
        onRemove: (id: string) => void;
    }>();
</script>

<div class="space-y-3">
    {#if isLoading}
        <!-- Loading skeleton UI -->
        <div class="animate-pulse">
            {#each Array(3) as _, i}
                <div class="p-3 bg-gray-100 rounded-md shadow mb-3">
                    <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
            {/each}
        </div>
    {:else}
        {#each todos as todo}
            <TodoItem 
                {todo}
                {onToggleComplete}
                {onRemove}
            />
        {/each}

        {#if todos.length === 0}
            <p class="text-gray-500 text-center py-4">No todos available.</p>
        {/if}
    {/if}
</div>
