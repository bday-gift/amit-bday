
/* ========================================
   AMIT GUPTA — BIRTHDAY WEBSITE - FINAL VIP
   ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const pages = [...$$(".page")];
  let currentPage = 0;
  function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    pages.forEach((page, i) => {
      page.classList.toggle("active", i === index);
    });
    currentPage = index;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showPage(currentPage + 1));
  });
  $$("[data-prev]").forEach((button) => {
    button.addEventListener("click", () => showPage(currentPage - 1));
  });

  /* ---------- PIN SCREEN ---------- */
  const pinForm = $("#pinForm");
  const pinInput = $("#pin");
  const pinError = $("#pinError");
  if (pinForm) {
    pinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (pinInput.value.trim() === "0701") {
        pinError.textContent = "";
        pinInput.value = "";
        showPage(1);
        $("#music")?.play().catch(()=>{});
      } else {
        pinError.textContent = "That isn't the right PIN. Try 0701";
        pinInput.value = "";
        pinInput.focus();
      }
    });
  }

  /* ---------- BIRTHDAY COUNTDOWN ---------- */
  function updateCountdown() {
    const now = new Date();
    let birthday = new Date(now.getFullYear(), 9, 18, 0, 0, 0);
    if (now >= birthday) birthday = new Date(now.getFullYear() + 1, 9, 18, 0, 0, 0);
    const difference = birthday.getTime() - now.getTime();
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    const values = { "#days": days, "#hours": hours, "#minutes": minutes, "#seconds": seconds };
    Object.entries(values).forEach(([selector, value]) => {
      const element = $(selector);
      if (element) element.textContent = String(value).padStart(2, "0");
    });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- BACKGROUND MUSIC ---------- */
  const music = $("#music");
  const musicButton = $("#musicBtn");
  if (music && musicButton) {
    musicButton.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
          musicButton.textContent = "❚❚";
          musicButton.classList.add("playing");
        } else {
          music.pause();
          musicButton.textContent = "▶";
          musicButton.classList.remove("playing");
        }
      } catch (error) { console.error(error); }
    });
  }

  /* ---------- PHOTO GALLERY ---------- */
  const photoButtons = [...$$(".photo")];
  const lightbox = $("#lightbox");
  const lightboxImage = $("#largePhoto");
  const closeLightbox = $("#closeLightbox");
  const previousPhoto = $("#previousPhoto");
  const nextPhoto = $("#nextPhoto");
  const photoCount = $("#photoCount");
  let activePhotoIndex = 0;
  function showPhoto(index) {
    if (!photoButtons.length ||!lightbox ||!lightboxImage) return;
    activePhotoIndex = (index + photoButtons.length) % photoButtons.length;
    const image = photoButtons[activePhotoIndex].querySelector("img");
    if (!image) return;
    lightboxImage.src = image.src;
    if (photoCount) photoCount.textContent = `${activePhotoIndex + 1} / ${photoButtons.length}`;
  }
  function openPhoto(index) { showPhoto(index); lightbox.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closePhoto() { lightbox.classList.remove("open"); document.body.style.overflow = ""; }
  photoButtons.forEach((button, index) => { button.addEventListener("click", () => openPhoto(index)); });
  if (closeLightbox) closeLightbox.addEventListener("click", closePhoto);
  if (previousPhoto) previousPhoto.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
  if (nextPhoto) nextPhoto.addEventListener("click", () => showPhoto(activePhotoIndex + 1));
  if (lightbox) lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closePhoto(); });

  /* ---------- LETTER ENVELOPE - FIXED TO USE HTML TEXT ---------- */
  const envelope = $("#envelope");
  const letter = $("#letter");
  const letterText = $("#typedMessage");
  const originalLetterText = letterText? letterText.textContent.trim() : "";
  let letterOpened = false;
  function typeLetter() {
    if (!letterText || letterOpened) return;
    letterOpened = true;
    const fullText = originalLetterText;
    letterText.textContent = "";
    let characterIndex = 0;
    function typeNextCharacter() {
      if (characterIndex >= fullText.length) return;
      letterText.textContent += fullText.charAt(characterIndex);
      characterIndex++;
      setTimeout(typeNextCharacter, 18);
    }
    typeNextCharacter();
  }
  if (envelope) {
    envelope.addEventListener("click", () => {
      envelope.classList.add("opened");
      if (letter) letter.classList.add("show");
      typeLetter();
    });
  }

  /* ---------- GIFT CARDS ---------- */
  $$(".gift").forEach((gift) => {
    gift.addEventListener("click", () => {
      gift.classList.toggle("opened");
    });
  });

  /* ---------- MINI QUIZ ---------- */
  const quizQuestions = $$(".question");
  const quizResult = $("#quizResult");
  let answeredQuestions = 0; let correctAnswers = 0;
  quizQuestions.forEach((question) => {
    const answerButtons = [...question.querySelectorAll("button")];
    const correctIndex = parseInt(question.dataset.answer);
    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (question.dataset.answered === "true") return;
        question.dataset.answered = "true"; answeredQuestions++;
        const choice = parseInt(button.dataset.choice);
        const isCorrect = choice === correctIndex;
        if (isCorrect) { correctAnswers++; button.classList.add("correct"); }
        else {
          button.classList.add("wrong");
          if (answerButtons[correctIndex]) answerButtons[correctIndex].classList.add("correct");
        }
        answerButtons.forEach((item) => { item.disabled = true; });
        if (quizResult && answeredQuestions === quizQuestions.length) {
          quizResult.textContent = `You got ${correctAnswers} out of ${quizQuestions.length}. ` + (correctAnswers === quizQuestions.length? "You know him pretty well. 🏆" : "Looks like there is still more to learn.");
        }
      });
    });
  });

  /* ---------- CONFETTI ---------- */
  const confettiCanvas = $("#confetti");
  let confettiAnimation = null;
  function launchConfetti() {
    if (!confettiCanvas) return;
    const context = confettiCanvas.getContext("2d");
    if (!context) return;
    confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight;
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth, y: -Math.random() * window.innerHeight,
      size: Math.random() * 7 + 3, speedY: Math.random() * 3 + 2, speedX: Math.random() * 4 - 2,
      color: ["#ffd700", "#ff3030", "#ffffff", "#ff9b25"][Math.floor(Math.random() * 4)]
    }));
    function animateConfetti() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle) => {
        particle.x += particle.speedX; particle.y += particle.speedY;
        context.fillStyle = particle.color; context.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
      confettiAnimation = requestAnimationFrame(animateConfetti);
      setTimeout(()=> { cancelAnimationFrame(confettiAnimation); context.clearRect(0,0,window.innerWidth,window.innerHeight); }, 3500);
    }
    animateConfetti();
  }

  /* ---------- CAKE CUTTING - TUTORIAL + BLOW + SWIPE + PREMIUM POPUP + AJAX WISH ---------- */
  const cakeContainer = $("#cakeContainer");
  const realCake = $("#realCake");
  const cakeSlices = $("#cakeSlices");
  const cakeTutorial = $("#cakeTutorial");
  const cakeHint = $("#cakeHint");
  const cakeMessage = $("#cakeMessage");
  const cakePopup = $("#cakePopup");
  const closePopup = $("#closePopup");
  const wishBox = $("#wishBox");
  const candles = [...document.querySelectorAll('.candle')];
  let blownCount = 0;
  let cakeCut = false;
  let startX = 0;

  // Step 1: Blow candles tutorial
  candles.forEach(c => {
    c.addEventListener('click', () => {
      if(c.classList.contains('blown')) return;
      c.classList.add('blown');
      blownCount++;
      if(navigator.vibrate) navigator.vibrate(30);
      if(blownCount === candles.length){
        if(cakeTutorial){
          cakeTutorial.textContent = "🎉 Blown! Now swipe to cut the cake →";
        }
        setTimeout(()=>{
          if(cakeTutorial) cakeTutorial.classList.add('hidden');
          if(cakeHint) cakeHint.classList.remove('hidden');
        },1200);
      }
    });
  });

  function triggerCakeCut(){
    if(cakeCut) return;
    if(blownCount < candles.length){
      if(cakeTutorial){
        cakeTutorial.textContent = "First blow all candles! 👆 Tap them";
        cakeTutorial.classList.remove('hidden');
      }
      return;
    }
    cakeCut = true;
    if(navigator.vibrate) navigator.vibrate([100,50,100]);
    const s1 = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fireworks-crackle-2021.mp3');
    s1.volume = 0.7; s1.play().catch(()=>{});
    setTimeout(()=>{
      const s2 = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-confetti-cannon-1030.mp3');
      s2.volume = 0.8; s2.play().catch(()=>{});
    },300);

    if(cakeContainer) cakeContainer.classList.add('cutting');
    if(realCake) realCake.classList.add('cut');

    setTimeout(()=>{
      if(realCake){ realCake.style.opacity='0'; realCake.style.transform='scale(0.8)'; }
      if(cakeSlices) cakeSlices.classList.remove('hidden');
      if(cakeHint) cakeHint.classList.add('hidden');
      if(cakeMessage) cakeMessage.textContent='Yummy! Make a wish, Amit! ✨';
      launchConfetti();
      setTimeout(launchConfetti,400);
      setTimeout(launchConfetti,800);
      if(cakePopup) cakePopup.classList.remove('hidden');
    },500);
  }

  if(closePopup){
    closePopup.addEventListener('click', ()=>{
      if(cakePopup) cakePopup.classList.add('hidden');
      if(wishBox){ wishBox.classList.remove('hidden'); wishBox.scrollIntoView({behavior:'smooth'}); }
    });
  }

  if(cakeContainer){
    cakeContainer.addEventListener('mousedown', e=>{ startX=e.clientX; cakeContainer.classList.add('cutting'); });
    cakeContainer.addEventListener('mouseup', e=>{ cakeContainer.classList.remove('cutting'); if(Math.abs(e.clientX-startX)>50) triggerCakeCut(); });
    cakeContainer.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; cakeContainer.classList.add('cutting'); },{passive:true});
    cakeContainer.addEventListener('touchend', e=>{ cakeContainer.classList.remove('cutting'); const endX=e.changedTouches[0].clientX; if(Math.abs(endX-startX)>40) triggerCakeCut(); },{passive:true});
    cakeContainer.addEventListener('click', (e)=>{
      if(e.target.closest('.candle')) return;
      if(blownCount===candles.length) triggerCakeCut();
    });
  }

  // AJAX Wish - No Redirect
  const wishForm = $("#wishForm");
  const wishStatus = $("#wishStatus");
  if(wishForm){
    wishForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = $("#wishName")?.value.trim();
      const msg = $("#wishMsg")?.value.trim();
      if(!name || !msg) return;
      if(wishStatus){ wishStatus.textContent="Sending..."; wishStatus.className="wish-status"; }
      try{
        const res = await fetch("https://formsubmit.co/ajax/arjunbday12@gmail.com", {
          method:"POST",
          headers:{"Content-Type":"application/json","Accept":"application/json"},
          body: JSON.stringify({name, message: msg, _subject: "New Birthday Wish for Amit! 🎂", _captcha:"false", _template:"table"})
        });
        if(res.ok){
          if(wishStatus) wishStatus.textContent="✅ Wish sent to Amit! Thank you!";
          wishForm.reset();
          launchConfetti();
        } else throw new Error();
      }catch{
        if(wishStatus){ wishStatus.textContent="❌ Failed, try again"; wishStatus.classList.add('error'); }
      }
    });
  }

  /* ---------- RESTART ---------- */
  const restartButton = $("#restart");
  if (restartButton) {
    restartButton.addEventListener("click", () => location.reload());
  }
});
