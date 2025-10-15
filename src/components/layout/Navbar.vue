<script lang="ts" setup>
import { LogIn, LogOut, User, Info } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="border-b p-4">
        <nav class="list-none flex items-center justify-between">
            <RouterLink to="/">local-bite</RouterLink>
            <RouterLink to="/">local-bite</RouterLink>

            <div class="flex items-center gap-2">
                <RouterLink to="/login">
                    <LogIn/>
                </RouterLink>
                <!-- <RouterLink to="/">
                    <User/>
                </RouterLink> -->
                <RouterLink to="/about">
                    <Info/>
                </RouterLink>
                <!-- <RouterLink to="/">
                    <LogOut/>
                </RouterLink> -->
            </div>
        </nav>
    </header>
</template>