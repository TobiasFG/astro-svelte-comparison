import { getContext, onDestroy, setContext } from 'svelte';
import { browser } from '$app/environment';

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

const STORAGE_KEY = 'svelte-todos';

export class TodoStore {
    todos = $state<Todo[]>([]);
    isLoading = $state(true);

    constructor() {
        // Load todos from localStorage on initialization (only in browser)
        if (browser) {
            // Use Promise to simulate async loading and set proper loading state
            setTimeout(() => {
                const storedTodos = localStorage.getItem(STORAGE_KEY);
                if (storedTodos) {
                    this.todos = JSON.parse(storedTodos);
                }
                this.isLoading = false;
            }, 100); // Small timeout to ensure loading state is visible if needed
        } else {
            // Not in browser, so not loading
            this.isLoading = false;
        }

        // Save todos to localStorage whenever they change
        $effect(() => {
            if (browser && this.todos && !this.isLoading) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
            }
        });

        onDestroy(() => {
            // Cleanup if needed
        });
    }

    add(title: string) {
        const id = crypto.randomUUID();
        this.todos = [...this.todos, {
            id,
            title,
            completed: false,
        }];
    }

    remove(id: string) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
    }

    toggleComplete(id: string) {
        this.todos = this.todos.map(todo =>
            todo.id === id
                ? { ...todo, completed: !todo.completed }
                : todo
        );
    }
}

const TODO_STORE_KEY = Symbol('TODO_STORE');

export function initTodoStore() {
    return setContext(TODO_STORE_KEY, new TodoStore());
}

export function getTodoStore() {
    return getContext<ReturnType<typeof initTodoStore>>(TODO_STORE_KEY);
}