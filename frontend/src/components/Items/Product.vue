<!-- Product.vue -->
<template>
  <div class="product">
    <img :src="product.imageUrl" alt="Product Image" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <button @click="contactSeller">Зв'язатися</button>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    contactSeller() {
      // Ваша логіка для зв'язку з продавцем
      console.log('Зв\'язатися з продавцем:', this.product.name);
    }
  }
};
</script>

<style scoped>
.product {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  margin-left: 20px;
}
img {
  max-width: 200px;
  height: auto;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
