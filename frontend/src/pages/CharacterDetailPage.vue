<template>
  <div class="character-detail">
    <!-- Filter and Sort Controls -->
    <div class="filter-sort-container">
      <div>
        <label for="category">Filter by Category:</label>
        <select id="category" v-model="selectedCategory">
          <option value="">All Categories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div>
        <label for="location">Filter by Location:</label>
        <select id="location" v-model="selectedLocation">
          <option value="">All Locations</option>
          <option v-for="location in uniqueLocations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
      <div>
        <label for="sort">Sort by Price:</label>
        <select id="sort" v-model="sortOrder">
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>
      <button class="toggle-button" @click="toggleInventoryContent">
        {{ showInventoryContent ? "Hide Details" : "Show Details" }}
      </button>
    </div>

    <h1>{{ character.name }}'s Inventory</h1>

    <div class="inventory-grid">
      <div
        v-for="item in filteredAndSortedInventory"
        :key="item.inventory_id"
        class="inventory-card"
      >
        <div class="inventory-image-container">
          <img
            :src="item.imagePath"
            alt="Item Image"
            class="inventory-card-image"
            @error="handleImageError"
          />
          <div class="inventory-info-icons">
            <!-- Category Icon -->
            <img
              :src="require(`../assets/${item.item_category.toLowerCase()}.png`)"
              alt="Category Icon"
              class="info-icon"
              @error="handleImageError"
            />
            <!-- Location Icon -->
            <img
              :src="require(`../assets/${item.location_name.toLowerCase()}.png`)"
              alt="Location Icon"
              class="info-icon"
              @error="handleImageError"
            />
            <!-- Favorite Icon -->
            <img
              src="../assets/star.png"
              alt="Favorite Icon"
              class="info-icon"
              v-if="item.isFavorited"
            />
          </div>
        </div>
        <div
          v-if="showInventoryContent"
          class="inventory-card-content"
        >
          <h4>{{ item.item_name }} ({{ item.quantity }})</h4>
        </div>
      </div>
    </div>

    <router-link :to="'/characters/' + character.character_id + '/add'">
      <button class="add-item-button">Add Item to Inventory</button>
    </router-link>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const character = ref({});
    const inventory = ref([]);
    const showInventoryContent = ref(true); // Toggle for showing inventory-card-content
    const selectedCategory = ref(""); // Selected category filter
    const selectedLocation = ref(""); // Selected location filter
    const sortOrder = ref("asc"); // Sort order for price

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
      const fetchedInventory = await response.json();

      // Precompute image paths for each item
      inventory.value = fetchedInventory.map((item) => {
        const imagePath = getImagePath(item.item_name);
        return { ...item, imagePath };
      });
    };

    const getImagePath = (itemName) => {
      try {
        return require(`../assets/${itemName.replace(/\s+/g, '_')}.png`);
      } catch {
        return require('../assets/Torch.png'); // Fallback image
      }
    };

    const handleImageError = (event) => {
      event.target.src = require('../assets/Torch.png');
    };

    const toggleInventoryContent = () => {
      showInventoryContent.value = !showInventoryContent.value;
    };

    // Computed unique categories
    const uniqueCategories = computed(() =>
      [...new Set(inventory.value.map((item) => item.item_category))]
    );

    // Computed unique locations
    const uniqueLocations = computed(() =>
      [...new Set(inventory.value.map((item) => item.location_name))]
    );

    // Filtered and sorted inventory
    const filteredAndSortedInventory = computed(() => {
      let filtered = inventory.value;

      // Apply category filter
      if (selectedCategory.value) {
        filtered = filtered.filter((item) => item.item_category === selectedCategory.value);
      }

      // Apply location filter
      if (selectedLocation.value) {
        filtered = filtered.filter((item) => item.location_name === selectedLocation.value);
      }

      // Apply sorting by price
      filtered.sort((a, b) =>
        sortOrder.value === "asc" ? a.price - b.price : b.price - a.price
      );

      return filtered;
    });

    onMounted(async () => {
      await fetchCharacterDetails();
      await fetchInventory();
    });

    return {
      character,
      inventory,
      showInventoryContent,
      toggleInventoryContent,
      uniqueCategories,
      uniqueLocations,
      selectedCategory,
      selectedLocation,
      sortOrder,
      filteredAndSortedInventory,
      handleImageError,
    };
  },
};
</script>


<style scoped>
.character-detail {
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.filter-sort-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
  gap: 5px;
  background-color: gray;
  padding: 20px;
}

.toggle-button {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-button:hover {
  background: #0056b3;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Always 5 columns */
  gap: 15px;
  width: 100%;
  justify-content: center;
  align-items: start;
}

.inventory-card {
  background: #dbdbdb;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%; /* Adjust to grid column */
  border-radius: 20px;
}

.inventory-card:hover {
  transform: scale(1.02); /* Scales the card slightly */
  outline: 1px solid black; /* Adds a white outline */
  transition: transform 0.15s ease, outline 0.15s ease; /* Smooth transition for scaling and outline */
  border-radius: 20px;
}

.inventory-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.inventory-card-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover; /* Ensure images scale properly within their containers */
  border-radius: 20px 20px 0 0;
}

.inventory-info-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid black;
}

.inventory-card-content {
  padding: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inventory-card-content h4 {
  margin: 0;
  font-size: clamp(12px, 1.5vw, 18px);
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
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
}

.add-item-button:hover {
  background: #0056b3;
}

@media (max-width: 480px) {
  .inventory-grid {
    grid-template-columns: repeat(5, 1fr); /* Still maintain 5 columns, images will scale */
    gap: 5px;
  }

  .inventory-card {
    border-radius: 5px;
  }

  .inventory-card-content h4 {
    font-size: clamp(10px, 1.2vw, 16px);
  }

  .toggle-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
