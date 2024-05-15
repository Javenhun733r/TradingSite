<template>
  <ModalWindow v-model:is-active="isAddingItem">
    <div class="verification_window_container">
      <div class="verification_window">
        <button class="closeButton" @click="closeModal">×</button>
        <div class="form-group">
          <label>Назва</label>
          <input type="text" v-model="name" required>
        </div>
        <div class="form-group">
          <label>Опис</label>
          <input type="text" v-model="description" required>
        </div>
        <div class="form-group">
          <label>Категорія</label>
          <select v-model="selectedCategory" @change="updateSubcategories">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Підкатегорія</label>
          <select v-model="selectedSubcategory">
            <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">
              {{ subcategory }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Бажані категорії:</label>
          <div v-for="category in categories" :key="category.id">
            <input
                type="checkbox"
                :id="'wishCategory_' + category.id"
                :value="category.id"
                v-model="selectedWishCategories"
            />
            <label :for="'wishCategory_' + category.id">{{ category.name }}</label>
          </div>
        </div>
        <div class="form-group">
          <label>Фотографії</label>
          <input type="file" ref="photosInput" multiple @change="handleFileUpload">
        </div>
        <button @click="submitNewItem">Підтвердити</button>
        <button @click="closeModal">Закрити</button>
      </div>
    </div>
  </ModalWindow>
  <div class="products-list">
    <h2>Список книг</h2>
    <input type="text" v-model="searchQuery" placeholder="Пошук за назвою" >
    <button @click="toggleFilters"><font-awesome-icon :icon="['fas', 'filter']" /></button>
    <div class="filter-container" v-if="showFilters">
      <div class="filter-group">
        <label for="searchCategory">Категорія:</label>
        <select v-model="searchCategory" @change="updateSearchSubcategories" id="searchCategory">
          <option value="">Оберіть категорію</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="searchSubcategory">Підкатегорія:</label>
        <select v-model="searchSubcategory" id="searchSubcategory">
          <option value="">Оберіть підкатегорію</option>
          <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">
            {{ subcategory }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sortOrder">Сортувати за:</label>
        <select v-model="sortOrder" @change="sortProducts" id="sortOrder">
          <option value="desc">Новіші (спадання)</option>
          <option value="asc">Старіші (зростання)</option>
          <option value="alphaAsc">Назва (А-Я)</option>
          <option value="alphaDesc">Назва (Я-А)</option>
        </select>
      </div>
    </div>
    <button v-if="isAuth" @click="isAddingItem = true">Додати свою книгу</button>
    <div v-if="searchQuery || searchCategory || searchSubcategory" class="product-row">
      <div class="product" v-for="(product, index) in filteredProducts" :key="product.id">
        <Product :product="product" />
        <template v-if="(index + 1) % 5 !== 0 && index !== filteredProducts.length - 1">
          <div class="row-divider"></div>
        </template>
      </div>
    </div>
    <div v-if="!searchQuery & !searchCategory &!searchSubcategory" class="product-row">
      <div class="product" v-for="(product, index) in products" :key="product.id">
        <Product :product="product" />
        <template v-if="(index + 1) % 5 !== 0 && index !== products.length - 1">
          <div class="row-divider"></div>
        </template>
      </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";
import ModalWindow from "@/components/ModalWindows/ModalWindow.vue";
import Product from "@/components/Items/Product.vue";

export default {
  components: {Product, ModalWindow },
  data() {
    return {
      isAuth: false,
      jwt: "",
      name: '',
      description: '',
      uploadedPhotos: [],
      isAddingItem: false,
      products: [],
      selectedCategory: null,
      selectedSubcategory: null,
      searchCategory: null,
      searchSubcategory: null,
      selectedWishCategories: [],
      categories: [],
      subcategories: [],
      searchQuery: '',
      sortOrder: '',
      showFilters: false,
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      if (this.searchCategory) {
        filtered = filtered.filter(product => product.category === this.categories[this.searchCategory-1].name);
      }

      // Apply subcategory filter
      if (this.searchSubcategory) {
        filtered = filtered.filter(product => product.subcategory === this.searchSubcategory);
      }

      // Apply search query filter
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product => product.name.toLowerCase().includes(query));
      }

      return filtered;
    }

  },
  methods: {

    async submitNewItem() {
      try {
        if (!this.name || !this.description || !this.selectedCategory || !this.selectedSubcategory) {
          console.error('Будь ласка, заповніть усі обов’язкові поля.');
          return;
        }

        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('description', this.description);
        formData.append('category', this.categories[this.selectedCategory - 1].name);
        formData.append('subcategory', this.selectedSubcategory);

        // Додаємо всі обрані категорії бажань
        for (const wishCategory of this.selectedWishCategories) {
          formData.append('wishcategories', wishCategory); // Use [] to denote an array in form data
        }
        for (const photo of this.uploadedPhotos) {
          formData.append('photos', photo); // Додаємо файл як бінарні дані
        }

        const jwtToken = localStorage.getItem('jwt');

        const response = await axios.post('http://localhost:8081/create_item', formData, {
          headers: {
            'Authorization': jwtToken,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Елемент успішно додано', response.data);

        this.isAddingItem = false;
        this.name='';
        this.description = '';
        this.selectedCategory = null;
        this.selectedWishCategories = [];
        this.selectedSubcategory = null;
        this.fetchItems();
      } catch (error) {
        console.error('Помилка при додаванні елементу', error);
      }
    },
    toggleFilters() {
      this.showFilters = !this.showFilters; // Змінюємо стан показу фільтрів
    },
    sortProducts() {
      if (this.sortOrder === "desc") {
        // Сортування за спаданням (новіші вгорі)
        this.products.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      } else if (this.sortOrder === "asc") {
        // Сортування за зростанням (старіші вгорі)
        this.products.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      } else if (this.sortOrder === "alphaAsc") {
        // Сортування за назвою (за алфавітом, А-Я)
        this.products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortOrder === "alphaDesc") {
        // Сортування за назвою (за алфавітом, Я-А)
        this.products.sort((a, b) => b.name.localeCompare(a.name));
      }
    },
    handleFileUpload(event) {
      this.uploadedPhotos = Array.from(event.target.files);
    },
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:8081/items');
        this.products = response.data;
      } catch (error) {
        console.error('Помилка при отриманні товарів', error);
      }
    },
    closeModal() {
      this.isAddingItem = false; // Закрити модальне вікно
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8081/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Помилка при отриманні категорій', error);
      }
    },

    async updateSubcategories() {

      if (this.selectedCategory) {
        const selectedCategoryObj = this.categories.find(cat => cat.id === this.selectedCategory);
        if (selectedCategoryObj) {
          this.subcategories = selectedCategoryObj.subcategories;
        }
      } else {
        this.subcategories = []; // Очистити підкатегорії, якщо категорія не обрана
      }
    },
    async updateSearchSubcategories() {
      if (this.searchCategory) {
        const selectedCategoryObj = this.categories.find(cat => cat.id === this.searchCategory);
        if (selectedCategoryObj) {
          this.subcategories = selectedCategoryObj.subcategories;
        }
      } else {
        this.subcategories = [];
      }
    }
  },
  mounted() {
    const jwt = localStorage.getItem("jwt")
    this.isAuth = jwt!==null;
    this.jwt = jwt;
    this.fetchItems();
    this.fetchCategories();
  }
};
</script>

<style scoped>
*{
  margin-left: 5px;
  margin-right: 5px;
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

.verification_window {
  background-color: #fff;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="file"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 12px 24px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}


.product-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}


.row-divider {
  width: 100%;
  height: 20px;
}
.filter-container {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  font-weight: bold;
  margin-right: 10px;
}

.filter-group select {
  width: 200px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>

