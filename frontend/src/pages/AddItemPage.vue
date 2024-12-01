<template>
    <div>
      <h1>Add Item to {{ character.name }}'s Inventory</h1>
  
      <!-- Filters -->
      <div class="filter-container">
        <label for="category-filter">Select Categories to Display:</label>
        <div>
          <label v-for="category in uniqueCategories" :key="category" class="checkbox-label">
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="category"
            />
            {{ category }}
          </label>
        </div>
      </div>
  
      <!-- Items Table -->
      <div class="items-container">
        <div v-for="(itemsGroup, category) in filteredGroupedItems" :key="category">
          <h2>{{ category }}</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in itemsGroup"
                :key="item.item_id"
                class="clickable-row"
                @mousedown="toggleRowSelection(item)"
                :class="{ selected: selectedItems.includes(item) }"
              >
                <td>{{ item.item_name }}</td>
                <td>{{ item.item_category }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.weight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add Items to Inventory -->
      <button v-if="selectedItems.length > 0" @click="openModal">Add Selected Items</button>
  
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
      const inventory = ref([]);
      const selectedItems = ref([]);
      const selectedCategories = ref([]);
      const showModal = ref(false);
      const selectedLocationId = ref(null);
  
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
  
      const fetchInventory = async () => {
        const characterId = route.params.id;
        const response = await fetch(`http://localhost:5000/api/inventory/${characterId}/items`);
        if (!response.ok) {
          console.error("Failed to fetch inventory:", response.statusText);
          return;
        }
        inventory.value = await response.json();
      };
  
      const uniqueCategories = computed(() =>
        Array.from(new Set(items.value.map((item) => item.item_category)))
      );
  
      const uniqueLocations = computed(() => {
        const locationMap = new Map();
        inventory.value.forEach((item) => {
          if (!locationMap.has(item.location_id)) {
            locationMap.set(item.location_id, {
              location_id: item.location_id,
              location_name: item.location_name,
            });
          }
        });
        return Array.from(locationMap.values());
      });
  
      const groupedItems = computed(() => {
        const groups = {};
        items.value.forEach((item) => {
          if (!groups[item.item_category]) {
            groups[item.item_category] = [];
          }
          groups[item.item_category].push(item);
        });
  
        for (const category in groups) {
          groups[category].sort((a, b) => a.item_name.localeCompare(b.item_name));
        }
        return groups;
      });
  
      const filteredGroupedItems = computed(() => {
        if (selectedCategories.value.length === 0) {
          return groupedItems.value;
        }
        const filtered = {};
        for (const category in groupedItems.value) {
          if (selectedCategories.value.includes(category)) {
            filtered[category] = groupedItems.value[category];
          }
        }
        return filtered;
      });
  
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
        await fetchInventory();
      });
  
      return {
        character,
        items,
        uniqueCategories,
        uniqueLocations,
        filteredGroupedItems,
        selectedCategories,
        selectedItems,
        selectedLocationId,
        toggleRowSelection,
        openModal,
        closeModal,
        addSelectedItems,
        showModal,
      };
    },
  };
  </script>
  
    
    <style scoped>
    .filter-container {
      margin-bottom: 20px;
    }
    
    .items-container {
      margin-top: 20px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background-color: #f4f4f4;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      width: 100px;
    }
    
    th {
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    tr.clickable-row {
      cursor: pointer;
    }
    
    tr.clickable-row.selected {
      background-color: #d3f3d3;
    }
    
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .modal-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    </style>