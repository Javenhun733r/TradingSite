  <!-- ProductsList.vue -->
  <template>
    <div class="products-list">
      <h2>Наші продукти</h2>
      <div class="product-row" v-for="(product, index) in products" :key="product.id">
        <Product :product="product" />
        <!-- Додайте роздільник рядків після кожних 5 товарів -->
        <template v-if="(index + 1) % 5 === 0">
          <div class="row-divider"></div>
        </template>
      </div>
      <div v-if="products.length === 0">Немає товарів доступних зараз.</div>
    </div>
  </template>

  <script>
  import Product from '../Items/Product.vue';

  export default {
    components: {
      Product
    },
    data() {
      return {
        products: [
          {
            id: 1,
            name: 'Назва товару 1',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 1'
          },
          {
            id: 2,
            name: 'Назва товару 2',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 2'
          },
          {
            id: 3,
            name: 'Назва товару 1',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 1'
          },
          {
            id: 4,
            name: 'Назва товару 2',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 2'
          },
          {
            id: 5,
            name: 'Назва товару 1',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 1'
          },
          {
            id: 6,
            name: 'Назва товару 2',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 2'
          },
          {
            id: 7,
            name: 'Назва товару 1',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 1'
          },
          {
            id: 8,
            name: 'Назва товару 2',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 2'
          },
          {
            id: 9,
            name: 'Назва товару 1',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 1'
          },
          {
            id: 10,
            name: 'Назва товару 2',
            imageUrl: '@/assets/img.png',
            description: 'Короткий опис товару 2'
          },
        ]
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
