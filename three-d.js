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
scene.background=new THREE.Color(0x0b0a08);
scene.fog=new THREE.Fog(0x0b0a08,22,48);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.06,120);
camera.position.set(0,2.05,10.8);
let yaw=0,pitch=-.03;

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.18;
renderer.domElement.style.touchAction='none';
document.getElementById('stage').appendChild(renderer.domElement);

const marbleCanvas=document.createElement('canvas');marbleCanvas.width=1024;marbleCanvas.height=1024;
const mg=marbleCanvas.getContext('2d');mg.fillStyle='#f4f1eb';mg.fillRect(0,0,1024,1024);
for(let i=0;i<28;i++){mg.beginPath();const y=Math.random()*1024;mg.moveTo(-50,y);for(let x=0;x<1150;x+=80){mg.lineTo(x,y+Math.sin(x*.02+i)*18+(Math.random()-.5)*18)}mg.strokeStyle=i%3===0?'rgba(70,72,78,.38)':'rgba(110,110,112,.18)';mg.lineWidth=i%4===0?3:1.2;mg.stroke()}
const marbleTex=new THREE.CanvasTexture(marbleCanvas);marbleTex.wrapS=marbleTex.wrapT=THREE.RepeatWrapping;marbleTex.repeat.set(2.4,2.4);marbleTex.colorSpace=THREE.SRGBColorSpace;

const floorCanvas=document.createElement('canvas');floorCanvas.width=1024;floorCanvas.height=1024;
const fg=floorCanvas.getContext('2d');fg.fillStyle='#e9e0d2';fg.fillRect(0,0,1024,1024);
for(let i=0;i<22;i++){fg.strokeStyle='rgba(170,155,135,.18)';fg.lineWidth=2;fg.beginPath();fg.moveTo(0,i*48);fg.lineTo(1024,i*48+Math.sin(i)*12);fg.stroke()}
for(let x=0;x<1024;x+=170){fg.strokeStyle='rgba(185,170,150,.12)';fg.beginPath();fg.moveTo(x,0);fg.lineTo(x+25,1024);fg.stroke()}
const floorTex=new THREE.CanvasTexture(floorCanvas);floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(2.6,5.8);floorTex.colorSpace=THREE.SRGBColorSpace;

const mat={
 marble:new THREE.MeshStandardMaterial({map:marbleTex,roughness:.52,metalness:.02}),
 floor:new THREE.MeshStandardMaterial({map:floorTex,roughness:.62}),
 black:new THREE.MeshStandardMaterial({color:0x111315,roughness:.34,metalness:.62}),
 blackMatte:new THREE.MeshStandardMaterial({color:0x181818,roughness:.74}),
 gold:new THREE.MeshStandardMaterial({color:0xc8a14a,roughness:.18,metalness:.93}),
 goldWarm:new THREE.MeshStandardMaterial({color:0xe2bb60,roughness:.13,metalness:.96}),
 glass:new THREE.MeshPhysicalMaterial({color:0xe8f3f5,transparent:true,opacity:.18,roughness:.08,metalness:0,transmission:.72,thickness:.42,ior:1.45}),
 clearGlass:new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.12,roughness:.04,transmission:.85,thickness:.28}),
 seat:new THREE.MeshStandardMaterial({color:0xc8c5bf,roughness:.92}),
 darkPanel:new THREE.MeshStandardMaterial({color:0x202020,roughness:.67})
};

scene.add(new THREE.HemisphereLight(0xfbf4e6,0x3b3127,1.45));
const key=new THREE.DirectionalLight(0xffffff,1.55);key.position.set(-5,10,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);
const warmFront=new THREE.PointLight(0xffd28a,21,18,2);warmFront.position.set(0,4.2,4.2);scene.add(warmFront);

function box(w,h,d,m,x,y,z,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;scene.add(o);return o}
function cyl(r,h,m,x,y,z,segments=32){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function plane(w,h,m,x,y,z,rx=0,ry=0){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.set(rx,ry,0);o.receiveShadow=true;scene.add(o);return o}
function ledBar(w,h,d,x,y,z,rotY=0,color=0xffd98a,intensity=7){box(w,h,d,new THREE.MeshBasicMaterial({color}),x,y,z,false).rotation.y=rotY;const l=new THREE.PointLight(color,intensity,Math.max(w,d)*2.4,2);l.position.set(x,y-.05,z);scene.add(l)}

// exterior pavement and tall black facade frame from the real video
box(20,.24,14,mat.floor,0,-.12,4,false);
box(13.4,6.9,.28,mat.black,0,3.42,.08);
box(3.45,5.45,.3,mat.clearGlass,0,2.7,.25,false);
box(4.75,5.45,.26,mat.clearGlass,-4.05,2.7,.25,false);
box(4.75,5.45,.26,mat.clearGlass,4.05,2.7,.25,false);
[-6.55,-1.72,1.72,6.55].forEach(x=>box(.20,6.75,.46,mat.black,x,3.35,.16));
[1.22,3.0,4.82].forEach(y=>box(13.3,.16,.42,mat.black,0,y,.16));

// two high awning windows visible in the real facade
for(const sx of [-4.2,4.2]){
 const aw=box(2.0,.08,1.55,mat.black,sx,4.88,-.34);aw.rotation.x=-.52;
 box(2.2,1.2,.08,mat.clearGlass,sx,4.48,.18,false);
}

// low black bench/plinth outside both sides
for(const sx of [-4.65,4.65]){box(4.0,.9,1.15,mat.blackMatte,sx,.45,.25);ledBar(3.45,.04,.05,sx,.86,.86,0,0xffc96c,5)}

// actual door-like pair, animated when entering
const leftDoor=new THREE.Group(),rightDoor=new THREE.Group();scene.add(leftDoor,rightDoor);
leftDoor.position.set(-1.72,0,.4);rightDoor.position.set(1.72,0,.4);
const dl=new THREE.Mesh(new THREE.BoxGeometry(1.72,4.85,.08),mat.clearGlass);dl.position.set(.86,2.45,0);leftDoor.add(dl);
const dr=new THREE.Mesh(new THREE.BoxGeometry(1.72,4.85,.08),mat.clearGlass);dr.position.set(-.86,2.45,0);rightDoor.add(dr);
for(const g of [leftDoor,rightDoor]){const frame=new THREE.Mesh(new THREE.BoxGeometry(.07,4.9,.12),mat.black);frame.position.set(g===leftDoor?1.68:-1.68,2.45,0);g.add(frame)}
box(.07,1.1,.1,mat.gold,-.27,2.4,.0);box(.07,1.1,.1,mat.gold,.27,2.4,.0);

// inside room matching video proportions: long narrow white marble corridor
box(13.2,.22,19.8,mat.floor,0,.01,-9.4,false);
box(.24,5.8,19.8,mat.marble,-6.5,2.9,-9.4);
box(.24,5.8,19.8,mat.marble,6.5,2.9,-9.4);
box(13.2,5.8,.24,mat.blackMatte,0,2.9,-19.25);
box(13.0,.12,19.6,new THREE.MeshStandardMaterial({color:0xf8f7f2,roughness:.88}),0,5.72,-9.4,false);

// ceiling cove strips and long white LED line from video
for(const z of [-1.7,-5.0,-8.3,-11.6,-14.9,-18.0]){
 ledBar(11.5,.035,.05,0,5.54,z,0,0xffd07d,4.2);
 const down=new THREE.PointLight(0xffffff,6.2,6,2);down.position.set(0,5.35,z);scene.add(down)
}
ledBar(12.1,.028,.035,0,5.47,-9.4,0,0xdff5ff,3.2);

// circular ceiling detail at entrance seen in video
const ceilingRing=new THREE.Mesh(new THREE.TorusGeometry(1.5,.12,20,90),new THREE.MeshStandardMaterial({color:0xe7e5e0,roughness:.85}));
ceilingRing.position.set(0,5.48,-1.6);ceilingRing.rotation.x=Math.PI/2;scene.add(ceilingRing);
const ceilingRing2=new THREE.Mesh(new THREE.TorusGeometry(.92,.10,20,80),new THREE.MeshStandardMaterial({color:0xdedbd4,roughness:.88}));
ceilingRing2.position.set(0,5.48,-1.6);ceilingRing2.rotation.x=Math.PI/2;scene.add(ceilingRing2);

// gold vertical trim strips on marble walls
for(const sx of [-6.36,6.36])for(const z of [-3.1,-6.4,-9.7,-13.0,-16.3])ledBar(.035,4.2,.05,sx,3.0,z,0,0xd4a849,2.2);

// right wall: bright recessed display niches like video
const wallHotspots=[];
function makeWallNiche(side,z,label){
 const x=side*6.33;
 box(.10,2.25,2.45,mat.gold,x,2.65,z);
 box(.12,2.03,2.15,new THREE.MeshStandardMaterial({color:0xf5f2eb,roughness:.82}),x-side*.08,2.65,z);
 const light=new THREE.PointLight(0xffffff,5.8,4.2,2);light.position.set(x-side*.45,3.45,z);scene.add(light);
 ledBar(.025,1.72,.035,x-side*.14,2.52,z-1.0,0,0xffd59a,3);
 ledBar(.025,1.72,.035,x-side*.14,2.52,z+1.0,0,0xffd59a,3);
 wallHotspots.push({label,position:new THREE.Vector3(x-side*.62,2.7,z)})
}
makeWallNiche(1,-3.3,'خواتم');makeWallNiche(1,-6.4,'سلاسل');makeWallNiche(1,-9.5,'أساور');makeWallNiche(1,-12.6,'أقراط');
makeWallNiche(-1,-4.5,'سبائك');makeWallNiche(-1,-8.2,'أطقم');

// gold-framed mirror/panel row above niches
for(const side of [-1,1])for(const z of [-3.3,-6.4,-9.5,-12.6]){const x=side*6.35;box(.08,1.05,2.25,mat.gold,x,4.55,z);box(.09,.85,2.04,mat.clearGlass,x-side*.02,4.55,z,false)}

// real long central glass display counter
function glassCaseSegment(z){
 box(3.15,.92,3.05,mat.blackMatte,1.85,.54,z);
 ledBar(2.85,.035,.05,1.85,.98,z+1.42,0,0xffc867,4.2);
 ledBar(2.85,.035,.05,1.85,.98,z-1.42,0,0xffc867,4.2);
 box(3.05,.09,2.93,mat.gold,1.85,1.02,z);
 box(2.93,.08,2.75,mat.velvet||mat.blackMatte,1.85,1.15,z);
 box(3.05,.7,.08,mat.glass,1.85,1.5,z-1.36,false);
 box(3.05,.7,.08,mat.glass,1.85,1.5,z+1.36,false);
 box(.08,.7,2.75,mat.glass,.34,1.5,z,false);
 box(.08,.7,2.75,mat.glass,3.36,1.5,z,false);
 box(3.05,.08,2.75,mat.glass,1.85,1.86,z,false);
}
glassCaseSegment(-5.1);glassCaseSegment(-8.25);glassCaseSegment(-11.4);

// left side benches from video
for(const z of [-4.2,-7.0,-9.8]){
 box(2.55,.48,1.02,mat.blackMatte,-4.95,.25,z);
 box(2.45,.36,.92,mat.seat,-4.95,.54,z);
 box(2.45,.65,.22,mat.seat,-5.38,.93,z);
}

// small grey chair near rear right
box(.9,.08,.9,mat.blackMatte,5.0,.48,-12.6);
box(.12,1.0,.12,mat.blackMatte,4.68,.02,-12.3);box(.12,1.0,.12,mat.blackMatte,5.32,.02,-12.3);box(.12,1.0,.12,mat.blackMatte,4.68,.02,-12.9);box(.12,1.0,.12,mat.blackMatte,5.32,.02,-12.9);
box(.9,1.1,.11,mat.blackMatte,5.0,1.0,-13.02);

// rear black doorway and desk
box(2.5,4.4,.14,mat.black,-3.85,2.2,-19.05);
box(4.0,1.05,1.6,mat.blackMatte,2.1,.55,-17.55);box(4.15,.12,1.72,mat.gold,2.1,1.1,-17.55);
ledBar(3.65,.035,.04,2.1,1.17,-16.78,0,0xffc96b,4);

// back wall illuminated logo plaque
function signTexture(){
 const c=document.createElement('canvas');c.width=1200;c.height=460;const g=c.getContext('2d');
 g.fillStyle='#f2f0ea';g.fillRect(0,0,1200,460);g.textAlign='center';g.fillStyle='#3b3022';g.font='800 105px Tahoma,Arial';g.fillText(db.settings.brand||'عيار جولد',600,225);g.font='600 38px Arial';g.fillStyle='#b68b35';g.fillText('FINE GOLD • JEWELRY',600,318);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t
}
plane(4.9,2.0,new THREE.MeshBasicMaterial({map:signTexture()}),0,3.4,-19.1);

// local gold price screen on left wall
function boardTexture(){
 const c=document.createElement('canvas');c.width=900;c.height=520;const g=c.getContext('2d');
 g.fillStyle='#101214';g.fillRect(0,0,900,520);g.textAlign='center';g.fillStyle='#e6c86f';g.font='bold 48px Tahoma';g.fillText('السعر المحلي',450,62);
 [24,21,18].forEach((k,i)=>{const y=150+i*112;g.fillStyle='#fff0bb';g.font='bold 38px Arial';g.fillText(k+'K',190,y);g.fillStyle='#d9b85d';g.fillText(Number(db.prices[k].sell).toFixed(2)+' '+(db.settings.currency||'₪'),560,y)});
 g.font='24px Tahoma';g.fillStyle='#9e8a63';g.fillText('تحديث مباشر من لوحة الإدارة',450,475);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t
}
plane(2.4,1.45,new THREE.MeshBasicMaterial({map:boardTexture()}),-6.34,3.5,-12.8,0,Math.PI/2);

// jewelry props inside center showcase
function ring(x,y,z,s=.22){const r=new THREE.Mesh(new THREE.TorusGeometry(s,.045,16,48),mat.goldWarm);r.position.set(x,y,z);r.rotation.x=Math.PI/2;r.castShadow=true;scene.add(r)}
function bar(x,y,z){const b=new THREE.Mesh(new THREE.BoxGeometry(.58,.11,.75),mat.goldWarm);b.position.set(x,y,z);b.rotation.y=.24;b.castShadow=true;scene.add(b)}
function chain(x,y,z){const t=new THREE.Mesh(new THREE.TorusGeometry(.48,.04,16,72,Math.PI*1.45),mat.goldWarm);t.position.set(x,y,z);t.rotation.x=Math.PI/2;t.rotation.z=.35;scene.add(t)}
[-5.1,-8.25,-11.4].forEach((z,idx)=>{if(idx===0){ring(1.2,1.22,z);ring(1.85,1.22,z);ring(2.5,1.22,z)}else if(idx===1){chain(1.85,1.25,z)}else{bar(1.2,1.2,z);bar(1.85,1.2,z);bar(2.5,1.2,z)}});

// hotspot UI tied to physical display walls
const hotspotsRoot=document.getElementById('hotspots');
const hotspotEls=wallHotspots.map(cp=>{const b=document.createElement('button');b.className='hotspot hidden';b.textContent=cp.label;b.onclick=()=>openCategory(cp.label);hotspotsRoot.appendChild(b);return b});

let inside=false,tour=false,dragging=false,lastX=0,lastY=0,keys={},camAnim=null,tourT=0,doorProgress=0;
const tempV=new THREE.Vector3();
function updateLook(){camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}
updateLook();
renderer.domElement.addEventListener('pointerdown',e=>{if(!inside)return;dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!inside||!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.004;pitch-=dy*.003;pitch=Math.max(-.62,Math.min(.48,pitch));updateLook()});
renderer.domElement.addEventListener('pointerup',()=>dragging=false);
addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('.move[data-k]').forEach(b=>{const k=b.dataset.k;if(k==='x')return;b.addEventListener('pointerdown',()=>keys[k]=true);b.addEventListener('pointerup',()=>keys[k]=false);b.addEventListener('pointerleave',()=>keys[k]=false)});

function animateCamera(pos,ty,tp,dur){camAnim={from:camera.position.clone(),to:pos.clone(),sy:yaw,ty,sp:pitch,tp,start:performance.now(),dur}}
function smooth(t){return t*t*(3-2*t)}
function setDoor(p){doorProgress=Math.max(0,Math.min(1,p));leftDoor.rotation.y=-doorProgress*1.18;rightDoor.rotation.y=doorProgress*1.18}
function enterStore(auto=false){inside=true;tour=auto;tourT=0;document.getElementById('intro').classList.add('hide');document.getElementById('walk').classList.add('show');document.getElementById('bottomPanel').classList.add('show');document.getElementById('lookHint').classList.add('show');document.getElementById('help').classList.remove('hide');animateCamera(new THREE.Vector3(0,2.02,-2.25),Math.PI,0,2200)}
function exitStore(){inside=false;tour=false;hotspotEls.forEach(e=>e.classList.add('hidden'));document.getElementById('walk').classList.remove('show');document.getElementById('bottomPanel').classList.remove('show');document.getElementById('lookHint').classList.remove('show');document.getElementById('intro').classList.remove('hide');animateCamera(new THREE.Vector3(0,2.05,10.8),0,-.03,1850)}
function moveCamera(dt){if(!inside||camAnim)return;const speed=2.65*dt,fwd=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(keys.w)camera.position.addScaledVector(fwd,speed);if(keys.s)camera.position.addScaledVector(fwd,-speed);if(keys.a)camera.position.addScaledVector(right,-speed);if(keys.d)camera.position.addScaledVector(right,speed);camera.position.x=Math.max(-5.75,Math.min(5.75,camera.position.x));camera.position.z=Math.max(-18.15,Math.min(-.8,camera.position.z));camera.position.y=2.02}

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
document.getElementById('pricesBtn').onclick=()=>toast('لوحة السعر المحلي موجودة على الجدار داخل المحل');
document.getElementById('aboutBtn').onclick=()=>toast(db.settings.about||'عيار جولد - متجر ذهب ذكي');
document.getElementById('contactBtn').onclick=()=>window.open('https://wa.me/'+String(db.settings.whatsapp||'').replace(/\D/g,''),'_blank');

const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.033),tNow=performance.now();
 if(camAnim){
   let t=Math.min(1,(tNow-camAnim.start)/camAnim.dur),s=smooth(t);
   camera.position.lerpVectors(camAnim.from,camAnim.to,s);yaw=camAnim.sy+(camAnim.ty-camAnim.sy)*s;pitch=camAnim.sp+(camAnim.tp-camAnim.sp)*s;updateLook();
   if(inside)setDoor(Math.min(1,s*1.5));else setDoor(1-s);
   if(t>=1)camAnim=null
 }else if(tour&&inside){
   tourT+=dt;const z=-2.5-Math.min(14.3,tourT*.72);camera.position.z=z;camera.position.x=Math.sin(tourT*.34)*.65;yaw=Math.PI+Math.sin(tourT*.26)*.22;pitch=-.025;updateLook();setDoor(1);if(z<=-16.7){tour=false;toast('انتهت الجولة — يمكنك الآن التجول بنفسك')}
 }else{moveCamera(dt);setDoor(inside?1:0)}
 wallHotspots.forEach((cp,i)=>{tempV.copy(cp.position).project(camera);const visible=inside&&tempV.z<1&&tempV.z>-1&&Math.abs(tempV.x)<1.1&&Math.abs(tempV.y)<1.2;const el=hotspotEls[i];el.style.left=((tempV.x*.5+.5)*innerWidth)+'px';el.style.top=((-tempV.y*.5+.5)*innerHeight)+'px';el.classList.toggle('hidden',!visible)});
 renderer.render(scene,camera)
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>{const l=document.getElementById('loading');if(l){l.style.opacity='0';l.style.pointerEvents='none';setTimeout(()=>l.remove(),500)}},1200);
