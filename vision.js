/* FabLab — Our Vision page interactions (no libraries needed) */
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Hero particle network — reacts to mouse, touch, click/tap */
var hero=document.getElementById('vhero'),cv=document.getElementById('vc'),ctx=cv.getContext('2d');
var W,H,dpr,P=[],m={x:-999,y:-999,on:false};
function rnd(a,b){return a+Math.random()*(b-a)}
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;
  cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  var n=W<700?45:95;P=[];for(var i=0;i<n;i++)P.push({x:rnd(0,W),y:rnd(0,H),vx:rnd(-.3,.3),vy:rnd(-.3,.3),r:rnd(1.5,3),life:0})}
addEventListener('resize',resize);resize();
function pos(e){var r=hero.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;m.on=true}
hero.addEventListener('pointermove',pos);
hero.addEventListener('pointerdown',function(e){pos(e);
  for(var i=0;i<14;i++){var a=rnd(0,6.28),s=rnd(1.5,4);P.push({x:m.x,y:m.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:rnd(2,3.5),life:90})}});
hero.addEventListener('pointerleave',function(){m.on=false});
hero.addEventListener('pointerup',function(e){if(e.pointerType==='touch')m.on=false});
function draw(){
  ctx.clearRect(0,0,W,H);
  for(var i=P.length-1;i>=0;i--){var p=P[i];
    if(p.life){p.life--;if(!p.life){P.splice(i,1);continue}}
    if(m.on){var dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<150&&d>1){p.vx+=dx/d*.06;p.vy+=dy/d*.06}}
    p.vx*=.99;p.vy*=.99;p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
  for(var a=0;a<P.length;a++){
    for(var b=a+1;b<P.length;b++){var d2=Math.hypot(P[a].x-P[b].x,P[a].y-P[b].y);
      if(d2<110){ctx.strokeStyle='rgba(197,247,43,'+(.35*(1-d2/110))+')';ctx.beginPath();ctx.moveTo(P[a].x,P[a].y);ctx.lineTo(P[b].x,P[b].y);ctx.stroke()}}
    if(m.on){var d3=Math.hypot(P[a].x-m.x,P[a].y-m.y);
      if(d3<180){ctx.strokeStyle='rgba(197,247,43,'+(.8*(1-d3/180))+')';ctx.beginPath();ctx.moveTo(P[a].x,P[a].y);ctx.lineTo(m.x,m.y);ctx.stroke()}}
    ctx.fillStyle='#c5f72b';ctx.beginPath();ctx.arc(P[a].x,P[a].y,P[a].r,0,6.28);ctx.fill();
  }
  if(!reduce)requestAnimationFrame(draw)
}
draw();if(reduce)setInterval(draw,200);

/* 2. Journey — steps appear on scroll, line fills with scroll progress */
var steps=document.querySelectorAll('.step'),j=document.getElementById('journey'),fill=document.getElementById('fill');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in')})},{threshold:.5});
steps.forEach(function(s){io.observe(s)});
function prog(){var r=j.getBoundingClientRect(),p=(innerHeight*.6-r.top)/r.height;fill.style.height=Math.max(0,Math.min(1,p))*100+'%'}
addEventListener('scroll',prog,{passive:true});addEventListener('resize',prog);prog();

/* 3. Pillars — 3D tilt toward pointer */
document.querySelectorAll('.tilt').forEach(function(c){
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--ry',((x-.5)*14)+'deg');c.style.setProperty('--rx',((.5-y)*14)+'deg');
    c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.classList.add('on')});
  function off(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');c.classList.remove('on')}
  c.addEventListener('pointerleave',off);c.addEventListener('pointerup',function(e){if(e.pointerType==='touch')off()});
});

/* 4. Vision builder — pick services, get a sentence + prefilled contact link */
var chips=document.querySelectorAll('#chips button'),out=document.getElementById('out'),go=document.querySelector('.go');
function upd(){
  var sel=[].filter.call(chips,function(b){return b.getAttribute('aria-pressed')==='true'}).map(function(b){return b.textContent});
  if(!sel.length){out.textContent='Pick what you want to create…';return}
  var list=sel.length>1?sel.slice(0,-1).join(', ')+' and '+sel[sel.length-1]:sel[0];
  out.textContent='Your vision: '+list+'. We’ll turn it into something real, together.';
}
chips.forEach(function(b){b.addEventListener('click',function(){
  b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');upd()})});
})();
