<template>
  <div class="game-page">
    <div class="page-container">
      <h1 class="section-title">🎮 识字小游戏</h1>

      <!-- 游戏模式选择 -->
      <div v-if="!gameStarted" class="game-menu">
        <div class="game-modes">
          <div
            v-for="mode in gameModes"
            :key="mode.id"
            class="mode-card card-cute"
            @click="startGame(mode.id)"
          >
            <div class="mode-icon-wrap" :style="{ background: mode.gradient }">
              <span class="mode-icon">{{ mode.icon }}</span>
            </div>
            <h3 class="mode-title">{{ mode.title }}</h3>
            <p class="mode-desc">{{ mode.desc }}</p>
            <button class="btn-cute btn-primary btn-sm">开始游戏</button>
          </div>
        </div>
      </div>

      <!-- 配对游戏 -->
      <div v-else-if="currentMode === 'match'" class="game-area">
        <div class="game-header">
          <div class="game-info">
            <span class="game-score">🌟 {{ score }} 分</span>
            <span class="game-timer">⏱️ {{ timer }}秒</span>
          </div>
          <button class="btn-cute btn-accent btn-sm" @click="resetGame">
            🔄 重新开始
          </button>
        </div>

        <p class="game-instruction">把汉字和拼音配对起来吧！</p>

        <div class="match-grid">
          <div
            v-for="(card, index) in matchCards"
            :key="index"
            class="match-card"
            :class="{
              flipped: card.flipped,
              matched: card.matched,
              wrong: card.wrong,
            }"
            @click="flipCard(index)"
          >
            <div class="match-card-inner">
              <div class="match-card-front">
                <span>❓</span>
              </div>
              <div class="match-card-back" :style="{ fontFamily: card.type === 'char' ? 'var(--font-hanzi)' : 'inherit' }">
                <span :class="card.type === 'char' ? 'match-char' : 'match-pinyin'">
                  {{ card.display }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏完成 -->
        <div v-if="gameCompleted" class="game-complete">
          <div class="complete-card">
            <span class="complete-icon animate-bounce-in">🎉</span>
            <h2 class="complete-title">太棒了！</h2>
            <p class="complete-score">你获得了 {{ score }} 分！</p>
            <div class="complete-stars">
              <span v-for="i in completionStars" :key="i" class="star active" style="font-size: 2rem;">⭐</span>
            </div>
            <div class="complete-actions">
              <button class="btn-cute btn-primary" @click="startGame('match')">再玩一次</button>
              <button class="btn-cute btn-accent" @click="resetGame">换个游戏</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 听音选字游戏 -->
      <div v-else-if="currentMode === 'listen'" class="game-area">
        <div class="game-header">
          <div class="game-info">
            <span class="game-score">🌟 {{ score }} 分</span>
            <span class="game-round">第 {{ currentRound }}/{{ totalRounds }} 题</span>
          </div>
          <button class="btn-cute btn-accent btn-sm" @click="resetGame">
            🔄 返回
          </button>
        </div>

        <div v-if="!gameCompleted" class="listen-game">
          <p class="game-instruction">听一听，选出正确的汉字！</p>

          <button class="listen-btn animate-pulse-soft" @click="speakCurrent">
            <span class="listen-icon">🔊</span>
            <span>点我听发音</span>
          </button>

          <div class="listen-options">
            <button
              v-for="option in listenOptions"
              :key="option.char"
              class="option-card"
              :class="{
                correct: option.showResult && option.char === listenAnswer,
                wrong: option.showResult && option.selected && option.char !== listenAnswer,
              }"
              :disabled="option.showResult"
              @click="checkListenAnswer(option)"
            >
              <span class="option-char" :style="{ fontFamily: 'var(--font-hanzi)' }">{{ option.char }}</span>
              <span class="option-pinyin">{{ option.pinyin }}</span>
            </button>
          </div>
        </div>

        <!-- 听音游戏完成 -->
        <div v-if="gameCompleted" class="game-complete">
          <div class="complete-card">
            <span class="complete-icon animate-bounce-in">🏆</span>
            <h2 class="complete-title">全部完成！</h2>
            <p class="complete-score">答对了 {{ correctCount }}/{{ totalRounds }} 题，获得 {{ score }} 分！</p>
            <div class="complete-stars">
              <span v-for="i in completionStars" :key="i" class="star active" style="font-size: 2rem;">⭐</span>
            </div>
            <div class="complete-actions">
              <button class="btn-cute btn-primary" @click="startGame('listen')">再玩一次</button>
              <button class="btn-cute btn-accent" @click="resetGame">换个游戏</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { hanziData } from '@/data/hanzi'
import { ElMessage } from 'element-plus'

interface MatchCard {
  id: string
  display: string
  type: 'char' | 'pinyin'
  pairId: string
  flipped: boolean
  matched: boolean
  wrong: boolean
}

interface ListenOption {
  char: string
  pinyin: string
  selected: boolean
  showResult: boolean
}

const gameModes = [
  {
    id: 'match',
    title: '配对游戏',
    desc: '翻开卡片，把汉字和拼音配对',
    icon: '🃏',
    gradient: 'linear-gradient(135deg, #FF6B9D, #A29BFE)',
  },
  {
    id: 'listen',
    title: '听音选字',
    desc: '听发音，选出对应的汉字',
    icon: '🔊',
    gradient: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
  },
]

const gameStarted = ref(false)
const currentMode = ref('')
const score = ref(0)
const timer = ref(0)
const gameCompleted = ref(false)

// 配对游戏
const matchCards = ref<MatchCard[]>([])
let flippedCards: number[] = []
let matchLock = false
let timerInterval: number | null = null

// 听音游戏
const currentRound = ref(0)
const totalRounds = 8
const correctCount = ref(0)
const listenOptions = ref<ListenOption[]>([])
const listenAnswer = ref('')

const completionStars = computed(() => {
  if (currentMode.value === 'match') {
    if (timer.value < 30) return 3
    if (timer.value < 60) return 2
    return 1
  }
  const ratio = correctCount.value / totalRounds
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  return 1
})

function startGame(mode: string) {
  currentMode.value = mode
  gameStarted.value = true
  score.value = 0
  gameCompleted.value = false

  if (mode === 'match') {
    initMatchGame()
  } else if (mode === 'listen') {
    initListenGame()
  }
}

function resetGame() {
  gameStarted.value = false
  currentMode.value = ''
  score.value = 0
  gameCompleted.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// ========== 配对游戏逻辑 ==========
function initMatchGame() {
  timer.value = 0
  flippedCards = []
  matchLock = false

  const shuffled = [...hanziData].sort(() => Math.random() - 0.5).slice(0, 6)
  const cards: MatchCard[] = []

  shuffled.forEach(item => {
    cards.push({
      id: `char-${item.char}`,
      display: item.char,
      type: 'char',
      pairId: item.char,
      flipped: false,
      matched: false,
      wrong: false,
    })
    cards.push({
      id: `pinyin-${item.char}`,
      display: item.pinyin,
      type: 'pinyin',
      pairId: item.char,
      flipped: false,
      matched: false,
      wrong: false,
    })
  })

  matchCards.value = cards.sort(() => Math.random() - 0.5)

  if (timerInterval) clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    timer.value++
  }, 1000)
}

function flipCard(index: number) {
  if (matchLock) return
  const card = matchCards.value[index]
  if (card.flipped || card.matched) return

  card.flipped = true
  flippedCards.push(index)

  if (flippedCards.length === 2) {
    matchLock = true
    const [i1, i2] = flippedCards
    const card1 = matchCards.value[i1]
    const card2 = matchCards.value[i2]

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      // 匹配成功
      setTimeout(() => {
        card1.matched = true
        card2.matched = true
        score.value += 10
        flippedCards = []
        matchLock = false

        ElMessage({ message: '配对成功！🎉', type: 'success', duration: 1000 })

        // 检查是否全部完成
        if (matchCards.value.every(c => c.matched)) {
          gameCompleted.value = true
          if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
          }
          // 保存游戏记录
          const records = JSON.parse(localStorage.getItem('game-records') || '[]')
          records.push({ mode: 'match', score: score.value, time: timer.value, date: Date.now() })
          localStorage.setItem('game-records', JSON.stringify(records))
        }
      }, 400)
    } else {
      // 匹配失败
      card1.wrong = true
      card2.wrong = true
      setTimeout(() => {
        card1.flipped = false
        card2.flipped = false
        card1.wrong = false
        card2.wrong = false
        flippedCards = []
        matchLock = false
      }, 800)
    }
  }
}

// ========== 听音选字游戏逻辑 ==========
function initListenGame() {
  currentRound.value = 0
  correctCount.value = 0
  nextListenRound()
}

function nextListenRound() {
  currentRound.value++
  if (currentRound.value > totalRounds) {
    gameCompleted.value = true
    const records = JSON.parse(localStorage.getItem('game-records') || '[]')
    records.push({ mode: 'listen', score: score.value, correct: correctCount.value, total: totalRounds, date: Date.now() })
    localStorage.setItem('game-records', JSON.stringify(records))
    return
  }

  const shuffled = [...hanziData].sort(() => Math.random() - 0.5)
  const answer = shuffled[0]
  const wrong = shuffled.slice(1, 4)

  listenAnswer.value = answer.char
  listenOptions.value = [answer, ...wrong]
    .map(h => ({
      char: h.char,
      pinyin: h.pinyin,
      selected: false,
      showResult: false,
    }))
    .sort(() => Math.random() - 0.5)

  // 自动播放发音
  setTimeout(() => speakCurrent(), 500)
}

function speakCurrent() {
  const utterance = new SpeechSynthesisUtterance(listenAnswer.value)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.5
  utterance.pitch = 1.2
  speechSynthesis.speak(utterance)
}

function checkListenAnswer(option: ListenOption) {
  option.selected = true
  listenOptions.value.forEach(o => (o.showResult = true))

  if (option.char === listenAnswer.value) {
    score.value += 10
    correctCount.value++
    ElMessage({ message: '回答正确！🎉', type: 'success', duration: 1000 })
  } else {
    ElMessage({ message: `正确答案是「${listenAnswer.value}」，再接再厉！💪`, type: 'info', duration: 2000 })
  }

  setTimeout(() => nextListenRound(), 1500)
}

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  padding-bottom: var(--space-3xl);
}

/* Game Menu */
.game-menu {
  max-width: 700px;
  margin: 0 auto;
}

.game-modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.mode-card {
  padding: var(--space-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.mode-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-bounce);
}

.mode-card:hover .mode-icon-wrap {
  transform: scale(1.1) rotate(-5deg);
}

.mode-icon {
  font-size: 2.5rem;
}

.mode-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-text);
}

.mode-desc {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.btn-sm {
  padding: 8px 20px;
  font-size: 0.85rem;
}

/* Game Header */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.game-info {
  display: flex;
  gap: var(--space-lg);
}

.game-score,
.game-timer,
.game-round {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}

.game-instruction {
  text-align: center;
  font-size: 1.05rem;
  color: var(--color-text-light);
  font-weight: 600;
  margin-bottom: var(--space-xl);
}

/* Match Game */
.match-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  max-width: 600px;
  margin: 0 auto;
}

.match-card {
  aspect-ratio: 1;
  perspective: 600px;
  cursor: pointer;
}

.match-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.match-card.flipped .match-card-inner,
.match-card.matched .match-card-inner {
  transform: rotateY(180deg);
}

.match-card-front,
.match-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.match-card-front {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-card);
}

.match-card:hover .match-card-front {
  box-shadow: var(--shadow-card-hover);
}

.match-card-back {
  background: var(--color-bg-card);
  box-shadow: var(--shadow-card);
  transform: rotateY(180deg);
}

.match-card.matched .match-card-back {
  background: var(--color-success);
  border: 3px solid var(--color-success-dark);
}

.match-card.wrong .match-card-inner {
  animation: wiggle 0.4s ease;
}

.match-char {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-text);
}

.match-pinyin {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.match-card.matched .match-char,
.match-card.matched .match-pinyin {
  color: white;
}

/* Listen Game */
.listen-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  margin: 0 auto var(--space-xl);
  padding: var(--space-xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  border: 3px solid var(--color-secondary);
  cursor: pointer;
  transition: var(--transition-bounce);
  font-family: var(--font-body);
}

.listen-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-card-hover);
}

.listen-icon {
  font-size: 3rem;
}

.listen-btn span:last-child {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-light);
}

.listen-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  max-width: 500px;
  margin: 0 auto;
}

.option-card {
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  border: 3px solid transparent;
  cursor: pointer;
  transition: var(--transition-bounce);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
}

.option-card:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-card-hover);
}

.option-card.correct {
  background: var(--color-success);
  border-color: var(--color-success-dark);
  animation: bounce-in 0.4s ease;
}

.option-card.wrong {
  background: var(--color-danger);
  border-color: var(--color-danger-dark);
  animation: wiggle 0.4s ease;
}

.option-card.correct .option-char,
.option-card.correct .option-pinyin,
.option-card.wrong .option-char,
.option-card.wrong .option-pinyin {
  color: white;
}

.option-char {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.option-pinyin {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
}

/* Game Complete */
.game-complete {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.complete-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl) var(--space-3xl);
  text-align: center;
  box-shadow: var(--shadow-float);
  animation: bounce-in 0.5s ease;
}

.complete-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-md);
}

.complete-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.complete-score {
  font-size: 1rem;
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.complete-stars {
  margin-bottom: var(--space-lg);
}

.complete-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

@media (max-width: 768px) {
  .game-modes {
    grid-template-columns: 1fr;
  }

  .match-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .listen-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
