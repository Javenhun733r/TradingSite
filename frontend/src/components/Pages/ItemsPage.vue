<template>
  <ModalWindow v-model:is-active="isAddingItem">
    <div class="verification_window_container">
      <div class="verification_window">
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="name" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" v-model="description" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select v-model="selectedCategory" @change="updateSubcategories">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Subcategory</label>
          <select v-model="selectedSubcategory">
            <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">
              {{ subcategory }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Wish Categories</label>
          <select multiple v-model="selectedWishCategories">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Photos</label>
          <input type="file" ref="photosInput" multiple @change="handleFileUpload">
        </div>
        <button @click="submitNewItem">Submit</button>
      </div>
    </div>
  </ModalWindow>
  <div class="products-list">
    <h2>Наші продукти</h2>
    <input type="text" v-model="searchQuery" placeholder="Пошук за назвою" >
    <template v-if="products.length === 0">
      <div>Немає товарів доступних зараз.</div>
    </template>

    <div v-if="searchQuery" class="product-row">
      <div class="product" v-for="(product, index) in filteredProducts" :key="product.id">
        <Product :product="product" />
        <template v-if="(index + 1) % 5 !== 0 && index !== filteredProducts.length - 1">
          <div class="row-divider"></div>
        </template>
      </div>
    </div>
    <div v-if="!searchQuery" class="product-row">
      <div class="product" v-for="(product, index) in products" :key="product.id">
        <Product :product="product" />
        <template v-if="(index + 1) % 5 !== 0 && index !== products.length - 1">
          <div class="row-divider"></div>
        </template>
      </div>
    </div>

    <button @click="isAddingItem = true">Додати свій товар</button>
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
      name: '',
      description: '',
      uploadedPhotos: [],
      isAddingItem: false,
      products: [],
      selectedCategory: null,
      selectedSubcategory: null,
      selectedWishCategories: [],
      categories: [], // Масив категорій
      subcategories: [],
      searchQuery: ''
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
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
        formData.append('category', this.categories[this.selectedCategory].name);
        formData.append('subcategory', this.selectedSubcategory);

        // Додаємо всі обрані категорії бажань
        for (const wishCategory of this.selectedWishCategories) {
          formData.append('wishcategories', wishCategory);
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
        this.fetchItems();
      } catch (error) {
        console.error('Помилка при додаванні елементу', error);
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
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8081/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Помилка при отриманні категорій', error);
      }
    },

    async updateSubcategories() {
      // Отримати підкатегорії для обраної категорії
      if (this.selectedCategory) {
        const selectedCategoryObj = this.categories.find(cat => cat.id === this.selectedCategory);
        if (selectedCategoryObj) {
          this.subcategories = selectedCategoryObj.subcategories;
        }
      } else {
        this.subcategories = []; // Очистити підкатегорії, якщо категорія не обрана
      }
    },
  },
  mounted() {
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



.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="file"] {
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



.row-divider {
  width: 100%;
  height: 20px;
}


</style>

