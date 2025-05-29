<template>
    <div class="wrapper">
        <div class="register-box">
            <h2>Register</h2>
            <el-form @submit.prevent="register" label-position="top" :model="form">
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

            <el-alert v-if="error" type="error" :closable="false" :title="error" class="alert" />
            <el-alert v-if="success" type="success" :closable="false" :title="success" class="alert" />

            <div class="back-link">
                <router-link to="/"> <el-button type="info" plain>← Back to Home</el-button></router-link>
            </div>
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
:root {
    --page-background: linear-gradient(to bottom right, #f3f4f6, #ffffff);
    --text-color: #333;
}

body.dark {
    --page-background: #121212;
    --text-color: #e0e0e0;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--page-background);
    padding: 20px;
    box-sizing: border-box;
}

.register-box {
    background: rgba(255, 255, 255, 0.95);
    color: var(--text-color);
    border: 2px solid #409eff;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
    transition: background 0.3s, border-color 0.3s;
}

body.dark .register-box {
    background: rgba(18, 18, 18, 0.95);
    border-color: #66b1ff;
}

h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
}

.alert {
    margin: 10px 0;
}

.back-link {
    text-align: center;
    margin-top: 20px;
}
</style>
