<template>
    <div class="character-detail">
      <h1>{{ character.name }}'s Inventory</h1>
      <div class="inventory-grid">
        <div
          v-for="item in inventory"
          :key="item.inventory_id"
          class="inventory-card"
        >
          <div class="inventory-image-container">
            <img
              src="../assets/Torch.jpg"
              alt="Item Image"
              class="inventory-card-image"
            />
            <div class="inventory-info">
              <p><strong>Category:</strong> {{ item.item_category }}</p>
              <p><strong>Location:</strong> {{ item.location_name }}</p>
              <p><strong>Quantity:</strong> {{ item.quantity }}</p>
            </div>
          </div>
          <div class="inventory-card-content">
            <h3>{{ item.item_name }}</h3>
          </div>
        </div>
      </div>
      <router-link :to="'/characters/' + character.character_id + '/add'">
        <button class="add-item-button">Add Item to Inventory</button>
      </router-link>
    </div>
  </template>  
  

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const character = ref({});
        const inventory = ref([]);

        const fetchCharacterDetails = async () => {
            const characterId = route.params.id;
            const response = await fetch(`http://localhost:5000/api/characters/${characterId}`);
            if (!response.ok) {
                console.error('Failed to fetch character details:', response.statusText);
                return;
            }
            character.value = await response.json();
        };

        const fetchInventory = async () => {
            const characterId = route.params.id;
            const response = await fetch(`http://localhost:5000/api/inventory/${characterId}/items`);
            if (!response.ok) {
                console.error('Failed to fetch inventory:', response.statusText);
                return;
            }
            inventory.value = await response.json();
        };


        onMounted(async () => {
            await fetchCharacterDetails();
            await fetchInventory();
        });

        return { character, inventory };
    },
};
</script>

<style scoped>
.character-detail {
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
  gap: 20px;
  width: 100%; /* Take full width of the viewport */
  max-width: 100%; /* Ensure it doesn't exceed the viewport width */
  justify-content: center;
}

.inventory-card {
  max-width: 400px; /* Max width of the card */
  min-width: 225px; /* Min width of the card */
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 0 auto; /* Center the card in its grid cell */
}

.inventory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.inventory-image-container {
  position: relative;
}

.inventory-card-image {
  width: 100%;
  height: auto;
  display: block;
}

.inventory-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-size: 11px;
  text-align: left;
  line-height: 1.2;
}

.inventory-card-content {
  padding: 10px;
}

.inventory-card-content h3 {
  margin: 0;
  font-size: 18px; /* Adjusted for larger cards */
  color: #333;
}

.add-item-button {
  display: block;
  margin: 30px auto;
  padding: 12px 24px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
}

.add-item-button:hover {
  background: #0056b3;
}
</style>

