<template>
  <div class="progress-page">
    <div class="page-container">
      <h1 class="section-title">⭐ 我的星星</h1>

      <!-- 总览卡片 -->
      <div class="overview-grid">
        <div class="overview-card" style="--card-accent: #FF6B9D">
          <div class="overview-icon">📚</div>
          <div class="overview-num">{{ learnedCount }}</div>
          <div class="overview-label">已学汉字</div>
          <el-progress
            :percentage="learnedPercent"
            :stroke-width="8"
            color="#FF6B9D"
            :show-text="false"
          />
        </div>
        <div class="overview-card" style="--card-accent: #4ECDC4">
          <div class="overview-icon">✏️</div>
          <div class="overview-num">{{ practicedCount }}</div>
          <div class="overview-label">已练习</div>
          <el-progress
            :percentage="practicedPercent"
            :stroke-width="8"
            color="#4ECDC4"
            :show-text="false"
          />
        </div>
        <div class="overview-card" style="--card-accent: #FFE66D">
          <div class="overview-icon">🎮</div>
          <div class="overview-num">{{ gameCount }}</div>
          <div class="overview-label">游戏次数</div>
        </div>
        <div class="overview-card" style="--card-accent: #A29BFE">
          <div class="overview-icon">🌟</div>
          <div class="overview-num">{{ totalStars }}</div>
          <div class="overview-label">获得星星</div>
        </div>
      </div>

      <!-- 成就徽章 -->
      <section class="achievements-section">
        <h2 class="sub-title">🏆 成就徽章</h2>
        <div class="badge-grid">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="badge-card"
            :class="{ unlocked: badge.unlocked }"
          >
            <div class="badge-icon-wrap">
              <span class="badge-icon">{{ badge.icon }}</span>
            </div>
            <span class="badge-name">{{ badge.name }}</span>
            <span class="badge-desc">{{ badge.desc }}</span>
          </div>
        </div>
      </section>

      <!-- 已学汉字列表 -->
      <section class="learned-section">
        <h2 class="sub-title">📖 已学汉字</h2>
        <div v-if="learnedChars.length > 0" class="learned-grid">
          <div
            v-for="char in learnedChars"
            :key="char"
            class="learned-item"
          >
            <span class="learned-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ char }}</span>
            <span class="learned-check">✅</span>
          </div>
        </div>
        <div v-else class="empty-section">
          <span class="empty-icon animate-float">📖</span>
          <p>还没有学过汉字哦，快去学习吧！</p>
          <router-link to="/learn" class="btn-cute btn-primary btn-sm" style="margin-top: 12px;">
            去学习
          </router-link>
        </div>
      </section>

      <!-- 重置按钮 -->
      <div class="reset-section">
        <button class="reset-btn" @click="confirmReset">
          🗑️ 重置学习记录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { hanziData } from '@/data/hanzi'
import { ElMessageBox, ElMessage } from 'element-plus'

const learnedChars = ref<string[]>([])
const practicedChars = ref<string[]>([])
const gameRecords = ref<any[]>([])

const learnedCount = computed(() => learnedChars.value.length)
const practicedCount = computed(() => practicedChars.value.length)
const gameCount = computed(() => gameRecords.value.length)
const totalStars = computed(() => learnedCount.value * 2 + practicedCount.value + gameCount.value * 3)

const learnedPercent = computed(() => Math.round((learnedCount.value / hanziData.length) * 100))
const practicedPercent = computed(() => Math.round((practicedCount.value / hanziData.length) * 100))

const badges = computed(() => [
  {
    id: 'first-char',
    name: '初识汉字',
    desc: '学习第1个汉字',
    icon: '🌱',
    unlocked: learnedCount.value >= 1,
  },
  {
    id: 'five-chars',
    name: '小小学霸',
    desc: '学习5个汉字',
    icon: '📝',
    unlocked: learnedCount.value >= 5,
  },
  {
    id: 'ten-chars',
    name: '识字达人',
    desc: '学习10个汉字',
    icon: '🎓',
    unlocked: learnedCount.value >= 10,
  },
  {
    id: 'all-chars',
    name: '汉字大师',
    desc: '学完所有汉字',
    icon: '👑',
    unlocked: learnedCount.value >= hanziData.length,
  },
  {
    id: 'first-write',
    name: '小小书法家',
    desc: '完成第1次书写',
    icon: '✏️',
    unlocked: practicedCount.value >= 1,
  },
  {
    id: 'first-game',
    name: '游戏新星',
    desc: '完成第1次游戏',
    icon: '🎮',
    unlocked: gameCount.value >= 1,
  },
  {
    id: 'five-games',
    name: '游戏高手',
    desc: '完成5次游戏',
    icon: '🏆',
    unlocked: gameCount.value >= 5,
  },
  {
    id: 'star-collector',
    name: '星星收集者',
    desc: '获得50颗星星',
    icon: '⭐',
    unlocked: totalStars.value >= 50,
  },
])

function loadData() {
  learnedChars.value = JSON.parse(localStorage.getItem('learned-hanzi') || '[]')
  practicedChars.value = JSON.parse(localStorage.getItem('practiced-hanzi') || '[]')
  gameRecords.value = JSON.parse(localStorage.getItem('game-records') || '[]')
}

function confirmReset() {
  ElMessageBox.confirm(
    '确定要重置所有学习记录吗？这个操作不能撤销哦！',
    '重置学习记录',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    localStorage.removeItem('learned-hanzi')
    localStorage.removeItem('practiced-hanzi')
    localStorage.removeItem('game-records')
    loadData()
    ElMessage({ message: '学习记录已重置', type: 'success' })
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.progress-page {
  min-height: 100vh;
  padding-bottom: var(--space-3xl);
}

/* Overview */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.overview-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-accent);
}

.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
}

.overview-icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.overview-num {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-text);
  line-height: 1;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

/* Sub Title */
.sub-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

/* Achievements */
.achievements-section {
  margin-bottom: var(--space-2xl);
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

.badge-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: var(--space-lg) var(--space-md);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: var(--transition-smooth);
  opacity: 0.4;
  filter: grayscale(1);
}

.badge-card.unlocked {
  opacity: 1;
  filter: none;
  box-shadow: var(--shadow-card);
}

.badge-card.unlocked:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-card-hover);
}

.badge-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-card.unlocked .badge-icon-wrap {
  background: var(--gradient-warm);
  animation: pulse-soft 3s ease-in-out infinite;
}

.badge-icon {
  font-size: 1.8rem;
}

.badge-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
}

.badge-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Learned */
.learned-section {
  margin-bottom: var(--space-2xl);
}

.learned-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.learned-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: var(--color-bg-card);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.learned-char {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
}

.learned-check {
  font-size: 0.8rem;
}

.empty-section {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
}

.empty-section .empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-sm);
}

.empty-section p {
  color: var(--color-text-light);
  font-weight: 600;
}

.btn-sm {
  padding: 8px 20px;
  font-size: 0.85rem;
}

/* Reset */
.reset-section {
  text-align: center;
  padding-top: var(--space-xl);
}

.reset-btn {
  padding: 8px 20px;
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-family: var(--font-body);
}

.reset-btn:hover {
  background: var(--color-danger);
  color: white;
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .badge-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
