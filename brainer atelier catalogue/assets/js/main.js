// ── SMOOTH ANCHOR SCROLL (lightweight, no wheel lag) ──
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id==='#') return;
      const el=document.querySelector(id);
      if(el){
        e.preventDefault();
        const top=el.getBoundingClientRect().top+window.scrollY-80;
        window.scrollTo({top,behavior:'smooth'});
      }
    });
  });
});

// ── CURTAIN INTRO ──
window.addEventListener('load',()=>{
  const curtain=document.getElementById('curtain');
  if(curtain) setTimeout(()=>curtain.classList.add('hidden'),1500);
});

// ── HAMBURGER ──
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
if(hamburger&&mobileMenu){
  hamburger.addEventListener('click',()=>{
    mobileMenu.classList.toggle('open');
    const spans=hamburger.querySelectorAll('span');
    spans[0].style.transform=mobileMenu.classList.contains('open')?'rotate(45deg) translate(4px,4px)':'';
    spans[1].style.opacity=mobileMenu.classList.contains('open')?'0':'1';
    spans[2].style.transform=mobileMenu.classList.contains('open')?'rotate(-45deg) translate(4px,-4px)':'';
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
}

// ── HERO SLIDER ──
(function(){
  const slides=document.querySelectorAll('.slide');
  const dots=document.querySelectorAll('.slider-dot');
  const counter=document.getElementById('sliderCounter');
  const progressBar=document.getElementById('sliderProgressBar');
  const prevBtn=document.getElementById('sliderPrev');
  const nextBtn=document.getElementById('sliderNext');
  if(!slides.length)return;

  let current=0;
  let timer=null;
  let progressTimer=null;
  let progressVal=0;
  const INTERVAL=6000;

  function goTo(idx){
    slides[current].classList.remove('active');
    dots[current]&&dots[current].classList.remove('active');
    current=(idx+slides.length)%slides.length;
    slides[current].classList.add('active');
    dots[current]&&dots[current].classList.add('active');
    if(counter) counter.textContent=`0${current+1} / 0${slides.length}`;
    resetProgress();
  }

  function resetProgress(){
    clearInterval(progressTimer);
    progressVal=0;
    if(progressBar) progressBar.style.width='0%';
    const step=100/(INTERVAL/100);
    progressTimer=setInterval(()=>{
      progressVal+=step;
      if(progressBar) progressBar.style.width=Math.min(progressVal,100)+'%';
    },100);
  }

  function startAuto(){
    clearInterval(timer);
    timer=setInterval(()=>goTo(current+1),INTERVAL);
    resetProgress();
  }

  if(prevBtn) prevBtn.addEventListener('click',()=>{goTo(current-1);startAuto();});
  if(nextBtn) nextBtn.addEventListener('click',()=>{goTo(current+1);startAuto();});
  dots.forEach(dot=>dot.addEventListener('click',()=>{goTo(+dot.dataset.index);startAuto();}));

  // Swipe support
  let touchStartX=0;
  const slider=document.querySelector('.hero-slider');
  if(slider){
    slider.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
    slider.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-touchStartX;
      if(Math.abs(dx)>50){dx<0?goTo(current+1):goTo(current-1);startAuto();}
    },{passive:true});
  }

  startAuto();
})();




// ── CATALOGUE DATA ──
const dresses=[
  {id:1,name:'Dress 1',collection:'Ethereal',silhouette:'',fabric:'',detail:'',tag:'new',image:'assets/images/For website catalogue/2199b7fc5d93986e5cfcfbfaf97fe6c4.jpg'},
  {id:2,name:'Dress 2',collection:'Ethereal',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/2cefcfb1d5ee79d8c4d22dcd28133141.jpg'},
  {id:3,name:'Dress 3',collection:'Ethereal',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/45fbd1c065b9f5ecd8d392328128a431.jpg'},
  {id:4,name:'Dress 4',collection:'Mystique',silhouette:'',fabric:'',detail:'',tag:'new',image:'assets/images/For website catalogue/77d8b8bb907a6f1b9e5e1999fe04572b.jpg'},
  {id:5,name:'Dress 5',collection:'Mystique',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/9bb5cf22c5673e55bb53fb9b0ca3838c.jpg'},
  {id:6,name:'Dress 6',collection:'Mystique',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/Gemini_Generated_Image_dk6j2kdk6j2kdk6j.png'},
  {id:7,name:'Dress 7',collection:'Romance',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/Gemini_Generated_Image_nsp4gwnsp4gwnsp4.png'},
  {id:8,name:'Dress 8',collection:'Romance',silhouette:'',fabric:'',detail:'',tag:'new',image:'assets/images/For website catalogue/Image_20260515_163533_219.jpeg'},
  {id:9,name:'Dress 9',collection:'Romance',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/Image_20260515_163533_237.jpeg'},
  {id:10,name:'Dress 10',collection:'Classic',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/Image_20260515_163533_263.jpeg'},
  {id:11,name:'Dress 11',collection:'Classic',silhouette:'',fabric:'',detail:'',tag:'',image:'assets/images/For website catalogue/Image_20260515_163533_291.jpeg'},
  {id:12,name:'Dress 12',collection:'Classic',silhouette:'',fabric:'',detail:'',tag:'new',image:'assets/images/For website catalogue/Image_20260515_163533_313.jpeg'},
];

function blankPlaceholder(){
  return`<div class="blank-placeholder">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" opacity="0.4"/>
    </svg>
    <span>Photo Coming Soon</span>
  </div>`;
}

function renderCards(filter='All'){
  const grid=document.getElementById('catalogueGrid');
  if(!grid)return;
  const filtered=filter==='All'?dresses:dresses.filter(d=>d.collection===filter);
  grid.innerHTML='';
  filtered.forEach((d,i)=>{
    const delay=i%4;
    const card=document.createElement('div');
    card.className=`dress-card reveal reveal-delay-${delay}`;
    card.dataset.id=d.id;
    card.innerHTML=`
      <div class="dress-card-img ${d.image ? '' : 'blank'}">
        ${d.image ? `<img src="${d.image}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: cover;">` : blankPlaceholder()}
        ${d.tag?`<span class="dress-card-badge ${d.tag}">${d.tag==='new'?'New':'Featured'}</span>`:''}
        <div class="dress-card-overlay">
          <button class="btn-view" onclick="openLightbox(${d.id})">View Details</button>
        </div>
      </div>
      <div class="dress-card-info">
        <span class="collection-tag">${d.collection} Collection</span>
        <h3>${d.name}</h3>
        ${(d.silhouette || d.fabric) ? `<p class="dress-detail">${[d.silhouette, d.fabric].filter(Boolean).join(' · ')}</p>` : ''}
      </div>`;
    grid.appendChild(card);
  });
  setTimeout(initReveal,50);
}

// ── FILTER ──
document.addEventListener('DOMContentLoaded',()=>{
  renderCards('All');
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      renderCards(this.dataset.filter);
    });
  });
});

// ── LIGHTBOX ──
function openLightbox(id){
  const d=dresses.find(x=>x.id===id);
  if(!d)return;
  const lb=document.getElementById('lightbox');
  document.getElementById('lbTitle').textContent=d.name;
  document.getElementById('lbCollection').textContent=d.collection+' Collection';
  document.getElementById('lbDetail').textContent=[d.silhouette, d.fabric, d.detail].filter(Boolean).join(' · ');
  
  const lbImg = lb.querySelector('.lightbox-img');
  if (d.image) {
    lbImg.innerHTML = `<img src="${d.image}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
  } else {
    lbImg.innerHTML = blankPlaceholder();
  }
  
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});

// ── SCROLL REVEAL ──
function initReveal(){
  const items=document.querySelectorAll('.reveal:not(.in-view)');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}});
  },{threshold:0.12});
  items.forEach(el=>observer.observe(el));
}
document.addEventListener('DOMContentLoaded',initReveal);

// ── ACTIVE NAV ──
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id;});
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.classList.toggle('active',a.getAttribute('href')==='#'+cur);
  });
},{passive:true});

// ── INQUIRY FORM ──
const inquiryForm=document.getElementById('inquiryForm');
if(inquiryForm){
  inquiryForm.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=inquiryForm.querySelector('button[type="submit"]');
    btn.textContent='Message Sent ✓';
    btn.style.background='var(--dark)';
    setTimeout(()=>{btn.textContent='Send Inquiry';btn.style.background='';inquiryForm.reset();},3000);
  });
}

// ── AI CHAT WIDGET ──
(function(){
  const fab=document.getElementById('chatFab');
  const panel=document.getElementById('chatPanel');
  const closeBtn=document.getElementById('chatClose');
  const form=document.getElementById('chatForm');
  const input=document.getElementById('chatInput');
  const messages=document.getElementById('chatMessages');
  const quickReplies=document.getElementById('chatQuickReplies');
  if(!fab||!panel) return;

  // Toggle open/close
  fab.addEventListener('click',()=>{
    const isOpen=panel.classList.contains('open');
    panel.classList.toggle('open',!isOpen);
    fab.querySelector('.chat-fab-icon--open').style.display=isOpen?'':'none';
    fab.querySelector('.chat-fab-icon--close').style.display=isOpen?'none':'';
    
    // Hide pulse after first click
    const pulse = fab.querySelector('.chat-fab-pulse');
    if (pulse) pulse.style.display = 'none';

    if(!isOpen) setTimeout(()=>input&&input.focus(),350);
  });
  closeBtn&&closeBtn.addEventListener('click',()=>{
    panel.classList.remove('open');
    fab.querySelector('.chat-fab-icon--open').style.display='';
    fab.querySelector('.chat-fab-icon--close').style.display='none';
  });

  // Chat knowledge base
  const KB=[
    {k:['collection','gown','dress','ethereal','mystique','romance','classic'],
     r:'We have four bridal collections: **Ethereal** (silk tulle, ball gowns), **Mystique** (organza & lace, dramatic silhouettes), **Romance** (floral appliqué, sweetheart necklines), and **Classic** (timeless duchesse satin). Each gown is available for bespoke customisation. 👗'},
    {k:['fitting','appointment','book','schedule','consult'],
     r:'To book a private fitting, simply fill out our **inquiry form** on this page! Include your name, email, wedding date, and preferred gown. Our team will confirm your atelier appointment within 24–48 hours. 📅'},
    {k:['process','how','order','made','custom','bespoke'],
     r:'Our process has 4 steps:\n1. **Consultation** — We understand your vision\n2. **Design & Fabric** — Custom sketches & fabric selection\n3. **Atelier Creation** — Hand-constructed by our artisans\n4. **Final Fitting** — Perfecting every detail just for you ✨'},
    {k:['price','cost','how much','fee','rate'],
     r:'Pricing varies depending on the gown design, fabric choice, and customisation level. Please submit an inquiry with your preferred gown and wedding date, and our team will provide a personalised quote. 💐'},
    {k:['photo','picture','image','see','view','catalogue'],
     r:'Our gown photographs are coming soon! In the meantime, you can visit our atelier in person for an exclusive private viewing, or submit an inquiry and our team will share design references. 📷'},
    {k:['location','address','where','studio','philippines'],
     r:'Brainer Atelier is based in the Philippines. For atelier visit details and studio address, please book a consultation via our inquiry form and we will provide all location details. 🇵🇭'},
    {k:['contact','reach','email','message','inquiry'],
     r:'You can reach us through our **inquiry form** below! Fill in your details and vision, and our bridal team will get back to you within 1–2 business days. 💌'},
    {k:['markiecadag','rights','copyright','brand'],
     r:'Brainer Atelier is a brand by **Markiecadag**. All rights reserved. Our gowns are exclusively designed and crafted under the Brainer Atelier name. ®'},
    {k:['hello','hi','hey','good','morning','afternoon'],
     r:'Hello! Welcome to Brainer Atelier 💍 I\'m here to help you find your dream bridal gown, book a consultation, or answer any questions about our collections.'},
  ];

  function getBotReply(msg){
    const lower=msg.toLowerCase();
    for(const entry of KB){
      if(entry.k.some(k=>lower.includes(k))) return entry.r;
    }
    return 'Thank you for your message! For personalised assistance, please submit our **inquiry form** below or visit us at the atelier. Our bridal team will be happy to help you find your perfect gown. 👗✨';
  }

  function formatMsg(text){
    return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  }

  function now(){
    return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  }

  function appendMsg(text,type){
    const div=document.createElement('div');
    div.className=`chat-msg chat-msg--${type}`;
    div.innerHTML=`<div class="chat-bubble">${formatMsg(text)}</div><span class="chat-time">${now()}</span>`;
    messages.appendChild(div);
    messages.scrollTop=messages.scrollHeight;
  }

  function showTyping(){
    const t=document.createElement('div');
    t.className='chat-msg chat-msg--bot';
    t.id='chatTyping';
    t.innerHTML='<div class="chat-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(t);
    messages.scrollTop=messages.scrollHeight;
    return t;
  }

  function send(msg){
    if(!msg.trim()) return;
    appendMsg(msg,'user');
    quickReplies&&(quickReplies.style.display='none');
    const typing=showTyping();
    setTimeout(()=>{
      typing.remove();
      appendMsg(getBotReply(msg),'bot');
    },900+Math.random()*600);
  }

  form&&form.addEventListener('submit',e=>{
    e.preventDefault();
    send(input.value);
    input.value='';
  });

  document.querySelectorAll('.chat-quick').forEach(btn=>{
    btn.addEventListener('click',()=>send(btn.dataset.msg));
  });
})();
