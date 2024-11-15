<template>
    <div class="character-creation">
      <h1 class="heading">Character Creation</h1>
  
      <!-- Dropdown for Backgrounds -->
      <label for="background-select">Choose a Background:</label>
      <select id="background-select" v-model="selectedBackground">
        <option value="" disabled selected>Select a background</option>
        <option v-for="background in backgrounds" :key="background.key" :value="background.name">
          {{ background.name }}
        </option>
      </select>
  
      <!-- Dropdown for Races -->
      <label for="race-select">Choose a Race:</label>
      <select id="race-select" v-model="selectedRace">
        <option value="" disabled selected>Select a race</option>
        <option v-for="race in races" :key="race.index" :value="race.name">
          {{ race.name }}
          {{ race.desc }}
          {{ race.subrace_of }}
        </option>
      </select>
  
      <!-- Dropdown for Classes -->
      <label for="class-select">Choose a Class:</label>
      <select id="class-select" v-model="selectedClass">
        <option value="" disabled selected>Select a class</option>
        <option v-for="classItem in classes" :key="classItem.index" :value="classItem.name">
          {{ classItem.name }}
        </option>
      </select>
  
      <!-- Display Selected Options -->
      <div class="selection-summary">
        <h2>Selected Options:</h2>
        <p>Background: {{ selectedBackground }}</p>
        <p>Race: {{ selectedRace }}</p>
        <p>Class: {{ selectedClass }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        backgrounds: [],
        races: [],
        classes: [],
        selectedBackground: '',
        selectedRace: '',
        selectedClass: '',
      };
    },
    created() {
      this.fetchBackgrounds();
      this.fetchRaces();
      this.fetchClasses();
    },
    methods: {
      async fetchBackgrounds() {
        try {
          const response = await fetch('https://api.open5e.com/v2/backgrounds/');
          const data = await response.json();
          this.backgrounds = data.results;
        } catch (error) {
          console.error('Error fetching backgrounds:', error);
        }
      },
      async fetchRaces() {
        try {
          const response = await fetch('https://api.open5e.com/v2/races/');
          const data = await response.json();
          this.races = data.results;
        } catch (error) {
          console.error('Error fetching races:', error);
        }
      },
      async fetchClasses() {
        try {
          const response = await fetch('https://api.open5e.com/v1/classes/');
          const data = await response.json();
          this.classes = data.results;
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      },
    },
  };
  </script>
  
  <style>
  .character-creation {
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  
  .heading {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-top: 1rem;
    font-weight: bold;
  }
  
  select {
    display: block;
    margin-top: 0.5rem;
    padding: 0.5rem;
    width: 100%;
  }
  
  .selection-summary {
    margin-top: 2rem;
    border-top: 1px solid #ccc;
    padding-top: 1rem;
  }
  </style>
  