<template>
  <div class="app-wrapper">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- 装饰性浮动元素 -->
    <div class="deco-elements">
      <span class="deco-item deco-1">✿</span>
      <span class="deco-item deco-2">☆</span>
      <span class="deco-item deco-3">♡</span>
      <span class="deco-item deco-4">✦</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.app-main {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
}

.deco-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.deco-item {
  position: absolute;
  opacity: 0.08;
  font-size: 2rem;
}

.deco-1 {
  top: 15%;
  right: 5%;
  color: var(--color-primary);
  animation: floatSlow 6s ease-in-out infinite;
}

.deco-2 {
  top: 40%;
  left: 3%;
  color: var(--color-accent);
  animation: floatSlow 8s ease-in-out infinite 1s;
}

.deco-3 {
  bottom: 20%;
  right: 8%;
  color: var(--color-primary);
  animation: floatSlow 7s ease-in-out infinite 2s;
}

.deco-4 {
  bottom: 35%;
  left: 6%;
  color: var(--color-purple);
  animation: floatSlow 9s ease-in-out infinite 0.5s;
}
</style>
