<template>
    <div class="register">
        <h2>Register</h2>
        <form @submit.prevent="register">
            <input v-model="username" placeholder="Username" required />
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
        <p v-if="error" style="color:red;">{{ error }}</p>
        <p v-if="success" style="color:green;">{{ success }}</p>
        <router-link to="/">← Back</router-link>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

async function register() {
    error.value = ''
    success.value = ''

    try {
        await axios.post('http://localhost:3000/api/register', {
            username: username.value,
            email: email.value,
            password: password.value,
        })
        success.value = 'Registration successful! Redirecting...'
        setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
        error.value = err.response?.data?.error || 'Registration failed.'
    }
}
</script>
