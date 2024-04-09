<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="text-logo">TradingSite</router-link>
    </div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>

      <li><router-link to="/signup"><font-awesome-icon icon="fa-solid fa-user" /></router-link></li>
    </ul>
  </nav>
</template>

<script setup>

</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo {
  font-size: 1.5rem;

}
.text-logo{
  text-decoration: none;
  color: #fff;
}
.nav-links {
  list-style: none;
  display: flex;
}
.logo a:hover{
  color: #7eb9ff;
}
.nav-links li {
  margin-right: 20px;
}

.nav-links li a {
  color: #fff;
  text-decoration: none;
}

.nav-links li a:hover {
  text-decoration: underline;
}
</style>