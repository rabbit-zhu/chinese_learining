<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg">
        <img src="/images/hero-banner.png" alt="汉字乐园" class="hero-image" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge animate-bounce-in">🎉 专为小朋友设计</div>
        <h1 class="hero-title animate-slide-up">
          欢迎来到<br />
          <span class="hero-highlight">汉字乐园</span>
        </h1>
        <p class="hero-desc animate-slide-up" style="animation-delay: 0.15s">
          和可爱的小伙伴一起，在游戏中轻松学汉字！
        </p>
        <div class="hero-actions animate-slide-up" style="animation-delay: 0.3s">
          <router-link to="/learn" class="btn-cute btn-primary btn-lg">
            <span>🚀</span> 开始学习
          </router-link>
          <router-link to="/game" class="btn-cute btn-accent btn-lg">
            <span>🎮</span> 玩游戏
          </router-link>
        </div>
        <div class="hero-stats animate-slide-up" style="animation-delay: 0.45s">
          <div class="stat-item">
            <span class="stat-num">{{ hanziData.length }}</span>
            <span class="stat-label">个汉字</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ categories.length }}</span>
            <span class="stat-label">个分类</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">4</span>
            <span class="stat-label">种玩法</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能卡片 -->
    <section class="features-section page-container">
      <h2 class="section-title">✨ 选择你想玩的 ✨</h2>
      <div class="feature-grid">
        <router-link
          v-for="(feature, index) in features"
          :key="feature.path"
          :to="feature.path"
          class="feature-card card-cute"
          :style="{ animationDelay: index * 0.1 + 's', '--card-color': feature.color }"
        >
          <div class="feature-icon-wrap" :style="{ background: feature.gradient }">
            <span class="feature-icon">{{ feature.icon }}</span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
          <div class="feature-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 今日推荐汉字 -->
    <section class="daily-section page-container">
      <h2 class="section-title">🌟 今日推荐 🌟</h2>
      <div class="daily-grid">
        <div
          v-for="item in dailyHanzi"
          :key="item.char"
          class="daily-card"
          @click="goToLearn(item.char)"
        >
          <div class="daily-char-wrap">
            <span class="daily-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ item.char }}</span>
          </div>
          <div class="daily-info">
            <span class="daily-pinyin">{{ item.pinyin }}</span>
            <span class="daily-meaning">{{ item.meaning }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部装饰 -->
    <footer class="home-footer">
      <div class="footer-wave"></div>
      <div class="footer-content">
        <span class="footer-emoji">🐼</span>
        <p>汉字乐园 - 快乐学汉字</p>
        <p class="footer-sub">让每一个小朋友都爱上汉字</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { hanziData, categories } from '@/data/hanzi'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const features = [
  {
    title: '学汉字',
    desc: '认识汉字，学拼音和组词',
    icon: '📖',
    path: '/learn',
    color: '#FF6B9D',
    gradient: 'linear-gradient(135deg, #FF6B9D, #A29BFE)',
  },
  {
    title: '写一写',
    desc: '用手指描写汉字笔画',
    icon: '✏️',
    path: '/practice',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
  },
  {
    title: '小游戏',
    desc: '趣味配对，巩固记忆',
    icon: '🎮',
    path: '/game',
    color: '#FFE66D',
    gradient: 'linear-gradient(135deg, #FFE66D, #FDCB6E)',
  },
  {
    title: '我的星星',
    desc: '查看学习进度和成就',
    icon: '⭐',
    path: '/progress',
    color: '#A29BFE',
    gradient: 'linear-gradient(135deg, #A29BFE, #6C5CE7)',
  },
]

const dailyHanzi = computed(() => {
  const shuffled = [...hanziData].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6)
})

function goToLearn(char: string) {
  router.push({ path: '/learn', query: { char } })
}
</script>

<style scoped>
/* Hero */
.hero-section {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 248, 240, 0.3) 0%,
    rgba(255, 248, 240, 0.7) 50%,
    rgba(255, 248, 240, 1) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px var(--space-xl) var(--space-3xl);
  text-align: center;
  width: 100%;
}

.hero-badge {
  display: inline-block;
  padding: 6px 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  box-shadow: var(--shadow-soft);
  margin-bottom: var(--space-lg);
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.hero-highlight {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3.5rem;
}

.hero-desc {
  font-size: 1.15rem;
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-bottom: var(--space-2xl);
}

.btn-lg {
  padding: 14px 36px;
  font-size: 1.1rem;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-xl);
  padding: var(--space-md) var(--space-xl);
  display: inline-flex;
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--color-primary-light);
  opacity: 0.3;
}

/* Features */
.features-section {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-3xl);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.feature-card {
  text-decoration: none;
  color: var(--color-text);
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  animation: slideUp 0.5s ease-out backwards;
}

.feature-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-bounce);
}

.feature-card:hover .feature-icon-wrap {
  transform: scale(1.1) rotate(-5deg);
}

.feature-icon {
  font-size: 2rem;
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-text);
}

.feature-desc {
  font-size: 0.85rem;
  color: var(--color-text-light);
  line-height: 1.5;
}

.feature-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: var(--transition-smooth);
}

.feature-card:hover .feature-arrow {
  background: var(--color-primary);
  color: white;
  transform: translateX(4px);
}

/* Daily */
.daily-section {
  padding-bottom: var(--space-3xl);
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-md);
}

.daily-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-md);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
}

.daily-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-rainbow);
  background-size: 300% 100%;
  animation: rainbow-border 3s linear infinite;
}

.daily-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: var(--shadow-card-hover);
}

.daily-char-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-sm);
  border: 2px dashed var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  position: relative;
}

.daily-char-wrap::before,
.daily-char-wrap::after {
  content: '';
  position: absolute;
}

.daily-char-wrap::before {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 0;
  border-left: 1px dashed var(--color-primary-light);
  opacity: 0.4;
}

.daily-char-wrap::after {
  left: 0;
  right: 0;
  top: 50%;
  height: 0;
  border-top: 1px dashed var(--color-primary-light);
  opacity: 0.4;
}

.daily-char {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.daily-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.daily-pinyin {
  font-size: 0.85rem;
  color: var(--color-primary);
  font-weight: 600;
}

.daily-meaning {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Footer */
.home-footer {
  position: relative;
  background: var(--gradient-primary);
  padding: var(--space-3xl) var(--space-xl) var(--space-xl);
  text-align: center;
  color: white;
  overflow: hidden;
}

.footer-wave {
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  height: 50px;
  background: var(--color-bg);
  border-radius: 0 0 50% 50%;
}

.footer-content {
  position: relative;
}

.footer-emoji {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--space-sm);
  animation: float 3s ease-in-out infinite;
}

.home-footer p {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.footer-sub {
  opacity: 0.8;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-highlight {
    font-size: 2.5rem;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .daily-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
