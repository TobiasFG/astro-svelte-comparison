// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from "@tailwindcss/vite"

import svelte from '@astrojs/svelte'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],

    vite: {
        plugins: [tailwindcss()],
    },

    adapter: node({
        mode: 'standalone'
    })
})