<template>
  <div class="app-container">
    <ProgressIndicator
      :currentPage="currentPage"
      @navigate="handleNavigation"
    />
    <router-view :currentPage="currentPage" />
  </div>
</template>

<script>
import ProgressIndicator from './components/ProgressIndicator.vue';

export default {
  components: {
    ProgressIndicator,
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  methods: {
    handleNavigation(pageNumber) {
      this.currentPage = pageNumber;
      this.navigateToPage(pageNumber);
    },
    navigateToPage(pageNumber) {
      if (pageNumber === 1) {
        this.$router.push('/');
      } else if (pageNumber === 2) {
        this.$router.push('/class');
      } else if (pageNumber === 3) {
        this.$router.push('/background');
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navigation-buttons {
  margin-top: 20px;
}
</style>
