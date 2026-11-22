/* FabLab — shared UI: theme (remembered on every page) + mobile menu */
(function(){
  var KEY='fablab-theme',root=document.documentElement;
  /* Self-healing: if a page's HTML is older than this script, add the missing phone tab bar and
     move the theme button out of the (hidden-on-phones) menu, so navigation is never lost. */
  (function(){
    var nav=document.getElementById('nav')||document.querySelector('header nav');
    if(!nav)return;
    var hctl=document.querySelector('.hctl');
    if(!hctl){hctl=document.createElement('div');hctl.className='hctl';nav.parentNode.insertBefore(hctl,nav.nextSibling)}
    var t=document.getElementById('thm');if(t&&t.parentNode!==hctl)hctl.appendChild(t);
    if(document.querySelector('.tabbar'))return;
    var ICON=[
      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'];
    var LABEL=['Home','Vision','About','Contact'],links=nav.querySelectorAll('a'),bar=document.createElement('div'),cur=-1,i;
    bar.className='tabbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Main');
    for(i=0;i<links.length;i++){
      if(links[i].getAttribute('aria-current')==='page')cur=i;
      else if(cur<0&&links[i].pathname===location.pathname)cur=i;
    }
    if(cur<0&&document.getElementById('home'))cur=0;
    for(i=0;i<links.length&&i<4;i++){
      var a=document.createElement('a');a.href=links[i].getAttribute('href');
      if(i===cur)a.setAttribute('aria-current','page');
      a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+ICON[i]+'</svg><span>'+LABEL[i]+'</span>';
      bar.appendChild(a);
    }
    document.body.appendChild(bar);
  })();


  function saved(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function sys(){return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
  function apply(t){
    root.setAttribute('data-theme',t);
    var b=document.getElementById('thm');
    if(b){b.textContent=t==='dark'?'☀':'☾';b.setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme')}
  }
  apply(saved()||sys());
  var thm=document.getElementById('thm');
  if(thm)thm.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    try{localStorage.setItem(KEY,next)}catch(e){}
    apply(next);
  });
  addEventListener('storage',function(e){if(e.key===KEY&&e.newValue)apply(e.newValue)});   // other open tabs follow
  addEventListener('pageshow',function(){apply(saved()||sys())});                          // back/forward button

  var menu=document.getElementById('menu'),nav=document.getElementById('nav');
  function close(){if(!nav)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';menu.setAttribute('aria-label','Open menu')}
  if(menu&&nav){
    menu.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      menu.setAttribute('aria-expanded',open);menu.textContent=open?'✕':'☰';menu.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    nav.addEventListener('click',function(e){if(e.target.closest('a'))close()});
    addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    addEventListener('resize',function(){if(innerWidth>720)close()});
  }
})();

/* FabLab — interactive 3D robot (needs three.js r128, loaded in index.html) */
(function(){
var cv=document.getElementById('c'),hero=document.getElementById('home');
if(!cv||!hero)return; // pages without the robot hero only need the theme button

var ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});ren.setPixelRatio(Math.min(devicePixelRatio||1,2));
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,100);
var ec=document.createElement('canvas');ec.width=512;ec.height=256;var e=ec.getContext('2d');
var g=e.createLinearGradient(0,0,0,256);g.addColorStop(0,'#fff');g.addColorStop(.5,'#9a9a9a');g.addColorStop(1,'#222');e.fillStyle=g;e.fillRect(0,0,512,256);
e.fillStyle='#fff';e.fillRect(60,40,90,70);e.fillRect(330,30,120,60);e.fillStyle='#000';e.fillRect(200,110,60,100);
var et=new THREE.CanvasTexture(ec);et.mapping=THREE.EquirectangularReflectionMapping;
scene.environment=new THREE.PMREMGenerator(ren).fromEquirectangular(et).texture;
var key=new THREE.DirectionalLight(0xffffff,1.2);key.position.set(3,5,6);scene.add(key);scene.add(new THREE.AmbientLight(0xffffff,.25));
var black=new THREE.MeshStandardMaterial({color:0x080807,metalness:.55,roughness:.16});
var glass=new THREE.MeshPhysicalMaterial({color:0x0a0a0a,metalness:.9,roughness:.04,clearcoat:1});
var lime=new THREE.MeshStandardMaterial({color:0xc5f72b,emissive:0xc5f72b,emissiveIntensity:.9});
var grey=new THREE.MeshStandardMaterial({color:0xc5f72b,metalness:.5,roughness:.3});
var root=new THREE.Group();scene.add(root);
function mesh(geo,mat,x,y,z,sx,sy,sz,p){var m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.scale.set(sx||1,sy||1,sz||1);(p||root).add(m);return m}
var S=new THREE.SphereGeometry(1,40,28),Cy=new THREE.CylinderGeometry(1,1,1,32);
var torso=new THREE.Group();root.add(torso);
mesh(new THREE.CylinderGeometry(1.05,.62,1.9,40),black,0,.95,0,1,1,.5,torso);
mesh(S,black,0,1.85,0,1.1,.28,.52,torso);mesh(Cy,black,0,-.2,0,.5,.35,.3,torso);
mesh(new THREE.BoxGeometry(.5,.07,.02),lime,0,1.2,.27,1,1,1,torso); // chest light
mesh(Cy,grey,0,2.05,0,.16,.3,.16,torso);
var head=new THREE.Group();head.position.set(0,2.65,0);torso.add(head);
mesh(S,black,0,0,0,.52,.64,.56,head);
mesh(new THREE.SphereGeometry(1,40,28,-.9,1.8,.35,2.2),glass,0,0,0,.535,.655,.575,head);
mesh(new THREE.BoxGeometry(.5,.07,.02),lime,0,.02,.57,1,1,1,head); // lime eye line
function arm(s){var sh=new THREE.Group();sh.position.set(s*1.25,1.7,0);torso.add(sh);
 mesh(S,black,0,0,0,.3,.3,.3,sh);var up=mesh(Cy,black,s*.08,-.5,0,.2,.55,.2,sh);up.rotation.z=s*.06;
 var el=new THREE.Group();el.position.set(s*.15,-1.05,0);sh.add(el);mesh(S,grey,0,0,0,.17,.17,.17,el);
 mesh(Cy,black,s*.05,-.5,.04,.17,.5,.17,el);mesh(S,black,s*.08,-1.1,.05,.16,.22,.1,el);return{sh:sh,el:el}}
var L=arm(-1),R=arm(1);
mesh(Cy,black,0,-.55,0,.78,.22,.45,root);
[-1,1].forEach(function(s){mesh(S,grey,s*.5,-.75,0,.2,.2,.2,root);mesh(Cy,black,s*.5,-1.9,0,.28,1.1,.26,root)});
root.position.y=-.6;
function size(){var w=hero.clientWidth,h=hero.clientHeight,a=w/h;ren.setSize(w,h,false);cam.aspect=a;
 cam.position.set(0,1.25,Math.max(9,5.6/(2*Math.tan(Math.PI/12)*a)));cam.lookAt(0,1.05,0);cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
var tx=0,ty=0,px=0,py=0,pvx=0,sw=0,sv=0,wave=0;
function pt(e){var r=hero.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width*2-1,ny=(e.clientY-r.top)/r.height*2-1;
 nx=Math.max(-1.2,Math.min(1.2,nx));ny=Math.max(-1.2,Math.min(1.2,ny));pvx=nx-tx;tx=nx;ty=ny}
addEventListener('pointermove',pt);
hero.addEventListener('pointerdown',function(e){pt(e);wave=1});
addEventListener('pointerup',function(e){if(e.pointerType==='touch'){tx=ty=0}});
document.addEventListener('pointerleave',function(){tx=ty=0});
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,t0=performance.now();
function loop(now){var t=(now-t0)/1000;
 px+=(tx-px)*.07;py+=(ty-py)*.07;sv+=(-sw*22-sv*5+pvx*140)*.016;sw+=sv*.016;pvx*=.8;
 var id=reduce?0:Math.sin(t*1.4);
 torso.rotation.y=px*.45;torso.rotation.x=py*.08;torso.position.y=id*.015;
 head.rotation.y=px*.55;head.rotation.x=py*.35;head.rotation.z=-px*.08;root.rotation.y=px*.12;
 L.sh.rotation.z=-.12-sw*.9+id*.02;L.sh.rotation.x=py*.2;R.sh.rotation.x=py*.2;L.el.rotation.x=-.25-Math.abs(sw)*.6;
 wave*=.985;R.sh.rotation.z=.12-sw*.9+wave*2.6;R.el.rotation.z=wave>.02?Math.sin(t*9)*.35*wave:0;R.el.rotation.x=-.25-wave*.4;
 ren.render(scene,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
