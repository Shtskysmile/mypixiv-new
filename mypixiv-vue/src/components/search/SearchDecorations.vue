<template>
  <div class="search-decorations">
    <!-- Particles -->
    <div class="particles">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Floating Elements -->
    <div class="floating-decorations">
      <div class="float-star star-1 animate-float">🔍</div>
      <div class="float-star star-2 animate-sparkle">✨</div>
      <div class="float-star star-3 animate-float">💫</div>
    </div>
  </div>
</template>

<script>
/**
 * SearchDecorations - 搜索页装饰性元素
 * Decorative particles and floating elements for Search page
 */
export default {
  name: 'SearchDecorations',
  methods: {
    getParticleStyle(i) {
      const delay = Math.random() * 5;
      const duration = 5 + Math.random() * 10;
      const size = 2 + Math.random() * 4;
      const startX = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 30;
      const startY = 100 + Math.random() * 20;

      return {
        left: `${startX}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        '--end-x': `${endX}%`,
        '--start-y': `${startY}%`
      };
    }
  }
};
</script>

<style scoped>
.search-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(var(--start-y, 100%)) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20%) translateX(var(--end-x, 0));
    opacity: 0;
  }
}

.floating-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.float-star {
  position: absolute;
  font-size: 48px;
  opacity: 0.2;
  filter: blur(1px);
}

.star-1 {
  top: 15%;
  left: 10%;
  animation-duration: 4s;
}

.star-2 {
  top: 60%;
  right: 15%;
  animation-duration: 3s;
  animation-delay: 1s;
}

.star-3 {
  bottom: 20%;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 0.5s;
}
</style>
