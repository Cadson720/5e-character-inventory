<template>
    <div class="background-page">
      <h1 class="title">Select Your Background</h1>
  
      <div class="background-list">
        <div
          v-for="background in backgrounds"
          :key="background.key"
          class="background-card"
        >
          <h2 class="background-name">{{ background.name }}</h2>
          <p class="background-desc" v-if="background.desc">{{ background.desc }}</p>
          <div class="background-benefits" v-if="background.benefits">
            <div
              v-for="benefit in background.benefits"
              :key="benefit.name"
              class="benefit"
            >
              <h3 class="benefit-name">{{ benefit.name }}</h3>
              <p class="benefit-desc">{{ benefit.desc }}</p>
            </div>
          </div>
          <button class="select-button" @click="selectBackground(background)">
            Select
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        backgrounds: [],
      };
    },
    mounted() {
      fetch('https://api.open5e.com/v2/backgrounds/')
        .then(response => response.json())
        .then(data => {
          this.backgrounds = data.results;
        })
        .catch(error => {
          console.error('Error fetching background data:', error);
        });
    },
    methods: {
      selectBackground(background) {
        // Handle background selection logic
        console.log(`Selected background: ${background.name}`);
      },
    },
  };
  </script>
  
  <style>
  .background-page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .progress-indicator {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    gap: 10px;
  }
  
  .progress-bar {
    flex: 1;
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    cursor: pointer;
    background-color: #f9f9f9;
  }
  
  .progress-bar.active {
    font-weight: bold;
    border-color: #000;
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .background-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 20px;
  }
  
  .background-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    transition: box-shadow 0.3s;
  }
  
  .background-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .background-name {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .background-desc {
    font-size: 14px;
    color: #555;
    margin-bottom: 15px;
  }
  
  .benefit {
    margin-bottom: 10px;
  }
  
  .benefit-name {
    font-weight: bold;
  }
  
  .benefit-desc {
    font-size: 13px;
    color: #666;
  }
  
  .select-button {
    padding: 8px 16px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .select-button:hover {
    background-color: #0056b3;
  }
  </style>
  