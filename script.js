// final script - integrates all features including bg motion, particles, counter, modal, faq, sounds
document.addEventListener('DOMContentLoaded', ()=>{

  // ============ НАСТРОЙКИ ============
  const TELEGRAM_USERNAME = 'avert2';  // ← АДМИН
  const BOT_USERNAME = 'Standoff2_Droq2bot';  // ← БОТ
  
  const TELEGRAM_LINK = 'https://t.me/' + TELEGRAM_USERNAME;
  const TG_APP = 'tg://resolve?domain=' + TELEGRAM_USERNAME;
  const BOT_LINK = 'https://t.me/' + BOT_USERNAME;
  const BOT_APP = 'tg://resolve?domain=' + BOT_USERNAME;

  // fill bot top links
  const botTop = document.getElementById('botTop');
  if(botTop) {
    botTop.href = BOT_LINK;
    botTop.addEventListener('click', (e) => {
      e.preventDefault();
      try { window.location = BOT_APP; } catch(e) {}
      setTimeout(() => { window.open(BOT_LINK, '_blank'); }, 700);
    });
  }
  
  const botTopR = document.getElementById('botTopR');
  if(botTopR) {
    botTopR.href = BOT_LINK;
    botTopR.addEventListener('click', (e) => {
      e.preventDefault();
      try { window.location = BOT_APP; } catch(e) {}
      setTimeout(() => { window.open(BOT_LINK, '_blank'); }, 700);
    });
  }
  
  const botTopF = document.getElementById('botTopF');
  if(botTopF) {
    botTopF.href = BOT_LINK;
    botTopF.addEventListener('click', (e) => {
      e.preventDefault();
      try { window.location = BOT_APP; } catch(e) {}
      setTimeout(() => { window.open(BOT_LINK, '_blank'); }, 700);
    });
  }

  // touch detection
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // audio
  let audioCtx;
  try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ audioCtx = null; }
  function playTick(){
    if(!audioCtx) return;
    try{
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 1200;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.13);
    }catch(e){}
  }

  // cursor glow
  const cursor = document.getElementById('cursorGlow');
  if(cursor && !isTouch){
    window.addEventListener('mousemove', (e)=>{
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  } else if(cursor){
    cursor.style.display = 'none';
  }

  // clients counter with localStorage
  const counterEl = document.getElementById('clientsCounter');
  if(counterEl){
    const LS_KEY = 'st2_clients_final';
    const base = 12438;
    const stored = parseInt(localStorage.getItem(LS_KEY));
    let current = Number.isInteger(stored) ? stored : base;
    const inc = Math.floor(Math.random()*3)+1;
    current += inc;
    localStorage.setItem(LS_KEY, current);
    function animateCounter(){
      const start = parseInt(counterEl.textContent.replace(/\s/g,'')) || base;
      const end = current;
      const dur = 900;
      const steps = Math.ceil(dur/30);
      let step = 0;
      const diff = end - start;
      const iv = setInterval(()=>{
        step++;
        const val = Math.round(start + diff * (step/steps));
        counterEl.textContent = val.toLocaleString('ru-RU');
        if(step>=steps) clearInterval(iv);
      },30);
    }
    function onScroll(){
      const rect = counterEl.getBoundingClientRect();
      if(rect.top < window.innerHeight && rect.bottom >= 0){ animateCounter(); window.removeEventListener('scroll', onScroll); }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // particles (gold) - lighter on touch
  const page = document.body.getAttribute('data-page') || 'index';
  if(page === 'index'){
    const canvas = document.createElement('canvas');
    canvas.id = 'goldParticles';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; }
    window.addEventListener('resize', resize); resize();
    const count = isTouch ? 46 : 120;
    const particles = Array.from({length:count}, ()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()*-0.6)-0.1,r:Math.random()*2+0.6,alpha:0.6+Math.random()*0.6}));
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy;
        p.alpha -= isTouch ? 0.0012 : 0.0008;
        if(p.y < -20 || p.alpha<=0){ p.x = Math.random()*canvas.width; p.y = canvas.height + Math.random()*60; p.alpha = 0.6 + Math.random()*0.6; }
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,215,0,'+p.alpha+')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // modal / calculator
  const openCalc = document.getElementById('openCalc');
  const calcModal = document.getElementById('calcModal');
  const closeCalc = document.getElementById('closeCalc');
  const backdrop = document.getElementById('backdrop');
  const calcSell = document.getElementById('calcSell');
  const goldInput = document.getElementById('goldInput');
  const holoResult = document.getElementById('holoResult');
  const adminBtn = document.getElementById('adminBtn');

  function openModal(){ if(calcModal){ calcModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; playTick(); } }
  function closeModal(){ if(calcModal){ calcModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } }

  if(openCalc) openCalc.addEventListener('click', ()=>{ openModal(); playTick(); });
  if(closeCalc) closeCalc.addEventListener('click', ()=>{ closeModal(); playTick(); });
  if(backdrop) backdrop.addEventListener('click', ()=>{ closeModal(); });

  if(calcSell){
    calcSell.addEventListener('click', ()=>{
      playTick();
      const gold = parseFloat(goldInput.value);
      if(!gold || gold <= 0){ holoResult.innerHTML = '<div style="color:#ff8080">Введите корректное количество голды</div>'; holoResult.classList.add('show'); return; }
      const sum = (gold * 1.2).toFixed(2);
      holoResult.innerHTML = '<div style="font-size:18px;color:var(--gold);">Итог: <strong>'+sum+' ₽</strong></div>' +
        '<div style="font-size:13px;color:#cfcfcf;margin-top:8px">Нажмите кнопку ниже, чтобы связаться с админом и завершить сделку.</div>';
      holoResult.classList.add('show');
      // admin button: try app protocol then fallback to web
      adminBtn.onclick = ()=>{
        try{ window.location = TG_APP; }catch(e){}
        setTimeout(()=>{ window.open(TELEGRAM_LINK, '_blank'); }, 700);
      };
    });
  }

  // top admin link: both ways
  const tgTop = document.getElementById('tgTop');
  if(tgTop){
    tgTop.addEventListener('click', (e)=>{ e.preventDefault(); playTick(); try{ window.location = TG_APP; }catch(e){} setTimeout(()=>{ window.open(TELEGRAM_LINK, '_blank'); },700); });
  }
  
  const tgTopR = document.getElementById('tgTopR');
  if(tgTopR){
    tgTopR.addEventListener('click', (e)=>{ e.preventDefault(); playTick(); try{ window.location = TG_APP; }catch(e){} setTimeout(()=>{ window.open(TELEGRAM_LINK, '_blank'); },700); });
  }
  
  const tgTopF = document.getElementById('tgTopF');
  if(tgTopF){
    tgTopF.addEventListener('click', (e)=>{ e.preventDefault(); playTick(); try{ window.location = TG_APP; }catch(e){} setTimeout(()=>{ window.open(TELEGRAM_LINK, '_blank'); },700); });
  }

  // FAQ toggle
  document.querySelectorAll('.q-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      playTick();
      const a = btn.parentElement.nextElementSibling;
      if(!a) return;
      const visible = a.style.display === 'block';
      document.querySelectorAll('.a').forEach(x=>x.style.display='none');
      if(!visible){ a.style.display = 'block'; a.scrollIntoView({behavior:'smooth',block:'center'}); }
    });
  });

  // play tick on nav buttons
  document.querySelectorAll('.nav-btn, .btn').forEach(el=>{ el.addEventListener('click', ()=>{ playTick(); }); });

  // accessibility: Enter on input triggers calc
  if(goldInput) goldInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') calcSell.click(); });

});
