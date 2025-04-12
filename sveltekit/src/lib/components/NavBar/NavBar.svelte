<script lang="ts">
    import { page } from '$app/stores';

    const { title = "My Application" } = $props<{
        title?: string;
    }>();
    
    // Navigation links with proper paths
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' }
    ];

    // Helper function to check if a link is active based on current path
    function isActive(href: string): boolean {
        // Check if the current URL pathname starts with the link's href
        // This ensures that sub-pages of a section also highlight the main nav item
        return $page.url.pathname === href || 
               ($page.url.pathname.startsWith(href) && href !== '/');
    }
</script>

<nav class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
            <!-- Logo and Brand Name -->
            <div class="flex-shrink-0 flex items-center">
                <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span class="ml-2 text-xl font-semibold text-gray-800">{title}</span>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                {#each navLinks as link}
                    <a 
                        href={link.href} 
                        class={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                            ${isActive(link.href)
                                ? 'border-blue-500 text-gray-900' 
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                        {link.name}
                    </a>
                {/each}
            </div>
            
            <!-- Mobile menu button -->
            <div class="sm:hidden flex items-center">
                <button 
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                >
                    <span class="sr-only">Open main menu</span>
                    <!-- Icon when menu is closed -->
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div class="sm:hidden hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
            {#each navLinks as link}
                <a
                    href={link.href}
                    class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                        ${isActive(link.href)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                >
                    {link.name}
                </a>
            {/each}
        </div>
    </div>
</nav>
