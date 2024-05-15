<template>
  <div class="container">
    <h1>Вітаємо вас на сайті для обміну книжок!</h1>
    <p>Тут ви можете обміняти свої книжки, на книжки інших людей, не витрачаючи на це значних коштів, а також збагачуючи свій кругозір.</p>
    <router-link to="/signup" class="cta-button">Почнімо!</router-link>
  </div>
</template>

<script setup>


</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #333;
}

p {
  color: #666;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #0056b3;
}
</style>
