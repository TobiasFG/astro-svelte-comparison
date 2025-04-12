<script lang="ts">
    import { initTodoStore } from "$lib/stores/todo-store.svelte";
    import TodoForm from "$lib/components/TodoApp/TodoForm.svelte";
    import TodoList from "$lib/components/TodoApp/TodoList.svelte";

    // Initialize the TodoStore
    const TodoStore = initTodoStore();
</script>

<div class="max-w-md mx-auto mt-8 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Todo List</h1>
    
    <TodoForm onSubmit={(todo) => TodoStore.add(todo)} />
    
    <TodoList 
        todos={TodoStore.todos} 
        isLoading={TodoStore.isLoading}
        onToggleComplete={(id) => TodoStore.toggleComplete(id)}
        onRemove={(id) => TodoStore.remove(id)}
    />
</div>
