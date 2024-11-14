<template>
  <button @click="sayHello" class="button">
    Click Me!
  </button>
</template>

<script>
export default {
  methods: {
    sayHello() {
      alert('Hello from Vue.js and Tailwind CSS!');
    },
  },
};
</script>
