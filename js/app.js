/**
 * 20-10 DYNAMIC ENCHANTED EXPERIENCE - JAVASCRIPT
 * Features:
 * - Particle physics: Twinkling Stars, Falling 3D Rose Petals, Touch Sparklers, Heart Fireworks
 * - Continuous Golden Flower Pollen & Fairy Stardust Emitter
 * - Web Audio API: Synthesized Chimes, Shimmer, Rose Sparkles, Pops
 * - Interactive Blooming Rose Shockwave & Petal Fountain
 * - Dynamic URL parameter customization (?to=...&from=...&msg=...&theme=...)
 */

// ==========================================================================T
// 1. CONFIG & PRESETS
// ==========================================================================
const PRESETS = {
  lover: {
    title: "Chúc Bạn",
    msg: "Chúc bạn một ngày 20/10 thật rạng rỡ, xinh đẹp, tự tin và gặt hái thật nhiều thành công, may mắn và hạnh phúc trong cuộc sống! 🌸🥂"
  },
  mom: {
    title: "Mẹ Kính Yêu",
    msg: "Chúc Mẹ kính yêu của con ngày 20/10 tràn ngập sức khỏe, niềm vui và bình an! Cảm ơn Mẹ vì tất cả sự hy sinh thầm lặng và tình yêu thương bao la dành cho con. Con yêu Mẹ thật nhiều! 💐❤️"
  },
  crush: {
    title: "Crush / Thầm Thương",
    msg: "Chúc người con gái dễ thương đang đọc tin nhắn này có một ngày 20-10 ngập tràn niềm vui, hoa và quà nha! Hy vọng nụ cười của em sẽ luôn tỏa nắng rạng rỡ như hôm nay! ✨🥰"
  },
  friend: {
    title: "Bạn Bè / Đồng Nghiệp",
    msg: "Chúc bạn một ngày 20/10 thật rạng rỡ, xinh đẹp, tự tin và gặt hái thật nhiều thành công, may mắn và hạnh phúc trong cuộc sống! 🌸🥂"
  }
};

const PHOTO_LIST = [
  'assets/bouquet.jpg',
  'assets/giftbox.jpg',
  'assets/rose_close.jpg'
];

// Trích xuất tham số URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to') || 'Người Phụ Nữ Tuyệt Vời';
  const from = params.get('from') || 'Friend';
  let msg = params.get('msg');
  const theme = params.get('theme') || 'lover';

  if (!msg) {
    msg = PRESETS[theme] ? PRESETS[theme].msg : PRESETS.lover.msg;
  } else {
    try {
      if (msg.startsWith('b64:')) {
        msg = decodeURIComponent(escape(atob(msg.slice(4))));
      }
    } catch (e) {
      // Dùng nguyên chuỗi decode thông thường
    }
  }

  const imgParam = params.get('img');
  let currentPhoto = PHOTO_LIST[0];
  if (imgParam) {
    if (imgParam === '2') currentPhoto = PHOTO_LIST[1];
    else if (imgParam === '3') currentPhoto = PHOTO_LIST[2];
    else if (imgParam.startsWith('http')) currentPhoto = imgParam;
  }

  return { to, from, msg, theme, currentPhoto };
}

let AppState = {
  ...getQueryParams(),
  audioPlaying: false,
  currentTrackIndex: 0,
  activePhotoIndex: 0,
  isOpened: false,
  flowerStageActive: false,
  typewriterTimeout: null
};

// ==========================================================================
// 2. AUDIO & SOUND EFFECTS (Web Audio API + Audio Tracks)
// ==========================================================================
const AUDIO_TRACKS = [
  { name: 'Piano Lãng Mạn', src: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3' },
  { name: 'Acoustic Ngọt Ngào', src: 'https://assets.mixkit.co/music/preview/mixkit-loving-you-117.mp3' },
  { name: 'Lo-Fi Chill Piano', src: 'https://assets.mixkit.co/music/preview/mixkit-dreams-piano-lofi-2544.mp3' }
];

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Bộ tạo âm thanh sống động (Harp chime, Bubble pop, Rose sparkle)
const SoundFX = {
  chime: function () {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }, idx * 110);
      });
    } catch (e) { }
  },

  heartPop: function () {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880 + Math.random() * 200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) { }
  },

  roseSparkle: function () {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [783.99, 987.77, 1174.66, 1396.91, 1567.98, 1975.53];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.07, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }, i * 70);
      });
    } catch (e) { }
  }
};

const bgAudio = document.getElementById('bgAudio');
const musicCapsule = document.getElementById('musicCapsule');
const musicVinyl = document.getElementById('musicVinyl');
const waveBars = document.getElementById('waveBars');
const trackTitleText = document.getElementById('trackTitleText');

function updateMusicVisualState(isPlaying) {
  if (musicVinyl) {
    if (isPlaying) musicVinyl.classList.remove('paused');
    else musicVinyl.classList.add('paused');
  }
  if (waveBars) {
    if (isPlaying) waveBars.classList.remove('paused');
    else waveBars.classList.add('paused');
  }
  if (musicCapsule) {
    if (isPlaying) musicCapsule.classList.add('is-playing');
    else musicCapsule.classList.remove('is-playing');
  }
}

function setAudioTrack(index) {
  AppState.currentTrackIndex = index % AUDIO_TRACKS.length;
  bgAudio.src = AUDIO_TRACKS[AppState.currentTrackIndex].src;
  if (trackTitleText) {
    trackTitleText.innerText = AUDIO_TRACKS[AppState.currentTrackIndex].name;
  }
  if (AppState.audioPlaying) {
    bgAudio.play().then(() => {
      updateMusicVisualState(true);
    }).catch(() => { });
  }
}

function toggleAudio() {
  getAudioContext();
  if (AppState.audioPlaying) {
    bgAudio.pause();
    AppState.audioPlaying = false;
    updateMusicVisualState(false);
  } else {
    bgAudio.play().then(() => {
      AppState.audioPlaying = true;
      updateMusicVisualState(true);
      spawnFloatingMusicNote();
    }).catch(() => {
      // Nếu audio ngoài bị chặn, phát âm chime thay thế
      SoundFX.chime();
      AppState.audioPlaying = true;
      updateMusicVisualState(true);
    });
  }
}

function switchTrack() {
  setAudioTrack(AppState.currentTrackIndex + 1);
  if (!AppState.audioPlaying) toggleAudio();
  showToast(`Đã đổi bài: ${AUDIO_TRACKS[AppState.currentTrackIndex].name} 🎵`);
  spawnFloatingMusicNote();
}

// Promax: Nốt nhạc bay lơ lửng khi phát nhạc
const NOTE_ICONS = ['♪', '♫', '♬', '♩', '💖', '✨'];
function spawnFloatingMusicNote() {
  const capsule = document.getElementById('musicCapsule');
  if (!capsule) return;
  const rect = capsule.getBoundingClientRect();
  const note = document.createElement('div');
  note.className = 'floating-music-note';
  note.innerText = NOTE_ICONS[Math.floor(Math.random() * NOTE_ICONS.length)];
  note.style.left = (rect.left + Math.random() * (rect.width - 20)) + 'px';
  note.style.top = (rect.top - 5) + 'px';
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 2400);
}

setInterval(() => {
  if (AppState.audioPlaying) {
    spawnFloatingMusicNote();
  }
}, 1300);

// ==========================================================================
// 3. CANVAS ENGINE: SKY, SHOOTING STARS, RIPPLES, PETALS, POLLEN, AND SPARKLERS
// ==========================================================================
const skyCanvas = document.getElementById('sky-canvas');
const skyCtx = skyCanvas.getContext('2d');
let stars = [];
let fireflies = [];
let petals = [];
let sparklers = [];
let flowerPollens = [];
let shootingStars = [];
let touchRipples = [];

function resizeSky() {
  skyCanvas.width = window.innerWidth;
  skyCanvas.height = window.innerHeight;
  initStars();
  initFireflies();
  initPetals();
}

function initStars() {
  stars = [];
  const count = Math.floor(skyCanvas.width * skyCanvas.height / 9000);
  for (let i = 0; i < Math.max(count, 85); i++) {
    stars.push({
      x: Math.random() * skyCanvas.width,
      y: Math.random() * skyCanvas.height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.025 + 0.008
    });
  }
}

function initFireflies() {
  fireflies = [];
  for (let i = 0; i < 20; i++) {
    fireflies.push({
      x: Math.random() * skyCanvas.width,
      y: Math.random() * skyCanvas.height,
      size: Math.random() * 2.8 + 1.6,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: Math.random() * 0.03 + 0.01
    });
  }
}

function initPetals() {
  petals = [];
  const petalCount = window.innerWidth < 768 ? 24 : 40;
  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal(true));
  }
}

function createPetal(randomY = false) {
  const colors = ['#ff758f', '#ff4d6d', '#ffb3c1', '#c9184a'];
  return {
    x: Math.random() * skyCanvas.width,
    y: randomY ? Math.random() * skyCanvas.height : -35,
    size: Math.random() * 14 + 11,
    speedY: Math.random() * 1.3 + 0.95,
    speedX: Math.random() * 0.8 - 0.4,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 1.6 - 0.8,
    flip: Math.random() * Math.PI,
    flipSpeed: Math.random() * 0.035 + 0.015,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.45 + 0.5
  };
}

// Bụi sao tương tác chạm màn hình
function addSparkle(x, y) {
  for (let i = 0; i < 4; i++) {
    sparklers.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 0.6,
      size: Math.random() * 3.5 + 1.2,
      color: Math.random() > 0.45 ? '#ffd166' : '#ffffff',
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02
    });
  }
}

// Promax: Sóng nước dạ quang lan tỏa khi chạm
function addTouchRipple(x, y) {
  touchRipples.push({
    x, y,
    radius: 4,
    maxRadius: Math.random() * 30 + 45,
    alpha: 0.85,
    decay: 0.024,
    color: Math.random() > 0.5 ? '255, 117, 143' : '255, 209, 102'
  });
  // Bung 5 tia hạt sáng
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 2 + 1;
    sparklers.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      size: Math.random() * 3 + 1.2,
      color: Math.random() > 0.4 ? '#ffd166' : '#ffffff',
      alpha: 1,
      decay: Math.random() * 0.035 + 0.02
    });
  }
}

// Promax: Sao băng vụt sáng trên nền trời
function spawnShootingStar() {
  const startX = Math.random() * (skyCanvas.width * 0.7) + (skyCanvas.width * 0.25);
  const startY = Math.random() * (skyCanvas.height * 0.35);
  const length = Math.random() * 95 + 75;
  const speed = Math.random() * 11 + 9;
  const angle = Math.PI / 3.8 + (Math.random() - 0.5) * 0.2;
  shootingStars.push({
    x: startX,
    y: startY,
    vx: -Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: length,
    thickness: Math.random() * 1.5 + 1.2,
    alpha: 1,
    decay: Math.random() * 0.022 + 0.015
  });
}

// Bụi phấn hoa vàng kim phát sáng bay lên từ hoa hồng
function spawnFlowerPollen() {
  if (!AppState.flowerStageActive) return;
  const flowerCenterX = skyCanvas.width / 2;
  const flowerBaseY = skyCanvas.height - 120;

  for (let i = 0; i < 2; i++) {
    flowerPollens.push({
      x: flowerCenterX + (Math.random() - 0.5) * 220,
      y: flowerBaseY + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.7),
      size: Math.random() * 2.6 + 1.2,
      color: Math.random() > 0.5 ? '#ffd166' : '#ffe5ec',
      alpha: Math.random() * 0.7 + 0.3,
      decay: Math.random() * 0.008 + 0.005
    });
  }
}

// Tương tác chạm và di chuột
window.addEventListener('pointerdown', (e) => {
  addTouchRipple(e.clientX, e.clientY);
});
window.addEventListener('pointermove', (e) => {
  addSparkle(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    addSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// Sky Animation Loop
function renderSky() {
  skyCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);

  // 0. Promax Aurora & Deep Cosmic Glow
  const t = Date.now() * 0.0006;
  const grad1 = skyCtx.createRadialGradient(
    skyCanvas.width * 0.3 + Math.sin(t) * 80,
    skyCanvas.height * 0.25 + Math.cos(t * 0.8) * 60,
    10,
    skyCanvas.width * 0.3,
    skyCanvas.height * 0.25,
    skyCanvas.width * 0.55
  );
  grad1.addColorStop(0, 'rgba(193, 18, 91, 0.16)');
  grad1.addColorStop(0.5, 'rgba(114, 9, 183, 0.08)');
  grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  skyCtx.fillStyle = grad1;
  skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

  // 1. Vẽ sao trời lấp lánh
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;
    skyCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
    skyCtx.beginPath();
    skyCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    skyCtx.fill();
  });

  // 1.5. Promax Sao Băng (Shooting Stars)
  if (Math.random() < 0.015 && shootingStars.length < 3) {
    spawnShootingStar();
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += ss.vx;
    ss.y += ss.vy;
    ss.alpha -= ss.decay;
    if (ss.alpha <= 0 || ss.x < -100 || ss.y > skyCanvas.height + 100) {
      shootingStars.splice(i, 1);
      continue;
    }

    const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
    const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

    const grad = skyCtx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    grad.addColorStop(0, 'rgba(255, 117, 143, 0)');
    grad.addColorStop(0.5, `rgba(255, 209, 102, ${ss.alpha * 0.5})`);
    grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

    skyCtx.save();
    skyCtx.lineWidth = ss.thickness;
    skyCtx.strokeStyle = grad;
    skyCtx.lineCap = 'round';
    skyCtx.beginPath();
    skyCtx.moveTo(tailX, tailY);
    skyCtx.lineTo(ss.x, ss.y);
    skyCtx.stroke();

    // Điểm đầu sao băng phát sáng rực rỡ
    skyCtx.shadowColor = '#ffffff';
    skyCtx.shadowBlur = 10;
    skyCtx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
    skyCtx.beginPath();
    skyCtx.arc(ss.x, ss.y, ss.thickness * 1.4, 0, Math.PI * 2);
    skyCtx.fill();
    skyCtx.restore();
  }

  // 1.8. Promax Sóng Nước Dạ Quang (Touch Ripples)
  for (let i = touchRipples.length - 1; i >= 0; i--) {
    const rip = touchRipples[i];
    rip.radius += 1.8;
    rip.alpha -= rip.decay;
    if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
      touchRipples.splice(i, 1);
      continue;
    }
    skyCtx.save();
    skyCtx.strokeStyle = `rgba(${rip.color}, ${rip.alpha})`;
    skyCtx.lineWidth = 1.8;
    skyCtx.shadowColor = `rgba(${rip.color}, 0.8)`;
    skyCtx.shadowBlur = 8;
    skyCtx.beginPath();
    skyCtx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
    skyCtx.stroke();
    skyCtx.restore();
  }

  // 2. Vẽ đom đóm dạ quang
  fireflies.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    if (f.x < 0) f.x = skyCanvas.width;
    if (f.x > skyCanvas.width) f.x = 0;
    if (f.y < 0) f.y = skyCanvas.height;
    if (f.y > skyCanvas.height) f.y = 0;

    f.alpha += f.alphaSpeed;
    if (f.alpha > 1 || f.alpha < 0.2) f.alphaSpeed = -f.alphaSpeed;

    const radGrad = skyCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 3.5);
    radGrad.addColorStop(0, `rgba(255, 238, 136, ${f.alpha})`);
    radGrad.addColorStop(1, 'rgba(255, 183, 3, 0)');
    skyCtx.fillStyle = radGrad;
    skyCtx.beginPath();
    skyCtx.arc(f.x, f.y, f.size * 3.5, 0, Math.PI * 2);
    skyCtx.fill();

    skyCtx.fillStyle = `rgba(255, 255, 235, ${f.alpha})`;
    skyCtx.beginPath();
    skyCtx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    skyCtx.fill();
  });

  // 3. Vẽ phấn hoa vàng kim bay lên từ đóa hồng
  spawnFlowerPollen();
  for (let i = flowerPollens.length - 1; i >= 0; i--) {
    const fp = flowerPollens[i];
    fp.x += fp.vx + Math.sin(fp.y * 0.02) * 0.5;
    fp.y += fp.vy;
    fp.alpha -= fp.decay;

    if (fp.alpha <= 0 || fp.y < 0) {
      flowerPollens.splice(i, 1);
      continue;
    }

    skyCtx.save();
    skyCtx.globalAlpha = fp.alpha;
    skyCtx.fillStyle = fp.color;
    skyCtx.shadowColor = '#ffd166';
    skyCtx.shadowBlur = 6;
    skyCtx.beginPath();
    skyCtx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
    skyCtx.fill();
    skyCtx.restore();
  }

  // 4. Vẽ cánh hoa hồng rơi 3D
  petals.forEach((p, idx) => {
    p.y += p.speedY;
    p.x += Math.sin(p.y * 0.015) * 1.3 + p.speedX;
    p.rotation += p.rotSpeed;
    p.flip += p.flipSpeed;

    if (p.y > skyCanvas.height + 35) {
      petals[idx] = createPetal(false);
    }

    skyCtx.save();
    skyCtx.translate(p.x, p.y);
    skyCtx.rotate(p.rotation * Math.PI / 180);
    skyCtx.scale(1, Math.cos(p.flip));

    skyCtx.fillStyle = p.color;
    skyCtx.globalAlpha = p.opacity;

    // Đường cong cánh hoa hồng mềm mại
    skyCtx.beginPath();
    skyCtx.moveTo(0, 0);
    skyCtx.quadraticCurveTo(p.size * 0.6, -p.size * 0.8, p.size, 0);
    skyCtx.quadraticCurveTo(p.size * 0.5, p.size * 0.9, 0, 0);
    skyCtx.fill();

    skyCtx.restore();
  });

  // 5. Vẽ vệt bụi sao tương tác
  for (let i = sparklers.length - 1; i >= 0; i--) {
    const sp = sparklers[i];
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.alpha -= sp.decay;
    if (sp.alpha <= 0) {
      sparklers.splice(i, 1);
      continue;
    }
    skyCtx.save();
    skyCtx.globalAlpha = sp.alpha;
    skyCtx.fillStyle = sp.color;
    skyCtx.beginPath();
    skyCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
    skyCtx.fill();
    skyCtx.restore();
  }

  requestAnimationFrame(renderSky);
}

// ==========================================================================
// 4. FIREWORKS & HEART EXPLOSION CANVAS
// ==========================================================================
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fwCanvas.getContext('2d');
let fwParticles = [];

function resizeFireworks() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}

function spawnHeartFireworks(centerX, centerY) {
  const colors = ['#ff2a6d', '#ff758f', '#ffd166', '#ffffff', '#ff99c8', '#ffe5ec'];
  const count = 75;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    // Phương trình tọa độ trái tim Parametric
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const speed = Math.random() * 0.35 + 0.85;

    fwParticles.push({
      x: centerX,
      y: centerY,
      vx: hx * 0.32 * speed,
      vy: hy * 0.32 * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3.5 + 2,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      gravity: 0.038
    });
  }
}

function renderFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  for (let i = fwParticles.length - 1; i >= 0; i--) {
    const p = fwParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      fwParticles.splice(i, 1);
      continue;
    }

    fwCtx.save();
    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }
  requestAnimationFrame(renderFireworks);
}

// ==========================================================================
// 5. STAGE TRANSITIONS & CORE FLOW
// ==========================================================================
const introStage = document.getElementById('introStage');
const flowerStage = document.getElementById('flowerStage');
const envelopeBox = document.getElementById('envelopeBox');
const cardModal = document.getElementById('cardModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const introToName = document.getElementById('introToName');
const cardToName = document.getElementById('cardToName');
const cardFromName = document.getElementById('cardFromName');
const cardWishText = document.getElementById('cardWishText');
const cardMainImg = document.getElementById('cardMainImg');

function applyUserData() {
  introToName.innerText = `Gửi ${AppState.to} 💕`;
  cardToName.innerText = AppState.to;
  cardFromName.innerText = AppState.from;
  cardMainImg.src = AppState.currentPhoto;
  document.title = `Món Quà 20-10 Dành Tặng ${AppState.to} 💖`;
}

// Chạm mở hộp quà
function openGift() {
  if (AppState.isOpened) return;
  AppState.isOpened = true;

  // Bắn pháo hoa hình trái tim
  const rect = document.getElementById('giftboxWrapper').getBoundingClientRect();
  spawnHeartFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);

  // Ẩn Intro Stage
  introStage.classList.add('hide');

  // Hiện Vườn hoa & Phong thư
  setTimeout(() => {
    flowerStage.classList.add('active');
    AppState.flowerStageActive = true;
  }, 400);

  // Phong bì bay lên
  setTimeout(() => {
    envelopeBox.classList.add('show');
  }, 900);

  // Mở nắp phong thư
  setTimeout(() => {
    envelopeBox.classList.add('open');
  }, 1600);

  // Mở tấm thiệp chính
  setTimeout(() => {
    openCardModal();
  }, 2200);
}

// Chạm vào đóa hoa hồng để kích hoạt hiệu ứng bừng nở rực rỡ
function triggerFlowerBloom(e) {
  // Âm thanh lấp lánh thần tiên
  SoundFX.roseSparkle();

  // Kích hoạt vòng sóng xung kích (Shockwave Ring)
  const ring = document.getElementById('flowerShockwave');
  if (ring) {
    ring.classList.remove('fire');
    void ring.offsetWidth; // Trigger reflow
    ring.classList.add('fire');
  }

  // Hiệu ứng phình to phát sáng của bụi hoa
  const bush = document.getElementById('flowerBush');
  if (bush) {
    bush.classList.add('blooming');
    setTimeout(() => bush.classList.remove('blooming'), 1200);
  }

  // Tọa độ bắn pháo hoa
  const clickX = e.clientX || window.innerWidth / 2;
  const clickY = e.clientY || window.innerHeight - 200;
  spawnHeartFireworks(clickX, clickY);

  // Thả thêm hoa và tim bay
  shootRoses();
  shootHearts();

  showToast('Đóa hoa hồng bừng nở vì người đẹp nhất! 🌹✨');

  // Nếu người dùng chạm vào hoa khi thiệp chưa mở, mở thiệp luôn
  setTimeout(() => {
    if (!cardModal.classList.contains('active')) {
      openCardModal();
    }
  }, 700);
}

// Mở tấm thiệp chúc mừng (Êm đềm, mượt mà tuyệt đối)
function openCardModal() {
  modalBackdrop.classList.add('active');
  cardModal.classList.add('active');

  // Xuất hiện lời chúc từng từ mượt mà, lãng mạn
  revealWishText(AppState.msg, 320);
}

function closeCardModal() {
  cardModal.classList.remove('active');
  modalBackdrop.classList.remove('active');
  // Thả mưa ảnh polaroid lãng mạn khi đóng
  startPolaroidRain();
}

// Phong cách xuất hiện từng từ lãng mạn, mượt mà tuyệt đối không giật lag
function revealWishText(text, initialDelay = 280) {
  if (AppState.typewriterTimeout) clearTimeout(AppState.typewriterTimeout);
  cardWishText.innerHTML = '';
  
  if (!text) return;

  const lines = text.split('\n');
  let wordIndex = 0;
  const fragment = document.createDocumentFragment();

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      const spacer = document.createElement('div');
      spacer.style.height = '8px';
      fragment.appendChild(spacer);
      return;
    }

    const lineContainer = document.createElement('div');
    lineContainer.className = 'wish-line';

    const words = trimmed.split(/\s+/);
    words.forEach((word) => {
      if (!word) return;
      const span = document.createElement('span');
      span.className = 'wish-word';
      span.textContent = word;
      span.style.animationDelay = `${initialDelay + wordIndex * 110}ms`;
      lineContainer.appendChild(span);
      wordIndex++;
    });

    fragment.appendChild(lineContainer);
  });

  cardWishText.appendChild(fragment);
}

// ==========================================================================
// 6. PHOTO GALLERY & CAROUSEL
// ==========================================================================
function switchPhoto(index) {
  AppState.activePhotoIndex = index;
  cardMainImg.style.opacity = '0.3';
  setTimeout(() => {
    cardMainImg.src = PHOTO_LIST[index];
    cardMainImg.style.opacity = '1';
  }, 200);

  document.querySelectorAll('.photo-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

// Mưa ảnh Polaroid rơi từ trên trời
function startPolaroidRain() {
  const zone = document.getElementById('polaroid-rain-zone');
  const photos = [
    'assets/bouquet.jpg',
    'assets/giftbox.jpg',
    'assets/rose_close.jpg'
  ];

  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'rain-polaroid';
      card.style.left = (Math.random() * 85 + 5) + 'vw';

      const img = document.createElement('img');
      img.src = photos[i % photos.length];
      card.appendChild(img);

      const duration = Math.random() * 2.5 + 4.5;
      const driftX = (Math.random() - 0.5) * 100;
      const rot = (Math.random() - 0.5) * 50;

      card.style.animationDuration = `${duration}s`;
      card.style.setProperty('--drift-x', `${driftX}px`);
      card.style.setProperty('--rot', `${rot}deg`);

      zone.appendChild(card);
      setTimeout(() => card.remove(), duration * 1000);
    }, i * 220);
  }
}

// ==========================================================================
// 7. INTERACTIVE ACTIONS (Hearts, Roses, Replay)
// ==========================================================================
function shootHearts() {
  SoundFX.heartPop();
  const hearts = ['💖', '💕', '🌹', '✨', '💐', '🥰', '🌸'];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'floating-heart';
      el.innerText = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.left = (Math.random() * 90 + 5) + 'vw';
      el.style.bottom = '10px';
      const duration = Math.random() * 2 + 3;
      el.style.animationDuration = `${duration}s`;
      el.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 80}px`);
      el.style.setProperty('--size', `${Math.random() * 18 + 18}px`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000);
    }, i * 70);
  }
}

function shootRoses() {
  SoundFX.roseSparkle();
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'floating-rose';
      el.innerHTML = '🌹';
      el.style.fontSize = '32px';
      el.style.left = (Math.random() * 85 + 5) + 'vw';
      el.style.bottom = '15px';
      const duration = Math.random() * 2 + 3.5;
      el.style.animationDuration = `${duration}s`;
      el.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 100}px`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000);
    }, i * 110);
  }
}

function replayWish() {
  SoundFX.roseSparkle();
  revealWishText(AppState.msg, 60);
}

// Toast thông báo nhỏ
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ==========================================================================
// 8. INIT & EVENT LISTENERS
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  resizeSky();
  resizeFireworks();
  applyUserData();
  setAudioTrack(0);

  window.addEventListener('resize', () => {
    resizeSky();
    resizeFireworks();
  });

  renderSky();
  renderFireworks();
});
