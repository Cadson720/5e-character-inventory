<template>
    <div>
        <h1>Add Item to {{ character.name }}'s Inventory</h1>
        <form @submit.prevent="addItem">
            <div>
                <label for="item">Select Item:</label>
                <select v-model="selectedItemId" required>
                    <option v-for="item in items" :value="item.item_id" :key="item.item_id">
                        {{ item.item_name }} ({{ item.item_category }})
                    </option>
                </select>
            </div>
            <div>
                <label for="location">Select Location:</label>
                <select v-model="selectedLocationId" required>
                    <option v-for="location in locations" :value="location.location_id" :key="location.location_id">
                        {{ location.location_name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="quantity">Quantity:</label>
                <input type="number" v-model="quantity" min="1" required />
            </div>
            <button type="submit">Add Item</button>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const character = ref({});
        const items = ref([]);
        const locations = ref([]);
        const selectedItemId = ref(null);
        const selectedLocationId = ref(null);
        const quantity = ref(1);

        const fetchCharacterDetails = async () => {
            const characterId = route.params.id;
            const response = await fetch(`http://localhost:5000/characters/${characterId}`);
            character.value = await response.json();
        };

        const fetchItems = async () => {
            const response = await fetch('http://localhost:5000/items');
            items.value = await response.json();
        };

        const fetchLocations = async () => {
            const characterId = route.params.id;
            const response = await fetch(`http://localhost:5000/locations/${characterId}`);
            locations.value = await response.json();
        };

        const addItem = async () => {
            const characterId = route.params.id;
            const response = await fetch(`http://localhost:5000/inventory/${characterId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: selectedItemId.value,
                    quantity: quantity.value,
                    locationId: selectedLocationId.value
                })
            });

            if (response.ok) {
                alert('Item added successfully!');
                router.push(`/characters/${characterId}`);
            } else {
                alert('Failed to add item. Please try again.');
            }
        };

        onMounted(async () => {
            await fetchCharacterDetails();
            await fetchItems();
            await fetchLocations();
        });

        return {
            character,
            items,
            locations,
            selectedItemId,
            selectedLocationId,
            quantity,
            addItem
        };
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
label {
    font-weight: bold;
}
button {
    margin-top: 20px;
}
</style>
