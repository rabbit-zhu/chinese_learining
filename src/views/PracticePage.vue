<template>
  <div class="practice-page">
    <div class="page-container">
      <h1 class="section-title">✏️ 写一写</h1>

      <!-- 汉字选择 -->
      <div class="char-selector">
        <div class="char-scroll">
          <button
            v-for="item in hanziData"
            :key="item.char"
            class="char-btn"
            :class="{ active: currentChar?.char === item.char }"
            @click="selectChar(item)"
          >
            {{ item.char }}
          </button>
        </div>
      </div>

      <div class="practice-content" v-if="currentChar">
        <div class="practice-grid">
          <!-- 左侧 - 示范 -->
          <div class="demo-side">
            <div class="demo-card">
              <div class="demo-char-wrap tian-grid">
                <span class="demo-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ currentChar.char }}</span>
              </div>
              <div class="demo-info">
                <span class="demo-pinyin">{{ currentChar.pinyin }}</span>
                <span class="demo-strokes">{{ currentChar.strokes }} 画</span>
              </div>
              <button class="btn-cute btn-primary btn-sm" @click="speak(currentChar.char)">
                🔊 听发音
              </button>
            </div>

            <!-- 提示 -->
            <div class="tips-card">
              <h3 class="tips-title">💡 小提示</h3>
              <ul class="tips-list">
                <li>看左边的字，在右边画板上写</li>
                <li>注意笔画顺序哦</li>
                <li>写完点"检查"按钮</li>
                <li>不满意可以点"清除"重写</li>
              </ul>
            </div>
          </div>

          <!-- 右侧 - 画板 -->
          <div class="canvas-side">
            <div class="canvas-wrapper">
              <div class="canvas-header">
                <span class="canvas-label">在这里写 ✍️</span>
                <div class="canvas-tools">
                  <button class="tool-btn" :class="{ active: penSize === 4 }" @click="penSize = 4">细</button>
                  <button class="tool-btn" :class="{ active: penSize === 8 }" @click="penSize = 8">中</button>
                  <button class="tool-btn" :class="{ active: penSize === 12 }" @click="penSize = 12">粗</button>
                </div>
              </div>
              <div class="canvas-box tian-grid">
                <canvas
                  ref="canvasRef"
                  :width="canvasSize"
                  :height="canvasSize"
                  @mousedown="startDraw"
                  @mousemove="draw"
                  @mouseup="endDraw"
                  @mouseleave="endDraw"
                  @touchstart.prevent="startDrawTouch"
                  @touchmove.prevent="drawTouch"
                  @touchend="endDraw"
                  class="writing-canvas"
                ></canvas>
                <!-- 参考字（淡底） -->
                <span class="canvas-ref-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ currentChar.char }}</span>
              </div>
              <div class="canvas-actions">
                <button class="btn-cute btn-accent" @click="clearCanvas">
                  🗑️ 清除
                </button>
                <button class="btn-cute btn-primary" @click="checkWriting">
                  ✅ 写好了
                </button>
              </div>
            </div>

            <!-- 历史记录 -->
            <div class="history-section" v-if="writingHistory.length > 0">
              <h3 class="history-title">📝 练习记录</h3>
              <div class="history-grid">
                <div
                  v-for="(record, i) in writingHistory"
                  :key="i"
                  class="history-item"
                >
                  <img :src="record.image" :alt="record.char" class="history-img" />
                  <div class="history-stars">
                    <span v-for="s in record.stars" :key="s" class="star active">⭐</span>
                    <span v-for="s in (3 - record.stars)" :key="'e'+s" class="star">☆</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span class="empty-icon animate-float">✏️</span>
        <p class="empty-text">选择一个汉字开始练习吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { hanziData } from '@/data/hanzi'
import type { HanziItem } from '@/data/hanzi'
import { ElMessage } from 'element-plus'

const route = useRoute()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentChar = ref<HanziItem | null>(null)
const isDrawing = ref(false)
const penSize = ref(8)
const canvasSize = 300
const writingHistory = ref<{ char: string; image: string; stars: number }[]>([])

function selectChar(item: HanziItem) {
  currentChar.value = item
  nextTick(() => clearCanvas())
}

function getCtx() {
  return canvasRef.value?.getContext('2d') || null
}

function startDraw(e: MouseEvent) {
  const ctx = getCtx()
  if (!ctx) return
  isDrawing.value = true
  const rect = canvasRef.value!.getBoundingClientRect()
  ctx.beginPath()
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  ctx.strokeStyle = '#2D3436'
  ctx.lineWidth = penSize.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function draw(e: MouseEvent) {
  if (!isDrawing.value) return
  const ctx = getCtx()
  if (!ctx) return
  const rect = canvasRef.value!.getBoundingClientRect()
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
  ctx.stroke()
}

function startDrawTouch(e: TouchEvent) {
  const ctx = getCtx()
  if (!ctx || !e.touches.length) return
  isDrawing.value = true
  const rect = canvasRef.value!.getBoundingClientRect()
  const touch = e.touches[0]
  ctx.beginPath()
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
  ctx.strokeStyle = '#2D3436'
  ctx.lineWidth = penSize.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function drawTouch(e: TouchEvent) {
  if (!isDrawing.value) return
  const ctx = getCtx()
  if (!ctx || !e.touches.length) return
  const rect = canvasRef.value!.getBoundingClientRect()
  const touch = e.touches[0]
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
  ctx.stroke()
}

function endDraw() {
  isDrawing.value = false
}

function clearCanvas() {
  const ctx = getCtx()
  if (!ctx) return
  ctx.clearRect(0, 0, canvasSize, canvasSize)
}

function checkWriting() {
  if (!canvasRef.value || !currentChar.value) return
  const ctx = getCtx()
  if (!ctx) return

  // 检查画布是否有内容
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize)
  const pixels = imageData.data
  let filledPixels = 0
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) filledPixels++
  }

  if (filledPixels < 50) {
    ElMessage({ message: '还没有写呢，快动笔吧！😊', type: 'warning' })
    return
  }

  // 随机给星（简单评价）
  const coverage = filledPixels / (canvasSize * canvasSize)
  let stars = 1
  if (coverage > 0.02 && coverage < 0.15) stars = 3
  else if (coverage > 0.01) stars = 2

  const image = canvasRef.value.toDataURL()
  writingHistory.value.unshift({
    char: currentChar.value.char,
    image,
    stars,
  })

  if (writingHistory.value.length > 6) {
    writingHistory.value = writingHistory.value.slice(0, 6)
  }

  const messages = ['写得真棒！🌟', '太厉害了！继续加油！🎉', '真不错！你是小小书法家！✨']
  ElMessage({
    message: messages[stars - 1],
    type: 'success',
    duration: 2000,
  })

  // 保存到学习记录
  const learned: string[] = JSON.parse(localStorage.getItem('practiced-hanzi') || '[]')
  if (!learned.includes(currentChar.value.char)) {
    learned.push(currentChar.value.char)
    localStorage.setItem('practiced-hanzi', JSON.stringify(learned))
  }

  clearCanvas()
}

function speak(char: string) {
  const utterance = new SpeechSynthesisUtterance(char)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.6
  utterance.pitch = 1.2
  speechSynthesis.speak(utterance)
}

onMounted(() => {
  const charQuery = route.query.char as string
  if (charQuery) {
    const found = hanziData.find(h => h.char === charQuery)
    if (found) selectChar(found)
  }
})
</script>

<style scoped>
.practice-page {
  min-height: 100vh;
  padding-bottom: var(--space-3xl);
}

/* Char Selector */
.char-selector {
  margin-bottom: var(--space-xl);
  overflow: hidden;
}

.char-scroll {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding: var(--space-sm) 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.char-scroll::-webkit-scrollbar {
  display: none;
}

.char-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  background: var(--color-bg-card);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition-bounce);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: var(--font-hanzi);
}

.char-btn:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary-light);
}

.char-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

/* Practice Content */
.practice-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-xl);
}

/* Demo Side */
.demo-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.demo-char-wrap {
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-char {
  font-size: 5rem;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.demo-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.demo-pinyin {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.demo-strokes {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.btn-sm {
  padding: 8px 20px;
  font-size: 0.85rem;
}

/* Tips */
.tips-card {
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.tips-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.tips-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tips-list li {
  font-size: 0.8rem;
  color: var(--color-text-light);
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '🌸';
  position: absolute;
  left: 0;
  font-size: 0.7rem;
}

/* Canvas Side */
.canvas-wrapper {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl);
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.canvas-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.canvas-tools {
  display: flex;
  gap: var(--space-xs);
}

.tool-btn {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-primary-light);
  background: white;
  color: var(--color-text-light);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-family: var(--font-body);
}

.tool-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.canvas-box {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.writing-canvas {
  position: relative;
  z-index: 2;
  cursor: crosshair;
  display: block;
  border-radius: 6px;
}

.canvas-ref-char {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  color: var(--color-primary-light);
  opacity: 0.12;
  z-index: 1;
  pointer-events: none;
  user-select: none;
}

.canvas-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-top: var(--space-lg);
}

/* History */
.history-section {
  margin-top: var(--space-xl);
}

.history-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.history-grid {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  padding: var(--space-sm) 0;
}

.history-item {
  flex-shrink: 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  padding: var(--space-sm);
  text-align: center;
}

.history-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background: var(--color-bg);
  display: block;
}

.history-stars {
  margin-top: 4px;
  font-size: 0.8rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-3xl);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-md);
}

.empty-text {
  font-size: 1.1rem;
  color: var(--color-text-light);
  font-weight: 600;
}

@media (max-width: 768px) {
  .practice-grid {
    grid-template-columns: 1fr;
  }

  .canvas-box {
    width: 260px;
    height: 260px;
  }

  .writing-canvas {
    width: 260px !important;
    height: 260px !important;
  }
}
</style>
