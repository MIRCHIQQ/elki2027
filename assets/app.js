(()=>{
'use strict';

/* ---------- утилиты ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let UID=0; const uid=p=>p+(++UID);
const money=n=>n.toLocaleString('ru-RU')+' ₽';
const plural=(n,f)=>{const a=Math.abs(n)%100,b=a%10;return a>10&&a<20?f[2]:b>1&&b<5?f[1]:b===1?f[0]:f[2]};
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
const star=(cx,cy,R,r)=>Array.from({length:10},(_,i)=>{
  const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;
  return (cx+q*Math.cos(a)).toFixed(1)+','+(cy+q*Math.sin(a)).toFixed(1);
}).join(' ');
const sine=(n,x0,x1,y0,amp,cyc)=>Array.from({length:n},(_,i)=>{const t=i/(n-1);return [x0+(x1-x0)*t,y0+amp*Math.sin(t*Math.PI*2*cyc)]});
const BULB=['#c42b43','#e8b24a','#8fd0e0','#59c27a','#ff8fa3'];

/* ---------- иллюстрации товаров (inline SVG) ---------- */
function ball(c1,c2,o={}){
  const g=uid('bl');
  const dots=o.dots?[[34,84],[66,92],[50,58],[72,64],[30,62],[56,80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${o.dots}" opacity=".9"/>`).join(''):'';
  return `<svg viewBox="0 0 100 120" aria-hidden="true"><defs><radialGradient id="${g}" cx="35%" cy="30%" r="78%"><stop offset="0" stop-color="${o.hi||'#fff'}" stop-opacity=".95"/><stop offset=".26" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><path d="M50 14V6" stroke="#caa14a" stroke-width="2" fill="none"/><rect x="42" y="14" width="16" height="16" rx="3" fill="#caa14a"/><circle cx="50" cy="72" r="42" fill="url(#${g})"/>${o.band?`<path d="M10 68Q50 86 90 68L90 80Q50 98 10 80Z" fill="${o.band}" opacity=".88"/>`:''}${dots}<ellipse cx="34" cy="48" rx="10" ry="6" fill="#fff" opacity=".38" transform="rotate(-30 34 48)"/></svg>`;
}

const ART={
  tree(c){
    const g=uid('tr');
    const tip=c.tip?`<path d="M100 22L113 42Q100 36 87 42Z M100 58L118 84Q100 76 82 84Z M100 98L124 130Q100 120 76 130Z" fill="#eef4f6"/>`:'';
    const orn=[[78,160,'#c42b43'],[124,150,'#e8b24a'],[100,124,'#8fd0e0'],[70,118,'#e8b24a'],[132,110,'#c42b43'],[100,80,'#c42b43'],[90,44,'#e8b24a']];
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient></defs><rect x="92" y="172" width="16" height="22" rx="3" fill="#6b4226"/><path d="M100 98L172 178H28Z" fill="url(#${g})"/><path d="M100 58L160 136H40Z" fill="url(#${g})"/><path d="M100 22L146 92H54Z" fill="url(#${g})"/>${tip}${orn.map(([x,y,f])=>`<circle cx="${x}" cy="${y}" r="5" fill="${f}"/>`).join('')}<polygon points="${star(100,16,11,4.5)}" fill="#f6d98b"/></svg>`;
  },
  icicle(c){
    const g=uid('ic'),xs=[30,58,86,114,142,170],ls=[110,150,92,160,122,100];
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4fcff"/><stop offset="1" stop-color="${c.b}"/></linearGradient></defs><rect x="14" y="14" width="172" height="9" rx="4.5" fill="#caa14a"/>${xs.map((x,i)=>`<path d="M${x-10} 23H${x+10}L${x} ${23+ls[i]}Z" fill="url(#${g})" opacity=".92"/><path d="M${x-4} 32L${x-1} ${23+ls[i]*.6}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`).join('')}</svg>`;
  },
  star(){
    const g=uid('st');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="${g}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e8b24a"/><stop offset="1" stop-color="#a8681f"/></radialGradient></defs><circle cx="100" cy="92" r="80" fill="#e8b24a" opacity=".16"/><polygon points="${star(100,90,70,30)}" fill="url(#${g})" stroke="#fff3c4" stroke-width="2" stroke-linejoin="round"/><polygon points="${star(100,90,42,18)}" fill="#fff" opacity=".28"/><rect x="88" y="152" width="24" height="30" rx="4" fill="#caa14a"/></svg>`;
  },
  bell(){
    const g=uid('be');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8681f"/><stop offset=".4" stop-color="#f6d98b"/><stop offset="1" stop-color="#b9792a"/></linearGradient></defs><path d="M100 44C70 44 64 84 60 120C58 136 44 142 44 152H156C156 142 142 136 140 120C136 84 130 44 100 44Z" fill="url(#${g})"/><rect x="48" y="148" width="104" height="11" rx="5.5" fill="#a8681f"/><circle cx="100" cy="172" r="12" fill="url(#${g})"/><path d="M100 38C80 12 58 28 76 42C90 50 100 42 100 38ZM100 38C120 12 142 28 124 42C110 50 100 42 100 38Z" fill="#c42b43"/><circle cx="100" cy="40" r="7" fill="#9d1f34"/></svg>`;
  },
  lights(){
    const w=sine(48,10,190,72,24,1.5).map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ');
    const b=sine(9,10,190,72,24,1.5);
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><polyline points="${w}" fill="none" stroke="#6e8f87" stroke-width="2.5" stroke-linejoin="round"/>${b.map(([x,y],i)=>`<g><circle cx="${x.toFixed(1)}" cy="${(y+13).toFixed(1)}" r="15" fill="${BULB[i%5]}" opacity=".22"/><rect x="${(x-3).toFixed(1)}" y="${y.toFixed(1)}" width="6" height="6" rx="1" fill="#3d514c"/><ellipse class="bulb" style="--d:${(i*-.3).toFixed(1)}s" cx="${x.toFixed(1)}" cy="${(y+13).toFixed(1)}" rx="6.5" ry="8.5" fill="${BULB[i%5]}"/></g>`).join('')}</svg>`;
  },
  curtain(){
    const ls=[96,138,72,160,110,146,84];
    const strands=ls.map((l,i)=>{
      const x=24+i*26;
      let s=`<line x1="${x}" y1="21" x2="${x}" y2="${21+l}" stroke="#6e8f87" stroke-width="1.5"/>`;
      for(let k=1;k<=Math.floor(l/22);k++)s+=`<circle class="bulb" style="--d:${((i+k)*-.4).toFixed(1)}s" cx="${x}" cy="${21+k*22}" r="4.5" fill="#fff1c2"/>`;
      return s+`<ellipse cx="${x}" cy="${21+l+4}" rx="3.5" ry="6" fill="#fff"/>`;
    }).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="12" y="14" width="176" height="7" rx="3.5" fill="#caa14a"/>${strands}</svg>`;
  },
  beads(){
    const g=uid('pe');
    const s1=sine(13,18,182,36,0,1).map(([x],i,a)=>[x,36+92*Math.sin(Math.PI*i/(a.length-1))]);
    const s2=sine(11,32,168,54,0,1).map(([x],i,a)=>[x,54+70*Math.sin(Math.PI*i/(a.length-1))]);
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="${g}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#f1e8da"/><stop offset="1" stop-color="#b9a98f"/></radialGradient></defs>${s2.map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#e8b24a"/>`).join('')}${s1.map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="url(#${g})"/>`).join('')}</svg>`;
  },
  wreath(){
    const L=(n,r,off,fill,rx,ry)=>Array.from({length:n},(_,i)=>`<ellipse transform="translate(100 100) rotate(${off+i*360/n}) translate(0 -${r})" rx="${rx}" ry="${ry}" fill="${fill}"/>`).join('');
    const berries=[20,75,140,200,255,310].map(a=>`<circle transform="translate(100 100) rotate(${a}) translate(0 -58)" r="5" fill="#c42b43"/>`).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="58" fill="none" stroke="#0f3b2c" stroke-width="22"/>${L(18,58,0,'#1f6b4f',9,24)}${L(18,58,10,'#2f9468',7,20)}${L(14,58,18,'#144a37',6,16)}${berries}<path d="M96 170L84 196M104 170L116 196" stroke="#c42b43" stroke-width="7" stroke-linecap="round"/><path d="M100 160C70 140 56 176 82 184C94 188 100 172 100 160ZM100 160C130 140 144 176 118 184C106 188 100 172 100 160Z" fill="#c42b43"/><circle cx="100" cy="164" r="8" fill="#9d1f34"/></svg>`;
  },
  gift(c){
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="36" y="92" width="128" height="88" rx="6" fill="${c.a}"/><rect x="28" y="68" width="144" height="32" rx="6" fill="${c.a2}"/><rect x="92" y="68" width="16" height="112" fill="${c.b}"/><path d="M100 68C70 26 38 50 68 68ZM100 68C130 26 162 50 132 68Z" fill="${c.b}"/><circle cx="100" cy="66" r="8" fill="${c.b2}"/><rect x="36" y="150" width="128" height="6" fill="#000" opacity=".12"/></svg>`;
  },
  sock(c){
    const dm=[70,92,114].map(y=>`<polygon points="100,${y-10} 108,${y} 100,${y+10} 92,${y}" fill="${c.b}" opacity=".9"/>`).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M72 36H128V108C128 124 142 132 162 138C184 146 186 180 156 182C122 184 90 170 78 148C70 134 72 122 72 108Z" fill="${c.a}"/><path d="M128 140C148 146 164 150 172 156C178 170 168 180 152 180C140 180 130 176 124 170Z" fill="${c.b}"/>${dm}<rect x="64" y="28" width="72" height="26" rx="9" fill="${c.b}"/></svg>`;
  },
  tinsel(c){
    const p=sine(34,16,184,100,38,1);
    const sp=p.map(([x,y],i)=>{
      const t=i%2?c.b:'#eef4f6';
      return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${(x+6).toFixed(1)} ${(y-17).toFixed(1)}M${x.toFixed(1)} ${y.toFixed(1)}L${(x-6).toFixed(1)} ${(y+17).toFixed(1)}" stroke="${t}" stroke-width="2.6" stroke-linecap="round"/>`;
    }).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true"><polyline points="${p.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#c9dde3" stroke-width="3" stroke-linejoin="round"/>${sp}</svg>`;
  }
};

/* ---------- каталог ---------- */
const P=[
  {id:'altay',cat:'tree',set:'forest',name:'Ель «Алтайская» 180 см',desc:'Густая литая хвоя и металлическая подставка. Собирается за 10 минут.',price:12900,tag:'Хит',bg:['#2b7a5d','#0f2f27'],art:()=>ART.tree({a:'#2f9468',b:'#14503c'})},
  {id:'snowball',cat:'tree',set:'frost',name:'Ель «Снежок» 60 см',desc:'Настольная ель с белыми кончиками веток. Встанет на подоконник или комод.',price:2490,tag:'Новинка',bg:['#3c7f8f','#10303a'],art:()=>ART.tree({a:'#2a8a63',b:'#17604a',tip:1})},
  {id:'karel',cat:'tree',set:'forest',name:'Ель «Карельская» 240 см',desc:'Высокая ель с тёплой подсветкой 400 LED. Для гостиной с высоким потолком.',price:28500,old:33500,tag:'−15%',bg:['#256a52','#0b241d'],art:()=>ART.tree({a:'#21795a',b:'#0f3d2e'})},
  {id:'bordo',cat:'toys',set:'classic',name:'Шары «Бордо и золото», 24 шт.',desc:'Матовые и глянцевые, два размера. Пластик под стекло, не бьются.',price:1890,tag:'Хит',bg:['#8a2a3c','#2b0f14'],art:()=>ball('#e0475c','#7d1426',{band:'#e8b24a'})},
  {id:'inei',cat:'toys',set:'frost',name:'Шар «Иней», стекло',desc:'Расписан вручную белой краской. Каждый шар чуть отличается от соседнего.',price:790,bg:['#4a8ca0','#122a33'],art:()=>ball('#d7eef5','#4a8ca0',{dots:'#fff'})},
  {id:'icicles',cat:'toys',set:'frost',name:'Сосульки «Ледяной звон», 6 шт.',desc:'Стеклянные подвески 14–22 см. Красиво ловят свет гирлянды.',price:1150,bg:['#3b7488','#0f2630'],art:()=>ART.icicle({b:'#7fc3d6'})},
  {id:'star',cat:'toys',set:'classic',name:'Верхушка «Звезда»',desc:'Золотая звезда на макушку, подходит для стволов до 3 см.',price:1290,bg:['#7d5a1c','#241a08'],art:()=>ART.star()},
  {id:'bell',cat:'toys',set:'classic',name:'Колокольчик латунный с бантом',desc:'Звенит негромко и по-настоящему. Бант из бархатной ленты.',price:590,bg:['#7a2434','#25090f'],art:()=>ART.bell()},
  {id:'warm',cat:'lights',set:'forest',name:'Гирлянда «Тёплый вечер», 10 м',desc:'100 LED тёплого света, 8 режимов, прозрачный провод. Питание от розетки.',price:1490,tag:'Хит',bg:['#2d5a4c','#0b211b'],art:()=>ART.lights()},
  {id:'curtain',cat:'lights',set:'frost',name:'Гирлянда-занавес «Сосульки» 3×2 м',desc:'Семь нитей по два метра, 300 LED холодного света. Для окна или стены.',price:2190,old:2740,tag:'−20%',bg:['#2f6578','#0d2530'],art:()=>ART.curtain()},
  {id:'pearl',cat:'decor',set:'frost',name:'Бусы «Жемчужная нить», 5 м',desc:'Крупные бусины под жемчуг. Можно обвить ель целиком.',price:650,bg:['#4b6f7a','#13262c'],art:()=>ART.beads()},
  {id:'wreath',cat:'decor',set:'forest',name:'Венок «Хвойный», 45 см',desc:'Хвоя, ягоды и красный бант. Крепится на дверь или стену.',price:3200,tag:'Новинка',bg:['#2c6a4d','#0c261c'],art:()=>ART.wreath()},
  {id:'tinsel',cat:'decor',set:'frost',name:'Мишура «Серебряный дождь», 3 шт.',desc:'Мягкая, не осыпается. Длина каждой нити 2 м.',price:320,bg:['#456c78','#11262d'],art:()=>ART.tinsel({b:'#a9c9d4'})},
  {id:'sock',cat:'decor',set:'classic',name:'Носок для подарков, вязаный',desc:'Шерстяной носок с белой манжетой. Повесьте на камин или на спинку кровати.',price:980,bg:['#7a2434','#25090f'],art:()=>ART.sock({a:'#c42b43',b:'#eef4f6'})},
  {id:'box',cat:'tree',set:'forest',name:'Набор «Ёлка за час»',desc:'Ель 120 см, 30 шаров и гирлянда в одной коробке. Подарок себе или соседям.',price:6900,tag:'Набор',bg:['#2f6f55','#0d2a20'],art:()=>ART.gift({a:'#c42b43',a2:'#d94058',b:'#e8b24a',b2:'#a8681f'})}
];
const SETS=[
  {id:'classic',name:'Красное и золото',text:'Бордо, золото и бархатные банты. Классика, которая не стареет.',c1:'#7d1f31',c2:'#2b0f14',art:()=>ball('#e0475c','#7d1426',{band:'#e8b24a'})},
  {id:'frost',name:'Скандинавский иней',text:'Белое, серебряное и стеклянное. Холодный свет и ничего лишнего.',c1:'#1f5a6c',c2:'#0e2430',art:()=>ART.icicle({b:'#7fc3d6'})},
  {id:'forest',name:'Лесной уют',text:'Густые ели, хвойные венки и тёплые огоньки по вечерам.',c1:'#236b4c',c2:'#0d2a1f',art:()=>ART.wreath()}
];
const CATS=[['all','Всё'],['tree','Ёлки'],['toys','Игрушки'],['lights','Гирлянды'],['decor','Декор']];
const CATNAME={tree:'Ёлки',toys:'Игрушки',lights:'Гирлянды',decor:'Декор'};
const FREE_FROM=5000;

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prod=id=>P.find(p=>p.id===id);

/* ---------- украшения героя ---------- */
function drawGarland(){
  const el=$('#garland'); if(!el) return;
  const w=Math.max(320,Math.round(el.clientWidth||innerWidth)),h=60,per=Math.max(160,Math.min(240,w/5));
  const y=x=>6+22*Math.abs(Math.sin(Math.PI*x/per));
  let d='M0 '+y(0).toFixed(1);
  for(let x=4;x<=w+4;x+=4)d+=` L${x} ${y(x).toFixed(1)}`;
  const step=per/4;let bulbs='',i=0;
  for(let x=step/2;x<w;x+=step,i++){
    const yy=y(x),col=BULB[i%5];
    bulbs+=`<g><circle cx="${x.toFixed(1)}" cy="${(yy+11).toFixed(1)}" r="11" fill="${col}" opacity=".25"/><rect x="${(x-2.5).toFixed(1)}" y="${yy.toFixed(1)}" width="5" height="5" fill="#3d514c"/><ellipse class="bulb" style="--d:${(-(i%7)*.35).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${(yy+11).toFixed(1)}" rx="4.6" ry="6.4" fill="${col}"/></g>`;
  }
  el.innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#6e8f87" stroke-width="2"/>${bulbs}</svg>`;
}

function drawHangs(){
  const H=[[5,70,'#e0475c','#7d1426',{band:'#e8b24a'},6],[14,98,'#d7eef5','#4a8ca0',{dots:'#fff'},5],[33,56,'#f6d98b','#a8681f',{},7],[58,92,'#8fd0e0','#2a6f86',{band:'#eef4f6'},5],[77,64,'#e0475c','#7d1426',{dots:'#f6d98b'},6],[92,86,'#f6d98b','#a8681f',{band:'#c42b43'},5]];
  $('#hangs').innerHTML=H.map(([x,len,c1,c2,o,r],i)=>`<span class="hang" style="left:${x}%;--d:${(-i*.7).toFixed(1)}s;--r:${r}deg"><span class="str" style="--len:${len}px"></span>${ball(c1,c2,o)}</span>`).join('');
}

function drawTree(){
  const g=uid('ht'),au=uid('au');
  const orn=[[180,150,'#c42b43'],[222,140,'#e8b24a'],[200,115,'#8fd0e0'],[150,230,'#e8b24a'],[205,200,'#c42b43'],[255,240,'#8fd0e0'],[185,255,'#c42b43'],[120,330,'#e8b24a'],[175,310,'#8fd0e0'],[230,350,'#c42b43'],[285,320,'#e8b24a'],[200,372,'#8fd0e0'],[100,415,'#c42b43'],[160,400,'#e8b24a'],[240,420,'#8fd0e0'],[300,405,'#c42b43'],[200,432,'#e8b24a']];
  const tiers=[['M200 260L370 440H30Z',200,260,30],['M200 190L340 380H60Z',200,190,60],['M200 120L300 270H100Z',200,120,100],['M200 70L262 170H138Z',200,70,138]];
  const shade=[['M200 260L200 440H30Z'],['M200 190L200 380H60Z'],['M200 120L200 270H100Z'],['M200 70L200 170H138Z']];
  const swags=['M82 372Q200 428 318 372','M118 262Q200 306 282 262','M148 160Q200 192 252 160'];
  const body=tiers.map((t,i)=>`<path d="${t[0]}" fill="url(#${g})" stroke="#0e3a2b" stroke-width="2" stroke-linejoin="round"/><path d="${shade[i][0]}" fill="#fff" opacity=".05"/>`).join('');
  $('#tree').innerHTML=`<svg viewBox="0 0 400 480"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f9468"/><stop offset="1" stop-color="#124636"/></linearGradient><radialGradient id="${au}"><stop offset="0" stop-color="#e8b24a" stop-opacity=".2"/><stop offset="1" stop-color="#e8b24a" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="250" r="235" fill="url(#${au})"/><ellipse cx="200" cy="470" rx="150" ry="10" fill="#000" opacity=".28"/><rect x="180" y="438" width="40" height="36" rx="4" fill="#6b4226"/>${body}${swags.map(s=>`<path d="${s}" fill="none" stroke="#f6d98b" stroke-width="4" stroke-linecap="round" stroke-dasharray="0.1 9"/>`).join('')}${orn.map(([x,y,f],i)=>`<g class="bulb" style="--d:${(-(i%6)*.45).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="9" fill="${f}"/><circle cx="${x-3}" cy="${y-3}" r="2.6" fill="#fff" opacity=".7"/></g>`).join('')}<circle class="bulb" cx="200" cy="50" r="40" fill="#f6d98b" opacity=".3"/><polygon points="${star(200,50,26,11)}" fill="#f6d98b" stroke="#fff3c4" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

function countdown(){
  const t=new Date(new Date().getFullYear()+1,0,1);
  const tick=()=>{
    let s=Math.max(0,Math.floor((t-Date.now())/1000));
    const d=Math.floor(s/86400);s%=86400;
    const h=Math.floor(s/3600);s%=3600;
    const m=Math.floor(s/60);s%=60;
    $('#cd-d').textContent=d;
    $('#cd-dl').textContent=plural(d,['день','дня','дней']);
    $('#cd-h').textContent=String(h).padStart(2,'0');
    $('#cd-m').textContent=String(m).padStart(2,'0');
    $('#cd-s').textContent=String(s).padStart(2,'0');
  };
  tick();setInterval(tick,1000);
}

/* ---------- каталог ---------- */
const state={cat:'all',set:null,sort:'def'};
function visible(){
  let a=P.filter(p=>(state.cat==='all'||p.cat===state.cat)&&(!state.set||p.set===state.set));
  if(state.sort==='asc')a=[...a].sort((x,y)=>x.price-y.price);
  if(state.sort==='desc')a=[...a].sort((x,y)=>y.price-x.price);
  return a;
}
function renderChips(){
  const base=P.filter(p=>!state.set||p.set===state.set);
  $('#chips').innerHTML=CATS.map(([k,l])=>{
    const n=k==='all'?base.length:base.filter(p=>p.cat===k).length;
    return `<button class="chip" type="button" data-cat="${k}" aria-pressed="${state.cat===k}">${l} <small>${n}</small></button>`;
  }).join('');
}
function renderNote(){
  const s=SETS.find(x=>x.id===state.set);
  $('#colNote').innerHTML=s?`<div class="note">Подборка <b>«${s.name}»</b><button class="chip" type="button" id="colClear">Показать всё ×</button></div>`:'';
}
function renderGrid(){
  const list=visible();
  $('#grid').innerHTML=list.length?list.map((p,i)=>`<article class="card" style="--i:${i}">${p.tag?`<span class="tag">${p.tag}</span>`:''}<div class="art" style="--a:${p.bg[0]};--b:${p.bg[1]}">${p.art()}</div><div class="info"><span class="cat">${CATNAME[p.cat]}</span><h3 class="name">${p.name}</h3><p class="desc">${p.desc}</p><div class="buy"><span class="price">${money(p.price)}${p.old?`<s>${money(p.old)}</s>`:''}</span><button class="add" type="button" data-add="${p.id}" aria-label="В корзину: ${p.name}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>В корзину</button></div></div></article>`).join(''):`<div class="empty">В этой подборке нет товаров из выбранной категории.</div>`;
}
function renderSets(){
  $('#cols').innerHTML=SETS.map(s=>{
    const n=P.filter(p=>p.set===s.id).length;
    return `<article class="col" style="--c1:${s.c1};--c2:${s.c2}"><div class="bg" aria-hidden="true">${s.art()}</div><h3>${s.name}</h3><p>${s.text}</p><button class="btn btn-gold" type="button" data-set="${s.id}">Смотреть ${n} ${plural(n,['товар','товара','товаров'])}</button></article>`;
  }).join('');
}

function goTo(id){
  const beh=reduce?'auto':'smooth';
  if(id==='top'){scrollTo({top:0,behavior:beh});return}
  const el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:beh,block:'start'});
}

/* ---------- корзина ---------- */
const cart=store.get('ebal-cart',{});
Object.keys(cart).forEach(k=>{if(!prod(k)||!(cart[k]>0))delete cart[k]});
let view='cart',doneInfo=null,lastFocus=null;
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const total=()=>Object.entries(cart).reduce((s,[id,q])=>s+prod(id).price*q,0);
const saveCart=()=>store.set('ebal-cart',cart);
const isOpen=()=>document.body.classList.contains('cart-open');

function updateBadge(bump){
  const el=$('#cartCount');
  el.textContent=count();
  if(bump&&!reduce){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
}
function fly(from){
  if(reduce)return;
  const a=from.getBoundingClientRect(),b=$('#cartBtn').getBoundingClientRect();
  const d=document.createElement('div');d.className='fly';
  d.style.left=(a.left+a.width/2-15)+'px';d.style.top=(a.top+a.height/2-15)+'px';
  d.innerHTML=ball('#f6d98b','#a8681f',{band:'#c42b43'});
  document.body.appendChild(d);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
  const an=d.animate([
    {transform:'translate(0,0) scale(1)',opacity:1},
    {transform:`translate(${dx*.45}px,${dy*.45-90}px) scale(1.15)`,opacity:1,offset:.45},
    {transform:`translate(${dx}px,${dy}px) scale(.35)`,opacity:.5}
  ],{duration:800,easing:'cubic-bezier(.4,0,.2,1)'});
  an.onfinish=()=>d.remove();
}
function addToCart(id,btn){
  cart[id]=(cart[id]||0)+1;saveCart();updateBadge(true);
  if(btn)fly(btn);
  if(isOpen())renderDrawer();
}

function renderDrawer(){
  const body=$('#dBody'),foot=$('#dFoot'),items=Object.entries(cart);
  if(view==='form'&&!items.length)view='cart';
  $('#dTitle').textContent=view==='form'?'Оформление':view==='done'?'Заказ принят':'Корзина';

  if(view==='done'){
    body.innerHTML=`<div class="done"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#e8b24a" opacity=".15"/><polygon points="${star(50,52,40,17)}" fill="#e8b24a" stroke="#f6d98b" stroke-width="2" stroke-linejoin="round"/></svg><h3>Спасибо${doneInfo&&doneInfo.name?', '+esc(doneInfo.name):''}!</h3><p>Заказ на ${money(doneInfo?doneInfo.sum:0)} оформлен.</p><small>Это демонстрационный сайт: заказ никуда не отправлен.</small></div>`;
    foot.innerHTML=`<button class="btn btn-gold" type="button" data-finish>Вернуться в магазин</button>`;
    return;
  }
  if(!items.length){
    body.innerHTML=`<div class="d-empty"><div style="width:70px">${ball('#e0475c','#7d1426',{band:'#e8b24a'})}</div><p>Корзина пока пуста.<br>Выберите ёлку, пару шаров и гирлянду.</p></div>`;
    foot.innerHTML=`<button class="btn btn-gold" type="button" data-shop>Перейти в каталог</button>`;
    return;
  }
  const sum=total(),n=count();
  const totalRow=`<div class="total"><span>Итого, ${n} ${plural(n,['товар','товара','товаров'])}</span><b>${money(sum)}</b></div>`;
  if(view==='form'){
    body.innerHTML=`<button class="link" type="button" id="backCart">← К корзине</button><form id="orderForm"><div class="field"><label for="f-name">Имя</label><input id="f-name" name="name" type="text" autocomplete="given-name" required placeholder="Анна"></div><div class="field"><label for="f-phone">Телефон</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required minlength="10" placeholder="+7 900 000-00-00"></div><div class="field"><label for="f-addr">Адрес доставки</label><textarea id="f-addr" name="addr" rows="3" required placeholder="Город, улица, дом, квартира"></textarea></div></form>`;
    foot.innerHTML=`${totalRow}<button class="btn btn-gold" type="submit" form="orderForm">Подтвердить заказ</button>`;
    return;
  }
  body.innerHTML=items.map(([id,q])=>{
    const p=prod(id);
    return `<div class="ci"><div class="th" style="--a:${p.bg[0]};--b:${p.bg[1]}">${p.art()}</div><div><h4>${p.name}</h4><div class="p">${money(p.price)} за шт.</div><div class="qty"><button type="button" data-step="-1" data-id="${id}" aria-label="Убавить: ${p.name}">−</button><output>${q}</output><button type="button" data-step="1" data-id="${id}" aria-label="Добавить: ${p.name}">+</button></div></div><div class="sum">${money(p.price*q)}</div></div>`;
  }).join('');
  const left=Math.max(0,FREE_FROM-sum),pct=Math.min(100,Math.round(sum/FREE_FROM*100));
  foot.innerHTML=`<div class="ship">${left>0?`Добавьте ещё на ${money(left)}, и доставка будет бесплатной`:'Доставка бесплатная'}<div class="bar2"><i style="--s:${pct}"></i></div></div>${totalRow}<button class="btn btn-gold" type="button" id="goForm">Оформить заказ</button>`;
}
function openCart(){
  lastFocus=document.activeElement;view='cart';renderDrawer();
  document.body.classList.add('cart-open');
  $('#drawer').setAttribute('aria-hidden','false');
  setTimeout(()=>$('#dClose').focus({preventScroll:true}),60);
}
function closeCart(){
  document.body.classList.remove('cart-open');
  $('#drawer').setAttribute('aria-hidden','true');
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
}

/* ---------- снег ---------- */
const snow={cv:$('#snow'),ctx:null,flakes:[],on:false,fading:false,raf:0,last:0,w:0,h:0};
function mkFlake(init){
  const r=Math.random()*2.6+.8;
  return {x:Math.random()*snow.w,y:init?Math.random()*snow.h:-10,r,vy:.35+r*.28+Math.random()*.4,ph:Math.random()*6.28,sw:.3+Math.random()*.7,a:.45+Math.random()*.5};
}
function snowResize(){
  const dpr=Math.min(2,devicePixelRatio||1);
  snow.w=innerWidth;snow.h=innerHeight;
  snow.cv.width=Math.round(snow.w*dpr);snow.cv.height=Math.round(snow.h*dpr);
  snow.ctx.setTransform(dpr,0,0,dpr,0,0);
  const n=Math.round(Math.min(170,Math.max(60,snow.w*snow.h/9500)));
  while(snow.flakes.length<n)snow.flakes.push(mkFlake(true));
  snow.flakes.length=n;
}
function snowFrame(ts){
  if(!snow.on&&!snow.fading){snow.raf=0;snow.ctx.clearRect(0,0,snow.w,snow.h);return}
  const dt=Math.min(40,ts-(snow.last||ts-16))/16.7;snow.last=ts;
  const c=snow.ctx,wind=Math.sin(ts/4000)*.25;
  c.clearRect(0,0,snow.w,snow.h);
  c.fillStyle='#fff';
  for(const f of snow.flakes){
    f.y+=f.vy*dt;
    f.x+=(Math.sin(ts/1000*f.sw+f.ph)*.35+wind)*dt;
    if(f.y>snow.h+8)Object.assign(f,mkFlake(false));
    if(f.x>snow.w+8)f.x=-8;else if(f.x<-8)f.x=snow.w+8;
    c.globalAlpha=f.a;c.beginPath();c.arc(f.x,f.y,f.r,0,6.2832);c.fill();
  }
  c.globalAlpha=1;
  snow.raf=requestAnimationFrame(snowFrame);
}
function setSnow(on,persist){
  snow.on=on;
  $('#snowBtn').setAttribute('aria-pressed',String(on));
  if(on){
    snow.fading=false;
    if(!snow.ctx)snow.ctx=snow.cv.getContext('2d');
    snowResize();
    snow.cv.classList.add('on');
    if(!snow.raf){snow.last=0;snow.raf=requestAnimationFrame(snowFrame)}
  }else{
    snow.cv.classList.remove('on');
    snow.fading=true;
    setTimeout(()=>{if(!snow.on)snow.fading=false},900);
  }
  if(persist)store.set('ebal-snow',on);
}

/* ---------- события ---------- */
$('#chips').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;state.cat=b.dataset.cat;renderChips();renderGrid()});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;renderGrid()});
$('#colNote').addEventListener('click',e=>{if(e.target.closest('#colClear')){state.set=null;renderNote();renderChips();renderGrid()}});
$('#cols').addEventListener('click',e=>{const b=e.target.closest('[data-set]');if(!b)return;state.set=b.dataset.set;state.cat='all';renderNote();renderChips();renderGrid();goTo('catalog')});
$('#grid').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addToCart(b.dataset.add,b)});

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-go]');if(!a)return;
  e.preventDefault();if(isOpen())closeCart();goTo(a.dataset.go);
});
$('#cartBtn').addEventListener('click',openCart);
$('#dClose').addEventListener('click',closeCart);
$('#scrim').addEventListener('click',closeCart);
$('#snowBtn').addEventListener('click',()=>setSnow(!snow.on,true));

$('#drawer').addEventListener('click',e=>{
  const s=e.target.closest('[data-step]');
  if(s){
    const id=s.dataset.id,n=(cart[id]||0)+Number(s.dataset.step);
    if(n<=0)delete cart[id];else cart[id]=n;
    saveCart();updateBadge(false);renderDrawer();return;
  }
  if(e.target.closest('#goForm')){view='form';renderDrawer();return}
  if(e.target.closest('#backCart')){view='cart';renderDrawer();return}
  if(e.target.closest('[data-shop]')){closeCart();goTo('catalog');return}
  if(e.target.closest('[data-finish]')){closeCart();goTo('top')}
});
$('#drawer').addEventListener('submit',e=>{
  if(e.target.id!=='orderForm')return;
  e.preventDefault();
  doneInfo={name:$('#f-name').value.trim(),sum:total()};
  Object.keys(cart).forEach(k=>delete cart[k]);
  saveCart();updateBadge(false);view='done';renderDrawer();
});
document.addEventListener('keydown',e=>{
  if(!isOpen())return;
  if(e.key==='Escape'){closeCart();return}
  if(e.key==='Tab'){
    const f=$$('button,input,select,textarea,a[href]',$('#drawer')).filter(x=>!x.disabled);
    if(!f.length)return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});

/* ---------- прокрутка: полоса-гирлянда, меню, появление блоков ---------- */
const prog=$('.prog'),links=$$('.nav a');let ticking=false;
function onScroll(){
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
    const m=document.documentElement.scrollHeight-innerHeight;
    prog.style.setProperty('--p',(m>0?Math.min(1,Math.max(0,scrollY/m)):0).toFixed(4));
    if(scrollY<300)links.forEach(a=>a.classList.remove('on'));
    ticking=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});

if('IntersectionObserver' in window){
  const so=new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.dataset.go===en.target.id));
  }),{rootMargin:'-45% 0px -50% 0px'});
  ['catalog','sets','delivery'].forEach(id=>so.observe(document.getElementById(id)));
}
const rv=$$('.rv'),gridEl=$('#grid');
const revealAll=()=>{rv.forEach(el=>el.classList.add('in'));gridEl.classList.add('in')};
if('IntersectionObserver' in window&&!reduce){
  const io=new IntersectionObserver((es,o)=>es.forEach(en=>{
    if(en.isIntersecting){en.target.classList.add('in');o.unobserve(en.target)}
  }),{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  rv.forEach(el=>io.observe(el));io.observe(gridEl);
  setTimeout(revealAll,15000);
}else revealAll();

let rz=0;
addEventListener('resize',()=>{
  clearTimeout(rz);
  rz=setTimeout(()=>{drawGarland();if(snow.on)snowResize()},150);
});

/* ---------- запуск ---------- */
drawGarland();drawHangs();drawTree();countdown();
const belt=$('#belt');belt.innerHTML+=belt.innerHTML;
renderChips();renderNote();renderGrid();renderSets();
updateBadge(false);onScroll();
const savedSnow=store.get('ebal-snow',null);
setSnow(savedSnow===null?!reduce:!!savedSnow,false);
})();
