/**
 * Motion kit — every scroll technique the renderer uses, in one place.
 *
 * Sixteen techniques, all opt-in via a single data-motion attribute that
 * sections.ts emits. The model never writes any of this.
 *
 * Two rules that matter:
 *
 *   1. Initial hidden states are set in JS, never in CSS. If the GSAP CDN
 *      fails, the early return fires before anything is hidden, and the page
 *      is fully readable. A CSS clip-path or opacity:0 would leave a blank
 *      page instead.
 *
 *   2. The accordion runs before the reduced-motion guard. It is behaviour,
 *      not motion — a visitor who prefers reduced motion still needs to open
 *      a question.
 */

export const MOTION_CSS = `
/* 1. sticky stack ------------------------------------------------- */
[data-motion="stack"]{display:grid;gap:clamp(16px,2vw,28px)}
[data-motion="stack"] > *{
  position:sticky;
  top:calc(88px + var(--stack-i,0) * 14px);
  transform-origin:center top;
  will-change:transform,opacity;
}
[data-motion="stack"] > *:last-child{position:relative;top:auto}

/* 2. horizontal track --------------------------------------------- */
[data-motion="track"]{position:relative;height:100vh;overflow:hidden}
[data-motion="track"] .track{
  display:flex;align-items:center;gap:clamp(16px,2.4vw,32px);
  height:100%;padding-inline:clamp(20px,4vw,64px);
  width:max-content;will-change:transform;
}
[data-motion="track"] .track-item{
  flex:0 0 auto;width:clamp(280px,42vw,560px);height:min(72vh,620px);
  border-radius:var(--r-photo,14px);overflow:hidden;position:relative;
  background:var(--surface,#0d0d0f);
}
[data-motion="track"] .track-item img{
  width:100%;height:100%;object-fit:cover;display:block;
}
[data-motion="track"] .track-item .cap{
  position:absolute;left:0;right:0;bottom:0;padding:clamp(16px,2vw,28px);
  background:linear-gradient(to top,rgba(0,0,0,.72),transparent);
  color:#fff;
}

/* 3. marquee ------------------------------------------------------ */
[data-motion="marquee"]{overflow:hidden;width:100%}
[data-motion="marquee"] .marquee-inner{
  display:flex;align-items:center;gap:clamp(24px,4vw,64px);
  width:max-content;
  animation:marquee-scroll var(--marquee-duration,32s) linear infinite;
}
[data-motion="marquee"][data-direction="reverse"] .marquee-inner{
  animation-direction:reverse;
}
@keyframes marquee-scroll{to{transform:translateX(-50%)}}

/* 4. pin-scale ---------------------------------------------------- */
[data-motion="pin-scale"] .pin-inner{transform-origin:center center;will-change:transform}

/* reduced motion: everything becomes a plain vertical page -------- */
@media (prefers-reduced-motion:reduce){
  [data-motion="stack"] > *{position:relative;top:auto;transform:none!important;opacity:1!important}
  [data-motion="track"]{height:auto;overflow:visible}
  [data-motion="track"] .track{
    flex-wrap:wrap;width:auto;height:auto;transform:none!important;
    padding-block:clamp(32px,5vw,64px);
  }
  [data-motion="track"] .track-item{width:100%;height:auto;aspect-ratio:4/3}
  [data-motion="marquee"] .marquee-inner{animation:none}
}
`;

export const MOTION_JS = `
(function(){
  /* --- accordion: behaviour, not motion ------------------------- */
  document.querySelectorAll('.faq-list').forEach(function(list){
    list.addEventListener('toggle',function(e){
      if(!e.target.open) return;
      list.querySelectorAll('details').forEach(function(d){
        if(d !== e.target) d.open = false;
      });
    }, true);
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  var D = 0.7, E = 'power3.out', DIST = 32;
  function all(n){ return gsap.utils.toArray('[data-motion="' + n + '"]'); }

  /* --- entrances ------------------------------------------------- */
  all('fade-rise').forEach(function(el){
    gsap.from(el,{y:DIST,opacity:0,duration:D,ease:E,
      scrollTrigger:{trigger:el,start:'top 88%'}});
  });
  all('stagger-children').forEach(function(el){
    gsap.from(el.children,{y:DIST*0.7,opacity:0,duration:D,ease:E,stagger:0.09,
      scrollTrigger:{trigger:el,start:'top 85%'}});
  });
  all('batch-cards').forEach(function(el){
    ScrollTrigger.batch(el.children,{start:'top 88%',
      onEnter:function(b){gsap.from(b,{y:DIST*0.7,opacity:0,duration:D,ease:E,stagger:0.07})}});
  });
  all('3d-flip').forEach(function(el){
    gsap.from(el,{rotateY:38,opacity:0,transformPerspective:900,duration:D+0.2,ease:E,
      scrollTrigger:{trigger:el,start:'top 85%'}});
  });

  /* --- text ------------------------------------------------------ */
  all('split-text').forEach(function(el){
    var words = el.textContent.split(/(\\s+)/);
    el.textContent='';
    words.forEach(function(w){
      if(!w.trim()){el.appendChild(document.createTextNode(w));return;}
      var s=document.createElement('span');
      s.textContent=w;s.style.display='inline-block';
      el.appendChild(s);el.appendChild(document.createTextNode(' '));
    });
    gsap.from(el.children,{y:'1em',opacity:0,duration:D+0.2,ease:E,stagger:0.04});
  });

  /* --- scroll-linked --------------------------------------------- */
  all('parallax-light').forEach(function(el){
    gsap.to(el,{yPercent:-8,ease:'none',
      scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}});
  });
  all('scrub-timeline').forEach(function(el){
    gsap.fromTo(el,{opacity:0.35},{opacity:1,ease:'none',
      scrollTrigger:{trigger:el,start:'top 85%',end:'top 35%',scrub:true}});
  });
  all('pin-section').forEach(function(el){
    ScrollTrigger.create({trigger:el,start:'top top',end:'+=100%',pin:true});
  });
  all('pin-scale').forEach(function(section){
    var inner = section.querySelector('.pin-inner') || section.firstElementChild;
    if(!inner) return;
    gsap.fromTo(inner,{scale:0.86,opacity:0.6},{scale:1,opacity:1,ease:'none',
      scrollTrigger:{trigger:section,start:'top bottom',end:'top top',scrub:true}});
  });
  all('mask-reveal').forEach(function(el){
    gsap.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',ease:'none',
      scrollTrigger:{trigger:el,start:'top 85%',end:'top 45%',scrub:true}});
  });
  all('stacking-sheets').forEach(function(el){
    var next = el.nextElementSibling;
    if(!next) return;
    gsap.to(el,{scale:0.88,borderRadius:20,filter:'brightness(0.55)',ease:'none',
      scrollTrigger:{trigger:next,start:'top bottom',end:'top top',scrub:true}});
  });

  /* --- horizontal track ------------------------------------------ */
  all('track').forEach(function(section){
    var track = section.querySelector('.track');
    if(!track) return;
    function distance(){ return Math.max(0, track.scrollWidth - window.innerWidth); }
    if(distance() <= 0) return;
    gsap.to(track,{
      x:function(){ return -distance(); },
      ease:'none',
      scrollTrigger:{
        trigger:section, start:'top top',
        end:function(){ return '+=' + distance(); },
        pin:true, scrub:true, invalidateOnRefresh:true, anticipatePin:1
      }
    });
  });

  /* --- sticky stack ---------------------------------------------- */
  all('stack').forEach(function(stack){
    var cards = Array.prototype.slice.call(stack.children);
    cards.forEach(function(card,i){ card.style.setProperty('--stack-i', String(i)); });
    cards.forEach(function(card,i){
      if(i === cards.length-1) return;
      gsap.to(card,{scale:0.92,opacity:0.55,ease:'none',
        scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top top',scrub:true}});
    });
  });

  /* --- marquees --------------------------------------------------- */
  all('direction-aware-marquee').forEach(function(el){
    var track = el.querySelector('.marquee__track') || el;
    var dir = 1;
    ScrollTrigger.create({onUpdate:function(self){dir = self.direction === 1 ? 1 : -1}});
    gsap.to(track,{xPercent:-50*dir,duration:24,ease:'none',repeat:-1});
  });
  all('marquee').forEach(function(el){
    var inner = el.querySelector('.marquee-inner');
    if(!inner || inner.dataset.cloned === 'true') return;
    inner.innerHTML = inner.innerHTML + inner.innerHTML;
    inner.dataset.cloned = 'true';
  });

  /* --- counters --------------------------------------------------- */
  all('counter').forEach(function(el){
    var to = parseFloat(el.dataset.to || '0');
    if(!isFinite(to)) return;
    var obj = {v:0};
    gsap.to(obj,{v:to,ease:'none',duration:1,
      scrollTrigger:{trigger:el,start:'top 88%',once:true},
      onUpdate:function(){ el.textContent = Math.round(obj.v).toLocaleString(); }});
  });

  /* --- class-driven ----------------------------------------------- */
  gsap.utils.toArray('.progress__fill').forEach(function(fill){
    var wrap = fill.closest('.wrap');
    if(!wrap) return;
    var steps = wrap.querySelectorAll('.step');
    gsap.to(fill,{width:'100%',ease:'none',
      scrollTrigger:{trigger:wrap,start:'top 60%',end:'bottom 40%',scrub:true,
        onUpdate:function(self){
          var n = Math.ceil(self.progress * steps.length);
          steps.forEach(function(s,i){ s.classList.toggle('is-active', i < n); });
        }}});
  });
  gsap.utils.toArray('.wordmark').forEach(function(w){
    gsap.fromTo(w,{fontWeight:400},{fontWeight:800,ease:'none',
      scrollTrigger:{trigger:w,start:'top 90%',end:'bottom 40%',scrub:true}});
  });
})();
`;
