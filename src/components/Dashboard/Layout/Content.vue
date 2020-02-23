<template>
  <div class="content">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </transition>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="scss" scoped>
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }
</style>
