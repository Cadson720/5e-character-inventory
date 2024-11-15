<template>
    <div class="class-page">
      <h1 class="title">Select Your Class</h1>
  
      <div class="class-list">
        <div
          v-for="charClass in classes"
          :key="charClass.slug"
          class="class-card"
        >
          <h2 class="class-name">{{ charClass.name }}</h2>
          <p class="class-desc" v-html="charClass.desc"></p>
          <button class="select-button" @click="selectClass(charClass)">
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
        classes: [],
      };
    },
    mounted() {
      fetch('https://api.open5e.com/v1/classes/')
        .then(response => response.json())
        .then(data => {
          this.classes = data.results;
        })
        .catch(error => {
          console.error('Error fetching class data:', error);
        });
    },
    methods: {
      selectClass(charClass) {
        // Handle class selection logic
        console.log(`Selected class: ${charClass.name}`);
      },
    },
  };
  </script>
  
  <style>
  .class-page {
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
  
  .class-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .class-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    transition: box-shadow 0.3s;
  }
  
  .class-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .class-name {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .class-desc {
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
  