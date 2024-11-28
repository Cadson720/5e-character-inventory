<template>
    <div class="login-page">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Username:</label>
                <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    placeholder="Enter your username"
                    required
                />
            </div>
            <div>
                <label for="password">Password:</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    placeholder="Enter your password"
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '', // Initialize username
                password: '', // Initialize password
            },
        };
    },
    methods: {
        async login() {
            if (!this.form.username || !this.form.password) {
                alert('Please fill in both username and password.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form), // Send form data
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.error || 'Login failed.');
                    return;
                }

                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user)); // Save user data locally
                alert(`Welcome, ${data.user.username}!`);
                this.$router.push('/characters'); // Navigate to the Characters page
            } catch (err) {
                console.error('Login error:', err);
                alert('An error occurred while logging in.');
            }
        },
    },
};
</script>
