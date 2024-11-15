<template>
    <div class="progress-bar">
      <div
        v-for="(bar, index) in 3"
        :key="index"
        :class="[
          'progress-segment',
          index + 1 === currentPage ? 'expanded colored' : ''
        ]"
        @click="navigateToPage(index + 1)"
      ></div>
    </div>
    <div class="tab-navigation">
      <span
        :class="['tab-button', { active: currentPage === 1 }]"
        @click="navigateToPage(1)"
      >
        Race
      </span>
      <span
        :class="['tab-button', { active: currentPage === 2 }]"
        @click="navigateToPage(2)"
      >
        Subclass
      </span>
      <span
        :class="['tab-button', { active: currentPage === 3 }]"
        @click="navigateToPage(3)"
      >
        Background
      </span>
    </div>
  </template>
  
  <script>
  export default {
    props: ['currentPage'],
    methods: {
      navigateToPage(pageNumber) {
        this.$emit('navigate', pageNumber);
      },
    },
  };
  </script>
  
  <style>
  .progress-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
    margin: 20px auto;
    background-color: #222;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  
  .progress-segment {
    width: 20px;
    height: 10px;
    background-color: #555;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .expanded {
    height: 20px;
    width: 40px;
  }
  
  .colored {
    background-color: #00f;
  }
  
  .tab-navigation {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    gap: 10px;
    padding: 10px;
  }
  
  .tab-button {
    flex: 1;
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    background-color: #f9f9f9;
    transition: border-color 0.3s, transform 0.3s;
  }
  
  .tab-button:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }
  
  .tab-button.active {
    font-weight: bold;
    border-color: #444; /* Darker outline when active */
  }
  </style>
  