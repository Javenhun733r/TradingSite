<template>
  <div class="profile">
    <h1>Welcome, {{ user.name }}</h1>

    <div v-if="userItems.length > 0">
      <h2>Your Items</h2>
      <ul>
        <li v-for="item in userItems" :key="item.id" class="item-card">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <div class="item-actions">
            <button @click="editItem(item)" class="action-btn">Edit</button>
            <button @click="deleteItem(item.id)" class="action-btn delete-btn">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No items found.</p>
    </div>

    <!-- Modal Window for Editing Item -->
    <ModalWindow :isActive="isEditModalActive" @update:isActive="isEditModalActive = $event">
      <div class="modal-content">
        <h2>Edit Item</h2>
        <input type="text" v-model="editedItem.name" placeholder="New Name">
        <textarea v-model="editedItem.description" placeholder="New Description"></textarea>
        <button @click="saveEditedItem">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </ModalWindow>
  </div>
</template>
<script>
import axios from 'axios';
import ModalWindow from "@/components/ModalWindows/ModalWindow.vue";

export default {
  components: {ModalWindow},
  data() {
    return {
      user: {
        name: '', // Fetch user data from API or Vuex store
      },
      isEditModalActive: false,
      userItems: [],
      editedItem: {
        id: null,
        name: '',
        description: '',
      },
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
          headers: { Authorization: localStorage.getItem("jwt") },
        });
        this.userItems = response.data;
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    },
    editItem(item) {
      this.editedItem.id = item.id;
      this.editedItem.name = item.name;
      this.editedItem.description = item.description;
      this.isEditModalActive = true;
    },
    async saveEditedItem() {
      try {
        const token = localStorage.getItem('jwt');
        const { id, name, description } = this.editedItem;
        await axios.put(`http://localhost:8081/items/${id}`, { name, description }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update item in the local list
        const index = this.userItems.findIndex(item => item.id === id);
        if (index !== -1) {
          this.userItems[index].name = name;
          this.userItems[index].description = description;
        }
        this.isEditModalActive = false;
      } catch (error) {
        console.error('Error updating item:', error);
      }
    },
    cancelEdit() {
      this.isEditModalActive = false;
    },
    async deleteItem(itemId) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8081/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.item-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info {
  flex-grow: 1;
}

.item-actions {
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
}


input[type="text"],
textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
@media (max-width: 600px) {
  .profile {
    padding: 10px;
  }
}
</style>
