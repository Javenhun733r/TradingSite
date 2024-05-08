<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="text-logo">TradingSite</router-link>
    </div>
    <ul class="nav-links" >
      <li><router-link to="/items">Home</router-link></li>
      <li v-if="isAuth"><router-link to="/profile"> <font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon></router-link></li>
      <li v-if="isAuth"><font-awesome-icon @click="logout()" icon="fa-solid fa-xmark" /></li>
      <li v-if="isAuth"><router-link to="/chats">Chats</router-link></li>
      <li v-if="!isAuth"><router-link to="/login">Login</router-link></li>
      <li v-if="!isAuth"><router-link to="/signup">Register</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Nav-bar",
  data() {
    return {
      isAuth: false,
      jwt: ""
    };
  },
  mounted(){
    const jwt = localStorage.getItem("jwt")
    this.isAuth = jwt!==null;
    this.jwt = jwt;

  },
  methods:{
    logout(){
      this.isAuth = false;
      localStorage.removeItem("jwt")
    }
  }
};
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