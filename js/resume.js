
const burger=document.getElementById('hamburger');
const mainNav=document.getElementById('mainNav');
const navOverlay=document.getElementById('navOverlay');
function setMenu(open){
  burger.classList.toggle('open',open);
  mainNav.classList.toggle('open',open);
  navOverlay.classList.toggle('show',open);
  burger.setAttribute('aria-expanded',open);
  document.body.classList.toggle('menu-open',open);
  document.body.style.overflow=open?'hidden':'';
}
burger.addEventListener('click',()=>setMenu(!mainNav.classList.contains('open')));
navOverlay.addEventListener('click',()=>setMenu(false));
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.addEventListener('resize',()=>{if(window.innerWidth>900)setMenu(false)});
