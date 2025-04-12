<script lang="ts">
    import { enhance } from "$app/forms";
    
    const { onSubmit } = $props<{
        onSubmit: (todo: string) => void;
    }>();
    
    let newTodo = $state("");
    
    function handleSubmit(e: Event) {
        e.preventDefault();
        if (newTodo.trim()) {
            onSubmit(newTodo.trim());
            newTodo = ""; // Clear the input after submission
        }
    }
</script>

<form 
    class="mb-6 flex gap-2" 
    onsubmit={handleSubmit}
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
