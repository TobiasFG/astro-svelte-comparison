<script lang="ts">
	import { page } from '$app/stores';

	const { title = 'My Application' } = $props<{
		title?: string;
	}>();

	// Navigation links with proper paths
	const navLinks = [{ name: 'Home', href: '/' }];

	// Helper function to check if a link is active based on current path
	function isActive(href: string): boolean {
		// Check if the current URL pathname starts with the link's href
		// This ensures that sub-pages of a section also highlight the main nav item
		return $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/');
	}
</script>

<nav class="border-b border-gray-200 bg-white">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo and Brand Name -->
			<div class="flex flex-shrink-0 items-center">
				<svg
					class="h-8 w-8 text-blue-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
				<span class="ml-2 text-xl font-semibold text-gray-800">{title}</span>
			</div>

			<!-- Navigation Links -->
			<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium
                            ${
															isActive(link.href)
																? 'border-blue-500 text-gray-900'
																: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
														}`}
						aria-current={isActive(link.href) ? 'page' : undefined}
					>
						{link.name}
					</a>
				{/each}
			</div>

			<!-- Mobile menu button -->
			<div class="flex items-center sm:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="sr-only">Open main menu</span>
					<!-- Icon when menu is closed -->
					<svg
						class="block h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state -->
	<div class="hidden sm:hidden" id="mobile-menu">
		<div class="space-y-1 pb-3 pt-2">
			{#each navLinks as link}
				<a
					href={link.href}
					class={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium
                        ${
													isActive(link.href)
														? 'border-blue-500 bg-blue-50 text-blue-700'
														: 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
												}`}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{link.name}
				</a>
			{/each}
		</div>
	</div>
</nav>
