<template>
  <div v-if="product" class="product">
    <swiper :options="swiperOptions" ref="mySwiper">
      <!-- Використовуємо SwiperSlide для кожного фото -->
      <swiper-slide v-for="(photo, index) in product.photos" :key="index">
        <img :src="photo" :alt="'Product Image ' + (index + 1)">
      </swiper-slide>
    </swiper>

    <!-- Кнопки для перемикання слайдів -->
    <div>
      <button @click="goToPrevSlide" :disabled="isBeginning">Попередня</button>
      <button @click="goToNextSlide" :disabled="isEnd">Наступна</button>
    </div>

    <!-- Інформація про продукт -->
    <h3>{{ product.name }}</h3>
    <h3>Категорія: {{product.category}}</h3>
    <h3>Підкатегорія: {{product.subcategory}}</h3>
    <p>{{ product.description }}</p>
    <button @click="contactSeller">Зв'язатися</button>
  </div>
</template>

<script>
import axios from "axios";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'; // Імпортуємо компоненти Swiper

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      swiperOptions: {
        // Опції для Swiper
        slidesPerView: 1,
        centeredSlides: true,
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    };
  },
  computed: {
    // Перевірка, чи початок/кінець каруселі
    isBeginning() {
      return this.$refs.mySwiper ? this.$refs.mySwiper.swiper.isBeginning : true;
    },
    isEnd() {
      return this.$refs.mySwiper ? this.$refs.mySwiper.swiper.isEnd : true;
    }
  },
  methods: {
    async contactSeller() {
      try {
        const sellerName = this.product.name;
        const response = await axios.post('http://localhost:8081/chats', {
          name: `Chat about trade of ${sellerName}`,
          userIds: [localStorage.getItem('jwt'), this.product.userId]
        });
        console.log('Чат успішно створено:', response.data);
      } catch (error) {
        console.error('Помилка при створенні чату з продавцем', error);
      }
    },
    goToNextSlide() {
      if (this.$refs.mySwiper) {
        this.$refs.mySwiper.swiper.slideNext();
      }
    },
    goToPrevSlide() {
      if (this.$refs.mySwiper) {
        this.$refs.mySwiper.swiper.slidePrev();
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

.product img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 4px;
}

.product h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.product p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.product button:hover {
  background-color: #0056b3;
}
</style>
