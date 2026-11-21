/* FabLab — About page interactions (no libraries needed) */
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Hero shapes follow pointer (mouse + touch), each at its own depth */
var hero=document.getElementById('ahero'),shapes=hero.querySelectorAll('.shape');
function move(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  shapes.forEach(function(s){var d=+s.dataset.d;s.style.transform='translate('+(x*d*2)+'px,'+(y*d*2)+'px)'+(s.classList.contains('s4')?' rotate('+(20+x*60)+'deg)':'')})}
if(!reduce){hero.addEventListener('pointermove',move);hero.addEventListener('pointerdown',move)}

/* 2. Changing word in the headline */
var w=document.getElementById('word'),words=['makers','designers','developers','dreamers','builders'],i=0;
if(!reduce)setInterval(function(){w.classList.add('out');setTimeout(function(){i=(i+1)%words.length;w.textContent=words[i];w.classList.remove('out')},250)},2200);

/* 3. Story track: mouse drag + arrow buttons (touch swipes natively) */
var t=document.getElementById('track'),down=false,sx=0,sl=0;
t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=t.scrollLeft;t.classList.add('drag')});
addEventListener('pointermove',function(e){if(down)t.scrollLeft=sl-(e.clientX-sx)});
addEventListener('pointerup',function(){down=false;t.classList.remove('drag')});
function by(n){t.scrollBy({left:n*(t.querySelector('.chap').offsetWidth+18),behavior:'smooth'})}
document.getElementById('prev').onclick=function(){by(-1)};
document.getElementById('next').onclick=function(){by(1)};

/* 4. Lab tabs */
var data=[
 ['Design & Marketing','Brand identity, graphics and digital campaigns that make your business easy to notice and hard to forget.'],
 ['Web Development','Fast, modern websites and web apps built around your customers and your goals.'],
 ['Graphic Designing','Rapid prototypes and finished parts, from a first concept model to small production runs.'],
 ['System Development','Precise cutting and engraving in wood, acrylic and more for signage, models and products.'],
 ['Product Videography','Circuits, sensors and embedded systems that make your product smart.']];
var tabs=document.querySelectorAll('#tabs button'),panel=document.getElementById('panel');
tabs.forEach(function(b){b.addEventListener('click',function(){
  tabs.forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');
  var d=data[+b.dataset.i],h=document.createElement('h3'),p=document.createElement('p');h.textContent=d[0];p.textContent=d[1];
  panel.replaceChildren(h,p);panel.style.animation='none';panel.offsetHeight;panel.style.animation=''})});

/* 5. Team cards: tap to flip on touch */
var cards=document.querySelectorAll('.tm');
cards.forEach(function(c){c.addEventListener('click',function(){var on=c.classList.contains('is-flipped');
  cards.forEach(function(x){x.classList.remove('is-flipped')});if(!on)c.classList.add('is-flipped')})});
})();
