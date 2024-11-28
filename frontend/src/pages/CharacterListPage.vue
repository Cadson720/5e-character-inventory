<template>
    <div class="character-list-page">
        <h1>Characters</h1>
        <div v-if="user">
            <h2>Welcome, {{ user.username }}</h2>
            <p>Select a character to view details:</p>
            <ul>
                <li v-for="character in characters" :key="character.character_id">
                    <router-link :to="`/characters/${character.character_id}`">
                        {{ character.name }}
                        {{ character.species }}
                        {{ character.class }}
                        {{ character.background }}
                    </router-link>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Please log in to view characters.</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null, // Store logged-in user information
            characters: [], // List of characters for the logged-in user
        };
    },
    created() {
        // Load user data from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);

            // Fetch the user's characters
            fetch(`http://localhost:5000/api/characters?userId=${this.user.profile_id}`)
                .then((res) => res.json())
                .then((data) => {
                    this.characters = data.characters;
                })
                .catch((err) => console.error('Failed to fetch characters:', err));
        }
    },
};
</script>

<style scoped>
    li {
        font-weight: bold;
        margin: 20px;
    }
</style>