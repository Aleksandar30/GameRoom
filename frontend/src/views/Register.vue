<template>
    <div class="register">
        <h2>Register</h2>
        <el-form @submit.prevent="register" label-position="top" :model="form" style="max-width: 400px; margin: auto;">
            <el-form-item label="Username">
                <el-input v-model="form.username" placeholder="Enter username" />
            </el-form-item>
            <el-form-item label="Email">
                <el-input v-model="form.email" placeholder="Enter email" type="email" />
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="form.password" placeholder="Enter password" type="password" show-password />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">Register</el-button>
            </el-form-item>
        </el-form>

        <el-alert v-if="error" type="error" :closable="false" :title="error"
            style="max-width: 400px; margin: 10px auto;" />
        <el-alert v-if="success" type="success" :closable="false" :title="success"
            style="max-width: 400px; margin: 10px auto;" />

        <div style="text-align: center; margin-top: 10px;">
            <router-link to="/">← Back to Home</router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    username: '',
    email: '',
    password: '',
})

const error = ref('')
const success = ref('')

async function register() {
    error.value = ''
    success.value = ''

    try {
        await axios.post('http://localhost:3000/api/register', {
            username: form.value.username,
            email: form.value.email,
            password: form.value.password,
        })
        success.value = 'Registration successful! Redirecting...'
        setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
        error.value = err.response?.data?.error || 'Registration failed.'
    }
}
</script>

<style scoped>
.register {
    padding-top: 50px;
}
</style>
