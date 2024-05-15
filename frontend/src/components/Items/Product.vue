<template>
  <div v-if="product" class="product">
    <div class="image-container">
      <img :src="currentPhoto" :alt="`Product Image ${currentIndex + 1}`" class="product-image">
      <div class="controls">
        <button @click="previousPhoto" :disabled="currentIndex === 0" class="control-button">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <button @click="nextPhoto" :disabled="currentIndex === product.photos.length - 1" class="control-button">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>

    <!-- Інформація про продукт -->
    <h3>{{ product.name }}</h3>
    <h3>Категорія: {{ product.category }}</h3>
    <h3>Підкатегорія: {{ product.subcategory }}</h3>
    <div v-if="product.description" class="product-description">
      <p v-for="(line, index) in splitTextIntoLines(product.description, 30)" :key="index">{{ line }}</p>
    </div>

    <div v-if="product.wishcategory && product.wishcategory.length > 0">
      <h3>Бажані категорії:</h3>
      <ul>
        <li v-for="(category, index) in product.wishcategory" :key="index">{{ category }}</li>
      </ul>
    </div>

    <button v-if="isAuth" class="contact-button" @click="contactSeller">Зв'язатися</button>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/components/router/index.js";

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      isAuth: false,
      jwt: ""
    };
  },
  mounted() {
    const jwt = localStorage.getItem("jwt")
    this.isAuth = jwt!==null;
    this.jwt = jwt;
  },
  computed: {
    currentPhoto() {
      return this.product.photos[this.currentIndex];
    }
  },
  methods: {
    splitTextIntoLines(text, lineLength) {
      const lines = [];
      let line = '';

      for (let i = 0; i < text.length; i++) {
        line += text[i];

        // Якщо довжина поточного рядка досягла бажаної довжини, додати його до масиву і почати новий рядок
        if (line.length === lineLength) {
          lines.push(line);
          line = '';
        }
      }

      // Додати останній рядок, якщо він залишився неповним
      if (line.length > 0) {
        lines.push(line);
      }

      return lines;
    },
    async contactSeller() {
      try {
        const sellerName = this.product.name;
        const response = await axios.post('http://localhost:8081/chats', {
          name: `Чат про обмін ${sellerName}`,
          userIds: [localStorage.getItem('jwt'), this.product.userId]
        });
        window.location.href = '/chats';
        console.log('Чат успішно створено:', response.data);

      } catch (error) {
        console.error('Помилка при створенні чату з продавцем', error);
      }
    },
    nextPhoto() {
      if (this.currentIndex < this.product.photos.length - 1) {
        this.currentIndex++;
      }
    },
    previousPhoto() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
  }
};
</script>

<style scoped>
/* Стилі для компонента product */
.product {

  flex-basis: calc(20% - 20px);
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product .image-container {
  position: relative;
}

.product img.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 4px;
}

.product .controls {
  position: absolute;
  bottom: 50%;
  left: 0;
  right: 0;
  transform: translateY(50%);
  display: flex;
  justify-content: space-between;
}

.control-button {
  padding: 0;
  background-color: transparent;
  color: #007bff;
  border: none;
  cursor: pointer;
}

.control-button {
  font-size: 24px;
}

.control-button:hover {
  color: #0056b3;
}
.product .image-container {
  position: relative;
  display: flex;
  justify-content: center; /* Центруємо зображення по горизонталі */
  align-items: center; /* Центруємо зображення по вертикалі */
  height: 300px; /* Встановлюємо фіксовану висоту контейнера зображення */
}

.product img.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}
.control-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.contact-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

.contact-button:hover {
  background-color: #0056b3;
}
</style>
