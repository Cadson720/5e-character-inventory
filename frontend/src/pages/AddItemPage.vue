<template>
  <div class="add-item-container">
    <h1>Add Item to {{ character.name }}'s Inventory</h1>

    <!-- Filters -->
    <div class="filter-sort-container">
      <div>
        <label for="category-filter">Select Categories:</label>
        <div>
          <label v-for="category in uniqueCategories" :key="category" class="checkbox-label">
            <input type="checkbox" v-model="selectedCategories" :value="category" />
            {{ category }}
          </label>
        </div>
      </div>
    </div>

    <!-- Items List -->
    <div class="inventory-grid">
      <div
        v-for="item in filteredItems"
        :key="item.item_id"
        :class="['inventory-card', { selected: selectedItems.includes(item) }]"
        @mousedown="startSelectMode(item)"
        @mouseup="stopSelectMode(item)"
        @click="showItemDetails(item)"
      >
        <div class="inventory-image-container">
          <img :src="getImagePath(item.item_name)" alt="Item Image" @error="handleImageError" />
        </div>
        <div class="inventory-card-content">
          <h4>{{ item.item_name }}</h4>
        </div>
      </div>
    </div>

    <!-- Add to Inventory Button -->
    <button v-if="selectMode && selectedItems.length > 0" @click="openModal">Add Selected Items</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Add Selected Items to Inventory</h2>
        <label for="location">Select Location:</label>
        <select v-model="selectedLocationId" required>
          <option v-for="location in uniqueLocations" :value="location.location_id" :key="location.location_id">
            {{ location.location_name }}
          </option>
        </select>
        <div v-for="item in selectedItems" :key="item.item_id" class="modal-item">
          <span>{{ item.item_name }}:</span>
          <input
            type="number"
            v-model="item.quantity"
            min="1"
            placeholder="Quantity"
            required
          />
        </div>
        <button @click="addSelectedItems">Confirm</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const character = ref({});
    const items = ref([]);
    const selectedItems = ref([]);
    const selectedCategories = ref([]);
    const selectMode = ref(false);
    const showModal = ref(false);
    const selectedLocationId = ref(null);
    let holdTimer = null;

    // Details popup for item
    const showItemDetails = (item) => {
      if (!selectMode.value) {
        alert(`
          Item Details:
          Name: ${item.item_name}
          Category: ${item.item_category}
          Price: ${item.price}
          Weight: ${item.weight}
        `);
      }
    };

    const fetchCharacterDetails = async () => {
      const characterId = route.params.id;
      const response = await fetch(`http://localhost:5000/api/characters/${characterId}`);
      if (!response.ok) {
        console.error("Failed to fetch character details:", response.statusText);
        return;
      }
      character.value = await response.json();
    };

    const fetchItems = async () => {
      const response = await fetch("http://localhost:5000/api/inventory/allItems");
      if (!response.ok) {
        console.error("Failed to fetch items:", response.statusText);
        return;
      }
      items.value = await response.json();
    };

    const uniqueCategories = computed(() =>
      Array.from(new Set(items.value.map((item) => item.item_category)))
    );

    const filteredItems = computed(() => {
      return items.value.filter((item) =>
        selectedCategories.value.length === 0 || selectedCategories.value.includes(item.item_category)
      );
    });

    const getImagePath = (itemName) => {
      try {
        return require(`../assets/items/${itemName.replace(/\s+/g, "_")}.png`);
      } catch {
        return require("../assets/Torch.png");
      }
    };

    const handleImageError = (event) => {
      event.target.src = require("../assets/Torch.png");
    };

    const startSelectMode = (item) => {
      holdTimer = setTimeout(() => {
        selectMode.value = true;
        toggleRowSelection(item);
      }, 99);
    };

    const stopSelectMode = () => {
      clearTimeout(holdTimer);
    };

    const toggleRowSelection = (item) => {
      if (selectedItems.value.includes(item)) {
        selectedItems.value = selectedItems.value.filter((i) => i !== item);
      } else {
        selectedItems.value.push(item);
      }
    };

    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const addSelectedItems = async () => {
      if (!selectedLocationId.value) {
        alert("Please select a location!");
        return;
      }

      const characterId = route.params.id;
      const itemsToAdd = selectedItems.value.map((item) => ({
        character_id: characterId,
        item_id: item.item_id,
        quantity: item.quantity || 1,
        location_id: selectedLocationId.value,
      }));

      try {
        const response = await fetch(`http://localhost:5000/api/characters/${characterId}/bulk-add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsToAdd }),
        });

        if (response.ok) {
          alert("Items added successfully!");
          closeModal();
          router.push(`/characters/${characterId}`);
        } else {
          throw new Error("Failed to add items");
        }
      } catch (error) {
        console.error(error.message);
        alert("Error adding items. Please try again.");
      }
    };

    onMounted(async () => {
      await fetchCharacterDetails();
      await fetchItems();
    });

    return {
      character,
      items,
      uniqueCategories,
      filteredItems,
      selectedItems,
      selectMode,
      showModal,
      selectedLocationId,
      getImagePath,
      handleImageError,
      startSelectMode,
      stopSelectMode,
      toggleRowSelection,
      openModal,
      closeModal,
      addSelectedItems,
      showItemDetails,
    };
  },
};
</script>

<style scoped>
.add-item-container {
  width: 95%;
}
/* General page layout */
.character-detail {
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

/* Filter section */
.filter-sort-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
}

.filter-sort-container label {
  font-weight: bold;
  margin-right: 10px;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
}

/* Inventory grid */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.inventory-card {
  background: #ffffff;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.inventory-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.inventory-card.selected {
  border: 2px solid #007bff;
  background-color: #eaf4ff;
}

/* Image container */
.inventory-image-container {
  overflow: hidden;
  border-radius: 10px 10px 0px 0px;
}

.inventory-image-container img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 10px 10px 0px 0px;
}

/* Inventory card content */
.inventory-card-content {
  padding: 10px;
}

.inventory-card-content h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-content h2 {
  text-align: center;
  font-size: 20px;
  color: #333;
}

.modal-content label {
  font-weight: bold;
}

.modal-content select,
.modal-content input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-item span {
  font-size: 16px;
  color: #333;
}

.modal-content button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.modal-content button:first-of-type {
  background: #007bff;
  color: white;
}

.modal-content button:first-of-type:hover {
  background: #0056b3;
}

.modal-content button:last-of-type {
  background: #f5f5f5;
  color: #333;
}

.modal-content button:last-of-type:hover {
  background: #e0e0e0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .inventory-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
  }

  .inventory-card-content h4 {
    font-size: 14px;
  }

  .modal-content button {
    font-size: 14px;
  }
}
</style>
