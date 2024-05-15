<template>
  <div class="best-books-page">
    <h1>Найкращі книжки для вас</h1>

    <div v-if="bestBooks.length > 0" class="product-grid">
      <div v-for="(product, index) in bestBooks" :key="product.id" class="product">
        <Product :product="product" />
        <template v-if="(index + 1) % 5 !== 0 && index !== bestBooks.length - 1">
          <div class="row-divider"></div>
        </template>
      </div>
    </div>

    <div v-else>
      <p>На жаль, найкращі книжки не знайдені</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Product from "@/components/Items/Product.vue";

export default {
  name: 'BestBooksPage',
  components: { Product },
  data() {
    return {
      bestBooks: [],
    };
  },
  mounted() {
    const category = localStorage.getItem("category");
    const wishcategory = localStorage.getItem("wishcategory");

    // Виклик запиту на сервер з параметрами
    this.fetchBestBooks(category, wishcategory);
  },
  methods: {
    async contactSeller() {
      try {
        const sellerName = this.product.name;
        const response = await axios.post('http://localhost:8081/chats', {
          name: `Chat about trade of ${sellerName}`,
          userIds: [localStorage.getItem('jwt'), this.product.userId]
        });
        window.location.href = '/chats';
        console.log('Чат успішно створено:', response.data);

      } catch (error) {
        console.error('Помилка при створенні чату з продавцем', error);
      }
    },
    async fetchBestBooks(category, wishcategory) {
      try {
        const response = await axios.post('http://localhost:8081/bestBooks', { category, wishcategory }, {
          headers: { Authorization: localStorage.getItem("jwt") },
        });

        this.bestBooks = response.data;
      } catch (error) {
        console.error('Помилка під час отримання найкращих книжок:', error);
      }
    }
  }
}
</script>

<style scoped>
.best-books-page {
  max-width: 1200px;
  margin: 0 auto;

}

.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 стовпців, рівномірно розподілені */
  gap: 20px; /* Відступи між продуктами */
}

.product {
  border: 1px solid #ccc;

  text-align: center;
}

.row-divider {

  width: 100%;
}
</style>
