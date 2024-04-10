<template>
  <ModalWindow v-model:is-active="isAddingItem">
    <div class="verification_window_container">
      <div class="verification_window">
        <div class="form-group">
          <label>Name</label>
          <input type="text" id="name" v-model="name" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" id="description" v-model="description" required>
        </div>
        <div class="form-group">
          <label>Photos</label>
          <input type="file" id="photos" ref="photosInput" multiple @change="handleFileUpload">
        </div>
        <button @click="submitNewItem">Submit</button>

      </div>
    </div>
  </ModalWindow>
  <div class="products-list">
    <h2>Наші продукти</h2>
    <div class="product-row" v-for="(product, index) in products" :key="product.id">
      <Product :product="product"/>
      <template v-if="(index + 1) % 5 === 0">
        <div class="row-divider"></div>
      </template>
    </div>
    <div v-if="products.length === 0">Немає товарів доступних зараз.</div>

    <button @click="isAddingItem = true">Add your own item</button>

  </div>
</template>

<script>
import Product from '../Items/Product.vue';
import ModalWindow from "@/components/ModalWindows/ModalWindow.vue";
import axios from "axios";

export default {
  components: {
    Product,
    ModalWindow
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:8081/items');
        this.products = response.data;
      } catch (error) {
        console.error('Помилка при отриманні товарів', error);
      }
    },
    async submitNewItem() {
      try {
        const formData = {
          name: this.name,
          description: this.description,
          photos: this.uploadedPhotos, // Передайте список фотографій
          userId: 1 // Встановіть userId відповідно до вашого поточного користувача
        };
        await axios.post('http://localhost:8081/items', formData);
        // Чітко повідомте про успішне додавання елементу
        console.log('Елемент успішно додано');
        // Закрийте модальне вікно після успішного додавання
        this.isAddingItem = false;
        // Оновіть список елементів після додавання нового елементу
        this.fetchItems();
      } catch (error) {
        console.error('Помилка при додаванні елементу', error);
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.uploadedPhotos.push({url: reader.result});
        };
        reader.readAsDataURL(files[i]);
      }
    }
  },
  mounted() {
    this.fetchItems();
  },

  data() {

    return {
      name: '',
      description: '',
      uploadedPhotos: [],
      isAddingItem: false,
      products: [],
    };
  }
};
</script>

<style scoped>
.products-list {
  margin-left: 20%;
  margin-right: 20%;
}

.product-row {

  flex-wrap: wrap;
  display: inline-block;
}

Product {

  width: 20%; /* Кожен товар по 20% ширини для відображення 5 товарів у рядок */
  padding: 10px;
  box-sizing: border-box;
}

.row-divider {
  width: 100%;
  height: 20px; /* Висота роздільника між рядками товарів */
}
</style>
