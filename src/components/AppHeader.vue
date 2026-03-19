<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo-link">
        <span class="logo-icon">🐼</span>
        <span class="logo-text">汉字乐园</span>
      </router-link>
      <nav class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPath = computed(() => route.path)

const navItems = [
  { path: '/learn', label: '学汉字', icon: '📖' },
  { path: '/practice', label: '写一写', icon: '✏️' },
  { path: '/game', label: '小游戏', icon: '🎮' },
  { path: '/progress', label: '我的星星', icon: '⭐' },
]
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(255, 107, 157, 0.1);
  z-index: 1000;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-xl);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: var(--space-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  text-decoration: none;
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition-smooth);
  position: relative;
}

.nav-item:hover {
  background: var(--color-bg-warm);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.nav-item.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-button);
}

.nav-item.active .nav-icon {
  animation: pulse-soft 2s ease-in-out infinite;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-label {
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 var(--space-md);
  }

  .nav-item {
    padding: 6px 10px;
  }

  .nav-label {
    display: none;
  }

  .nav-icon {
    font-size: 1.3rem;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}
</style>
