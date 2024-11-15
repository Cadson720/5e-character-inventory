<template>
    <div class="race-page">
      <h1 class="title">Select Your Race</h1>
      
      <div class="race-list">
        <div
          v-for="race in races"
          :key="race.key"
          class="race-card"
        >
          <h2 class="race-name">{{ race.name }}</h2>
          <p class="race-desc">{{ race.desc }}</p>
          <button class="select-button" @click="selectRace(race)">
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
        races: [],
      };
    },
    mounted() {
      fetch('https://api.open5e.com/v2/races/')
        .then(response => response.json())
        .then(data => {
          this.races = data.results;
        })
        .catch(error => {
          console.error('Error fetching race data:', error);
        });
    },
    methods: {
      selectRace(race) {
        // Handle race selection logic
        console.log(`Selected race: ${race.name}`);
      },
    },
  };
  </script>
  
  <style>
  .race-page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .progress-indicator {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
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
  
  .race-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .race-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    transition: box-shadow 0.3s;
  }
  
  .race-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .race-name {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .race-desc {
    font-size: 14px;
    color: #555;
    margin-bottom: 15px;
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
  