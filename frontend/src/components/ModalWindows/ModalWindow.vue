<template>
  <div class="modalWindow" v-if="isActive" @click="hideDialog">
    <div class="modalWindow__content" @click.stop>
      <slot></slot>

    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
  props:{
    isActive:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    hideDialog(){
      this.$emit("update:isActive", false)
    }
  }
}
</script>

<style scoped>
.modalWindow{
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0 , 0.9);
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modalWindow__content{
  background: white;
  height: 300px;
  width: 300px;
  padding: 20px;
  position: relative; /* Додали позицію relative для кнопки */
}

</style>