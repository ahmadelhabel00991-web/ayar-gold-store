import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';

const KEY='ayar_store_db_v2', PURITY={24:1,22:.916,21:.875,18:.75,14:.585};
const now=()=>new Date().toISOString();
function seed(){return{settings:{brand:'عيار جولد',currency:'₪',whatsapp:'970597303227',instagram:'https://instagram.com/',messenger:'https://m.me/',about:'متجر ذهب إلكتروني حديث يضع السعر والوزن والعيار أمام العميل بوضوح.'},sell24:395,buy24:389,prices:{},products:[{id:1,name:'خاتم كلاسيك',cat:'خواتم',k:21,w:4.35,work:8,fixed:10,margin:4,stock:6,auto:true,sku:'RNG-2101'},{id:2,name:'سلسال لمعة',cat:'سلاسل',k:21,w:8.7,work:10,fixed:18,margin:5,stock:4,auto:true,sku:'NCK-2102'},{id:3,name:'إسوارة نبض',cat:'أساور',k:21,w:11.2,work:9,fixed:15,margin:4.5,stock:3,auto:true,sku:'BRC-2103'},{id:4,name:'حلق نجمة',cat:'أقراط',k:18,w:3.1,work:12,fixed:8,margin:6,stock:8,auto:true,sku:'EAR-1801'},{id:5,name:'سبيكة 10 غرام',cat:'سبائك',k:24,w:10,work:2,fixed:0,margin:1.5,stock:10,auto:true,sku:'BAR-2401'},{id:6,name:'طقم مناسبات',cat:'أطقم',k:21,w:24.6,work:13,fixed:25,margin:5.5,stock:2,auto:true,sku:'SET-2104'}],orders:[],alerts:[],updated:now()}}
function calcPrices(d){[24,22,21,18,14].forEach(k=>d.prices[k]={sell:+(d.sell24*PURITY[k]).toFixed(2),buy:+(d.buy24*PURITY[k]).toFixed(2)})}
function load(){let d;try{d=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}d=d||seed();d.settings=d.settings||seed().settings;d.products=d.products||seed().products;d.orders=d.orders||[];d.sell24=Number(d.sell24||395);d.buy24=Number(d.buy24||389);calcPrices(d);return d}
let db=load(),cart=JSON.parse(localStorage.getItem('ayar_3d_cart')||'[]');
function save(){db.updated=now();calcPrices(db);localStorage.setItem(KEY,JSON.stringify(db))}
function price(p){if(p.auto===false&&p.manual)return Number(p.manual);const base=db.prices[p.k].sell*p.w+(p.work||0)*p.w+(p.fixed||0);return +(base*(1+(p.margin||0)/100)).toFixed(2)}
function money(n){return Number(n||0).toLocaleString('ar-EG',{maximumFractionDigits:2})+' '+(db.settings.currency||'₪')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)}
document.getElementById('brandName').textContent=db.settings.brand||'عيار جولد';
document.getElementById('price21').textContent=money(db.prices[21].sell);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x120e0a);
scene.fog=new THREE.Fog(0x120e0a,20,45);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.08,100);
camera.position.set(0,2.3,12.6);
let yaw=0,pitch=-.03;

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
document.getElementById('stage').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffe8bd,0x1b1410,1.35));
const sun=new THREE.DirectionalLight(0xffe4a7,2.8);sun.position.set(-7,10,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
const doorLight=new THREE.PointLight(0xffc96a,24,17,2);doorLight.position.set(0,3.8,2.2);scene.add(doorLight);
[[-4,4,-4],[4,4,-4],[-4,4,-11],[4,4,-11],[0,4,-15]].forEach(v=>{const l=new THREE.PointLight(0xffd98a,17,11,2);l.position.set(...v);scene.add(l)});

const mat={
 wall:new THREE.MeshStandardMaterial({color:0x3c2d20,roughness:.74}),
 stone:new THREE.MeshStandardMaterial({color:0xb49d78,roughness:.92}),
 dark:new THREE.MeshStandardMaterial({color:0x20160f,roughness:.68}),
 wood:new THREE.MeshStandardMaterial({color:0x4a321f,roughness:.58}),
 gold:new THREE.MeshStandardMaterial({color:0xd9b253,roughness:.22,metalness:.9}),
 gold2:new THREE.MeshStandardMaterial({color:0xffda6e,roughness:.17,metalness:.96}),
 glass:new THREE.MeshPhysicalMaterial({color:0xe4f4ff,transparent:true,opacity:.22,roughness:.06,transmission:.58,thickness:.35}),
 velvet:new THREE.MeshStandardMaterial({color:0x2a140e,roughness:.93})
};
function box(w,h,d,m,x,y,z,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;scene.add(o);return o}
function plane(w,h,m,x,y,z,rx=0,ry=0){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.set(rx,ry,0);o.receiveShadow=true;scene.add(o);return o}

// facade + exterior
box(34,.24,30,mat.stone,0,-.15,4,false);
box(15,6.2,.65,mat.wall,0,3,-.25);
box(3.1,4.9,.52,mat.dark,0,2.35,.12);
box(4.5,.34,.88,mat.gold,0,5.42,.1);
[-7.15,7.15,-2.05,2.05].forEach(x=>box(.42,6.1,.8,mat.gold,x,3,.16));

function jewelryWindow(cx){
  box(4.4,3.55,.12,mat.glass,cx,2.45,.12,false);
  box(4.5,.22,1.4,mat.gold,cx,.7,.5);
  box(4.15,.15,1.1,mat.velvet,cx,.88,.46);
  const t=new THREE.Mesh(new THREE.TorusGeometry(.72,.075,18,72),mat.gold2);t.position.set(cx,2.15,.74);t.rotation.y=Math.PI/2;t.castShadow=true;scene.add(t);
  for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.22,.055,14,48),mat.gold2);r.position.set(cx-1.2+i*.8,1.25,.82);r.rotation.x=Math.PI/2;scene.add(r)}
}
jewelryWindow(-4.6);jewelryWindow(4.6);

// interior
box(14.5,.22,18,mat.wood,0,.02,-8,false);
box(.28,5.8,18,mat.wall,-7.1,2.9,-8);
box(.28,5.8,18,mat.wall,7.1,2.9,-8);
box(14.5,5.8,.3,mat.wall,0,2.9,-16.8);
for(let z=-1.8;z>-16;z-=3.2)box(14.3,.16,.22,mat.gold,0,5.55,z,false);
box(3.2,.035,9,new THREE.MeshStandardMaterial({color:0x301a12,roughness:1}),0,.14,-8,false);

function textTexture(line1,line2='',w=1024,h=256){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 g.fillStyle='#25180f';g.fillRect(0,0,w,h);g.textAlign='center';g.textBaseline='middle';
 g.fillStyle='#f1d485';g.font='800 82px Tahoma,Arial';g.fillText(line1,w/2,h*.43);
 if(line2){g.font='600 34px Arial';g.fillStyle='#c8ab64';g.fillText(line2,w/2,h*.74)}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t
}
plane(7.6,1.9,new THREE.MeshBasicMaterial({map:textTexture(db.settings.brand||'عيار جولد','GOLD BOUTIQUE')}),0,5.05,.23);

function boardTexture(){
 const c=document.createElement('canvas');c.width=900;c.height=520;const g=c.getContext('2d');
 g.fillStyle='#17110c';g.fillRect(0,0,900,520);g.textAlign='center';g.fillStyle='#ead28f';g.font='bold 52px Tahoma';g.fillText('السعر المحلي',450,62);
 [24,21,18].forEach((k,i)=>{const y=155+i*110;g.fillStyle='#fff0bf';g.font='bold 40px Arial';g.fillText(k+'K',170,y);g.fillStyle='#d7ba71';g.fillText(Number(db.prices[k].sell).toFixed(2)+' '+(db.settings.currency||'₪'),540,y)});
 g.font='26px Tahoma';g.fillStyle='#9f8a5d';g.fillText('آخر تحديث '+new Date(db.updated).toLocaleTimeString('ar-EG'),450,472);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t
}
plane(5.2,3,new THREE.MeshBasicMaterial({map:boardTexture()}),0,3.15,-16.62);

const casePoints=[];
function ring(x,y,z,s=.32){const r=new THREE.Mesh(new THREE.TorusGeometry(s,.06,18,52),mat.gold2);r.position.set(x,y,z);r.rotation.x=Math.PI/2;r.castShadow=true;scene.add(r)}
function bar(x,y,z){const b=new THREE.Mesh(new THREE.BoxGeometry(.72,.16,1.02),mat.gold2);b.position.set(x,y,z);b.rotation.y=.22;b.castShadow=true;scene.add(b)}
function necklace(x,y,z){const t=new THREE.Mesh(new THREE.TorusGeometry(.62,.055,18,78,Math.PI*1.35),mat.gold2);t.position.set(x,y,z);t.rotation.x=Math.PI/2;t.rotation.z=.38;scene.add(t)}
function makeCase(x,z,label,type='rings'){
 box(3.5,.7,1.65,mat.wood,x,.52,z);box(3.36,.1,1.52,mat.velvet,x,.91,z);
 box(3.46,.72,.08,mat.glass,x,1.27,z-.79,false);box(3.46,.72,.08,mat.glass,x,1.27,z+.79,false);box(.08,.72,1.52,mat.glass,x-1.69,1.27,z,false);box(.08,.72,1.52,mat.glass,x+1.69,1.27,z,false);box(3.46,.08,1.52,mat.glass,x,1.65,z,false);
 if(type==='rings')for(let i=-1;i<=1;i++)ring(x+i*.78,1.12,z);
 if(type==='bars')for(let i=-1;i<=1;i++)bar(x+i*.82,1.08,z);
 if(type==='necklace')necklace(x,1.2,z);
 casePoints.push({label,position:new THREE.Vector3(x,2.05,z)})
}
makeCase(-4.4,-3.3,'خواتم','rings');makeCase(4.4,-3.3,'سلاسل','necklace');makeCase(-4.4,-7.4,'أساور','rings');makeCase(4.4,-7.4,'أقراط','rings');makeCase(-4.4,-11.5,'سبائك','bars');makeCase(4.4,-11.5,'أطقم','necklace');
box(4.4,1.05,1.35,mat.wood,0,.62,-10.2);box(4.55,.16,1.5,mat.gold,0,1.15,-10.2);

const hotspotsRoot=document.getElementById('hotspots');
const hotspotEls=casePoints.map(cp=>{const b=document.createElement('button');b.className='hotspot hidden';b.textContent=cp.label;b.onclick=()=>openCategory(cp.label);hotspotsRoot.appendChild(b);return b});

let inside=false,tour=false,dragging=false,lastX=0,lastY=0,keys={},camAnim=null,tourT=0;
const tempV=new THREE.Vector3();
function updateLook(){camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}
updateLook();

renderer.domElement.addEventListener('pointerdown',e=>{if(!inside)return;dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!inside||!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.004;pitch-=dy*.003;pitch=Math.max(-.72,Math.min(.55,pitch));updateLook()});
renderer.domElement.addEventListener('pointerup',()=>dragging=false);
addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('.move[data-k]').forEach(b=>{const k=b.dataset.k;if(k==='x')return;b.addEventListener('pointerdown',()=>keys[k]=true);b.addEventListener('pointerup',()=>keys[k]=false);b.addEventListener('pointerleave',()=>keys[k]=false)});

function animateCamera(pos,ty,tp,dur){camAnim={from:camera.position.clone(),to:pos.clone(),sy:yaw,ty,sp:pitch,tp,start:performance.now(),dur}}
function smooth(t){return t*t*(3-2*t)}
function enterStore(auto=false){inside=true;tour=auto;tourT=0;document.getElementById('intro').classList.add('hide');document.getElementById('walk').classList.add('show');document.getElementById('bottomPanel').classList.add('show');document.getElementById('lookHint').classList.add('show');document.getElementById('help').classList.remove('hide');animateCamera(new THREE.Vector3(0,2.05,-2.3),Math.PI,0,1800)}
function exitStore(){inside=false;tour=false;hotspotEls.forEach(e=>e.classList.add('hidden'));document.getElementById('walk').classList.remove('show');document.getElementById('bottomPanel').classList.remove('show');document.getElementById('lookHint').classList.remove('show');document.getElementById('intro').classList.remove('hide');animateCamera(new THREE.Vector3(0,2.3,12.6),0,-.03,1600)}
function moveCamera(dt){if(!inside||camAnim)return;const speed=2.7*dt,fwd=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(keys.w)camera.position.addScaledVector(fwd,speed);if(keys.s)camera.position.addScaledVector(fwd,-speed);if(keys.a)camera.position.addScaledVector(right,-speed);if(keys.d)camera.position.addScaledVector(right,speed);camera.position.x=Math.max(-6.05,Math.min(6.05,camera.position.x));camera.position.z=Math.max(-15.4,Math.min(-.9,camera.position.z));camera.position.y=2.05}
document.getElementById('enterBtn').onclick=()=>enterStore(false);
document.getElementById('tourBtn').onclick=()=>enterStore(true);
document.getElementById('exitBtn').onclick=exitStore;

function waLink(p){return 'https://wa.me/'+String(db.settings.whatsapp||'').replace(/\D/g,'')+'?text='+encodeURIComponent('مرحبًا، أريد الاستفسار عن '+p.name+' - '+(p.sku||''))}
function openCategory(cat){
 const list=db.products.filter(p=>p.cat===cat);
 document.getElementById('drawerTitle').textContent='جناح '+cat;
 document.getElementById('drawerSub').textContent=list.length+' قطعة متاحة في هذه الفترينة';
 document.getElementById('productList').innerHTML=list.length?list.map(p=>`<article class="product"><div class="prodVisual">◆</div><div><h3>${p.name}</h3><div class="meta"><span>${p.k}K</span><span>${p.w} غ</span><span>${p.sku||'SKU-'+p.id}</span></div><div class="prodPrice">${money(price(p))}</div><div class="stock ${p.stock?'':'out'}">${p.stock?'متوفر '+p.stock+' قطعة':'نفد المخزون'}</div></div><div class="prodActions"><button onclick="window.addCart(${p.id})" ${p.stock?'':'disabled'}>أضف للسلة</button><a target="_blank" href="${waLink(p)}">استفسر واتساب</a></div></article>`).join(''):'<div class="empty">لا توجد قطع في هذا الجناح حاليًا.</div>';
 document.getElementById('drawer').classList.add('show');document.getElementById('shade').classList.add('show')
}
function closeDrawer(){document.getElementById('drawer').classList.remove('show');document.getElementById('shade').classList.remove('show')}
document.getElementById('drawerClose').onclick=closeDrawer;document.getElementById('shade').onclick=closeDrawer;

window.addCart=id=>{const p=db.products.find(x=>x.id===id);if(!p||!p.stock)return;const i=cart.find(x=>x.id===id);if(i&&i.qty<p.stock)i.qty++;else if(!i)cart.push({id,qty:1});localStorage.setItem('ayar_3d_cart',JSON.stringify(cart));renderCart();toast('تمت إضافة القطعة إلى السلة')};
function renderCart(){document.getElementById('cartCount').textContent=cart.reduce((s,i)=>s+i.qty,0);let total=0;document.getElementById('cartItems').innerHTML=cart.length?cart.map(i=>{const p=db.products.find(x=>x.id===i.id);if(!p)return'';total+=price(p)*i.qty;return `<div class="cartLine"><span>${p.name} × ${i.qty}</span><b>${money(price(p)*i.qty)}</b></div>`}).join(''):'<div class="empty">السلة فارغة.</div>';document.getElementById('cartTotal').textContent=money(total)}
window.toggleCart=show=>document.getElementById('cartBox').classList.toggle('show',show);
document.getElementById('cartBtn').onclick=()=>window.toggleCart(true);
document.getElementById('checkoutBtn').onclick=()=>{if(!cart.length)return toast('السلة فارغة');const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),city=document.getElementById('city').value.trim();if(!name||!phone||!city)return toast('أدخل الاسم والهاتف والمدينة');let total=0;cart.forEach(i=>{const p=db.products.find(x=>x.id===i.id);total+=price(p)*i.qty});const code='AG-'+Date.now().toString(36).toUpperCase();db.orders.unshift({code,name,phone,city,pay:document.getElementById('pay').value,total:+total.toFixed(2),status:'جديد',items:cart.map(x=>({...x})),created:now()});cart.forEach(i=>{const p=db.products.find(x=>x.id===i.id);if(p)p.stock=Math.max(0,p.stock-i.qty)});cart=[];localStorage.setItem('ayar_3d_cart','[]');save();renderCart();document.getElementById('orderMsg').innerHTML='<div class="success">تم إنشاء الطلب. رقم الطلب: <b>'+code+'</b></div>';toast('تم إنشاء الطلب بنجاح')};
renderCart();

document.getElementById('pricesBtn').onclick=()=>toast('لوحة السعر المحلي أمامك على الجدار الخلفي');
document.getElementById('aboutBtn').onclick=()=>toast(db.settings.about||'عيار جولد - متجر ذهب ذكي');
document.getElementById('contactBtn').onclick=()=>window.open('https://wa.me/'+String(db.settings.whatsapp||'').replace(/\D/g,''),'_blank');

const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.033),tNow=performance.now();
 if(camAnim){let t=Math.min(1,(tNow-camAnim.start)/camAnim.dur),s=smooth(t);camera.position.lerpVectors(camAnim.from,camAnim.to,s);yaw=camAnim.sy+(camAnim.ty-camAnim.sy)*s;pitch=camAnim.sp+(camAnim.tp-camAnim.sp)*s;updateLook();if(t>=1)camAnim=null}
 else if(tour&&inside){tourT+=dt;const z=-2.6-Math.min(12,tourT*.8);camera.position.z=z;camera.position.x=Math.sin(tourT*.45)*1.15;yaw=Math.PI+Math.sin(tourT*.32)*.28;pitch=-.03;updateLook();if(z<=-14.4){tour=false;toast('انتهت الجولة — يمكنك الآن التجول بنفسك')}}
 else moveCamera(dt);
 casePoints.forEach((cp,i)=>{tempV.copy(cp.position).project(camera);const visible=inside&&tempV.z<1&&tempV.z>-1;const el=hotspotEls[i];el.style.left=((tempV.x*.5+.5)*innerWidth)+'px';el.style.top=((-tempV.y*.5+.5)*innerHeight)+'px';el.classList.toggle('hidden',!visible)});
 renderer.render(scene,camera)
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>{const l=document.getElementById('loading');l.style.opacity='0';l.style.pointerEvents='none';setTimeout(()=>l.remove(),500)},1100);
