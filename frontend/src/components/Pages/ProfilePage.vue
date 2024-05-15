<template>
  <div class="profile">
    <h1>Вітаємо, {{ user.name }}</h1>

    <div v-if="userItems.length > 0">
      <h2>Ваші книги:</h2>
      <ul>
        <li v-for="item in userItems" :key="item.id" class="item-card">
          <div class="item-info">
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="item.photos[item.currentIndex]" :alt="`Product Image ${item.currentIndex + 1}`"
                     class="product-image">
                <div class="nav-overlay">
                  <button @click="previousPhoto(item)" :disabled="item.currentIndex === 0"
                          class="control-button nav-left">
                    <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                  </button>
                  <button @click="nextPhoto(item)" :disabled="item.currentIndex === item.photos.length - 1"
                          class="control-button nav-right">
                    <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                  </button>
                </div>
              </div>
            </div>
            <h3>{{ item.name }}</h3>
            <h3>Категорія: {{ item.category }}</h3>
            <h3>Підкатегорія: {{ item.subcategory }}</h3>
            <h3>Опис: {{ item.description }}</h3>
          </div>
          <div class="item-actions">
            <button @click="findBestBooks(item)" class="action-btn">Знайти найкращу книжку</button>
            <button @click="editItem(item)" class="action-btn">Редагувати</button>
            <button @click="deleteItem(item.id)" class="action-btn delete-btn">Видалити</button>

          </div>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>У вас поки немає книг.</p>
    </div>

    <!-- Modal Window for Editing Item -->
    <ModalWindow :isActive="isEditModalActive" @update:isActive="isEditModalActive = $event">
      <div class="verification_window_container">
        <div class="modal-content">
          <h2>Edit Item</h2>
          <label>Назва</label>
          <input type="text" v-model="editedItem.name" placeholder="Нова назва">

          <div class="form-group">
            <label>Категорія</label>
            <select v-model="editedItem.category" @change="updateSubcategories">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Підкатегорія</label>
            <select v-model="editedItem.subcategory">
              <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">
                {{ subcategory }}
              </option>
            </select>
          </div>
          <label>Опис</label>
          <textarea v-model="editedItem.description" placeholder="Новий опис"></textarea>
          <button @click="saveEditedItem">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
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
        name: '',
      },
      isEditModalActive: false,
      userItems: [],
      categories: [],
      subcategories: [],
      editedItem: {
        id: null,
        name: '',
        description: '',
        category: '',
        subcategory: '',
      },
    };
  },
  mounted() {
    this.fetchUserName();
    this.fetchUserItems();
    this.fetchCategories();
  },
  methods: {
    async findBestBooks(item) {
      try {
        const {category, wishcategory} = item;


        // Формування URL з параметрами
        const queryParams = new URLSearchParams({
          category: category,
          wishcategory: JSON.stringify(wishcategory),
        });
        localStorage.setItem("category", category);
        localStorage.setItem("wishcategory", JSON.stringify(wishcategory))
        window.location.href = '/bestBooks';
      } catch (error) {
        console.error('Error finding best books:', error);
      }
    },
    async fetchUserName() {
      try {
        const response = await axios.get('http://localhost:8081/getUserName', {
          headers: {Authorization: localStorage.getItem("jwt")},
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
        // Assign initial currentIndex to each item
        this.userItems = response.data.map(item => ({
          ...item,
          currentIndex: 0,
        }));
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8081/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async updateSubcategories() {
      const selectedCategoryObj = this.categories.find(cat => cat.id === this.editedItem.category);
      this.subcategories = selectedCategoryObj ? selectedCategoryObj.subcategories : [];
    },
    editItem(item) {
      this.editedItem.id = item.id;
      this.editedItem.name = item.name;
      this.editedItem.description = item.description;
      this.editedItem.category = this.categories.find(cat => cat.name === item.category)?.id || '';
      this.editedItem.subcategory = item.subcategory;
      this.isEditModalActive = true;
    },
    async saveEditedItem() {
      try {
        const token = localStorage.getItem('jwt');
        const {id, name, description, category, subcategory} = this.editedItem;

        const updatedItem = {name, description};
        if (category) updatedItem.category = this.categories.find(cat => cat.id === category)?.name || '';
        if (subcategory) updatedItem.subcategory = subcategory;

        await axios.put(`http://localhost:8081/items/${id}`, updatedItem, {
          headers: {Authorization: `Bearer ${token}`},
        });

        // Update local item with new data
        const updatedUserItems = this.userItems.map(item => {
          if (item.id === id) {
            return {
              ...item,
              name,
              description,
              category: updatedItem.category,
              subcategory: updatedItem.subcategory,
            };
          }
          return item;
        });

        this.userItems = updatedUserItems;
        this.isEditModalActive = false;
      } catch (error) {
        console.error('Error updating item:', error);
      }
    },
    cancelEdit() {
      this.isEditModalActive = false;
    },
    nextPhoto(item) {
      if (item.currentIndex < item.photos.length - 1) {
        item.currentIndex++;
      }
    },
    previousPhoto(item) {
      if (item.currentIndex > 0) {
        item.currentIndex--;
      }
    },
    async deleteItem(itemId) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8081/items/${itemId}`, {
          headers: {Authorization: `Bearer ${token}`},
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

.image-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.product-image {
  width: 100%; /* Фіксований розмір зображення */
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.nav-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;

  transition: opacity 0.3s ease;
}

.nav-overlay:hover {
  opacity: 1;
}

.control-button {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 30px;
  padding: 10px;
  color: #0056b3;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-left {
  transform: translateX(-50%);
}

.nav-right {
  transform: translateX(50%);
}

@media (max-width: 600px) {
  .profile {
    padding: 10px;
  }
}
.verification_window_container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
}
.modal-content {
  max-height: 80vh; /* Максимальна висота вмісту модального вікна */
  overflow-y: auto; /* Додати вертикальну прокрутку при необхідності */
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>
