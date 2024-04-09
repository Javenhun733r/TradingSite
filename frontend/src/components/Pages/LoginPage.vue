<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="login">


      <div class="form-group">
        <label >Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label >Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" class="cta-button">Sign Up</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async login() {
      const userData = {
        username: this.username,
        password: this.password,
      };

      try {
        const response = await axios.post("http://localhost:8081/login", userData);
        localStorage.setItem("jwt", response.data);
        console.log(localStorage.getItem("jwt"));

        await new Promise(resolve => setTimeout(resolve, 0));


        window.location.href = '/';
      } catch (error) {
        console.error("Login failed: " + error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  max-width: 380px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
