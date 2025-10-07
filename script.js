/* ========== 3D card parallax ========== */
const card = document.getElementById('card');
if(card){
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const rotY = dx * 10; // degrees
    const rotX = -dy * 10;
    card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(10px)`;
  });
  window.addEventListener('mouseleave', ()=>{
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
  });
  // small pop on click (optional)
  card.addEventListener('mousedown', ()=> card.style.transform += ' scale(.995)');
  card.addEventListener('mouseup', ()=> card.style.transform = card.style.transform.replace(' scale(.995)',''));
}

/* ========== lightweight particle background ========== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.round((w*h)/80000); // keeps it light

  function rand(min,max){return Math.random()*(max-min)+min}

  for(let i=0;i<count;i++){
    particles.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(0.6,2.2),
      vx: rand(-0.2,0.2),
      vy: rand(-0.2,0.2),
      alpha: rand(0.05,0.25)
    });
  }

  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w;
      if(p.x>w) p.x=0;
      if(p.y<0) p.y=h;
      if(p.y>h) p.y=0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(0,234,255,${p.alpha})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ========== Contact form with EmailJS ==========
   - EmailJS is included in contact.html
   - You must replace: YOUR_USER_ID, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
   - Or if you don't want EmailJS, the form will show demo success message.
=============================================== */
(function(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('form-status');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name || !email || !message){
      status.style.color = '#ff3366';
      status.textContent = 'সব ফিল্ড পূরণ করো (fill all fields).';
      return;
    }

    // If EmailJS is configured, send via EmailJS
    if(typeof emailjs !== 'undefined' && emailjs.send){
      // CHANGE THESE to your own ids from EmailJS dashboard
      const SERVICE_ID = 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

      status.style.color = '#ffd166';
      status.textContent = 'Sending...';

      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message
      }).then(function(){
        status.style.color = '#7efc9f';
        status.textContent = '✅ Message sent. Thank you!';
        form.reset();
      }, function(err){
        console.error('EmailJS error:', err);
        status.style.color = '#ff6b6b';
        status.textContent = 'Send failed. (Demo mode) — message not delivered.';
      });
      return;
    }

    // Demo fallback (no EmailJS configured)
    status.style.color = '#7efc9f';
    status.textContent = '✅ Message sent (demo mode). To get real delivery, set up EmailJS.';
    form.reset();
  });
})();
