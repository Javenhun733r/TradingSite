<template>
  <div class="profile">
    <h1>Welcome, {{ user.name }}</h1>
    <div v-if="userItems.length > 0">
      <h2>Your Items</h2>
      <ul>
        <li v-for="item in userItems" :key="item.id">
          <div>{{ item.name }}</div>
          <div>{{ item.description }}</div>
          <div>
            <button @click="editItem(item)">Edit</button>
            <button @click="deleteItem(item.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No items found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        name: '', // Fetch user data from API or Vuex store
      },
      userItems: [], // Array to store user's items
    };
  },
  mounted() {
    this.fetchUserName();
    this.fetchUserItems();
  },
  methods: {
    async fetchUserName() {
      try {
        const response = await axios.get('http://localhost:8081/getUserName', {
          headers: { Authorization: localStorage.getItem("jwt") },
        });
        this.user.name = response.data; // Update user's name in the data object
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    },
    async fetchUserItems() {
      try {

        const response = await axios.get('http://localhost:8081/itemsUser', {
          headers: {Authorization: localStorage.getItem("jwt")},
        });
        this.userItems = response.data;

      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    },
    editItem(item) {
      // Navigate to edit item page with item ID
      this.$router.push(`/edit-item/${item.id}`);
    },
    async deleteItem(itemId) {
      try {
        const token = localStorage.getItem('jwt'); // Retrieve JWT from local storage
        await axios.delete(`http://localhost:8081/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT to the Authorization header
          },
        });
        this.userItems = this.userItems.filter(item => item.id !== itemId);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
  },
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
}
</style>
