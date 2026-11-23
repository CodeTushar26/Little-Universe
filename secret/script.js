/* ───
   Secret Birthday Gift by @saklincodes (MIT). Adapted for Little Universe: see CREDITS.md
─── */

/* ─── CLOCK DIAL TICKS & NUMERALS ─── */
(function initClockFace() {
  const tg = document.getElementById('clock-ticks');
  for (let i = 0; i < 60; i++) {
    const ang = (i * 6) * Math.PI / 180;
    const isMajor = (i % 5 === 0);
    const r1 = 126, r2 = isMajor ? 116 : 121;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 140 + r1 * Math.sin(ang));
    line.setAttribute('y1', 140 - r1 * Math.cos(ang));
    line.setAttribute('x2', 140 + r2 * Math.sin(ang));
    line.setAttribute('y2', 140 - r2 * Math.cos(ang));
    line.setAttribute('stroke-width', isMajor ? '1.8' : '0.8');
    line.setAttribute('opacity', isMajor ? '0.9' : '0.45');
    tg.appendChild(line);
  }

  const ng = document.getElementById('clock-numerals');
  const nums = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  nums.forEach((num, idx) => {
    const ang = (idx * 30) * Math.PI / 180;
    const r = 100;
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', 140 + r * Math.sin(ang));
    t.setAttribute('y', 140 - r * Math.cos(ang));
    t.textContent = num;
    ng.appendChild(t);
  });
})();

/* ─── AUDIO MUTED (PER USER REQUEST) ─── */
function playTick() {}
function playKeyClick() {}
function playMidnightChime() {}

/* ─── INTIMATE CANDLELIGHT MOTES & ROSE PETALS ─── */
(function createBackground() {
  const bg = document.getElementById('bg-ambient');
  if (!bg) return;
  for (let i = 0; i < 16; i++) {
    const m = document.createElement('div');
    m.className = 'candle-mote';
    const msz = Math.random() * 5 + 3;
    m.style.cssText = `width:${msz}px;height:${msz}px;left:${Math.random()*100}%;bottom:${Math.random()*25}%;--md:${Math.random()*5+6}s;--mdelay:-${Math.random()*6}s;`;
    bg.appendChild(m);
  }
  const colors = ['#8a1528','#6b0f1d','#a82035','#4f0b15'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = `left:${Math.random()*105}%;width:${Math.random()*12+10}px;height:${Math.random()*14+12}px;background:${colors[Math.floor(Math.random()*colors.length)]};--pd:${Math.random()*4+5}s;--pdelay:-${Math.random()*7}s;`;
    bg.appendChild(p);
  }
})();

/* ─── SHINCHAN PASSCODE VERIFICATION (4 DIGITS) ─── */
/* The passcode is checked on the server (see luCheckPin), never stored in this file. */

const SHINCHAN_GIFS = {
  ask: "assets/shinchan-birthday.png",
  wrong: "assets/shinchan-wrong.png"
};

let enteredDigits = "";

function updateDateBoxes() {
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById(`b${i}`);
    if (!box) continue;
    box.textContent = enteredDigits[i] || "";
    if (i === enteredDigits.length && enteredDigits.length < 4) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  }
}
updateDateBoxes();

function pressKey(num) {
  if (enteredDigits.length < 4) {
    enteredDigits += num;
    updateDateBoxes();
    if (enteredDigits.length === 4) {
      setTimeout(submitBirthdayDate, 220);
    }
  }
}

function deleteDigit() {
  if (enteredDigits.length > 0) {
    enteredDigits = enteredDigits.slice(0, -1);
    updateDateBoxes();
  }
}

async function submitBirthdayDate() {
  if (window.__pinBusy) return;
  const img = document.getElementById('shinchan-img');
  const txt = document.getElementById('quiz-text');
  const card = document.getElementById('quiz-card');
  const keypad = document.getElementById('keypad');
  const retryBtn = document.getElementById('retry-btn');

  if (enteredDigits.length < 4 && !window.__skipPin) {
    txt.textContent = "Please enter all 4 digits! ✨";
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    return;
  }

  if (await luCheckPin(enteredDigits)) {
    // Correct Passcode (2005) - Directly transition to the Surprise Question Screen
    const danceGif = document.getElementById('dance-gif');
    if (danceGif) {
      danceGif.src = DANCE_GIF_URL;
    }
    const archText = document.getElementById('arch-text-path');
    if (archText) {
      archText.textContent = "I have made something for you";
    }
    const textEl = document.querySelector('.arched-text');
    if (textEl) {
      textEl.classList.remove('excited-mode');
    }
    // Animate curved title with Distinct Page 1 Wave In
    triggerTitleAnim('anim-wave-drop');

    const promptEl = document.getElementById('surprise-prompt');
    if (promptEl) {
      promptEl.style.display = 'block';
      promptEl.innerHTML = "Do you wanna see it ?";
      triggerElementAnim(promptEl, 'prompt-entrance-pop');
    }
    const danceWrap = document.querySelector('.dance-gif-wrap');
    if (danceWrap) {
      triggerElementAnim(danceWrap, 'gif-entrance-pop');
    }
    const btnGroup = document.querySelector('.surprise-btn-group');
    if (btnGroup) {
      btnGroup.innerHTML = `
        <button id="btn-yes" class="pill-btn yes-btn" onclick="handleChoice('yes')">
          <span class="btn-shine-tr"></span>
          <span class="btn-label">YES</span>
          <span class="btn-shine-bl"></span>
        </button>
        <button id="btn-no" class="pill-btn no-btn" onclick="handleChoice('no')">
          <span class="btn-shine-tr"></span>
          <span class="btn-label">NO</span>
          <span class="btn-shine-bl"></span>
        </button>
      `;
      triggerElementAnim(btnGroup, 'btn-entrance-bounce');
    }
    document.getElementById('quiz-screen').classList.remove('show');
    document.getElementById('quiz-screen').classList.add('hidden');
    const surpriseEl = document.getElementById('surprise-screen');
    if (surpriseEl) {
      surpriseEl.classList.remove('hidden-screen');
      surpriseEl.classList.add('show-screen');
    }
    launchConfetti();
  } else {
    // Wrong Passcode
    img.src = SHINCHAN_GIFS.wrong;
    txt.textContent = window.__pinMsg || "Oops! Wrong Passcode! Try again, cutie! 🥺";
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    keypad.classList.add('hidden-btn');
    retryBtn.classList.remove('hidden-btn');
  }
}

function resetQuiz() {
  enteredDigits = "";
  updateDateBoxes();
  const img = document.getElementById('shinchan-img');
  const txt = document.getElementById('quiz-text');
  const keypad = document.getElementById('keypad');
  const retryBtn = document.getElementById('retry-btn');

  img.src = SHINCHAN_GIFS.ask;
  txt.textContent = "Enter the 4-digit secret passcode 💖";
  keypad.classList.remove('hidden-btn');
  retryBtn.classList.add('hidden-btn');
}

function triggerTitleAnim(animClass) {
  const svg = document.querySelector('.curved-title-svg');
  if (!svg) return;
  svg.classList.remove('anim-wave-drop', 'anim-excited-bounce');
  svg.style.animation = 'none';
  void svg.offsetWidth;
  svg.style.animation = '';
  svg.classList.add(animClass);
}

function triggerElementAnim(el, animClass) {
  if (!el) return;
  el.classList.remove(animClass);
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  el.classList.add(animClass);
}

/* ─── SURPRISE CHOICE INTERACTION (YES / NO) ─── */
const DANCE_GIF_URL = "assets/shinchan-dance.gif";
const PLEADING_GIF_URL = "assets/shinchan-pleading.gif";
const EXCITED_GIF_URL = "assets/shinchan-excited.gif";

function handleChoice(choice) {
  const danceGif = document.getElementById('dance-gif');

  if (choice === 'no') {
    if (danceGif) {
      danceGif.src = PLEADING_GIF_URL;
    }
    const promptEl = document.getElementById('surprise-prompt');
    if (promptEl) {
      promptEl.innerHTML = "Are you sure? 🥺 Please say YES! 💖";
      triggerElementAnim(promptEl, 'prompt-entrance-pop');
    }
    const noBtn = document.getElementById('btn-no');
    if (noBtn) {
      noBtn.style.animation = 'none';
      void noBtn.offsetWidth;
      noBtn.style.animation = 'cardShake 0.4s ease';
    }
    return;
  }

  // When choice === 'yes' -> Show "Are you really excited?" screen with distinct animation
  const archText = document.getElementById('arch-text-path');
  if (archText) {
    archText.textContent = "Are you really excited?";
  }
  const textEl = document.querySelector('.arched-text');
  if (textEl) {
    textEl.classList.add('excited-mode');
  }
  // Trigger Distinct Energetic Pop & Spring Bounce for "Are you really excited?"
  triggerTitleAnim('anim-excited-bounce');

  if (danceGif) {
    danceGif.src = EXCITED_GIF_URL;
  }
  const danceWrap = document.querySelector('.dance-gif-wrap');
  if (danceWrap) {
    triggerElementAnim(danceWrap, 'gif-entrance-pop');
  }
  const promptEl = document.getElementById('surprise-prompt');
  if (promptEl) {
    promptEl.style.display = 'none';
  }
  const btnGroup = document.querySelector('.surprise-btn-group');
  if (btnGroup) {
    btnGroup.innerHTML = `
      <button class="pill-btn yes-btn" onclick="handleExcitedChoice()">
        <span class="btn-shine-tr"></span>
        <span class="btn-label">YES</span>
        <span class="btn-shine-bl"></span>
      </button>
      <button class="pill-btn yes-btn" onclick="handleExcitedChoice()">
        <span class="btn-shine-tr"></span>
        <span class="btn-label">YES</span>
        <span class="btn-shine-bl"></span>
      </button>
    `;
    triggerElementAnim(btnGroup, 'btn-entrance-bounce');
  }
}

function handleExcitedChoice() {
  const surpriseEl = document.getElementById('surprise-screen');
  const giftEl = document.getElementById('gift-screen');

  if (surpriseEl) {
    surpriseEl.classList.remove('show-screen');
    surpriseEl.classList.add('hidden-screen');
  }
  if (giftEl) {
    giftEl.classList.remove('hidden-screen');
    giftEl.classList.add('show-screen');
  }
  // Light celebration confetti burst once new screen transition settles
  setTimeout(launchConfetti, 300);
}

/* ─── CLOTHESLINE HANGING MEMORIES GALLERY (MATCHING REFERENCE IMAGE 2) ─── */
function openMemoriesModal() {
  const modal = document.getElementById('memories-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const container = document.getElementById('memories-board-container');
    if (container) {
      container.style.animation = 'none';
      void container.offsetWidth;
      container.style.animation = 'clotheslineDropIn 0.45s cubic-bezier(0.34, 1.35, 0.64, 1)';
    }
    const track = document.getElementById('clothesline-photos-track');
    if (track) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }
}

function closeMemoriesModal() {
  const modal = document.getElementById('memories-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function scrollClothesline(direction) {
  const track = document.getElementById('clothesline-photos-track');
  if (track) {
    const scrollAmount = 260 * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function focusHangingPhoto(el) {
  if (!el) return;
  el.classList.add('active-sway');
  setTimeout(() => {
    el.classList.remove('active-sway');
  }, 1000);
}

/* ─── MAKE A WISH: BIRTHDAY CAKE (BOX 2) ─── */
let isWishMade = false;
let blownCandlesCount = 0;

function openCakeModal() {
  resetCake();
  const modal = document.getElementById('cake-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCakeModal() {
  const modal = document.getElementById('cake-modal');
  if (modal) modal.classList.add('hidden');
}

function blowCandle(num, e) {
  if (e) e.stopPropagation();
  const flame = document.getElementById(`flame-${num}`);
  if (flame && !flame.classList.contains('extinguished')) {
    flame.classList.add('extinguished');
    blownCandlesCount++;
    if (blownCandlesCount >= 7) setTimeout(makeCakeWish, 300);
  }
}

function makeCakeWish(e) {
  if (isWishMade) return;
  isWishMade = true;

  // Extinguish all 7 candles
  for (let i = 1; i <= 7; i++) {
    const flame = document.getElementById(`flame-${i}`);
    if (flame) flame.classList.add('extinguished');
  }

  // Celebratory confetti burst
  launchConfetti();
  setTimeout(launchConfetti, 350);

  // Update top arched text to celebration
  const archText = document.getElementById('cake-arch-text');
  if (archText) archText.textContent = "HAPPY BIRTHDAY ! 🎉";

  // Hide hint and show celebration ribbon
  const hint = document.getElementById('cake-footer-hint');
  if (hint) hint.style.display = 'none';

  setTimeout(() => {
    const banner = document.getElementById('cake-wish-banner');
    if (banner) banner.classList.remove('hidden');
  }, 300);
}

function resetCake() {
  isWishMade = false;
  blownCandlesCount = 0;

  for (let i = 1; i <= 7; i++) {
    const flame = document.getElementById(`flame-${i}`);
    if (flame) flame.classList.remove('extinguished');
  }

  const archText = document.getElementById('cake-arch-text');
  if (archText) archText.textContent = "MAKE A WISH";

  const hint = document.getElementById('cake-footer-hint');
  if (hint) hint.style.display = 'block';

  const banner = document.getElementById('cake-wish-banner');
  if (banner) banner.classList.add('hidden');
}

const MYSTERY_GIFTS = {
  1: {
    isMemories: true
  },
  2: {
    isCake: true
  },
  3: {
    icon: "👑",
    title: "Gift #3: Lifetime Happiness Pass",
    desc: "Unlimited hugs, endless laughter, and all your deepest birthday wishes coming true! 🎁💫💖"
  }
};

function openMysteryBox(boxNum) {
  if (boxNum === 1) {
    openMemoriesModal();
    return;
  }
  if (boxNum === 2) {
    openCakeModal();
    return;
  }
  if (boxNum === 3) {
    openLetterModal();
    return;
  }

  launchConfetti();
  const gift = MYSTERY_GIFTS[boxNum] || MYSTERY_GIFTS[3];
  
  const modal = document.getElementById('gift-modal');
  const iconEl = document.getElementById('gift-modal-icon');
  const titleEl = document.getElementById('gift-modal-title');
  const descEl = document.getElementById('gift-modal-desc');

  if (iconEl) iconEl.textContent = gift.icon;
  if (titleEl) titleEl.textContent = gift.title;
  if (descEl) descEl.textContent = gift.desc;

  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeGiftModal() {
  const modal = document.getElementById('gift-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/* ─── SPECIAL BOX 3: LOVE & BIRTHDAY LETTER (TYPEWRITER ANIMATION) ─── */
let LETTER_SECTIONS = [
  {
    id: 'letter-headline-el',
    text: "Happy birthday to my favourite\nperson! ❤️"
  },
  {
    id: 'letter-p1-el',
    text: "I hope this year brings you everything you've been wishing for and so much more. Thank you for making my days happier, my bad days easier, and my life a little more beautiful just by being in it. 🥺💖"
  },
  {
    id: 'letter-p2-el',
    text: "I'm so lucky to have you, and I can't wait to make a million more memories with you. Here's to you, your dreams, and all the happiness you deserve."
  },
  {
    id: 'letter-closing-el',
    text: "Happy birthday, my love. I love you more than you know. 🫶🏻🎂❤️"
  }
];

let letterTypewriterTimer = null;
let isLetterTyping = false;

function renderLetterInstant() {
  if (letterTypewriterTimer) {
    clearTimeout(letterTypewriterTimer);
    letterTypewriterTimer = null;
  }
  isLetterTyping = false;
  LETTER_SECTIONS.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (!el) return;
    el.textContent = '';
    sec.text.split('\n').forEach((ln, i) => { if (i) el.appendChild(document.createElement('br')); el.appendChild(document.createTextNode(ln)); });
  });
  const existingCursor = document.getElementById('letter-typing-cursor');
  if (existingCursor) existingCursor.remove();
}

function skipLetterTypewriter() {
  if (isLetterTyping) {
    renderLetterInstant();
  }
}

function startLetterTypewriter() {
  if (letterTypewriterTimer) {
    clearTimeout(letterTypewriterTimer);
    letterTypewriterTimer = null;
  }
  isLetterTyping = true;
  const __tot = LETTER_SECTIONS.reduce((a, s) => a + s.text.length, 0);
  window.__typeScale = Math.min(1, 9000 / Math.max(1, __tot * 28));   // long letters type faster so nobody waits
  window.__typeStep = Math.max(1, Math.ceil(__tot / 200));              // about 200 steps in total, so any letter finishes in roughly 8 seconds

  // Clear target containers
  LETTER_SECTIONS.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (el) el.innerHTML = '';
  });

  // Create or reuse blinking neon cursor
  let cursorEl = document.getElementById('letter-typing-cursor');
  if (!cursorEl) {
    cursorEl = document.createElement('span');
    cursorEl.id = 'letter-typing-cursor';
    cursorEl.className = 'typewriter-cursor';
  }

  let secIndex = 0;
  let charIndex = 0;

  function typeNextChar() {
    if (!isLetterTyping) return;

    if (secIndex >= LETTER_SECTIONS.length) {
      isLetterTyping = false;
      setTimeout(() => {
        if (cursorEl && cursorEl.parentNode) {
          cursorEl.style.transition = 'opacity 0.6s ease';
          cursorEl.style.opacity = '0';
          setTimeout(() => cursorEl.remove(), 600);
        }
      }, 1600);
      return;
    }

    const currentSection = LETTER_SECTIONS[secIndex];
    const el = document.getElementById(currentSection.id);
    const chars = Array.from(currentSection.text);

    if (charIndex < chars.length) {
      const step = window.__typeStep || 1;                       // long letters reveal several characters per tick
      const chunk = chars.slice(charIndex, charIndex + step);
      charIndex += chunk.length;
      const ch = chunk[chunk.length - 1];

      if (el) {
        chunk.forEach(c => {
          if (c === '\n') el.appendChild(document.createElement('br'));
          else el.appendChild(document.createTextNode(c));
        });
        el.appendChild(cursorEl);
        const __col = document.querySelector('.letter-text-column'); if (__col) __col.scrollTop = __col.scrollHeight;
      }

      // Natural emotional cadence (pause at punctuation/emojis)
      const delay = (ch === '.' || ch === '!' || ch === '?' || ch === '💖') ? 110 : (ch === ',' ? 50 : 25);
      letterTypewriterTimer = setTimeout(typeNextChar, Math.max(3, Math.round(delay * (window.__typeScale || 1))));
    } else {
      secIndex++;
      charIndex = 0;
      letterTypewriterTimer = setTimeout(typeNextChar, 140);
    }
  }

  // Brief pause after polaroid drop before typing begins
  letterTypewriterTimer = setTimeout(typeNextChar, 380);
}

function openLetterModal() {
  const modal = document.getElementById('letter-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const card = modal.querySelector('.letter-card-container');
    if (card) {
      card.classList.remove('animate-letter');
      void card.offsetWidth;
      card.classList.add('animate-letter');
    }
    // Launch dynamic live typewriter typing
    startLetterTypewriter();
  }
}

function closeLetterModal() {
  if (letterTypewriterTimer) {
    clearTimeout(letterTypewriterTimer);
    letterTypewriterTimer = null;
  }
  isLetterTyping = false;
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.add('hidden');
}

function handleLetterOverlayClick(e) {
  if (e.target.id === 'letter-modal' || e.target.classList.contains('letter-bg-backdrop')) {
    closeLetterModal();
  }
}

// Physical Keyboard Listener
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') luCloseReply();
  const letterModal = document.getElementById('letter-modal');
  if (letterModal && !letterModal.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closeLetterModal();
      return;
    }
  }

  const cakeModal = document.getElementById('cake-modal');
  if (cakeModal && !cakeModal.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closeCakeModal();
      return;
    } else if (e.key === ' ' || e.key === 'Enter') {
      makeCakeWish();
      return;
    }
  }

  const memModal = document.getElementById('memories-modal');
  if (memModal && !memModal.classList.contains('hidden')) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      scrollClothesline(1);
      return;
    } else if (e.key === 'ArrowLeft') {
      scrollClothesline(-1);
      return;
    } else if (e.key === 'Escape') {
      closeMemoriesModal();
      return;
    }
  }

  if (!document.getElementById('quiz-screen').classList.contains('show')) return;
  if (e.key >= '0' && e.key <= '9') {
    pressKey(e.key);
  } else if (e.key === 'Backspace') {
    deleteDigit();
  } else if (e.key === 'Enter') {
    submitBirthdayDate();
  }
});

/* ─── STAGE COUNTDOWN CLOCK (5 SECONDS) ─── */
const hhEl = document.getElementById('hh');
const mmEl = document.getElementById('mm');
const ssEl = document.getElementById('ss');
const secHand = document.getElementById('second-hand');
const minHand = document.getElementById('minute-hand');
const hrHand = document.getElementById('hour-hand');

const pad = n => String(n).padStart(2, '0');
let countLeft = 5;
let countdownTimer = null;

function updateClock(h, m, s) {
  hhEl.textContent = pad(h);
  mmEl.textContent = pad(m);
  ssEl.textContent = pad(s);

  secHand.style.transform = `rotate(${s === 0 ? 360 : s * 6}deg)`;
  minHand.style.transform = `rotate(${(m + s / 60) * 6}deg)`;
  hrHand.style.transform  = `rotate(${((h % 12) + m / 60) * 30}deg)`;
}

function startCountdown() {
  countLeft = 5;
  updateClock(11, 59, 55);

  countdownTimer = setInterval(() => {
    countLeft--;
    if (countLeft > 0) {
      updateClock(11, 59, 60 - countLeft);
      playTick();
    } else {
      clearInterval(countdownTimer);
      updateClock(12, 0, 0);
      playMidnightChime();
      setTimeout(triggerMidnight, 700);
    }
  }, 1000);
}

/* ─── MIDNIGHT REVEAL ─── */
function triggerMidnight() {
  const burst = document.getElementById('midnight-burst');
  if (burst) burst.classList.add('flash');
  setTimeout(() => {
    const cl = document.getElementById('curtain-left');
    const cr = document.getElementById('curtain-right');
    const cw = document.getElementById('countdown-wrap');
    if (cl) cl.classList.add('open');
    if (cr) cr.classList.add('open');
    if (cw) cw.classList.add('hidden');
  }, 400);
  setTimeout(() => {
    const qs = document.getElementById('quiz-screen');
    if (qs) { if (LU.pin) qs.classList.add('show'); else { window.__skipPin = true; submitBirthdayDate(); } }
  }, 1000);

  // Performance Optimization: Unload heavy curtain and background particle layers once off-screen
  setTimeout(() => {
    const cl = document.getElementById('curtain-left');
    const cr = document.getElementById('curtain-right');
    const cw = document.getElementById('countdown-wrap');
    const burstEl = document.getElementById('midnight-burst');
    const bgAmb = document.getElementById('bg-ambient');
    if (cl) cl.style.display = 'none';
    if (cr) cr.style.display = 'none';
    if (cw) cw.style.display = 'none';
    if (burstEl) burstEl.style.display = 'none';
    if (bgAmb) bgAmb.style.display = 'none';
  }, 2600);
}

/* ─── CONFETTI SYSTEM (OPTIMIZED & LEAK-FREE) ─── */
function launchConfetti() {
  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 35 : 65;
  const colors = ['#ff6b9d','#ffd700','#ff4db8','#00bcd4','#69f0ae','#ff5722'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const sz = Math.random() * (isMobile ? 6 : 8) + 6;
    const dur = Math.random() * 2 + 2;
    const delay = Math.random() * 1.2;
    c.style.cssText = `left:${Math.random()*100}%;top:-20px;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'3px'};--cf-d:${dur}s;--cf-delay:${delay}s;will-change:transform,opacity;`;
    document.body.appendChild(c);

    // Automatically remove element from DOM after animation completes to avoid memory leak & lag
    setTimeout(() => {
      c.remove();
    }, (dur + delay + 0.3) * 1000);
  }
}

/* ─── MOUSE TRAIL HEARTS (DESKTOP ONLY) ─── */
let lastTrail = 0;
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    const cl = document.getElementById('curtain-left');
    if (now - lastTrail < 140 || !cl || !cl.classList.contains('open')) return;
    lastTrail = now;
    const em = ['💖','💗','💕','✨','🌸'];
    const h = document.createElement('div');
    h.className = 'trail-heart';
    h.textContent = em[Math.floor(Math.random() * em.length)];
    h.style.left = (e.clientX - 10) + 'px';
    h.style.top = (e.clientY - 10) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 700);
  });
}

/* ─── START ON LOAD ─── */
/* ═══════════ LITTLE UNIVERSE: real gift data, server-checked PIN, reveal lock, replies ═══════════ */
const LU = { id:null, sb:null, gift:null, pin:false, owner:false, name:'', extras:{}, photos:[], audio:null, begun:false };
const LU_GREET = { birthday:'Happy birthday', anniversary:'Happy anniversary', valentine:"Happy Valentine's Day", graduation:'Congratulations', wedding:'Congratulations' };
const luEl = id => document.getElementById(id);
function luMsg(text, retry){
  luEl('lu-msg-text').textContent = text;
  luEl('lu-msg-retry').style.display = retry ? 'inline-block' : 'none';
  luEl('lu-msg').style.display = 'flex';
}
function luShowStart(){
  luEl('lu-start-name').textContent = LU.name ? 'A gift for ' + LU.name : 'A gift for you';
  luEl('lu-start').style.display = 'flex';
}
function luBegin(){
  LU.begun = true;
  luEl('lu-start').style.display = 'none';
  luStartMusic();
  startCountdown();
}
function luShowLock(pg){
  const target = Date.parse(pg.reveal_at), skew = Date.parse(pg.server_now) - Date.now();   // trust the server clock
  luEl('lu-lock-name').textContent = pg.name || 'you';
  luEl('lu-lock-msg').textContent = pg.lock_message || 'Something special is waiting for you. It opens soon…';
  luEl('lu-lock-note').textContent = '';
  luEl('lu-lock').style.display = 'flex';
  const pad = n => String(n).padStart(2, '0'); let done = false, t = null;
  const tick = () => {
    const left = Math.max(0, target - (Date.now() + skew)), s = Math.floor(left / 1000);
    luEl('lu-d').textContent = pad(Math.floor(s / 86400)); luEl('lu-h').textContent = pad(Math.floor(s % 86400 / 3600));
    luEl('lu-m').textContent = pad(Math.floor(s % 3600 / 60)); luEl('lu-s').textContent = pad(s % 60);
    if(left <= 0 && !done){
      done = true; clearInterval(t); luEl('lu-lock-note').textContent = 'Opening your gift…';
      setTimeout(() => { luEl('lu-lock').style.display = 'none'; luBoot(); }, 1500);   // ask the server again; it only opens if the time really passed
    }
  };
  t = setInterval(tick, 1000); tick();
}
async function luBoot(){
  const id = new URLSearchParams(location.search).get('gift'); LU.id = id;
  if(!id || !window.supabase){ luMsg('This gift link looks incomplete.', false); return; }
  if(!LU.sb) LU.sb = window.supabase.createClient(window.LU_CONFIG.url, window.LU_CONFIG.key);
  let pg = null;
  try{ const r = await LU.sb.rpc('get_public_gift', { p_id: id }); if(r.error) throw r.error; pg = r.data; }
  catch(e){ luMsg("Couldn't reach the server. Check your connection and try again.", true); return; }
  if(!pg){ luMsg("This gift isn't available. It may still be a draft, or the link may be incorrect.", false); return; }
  if(pg.locked && pg.reveal_at){ luShowLock(pg); return; }
  if(pg.locked && pg.pin_required){ LU.pin = true; LU.name = pg.name || ''; luShowStart(); return; }   // content stays on the server until the PIN is right
  luApply(pg);
  if(!LU.owner) LU.sb.rpc('increment_gift_views', { gift_id: id });
  luShowStart();
}
async function luCheckPin(pin){
  if(window.__skipPin) return true;
  window.__pinBusy = true; window.__pinMsg = '';
  try{
    const r = await LU.sb.rpc('unlock_gift_with_pin', { p_id: LU.id, p_pin: pin });
    if(r.error) throw r.error;
    const d = r.data;
    if(!d || d.error){
      window.__pinMsg = d && d.error === 'PIN_RATE' ? 'Too many tries. Please wait a few minutes and try again 💗'
        : d && d.error === 'REVEAL_LOCKED' ? "This gift isn't open yet." : '';
      return false;
    }
    luApply(d); LU.sb.rpc('increment_gift_views', { gift_id: LU.id });
    return true;
  }catch(e){ window.__pinMsg = "Couldn't check the passcode. Check your connection and try again."; return false; }
  finally{ window.__pinBusy = false; }
}
function luApply(pg){
  const g = pg.gift || {};
  LU.gift = g; LU.name = g.name || ''; LU.extras = g.extras || {}; LU.owner = !!pg.is_owner;
  LU.photos = (pg.photos || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).slice(0, 12);
  document.title = 'A gift for ' + (LU.name || 'you') + ' 🎁';
  if(LU.owner) luEl('lu-owner').style.display = 'block';
  luBuildClothesline(); luSetLetter(g);
  const wish = String(LU.extras.wish || '').trim(), w = luEl('cake-wish-text');
  if(w && wish) w.textContent = '🎉 ' + wish + ' 💖';
  luSetupMusic(g.music_file_url);
}
function luBuildClothesline(){
  const track = luEl('clothesline-photos-track'); if(!track) return;
  track.textContent = '';
  if(!LU.photos.length){
    const e = document.createElement('div'); e.className = 'lu-empty'; e.textContent = 'No photos yet 📸'; track.appendChild(e); return;
  }
  const tilts = ['tilt-left', 'tilt-right', 'tilt-straight'];
  LU.photos.forEach((p, i) => {
    const item = document.createElement('div'); item.className = 'hanging-polaroid-item ' + tilts[i % 3];
    item.addEventListener('click', () => focusHangingPhoto(item));
    const peg = document.createElement('div'); peg.className = 'wooden-clothespin';
    peg.innerHTML = '<span class="peg-slit"></span><span class="peg-spring"></span>';
    const frame = document.createElement('div'); frame.className = 'gingham-frame';
    const box = document.createElement('div'); box.className = 'photo-inner-box';
    const img = document.createElement('img'); img.src = p.url; img.alt = p.caption || ('Memory ' + (i + 1)); img.loading = 'lazy';
    box.appendChild(img); frame.appendChild(box);
    const cap = document.createElement('div'); cap.className = 'photo-caption-tag'; cap.textContent = p.caption || '';
    if(p.caption) frame.appendChild(cap);
    item.appendChild(peg); item.appendChild(frame); track.appendChild(item);
    if(i < LU.photos.length - 1){
      const d = document.createElement('div'); d.className = 'line-deco-element ' + (i % 2 ? 'flower-deco' : 'bow-deco'); d.textContent = i % 2 ? '🌺' : '🎀'; track.appendChild(d);
    }
  });
}
function luSetLetter(g){
  const m = g.messages || {}, nm = (g.name || '').trim(), greet = LU_GREET[g.occasion || 'birthday'] || 'Happy birthday';
  const secs = [
    { id: 'letter-headline-el', text: nm ? greet + ',\n' + nm + '! ❤️' : greet + '! ❤️' },
    { id: 'letter-p1-el', text: String(m.main || '').trim() },
    { id: 'letter-p2-el', text: [String(m.love || '').trim(), String(m.story || '').trim()].filter(Boolean).join('\n\n') },
    { id: 'letter-closing-el', text: String(m.dreams || '').trim() }
  ];
  LETTER_SECTIONS = secs.filter(s => s.text);
  secs.forEach(s => { const el = luEl(s.id); if(!el) return; el.textContent = ''; el.style.display = s.text ? '' : 'none'; });
  const img = luEl('letter-photo-img'), p = LU.photos[0];
  if(img){ if(p && p.url){ img.src = p.url; img.style.display = ''; } else { img.style.display = 'none'; } }
}
function luSetupMusic(url){
  if(!url || LU.audio) return;
  LU.audio = new Audio(url); LU.audio.loop = true; LU.audio.preload = 'auto';
  luEl('lu-music').style.display = 'block';
  if(LU.begun) luStartMusic();
}
function luStartMusic(){
  if(!LU.audio) return;
  LU.audio.play().then(() => { luEl('lu-music').textContent = '🔊'; }).catch(() => { luEl('lu-music').textContent = '🔈'; });
}
function luToggleMusic(){
  if(!LU.audio) return;
  if(LU.audio.paused) luStartMusic(); else { LU.audio.pause(); luEl('lu-music').textContent = '🔈'; }
}

/* ---- replies ---- */
let luReaction = '', luSending = false;
function luToken(){ try{ let t = localStorage.getItem('lu_rt'); if(!t){ t = Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem('lu_rt', t); } return t; }catch(e){ return Math.random().toString(36).slice(2) + Date.now().toString(36); } }
function luOpenReply(){
  luEl('lu-reply-err').textContent = '';
  let sent = false; try{ sent = !!localStorage.getItem('lu_replied_' + LU.id); }catch(e){}
  if(sent) luEl('lu-reply-err').textContent = 'You already sent a reply. You can send another one if you like 💗';
  luEl('lu-reply').style.display = 'flex';
}
function luCloseReply(){ const e = luEl('lu-reply'); if(e) e.style.display = 'none'; }
function luPick(btn){
  const on = btn.classList.contains('sel');
  document.querySelectorAll('#lu-chips button').forEach(b => b.classList.remove('sel')); luReaction = '';
  if(!on){ btn.classList.add('sel'); luReaction = btn.dataset.r; }
}
async function luSendReply(){
  const err = luEl('lu-reply-err'), btn = luEl('lu-reply-send'), msg = luEl('lu-reply-text').value.trim();
  err.textContent = '';
  if(!msg && !luReaction){ err.textContent = 'Write a message or pick a reaction first.'; return; }
  if(LU.owner){ err.textContent = 'Preview only: replies are saved when someone opens the real link.'; return; }
  if(luSending) return;
  luSending = true; btn.disabled = true; btn.textContent = 'Sending…';
  try{
    const r = await LU.sb.rpc('submit_gift_reply', { p_gift_id: LU.id, p_message: msg, p_reaction: luReaction || null, p_token: luToken() });
    if(r.error) throw r.error;
    try{ localStorage.setItem('lu_replied_' + LU.id, '1'); }catch(e){}
    luEl('lu-reply-text').value = ''; luReaction = ''; document.querySelectorAll('#lu-chips button').forEach(b => b.classList.remove('sel'));
    err.textContent = 'Sent! Thank you for making someone\'s day 💌';
    launchConfetti();
  }catch(e){
    const m = String((e && e.message) || '');
    err.textContent = /REPLY_RATE/.test(m) ? 'Lots of replies just came in. Please try again in a little while.'
      : /REPLY_DUP/.test(m) ? 'It looks like that reply was already sent.'
      : /REPLY_LOCKED/.test(m) ? "This gift isn't open yet."
      : /REPLY_INVALID/.test(m) ? 'Please check your message and try again.'
      : "Couldn't send your reply. Please check your connection and try again.";
  }
  luSending = false; btn.disabled = false; btn.textContent = 'Send reply 💌';
}

luBoot();


