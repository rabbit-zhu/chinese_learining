<template>
  <div class="learn-page">
    <div class="page-container">
      <h1 class="section-title">📖 学汉字</h1>

      <!-- 分类选择 -->
      <div class="category-bar">
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          :style="{ '--cat-color': getCatColor(cat) }"
          @click="selectedCategory = cat"
        >
          <span class="cat-emoji">{{ getCatEmoji(cat) }}</span>
          <span>{{ cat }}</span>
        </button>
      </div>

      <!-- 汉字网格 -->
      <div class="hanzi-grid">
        <div
          v-for="(item, index) in filteredHanzi"
          :key="item.char"
          class="hanzi-card card-cute"
          :class="{ selected: selectedHanzi?.char === item.char }"
          :style="{ animationDelay: index * 0.05 + 's' }"
          @click="selectHanzi(item)"
        >
          <div class="hanzi-char-box">
            <span class="hanzi-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ item.char }}</span>
          </div>
          <span class="hanzi-pinyin">{{ item.pinyin }}</span>
        </div>
      </div>

      <!-- 汉字详情面板 -->
      <transition name="detail">
        <div v-if="selectedHanzi" class="detail-panel">
          <div class="detail-card">
            <!-- 关闭按钮 -->
            <button class="detail-close" @click="selectedHanzi = null">
              <el-icon><Close /></el-icon>
            </button>

            <div class="detail-grid">
              <!-- 左侧 - 大字展示 -->
              <div class="detail-left">
                <div class="detail-char-wrap tian-grid">
                  <span class="detail-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ selectedHanzi.char }}</span>
                </div>
                <div class="detail-meta">
                  <span class="detail-pinyin">{{ selectedHanzi.pinyin }}</span>
                  <el-tag round type="info" size="small">{{ selectedHanzi.strokes }} 画</el-tag>
                  <el-tag round size="small" :style="{ background: getCatColor(selectedHanzi.category), color: '#fff', border: 'none' }">
                    {{ selectedHanzi.category }}
                  </el-tag>
                </div>

                <!-- 朗读按钮 -->
                <button class="btn-cute btn-primary" @click="speak(selectedHanzi.char)">
                  🔊 听发音
                </button>
              </div>

              <!-- 右侧 - 详细信息 -->
              <div class="detail-right">
                <div class="detail-section">
                  <h3 class="detail-label">💡 释义</h3>
                  <p class="detail-text">{{ selectedHanzi.meaning }}</p>
                </div>

                <div class="detail-section">
                  <h3 class="detail-label">📝 组词</h3>
                  <div class="word-tags">
                    <span
                      v-for="word in selectedHanzi.words"
                      :key="word"
                      class="word-tag"
                    >
                      {{ word }}
                    </span>
                  </div>
                </div>

                <div class="detail-section">
                  <h3 class="detail-label">💬 例句</h3>
                  <div class="sentences">
                    <p
                      v-for="(sentence, i) in selectedHanzi.sentences"
                      :key="i"
                      class="sentence-item"
                    >
                      {{ sentence }}
                    </p>
                  </div>
                </div>

                <div class="detail-actions">
                  <router-link
                    :to="{ path: '/practice', query: { char: selectedHanzi.char } }"
                    class="btn-cute btn-secondary"
                  >
                    ✏️ 去写一写
                  </router-link>
                  <button class="btn-cute btn-accent" @click="markLearned(selectedHanzi.char)">
                    ⭐ 学会啦
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 学习背景装饰 -->
    <div class="learn-bg-deco">
      <img src="/images/learn-bg.png" alt="" class="learn-bg-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Close } from '@element-plus/icons-vue'
import { hanziData, categories, categoryEmojis, categoryColors } from '@/data/hanzi'
import type { HanziItem } from '@/data/hanzi'
import { ElMessage } from 'element-plus'

const route = useRoute()

const allCategories = ['全部', ...categories]
const selectedCategory = ref('全部')
const selectedHanzi = ref<HanziItem | null>(null)

const filteredHanzi = computed(() => {
  if (selectedCategory.value === '全部') return hanziData
  return hanziData.filter(h => h.category === selectedCategory.value)
})

function getCatEmoji(cat: string) {
  if (cat === '全部') return '🌈'
  return categoryEmojis[cat] || '📚'
}

function getCatColor(cat: string) {
  if (cat === '全部') return '#FF6B9D'
  return categoryColors[cat] || '#FF6B9D'
}

function selectHanzi(item: HanziItem) {
  selectedHanzi.value = item
}

function speak(char: string) {
  const utterance = new SpeechSynthesisUtterance(char)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.6
  utterance.pitch = 1.2
  speechSynthesis.speak(utterance)
}

function markLearned(char: string) {
  const learned: string[] = JSON.parse(localStorage.getItem('learned-hanzi') || '[]')
  if (!learned.includes(char)) {
    learned.push(char)
    localStorage.setItem('learned-hanzi', JSON.stringify(learned))
  }
  ElMessage({
    message: `太棒了！你学会了「${char}」🌟`,
    type: 'success',
    duration: 2000,
  })
}

onMounted(() => {
  const charQuery = route.query.char as string
  if (charQuery) {
    const found = hanziData.find(h => h.char === charQuery)
    if (found) {
      selectedHanzi.value = found
      selectedCategory.value = found.category
    }
  }
})
</script>

<style scoped>
.learn-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: var(--space-3xl);
}

.learn-bg-deco {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
}

.learn-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.page-container {
  position: relative;
  z-index: 1;
}

/* Category Bar */
.category-bar {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-xl);
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  background: var(--color-bg-card);
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-card);
  font-family: var(--font-body);
}

.cat-btn:hover {
  transform: translateY(-2px);
  border-color: var(--cat-color);
  color: var(--cat-color);
}

.cat-btn.active {
  background: var(--cat-color);
  color: white;
  border-color: var(--cat-color);
  box-shadow: 0 4px 15px color-mix(in srgb, var(--cat-color) 40%, transparent);
}

.cat-emoji {
  font-size: 1.1rem;
}

/* Hanzi Grid */
.hanzi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.hanzi-card {
  padding: var(--space-md);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  animation: slideUp 0.4s ease-out backwards;
}

.hanzi-card.selected {
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-card-hover);
}

.hanzi-char-box {
  width: 56px;
  height: 56px;
  border: 2px dashed var(--color-primary-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  position: relative;
}

.hanzi-char-box::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  border-left: 1px dashed var(--color-primary-light);
  opacity: 0.3;
}

.hanzi-char-box::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px dashed var(--color-primary-light);
  opacity: 0.3;
}

.hanzi-char {
  font-size: 1.8rem;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.hanzi-card:hover .hanzi-char {
  color: var(--color-primary);
}

.hanzi-pinyin {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 600;
}

/* Detail Panel */
.detail-panel {
  margin-top: var(--space-lg);
}

.detail-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-float);
  padding: var(--space-xl);
  position: relative;
  overflow: hidden;
}

.detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-rainbow);
  background-size: 300% 100%;
  animation: rainbow-border 3s linear infinite;
}

.detail-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg);
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
  font-size: 1rem;
}

.detail-close:hover {
  background: var(--color-danger);
  color: white;
}

.detail-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-xl);
}

/* Detail Left */
.detail-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.detail-char-wrap {
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-char {
  font-size: 6rem;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.detail-pinyin {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

/* Detail Right */
.detail-right {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.detail-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.detail-text {
  font-size: 1rem;
  color: var(--color-text-light);
  line-height: 1.6;
}

.word-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.word-tag {
  padding: 6px 16px;
  background: var(--color-bg-warm);
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  transition: var(--transition-smooth);
  cursor: default;
}

.word-tag:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.05);
}

.sentences {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.sentence-item {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  color: var(--color-text-light);
  line-height: 1.6;
  border-left: 3px solid var(--color-secondary);
}

.detail-actions {
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-sm);
}

/* Transition */
.detail-enter-active,
.detail-leave-active {
  transition: all 0.3s ease;
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-char-wrap {
    width: 120px;
    height: 120px;
  }

  .detail-char {
    font-size: 4rem;
  }

  .hanzi-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
