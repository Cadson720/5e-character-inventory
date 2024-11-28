<template>
  <div class="center-container">
    <h1 class="heading">Hello World!</h1>
    <p class="paragraph">
      Welcome to your Vue.js app with Tailwind CSS!
    </p>
    <HelloWorldButton />
  </div>
</template>

<script>
import HelloWorldButton from '@/components/HelloWorldButton.vue';

export default {
  components: {
    HelloWorldButton,
  },
};
</script>