<script setup>
import Navigation from "@/components/Navigation.vue";
</script>

<template>

  <div class="app">
    <Navigation/>
    <content>
      <router-view/>

    </content>
    <footer>

    </footer>

  </div>
</template>

<style scoped>
*{
  margin: -10px;
  padding: 0;
  box-sizing: border-box;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
}
.app {
  min-height: 97.8vh;
  background-image: url('src/assets/background.jpg');
  background-size: cover;
  background-position: center;
}
</style>
