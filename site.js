(function(){
var doc=document,fs=doc.fonts,noop=function(){},rnd=function(a,b){return a+Math.random()*(b-a)};
var y=doc.getElementById("y");if(y)y.textContent=new Date().getFullYear();

/* 1. Load the fonts first, then show the page */
var fonts=fs&&fs.load?Promise.all([fs.load('800 1em "Bricolage Grotesque"'),fs.load('400 1em "Public Sans"'),fs.load('600 1em "Public Sans"')]).then(function(){return fs.ready}):Promise.resolve();
fonts=fonts.catch(noop);
fonts.then(function(){doc.documentElement.className=""});

/* 2. Background: pills and the M logo, random spot, size, speed and starting height, drawn in after load */
var MP="M201 313H343L415 428.5V313H557L607.5 394L658 313H800V428.5L872 313H1014V913H884V522L800 650V913H670V713L607.5 617L545 713V913H415V650L331 522V913H201Z",
LOGO='<svg xmlns="http://www.w3.org/2000/svg" viewBox="181 187 853 853"><defs><clipPath id="c"><path d="'+MP+'"/></clipPath><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs><path d="'+MP+'" transform="translate(0 14)" fill="#0B3A33" opacity=".3"/><g clip-path="url(#c)"><rect x="181" y="187" width="426.5" height="853" fill="#1FB58A"/><rect x="607.5" y="187" width="426.5" height="853" fill="#fff"/><rect x="181" y="187" width="853" height="853" fill="url(#g)"/></g><path d="'+MP+'" fill="none" stroke="#0B3A33" stroke-width="16" stroke-linejoin="round"/></svg>',
LOGOURI="data:image/svg+xml,"+encodeURIComponent(LOGO);
var colors=["#1FB58A","#FFC233","#4FA9EE","#F0705A"],n=10,h="";
for(var i=0;i<n;i++){
var mark=i%5===2,cap=Math.random()<.5,dur=rnd(mark?30:24,mark?42:38),size=mark?rnd(58,86):cap?rnd(44,66):rnd(30,52),left=(i+rnd(0,.8))/n*94+1,col=mark?"#1FB58A":colors[Math.floor(Math.random()*colors.length)];
h+='<span class="fp" style="--x:'+left.toFixed(1)+'%;--s:'+size.toFixed(0)+'px;--d:'+dur.toFixed(1)+'s;--t:-'+rnd(0,dur).toFixed(1)+'s;--g:'+(i*.3).toFixed(1)+'s;--c:'+col+'">'+(mark?
'<i class="mk"><img src="'+LOGOURI+'" alt=""></i><svg viewBox="181 187 853 853"><path class="ln" pathLength="1" style="stroke-width:12" d="'+MP+'"/></svg>':
'<i class="'+(cap?'cap':'tab')+'"></i>'+(cap?
'<svg viewBox="0 0 44 20" preserveAspectRatio="none"><rect class="ln" pathLength="1" x=".7" y=".7" width="42.6" height="18.6" rx="9.3"/><path class="ln" pathLength="1" d="M22 .7v18.6"/></svg>':
'<svg viewBox="0 0 20 20"><circle class="ln" pathLength="1" cx="10" cy="10" r="9.3"/><path class="ln" pathLength="1" d="M2.4 10h15.2"/></svg>'))+'</span>'}
var f=doc.createElement("div");f.className="float";f.setAttribute("aria-hidden","true");f.innerHTML=h;
doc.body.insertBefore(f,doc.body.firstChild);
var loaded=new Promise(function(r){if(doc.readyState==="complete")r();else addEventListener("load",r)});
Promise.all([fonts,loaded]).then(function(){requestAnimationFrame(function(){f.classList.add("on")})})
/* 3. Fixed header: reserve its space, show the glass after scrolling (desktop) */
var hdr=doc.querySelector(".top"),pg=doc.querySelector(".page");
function fit(){if(!hdr||!pg)return;var gap=Math.min(48,Math.max(24,innerWidth*.05));pg.style.paddingTop=(parseFloat(getComputedStyle(hdr).top)+hdr.offsetHeight+gap)+"px"}
function sc(){doc.body.classList.toggle("scrolled",(window.pageYOffset||doc.documentElement.scrollTop)>10)}
fit();sc();addEventListener("scroll",sc,{passive:true});addEventListener("resize",fit);fonts.then(fit);addEventListener("load",fit);

/* 4. Map badge: draw the logo in when the map scrolls into view */
var mb=doc.querySelector(".mapbadge");
if(mb&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
mb.classList.add("pre");
var go=function(){mb.classList.remove("pre");mb.classList.add("go")};
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();fonts.then(function(){requestAnimationFrame(function(){mb.getBoundingClientRect();go()})})}},{threshold:.4});io.observe(mb.parentNode)}else go();
}

/* 5. About showcase: four scenes, 5 seconds each, keeps cycling on hover; pauses on keyboard focus and when off screen */
var st=doc.querySelector(".stage");
if(st&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
var sc=[].slice.call(st.querySelectorAll(".scene")),dt=[].slice.call(st.querySelectorAll(".dots i")),n=sc.length,cur=0,left=5000,t0=0,tm=0,hold={hover:0,view:1,tab:0};
function show(k){cur=k;sc.forEach(function(s,j){s.classList.remove("on");if(dt[j])dt[j].classList.remove("on")});void st.offsetWidth;sc[k].classList.add("on");if(dt[k])dt[k].classList.add("on")}
function next(){show((cur+1)%n);left=5000;t0=Date.now();tm=setTimeout(next,left)}
function sync(){if(t0){left=Math.max(0,left-(Date.now()-t0));t0=0}clearTimeout(tm);
if(hold.hover||hold.view||hold.tab||doc.hidden){st.classList.add("paused")}else{st.classList.remove("paused");t0=Date.now();tm=setTimeout(next,left)}}
function held(){return hold.hover||hold.view||hold.tab||doc.hidden}
var kt=0;
function go(k){clearTimeout(tm);t0=0;show((k%n+n)%n);left=5000;
if(held()){clearTimeout(kt);st.classList.add("kick");kt=setTimeout(function(){st.classList.remove("kick");if(held())left=5000-2400},2400)}
sync()}
var pv=st.querySelector(".prev"),nx=st.querySelector(".next");
if(pv)pv.addEventListener("click",function(){go(cur-1)});
if(nx)nx.addEventListener("click",function(){go(cur+1)});
st.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){go(cur-1)}else if(e.key==="ArrowRight"){go(cur+1)}});
var sx=0,sy=0;
st.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
st.addEventListener("touchend",function(e){var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5)go(cur+(dx<0?1:-1))},{passive:true});
st.classList.add("live");st.classList.add("paused");show(0);
st.addEventListener("focusin",function(e){var k=0;try{k=e.target.matches(":focus-visible")}catch(x){k=1}if(k){hold.tab=1;sync()}});
st.addEventListener("focusout",function(){hold.tab=0;sync()});
doc.addEventListener("visibilitychange",sync);
if("IntersectionObserver" in window){new IntersectionObserver(function(e){hold.view=e[0].isIntersecting?0:1;sync()},{threshold:.3}).observe(st)}else{hold.view=0;sync()}
}
})();
