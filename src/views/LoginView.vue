<script lang="ts" setup>
const handleClick =( ) => {
    console.log('click')
}
</script>

<template>
    <section class="flex items-center justify-center mt-10">
       <form
        class="grid w-[90%] max-w-[400px] gap-y-1.5 md:gap-y-4 gap-x-4 p-5
                border rounded-lg border-gray-900
                grid-cols-1 md:[grid-template-columns:130px_minmax(0,1fr)] text-sm"
        >
            <!-- full name -->
            <label 
                for="fullname" 
                class=" md:text-right self-center"
            >
                full name
            </label>
            <input 
                id="fullname" 
                type="text"
                placeholder="John Doe"
                class="w-full px-3 py-0.5 rounded-lg border border-gray-800 bg-gray-200 " 
            />

            <!-- email -->
            <label 
                for="email" 
                class=" md:text-right self-center"
            >
                email
            </label>
            <input 
                id="email" 
                type="email"
                placeholder="johndoe@gmail.com"
                class="w-full px-3 py-0.5 rounded-lg border border-gray-800 bg-gray-200" 
            />

            <!-- username -->
            <label 
                for="username" 
                class=" md:text-right self-center"
            >
                username
            </label>
            <input 
                id="username" 
                type="text"
                placeholder="john_doe33"
                class="w-full px-3 py-0.5 rounded-lg border border-gray-800 bg-gray-200" 
            />

            <!-- password -->
            <label 
                for="password" 
                class=" md:text-right self-center"
            >
                password
            </label>
            <input 
                id="password" 
                type="password"
                class="w-full px-3 py-0.5 rounded-lg border border-gray-800 bg-gray-200" 
            />

            <!-- confirm password -->
            <label 
                for="password2" 
                class=" md:text-right self-center"
            >
                confirm
            </label>
            <input 
                id="password2" 
                type="password"
                class="w-full px-3 py-0.5 rounded-lg border border-gray-800 bg-gray-200" 
            />

            <!-- submit -->
            <button
                @click.prevent="handleClick"
                type="submit"
                class="mt-2 md:col-start-2 justify-self-start px-4 py-2 rounded-lg border border-gray-800"
            >
                Sign up
            </button>
            </form>

    </section>
</template>