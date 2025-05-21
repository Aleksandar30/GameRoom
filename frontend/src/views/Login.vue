<template>
    <div class="login">
        <h2>Login</h2>
        <el-form @submit.prevent="login" label-position="top" :model="form" style="max-width: 400px; margin: auto;">
            <el-form-item label="Username or Email">
                <el-input v-model="form.identifier" placeholder="Enter username or email" />
            </el-form-item>

            <el-form-item label="Password">
                <el-input v-model="form.password" placeholder="Enter password" type="password" show-password />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
        </el-form>

        <el-alert v-if="error" type="error" :closable="false" :title="error"
            style="max-width: 400px; margin: 10px auto;" />
        <el-alert v-if="success" type="success" :closable="false" :title="success"
            style="max-width: 400px; margin: 10px auto;" />

        <div style="text-align: center; margin-top: 20px;">
            <router-link to="/">
                <el-button type="info" plain>← Back to Home</el-button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    identifier: '',
    password: ''
})

const error = ref('')
const success = ref('')

async function login() {
    error.value = ''
    success.value = ''

    try {
        const res = await axios.post('http://localhost:3000/api/login', {
            identifier: form.value.identifier,
            password: form.value.password
        })

        // ✅ store user session or token
        sessionStorage.setItem('user', JSON.stringify(res.data.user))

        success.value = 'Login successful! Redirecting...'
        setTimeout(() => router.push('/lobby'), 1000)
    } catch (err: any) {
        error.value = err.response?.data?.error || 'Login failed.'
    }
}
</script>
