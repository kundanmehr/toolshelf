const $=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstChild};
const copy=async(t,el)=>{try{await navigator.clipboard.writeText(t);el.textContent='Copied'}catch(e){el.textContent='Select and copy manually'}};

const tools=[
{id:'words',name:'Word counter',render(p){
p.innerHTML=`<h2>Word counter</h2><p class="d">Count words, characters, sentences and reading time.</p>
<textarea id="t" placeholder="Paste or type your text here" aria-label="Text"></textarea>
<div class="stats"><div><b id="w">0</b><span>Words</span></div><div><b id="c">0</b><span>Characters</span></div><div><b id="s">0</b><span>Sentences</span></div><div><b id="r">0</b><span>Min to read</span></div></div>`;
const t=p.querySelector('#t');const u=()=>{const v=t.value;const w=(v.trim().match(/\S+/g)||[]).length;
p.querySelector('#w').textContent=w;p.querySelector('#c').textContent=v.length;
p.querySelector('#s').textContent=(v.match(/[^.!?۔]+[.!?۔]+/g)||[]).length;
p.querySelector('#r').textContent=w?Math.max(1,Math.round(w/220)):0};t.addEventListener('input',u)}},

{id:'case',name:'Case converter',render(p){
p.innerHTML=`<h2>Case converter</h2><p class="d">Change text to upper, lower, title or sentence case.</p>
<textarea id="t" placeholder="Paste or type your text here" aria-label="Text"></textarea>
<div class="row"><button class="btn alt" data-m="up">UPPER</button><button class="btn alt" data-m="low">lower</button><button class="btn alt" data-m="title">Title Case</button><button class="btn alt" data-m="sent">Sentence case</button></div>
<button class="btn" id="cp">Copy result</button>`;
const t=p.querySelector('#t');
const f={up:s=>s.toUpperCase(),low:s=>s.toLowerCase(),title:s=>s.toLowerCase().replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase()),sent:s=>s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())};
p.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{t.value=f[b.dataset.m](t.value)});
const cp=p.querySelector('#cp');cp.onclick=()=>copy(t.value,cp)}},

{id:'pass',name:'Password generator',render(p){
p.innerHTML=`<h2>Password generator</h2><p class="d">Random passwords made with your browser's secure generator.</p>
<div class="row"><label>Length <input id="n" type="number" min="8" max="64" value="16"></label>
<label>Include <select id="k"><option value="a">Letters, numbers, symbols</option><option value="b">Letters and numbers</option><option value="c">Letters only</option></select></label></div>
<div class="out" id="o" aria-live="polite"></div>
<div class="row"><button class="btn" id="g">Generate</button><button class="btn alt" id="cp">Copy</button></div>`;
const o=p.querySelector('#o');
const gen=()=>{const L='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',D='0123456789',S='!@#$%^&*()-_=+[]{};:,.?';
const k=p.querySelector('#k').value;const set=k==='a'?L+D+S:k==='b'?L+D:L;
let n=Math.min(64,Math.max(8,+p.querySelector('#n').value||16));const a=new Uint32Array(n);crypto.getRandomValues(a);
o.textContent=[...a].map(x=>set[x%set.length]).join('')};
p.querySelector('#g').onclick=gen;const cp=p.querySelector('#cp');cp.onclick=()=>copy(o.textContent,cp);gen()}},

{id:'pct',name:'Percentage calculator',render(p){
p.innerHTML=`<h2>Percentage calculator</h2><p class="d">Find a percentage of a number, or what percent one number is of another.</p>
<div class="row"><input id="a" type="number" placeholder="Percent" aria-label="Percent"><input id="b" type="number" placeholder="Number" aria-label="Number"></div>
<div class="big" id="r1">–</div><p class="d" id="l1">Enter both values to see what percent of the number is.</p>
<div class="row"><input id="c" type="number" placeholder="Part" aria-label="Part"><input id="d" type="number" placeholder="Whole" aria-label="Whole"></div>
<div class="big" id="r2">–</div><p class="d">Part as a percent of the whole.</p>`;
const q=s=>p.querySelector(s);const fmt=x=>+x.toFixed(4)+'';
const u=()=>{const a=q('#a').value,b=q('#b').value,c=q('#c').value,d=q('#d').value;
q('#r1').textContent=(a!==''&&b!=='')?fmt(a*b/100):'–';
q('#l1').textContent=(a!==''&&b!=='')?`${a}% of ${b}`:'Enter both values to see what percent of the number is.';
q('#r2').textContent=(c!==''&&d!==''&&+d!==0)?fmt(c/d*100)+'%':'–'};
p.querySelectorAll('input').forEach(i=>i.addEventListener('input',u))}},

{id:'json',name:'JSON formatter',render(p){
p.innerHTML=`<h2>JSON formatter</h2><p class="d">Check, format or compact JSON.</p>
<textarea id="t" placeholder='{"name":"Toolshelf","tools":5}' aria-label="JSON" spellcheck="false"></textarea>
<div class="row"><button class="btn" id="f">Format</button><button class="btn alt" id="m">Compact</button><button class="btn alt" id="cp">Copy</button></div><div id="msg" aria-live="polite"></div>`;
const t=p.querySelector('#t'),msg=p.querySelector('#msg');
const run=(sp)=>{try{t.value=JSON.stringify(JSON.parse(t.value),null,sp);msg.className='ok';msg.textContent='Valid JSON'}catch(e){msg.className='err';msg.textContent='Invalid JSON: '+e.message}};
p.querySelector('#f').onclick=()=>run(2);p.querySelector('#m').onclick=()=>run(0);
const cp=p.querySelector('#cp');cp.onclick=()=>copy(t.value,cp)}},

{id:'qr',name:'QR code maker',render(p){
p.innerHTML='<h2>QR code maker</h2><p class="d">Turn a link or text into a QR code you can save.</p><textarea id="t" style="min-height:80px" placeholder="https://example.com" aria-label="Text or link"></textarea><div id="o"></div><button class="btn" id="dl" hidden>Download SVG</button><div id="m" class="err"></div>';
const t=p.querySelector('#t'),o=p.querySelector('#o'),dl=p.querySelector('#dl'),m=p.querySelector('#m');let svg='';
t.addEventListener('input',()=>{m.textContent='';const v=t.value.trim();if(!v){o.innerHTML='';dl.hidden=true;return}
if(typeof qrcode==='undefined'){m.textContent='The QR library could not load. Check your connection.';return}
try{const q=qrcode(0,'M');q.addData(v);q.make();svg=q.createSvgTag({cellSize:6,margin:2,scalable:true});o.innerHTML='<div class="qr">'+svg+'</div>';dl.hidden=false}catch(e){m.textContent='Text is too long for a QR code.'}});
dl.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));a.download='qr-code.svg';a.click()}}},

{id:'units',name:'Unit converter',render(p){
const U={length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,yd:.9144,ft:.3048,in:.0254},weight:{kg:1,g:.001,lb:.45359237,oz:.028349523},volume:{L:1,mL:.001,gal:3.785411784,cup:.2365882365,'fl oz':.0295735296},temperature:{'°C':1,'°F':1,K:1}};
p.innerHTML='<h2>Unit converter</h2><p class="d">Length, weight, volume and temperature.</p><div class="row"><select id="c" aria-label="Category"></select><input id="v" type="number" value="1" aria-label="Value"></div><div class="row"><select id="f" aria-label="From"></select><select id="to" aria-label="To"></select></div><div class="big" id="r">–</div>';
const q=s=>p.querySelector(s),c=q('#c'),f=q('#f'),to=q('#to');
Object.keys(U).forEach(k=>c.add(new Option(k[0].toUpperCase()+k.slice(1),k)));
const fill=()=>{const ks=Object.keys(U[c.value]);f.innerHTML=to.innerHTML='';ks.forEach(k=>{f.add(new Option(k,k));to.add(new Option(k,k))});to.selectedIndex=Math.min(1,ks.length-1);calc()};
const calc=()=>{const v=parseFloat(q('#v').value);if(isNaN(v)){q('#r').textContent='–';return}let r;
if(c.value==='temperature'){const C=f.value==='°C'?v:f.value==='°F'?(v-32)*5/9:v-273.15;r=to.value==='°C'?C:to.value==='°F'?C*9/5+32:C+273.15}
else r=v*U[c.value][f.value]/U[c.value][to.value];
q('#r').textContent=(+r.toPrecision(8))+' '+to.value};
c.onchange=fill;[f,to,q('#v')].forEach(e=>e.addEventListener('input',calc));fill()}},

{id:'age',name:'Age calculator',render(p){
p.innerHTML='<h2>Age calculator</h2><p class="d">Exact age and days until the next birthday.</p><label for="b">Date of birth</label><input id="b" type="date"><div class="big" id="r">–</div><p class="d" id="x"></p>';
const b=p.querySelector('#b'),r=p.querySelector('#r'),x=p.querySelector('#x');
b.addEventListener('input',()=>{if(!b.value){r.textContent='–';x.textContent='';return}
const [Y,M,D]=b.value.split('-').map(Number),n=new Date(),T=new Date(n.getFullYear(),n.getMonth(),n.getDate()),d=new Date(Y,M-1,D);
if(d>T){r.textContent='–';x.textContent='That date is in the future.';return}
let y=T.getFullYear()-Y,m=T.getMonth()-(M-1),dd=T.getDate()-D;
if(dd<0){m--;dd+=new Date(T.getFullYear(),T.getMonth(),0).getDate()}if(m<0){y--;m+=12}
let nb=new Date(T.getFullYear(),M-1,D);if(nb<T)nb=new Date(T.getFullYear()+1,M-1,D);
r.textContent=y+' years, '+m+' months, '+dd+' days';
x.textContent=Math.round((T-d)/864e5).toLocaleString()+' days old. Next birthday in '+Math.round((nb-T)/864e5)+' days.'})}},

{id:'color',name:'Color converter',render(p){
p.innerHTML='<h2>Color converter</h2><p class="d">Pick a color and copy it as HEX, RGB or HSL.</p><input id="c" type="color" value="#2f5bff" style="height:54px;padding:4px" aria-label="Color"><div class="sw" id="s"></div><div id="l"></div>';
const c=p.querySelector('#c'),s=p.querySelector('#s'),l=p.querySelector('#l');
const u=()=>{const h=c.value,R=parseInt(h.slice(1,3),16),G=parseInt(h.slice(3,5),16),B=parseInt(h.slice(5,7),16);
const r=R/255,g=G/255,b=B/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),L=(mx+mn)/2,d=mx-mn;
let H=0,S=0;if(d){S=d/(1-Math.abs(2*L-1));H=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;H=Math.round((H*60+360)%360)}
const v=[h.toUpperCase(),'rgb('+R+', '+G+', '+B+')','hsl('+H+', '+Math.round(S*100)+'%, '+Math.round(L*100)+'%)'];
s.style.background=h;l.innerHTML='';
v.forEach(t=>{const row=document.createElement('div');row.className='row';const o=document.createElement('div');o.className='out';o.style.margin='0';o.textContent=t;const bt=document.createElement('button');bt.className='btn alt';bt.style.flex='0 0 auto';bt.textContent='Copy';bt.onclick=()=>copy(t,bt);row.append(o,bt);l.appendChild(row)})};
c.addEventListener('input',u);u()}},

{id:'diff',name:'Text compare',render(p){
p.innerHTML='<h2>Text compare</h2><p class="d">Paste two versions to see which lines were added or removed.</p><div class="two"><textarea id="a" placeholder="Original" aria-label="Original text"></textarea><textarea id="b" placeholder="Changed" aria-label="Changed text"></textarea></div><div class="row"><button class="btn" id="go">Compare</button></div><div id="o"></div>';
const q=s=>p.querySelector(s);
q('#go').onclick=()=>{const a=q('#a').value.split('\n'),b=q('#b').value.split('\n'),n=a.length,m=b.length,o=q('#o');o.innerHTML='';
if(n*m>250000){o.textContent='Texts are too long. Try fewer than 500 lines each.';return}
const dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
const add=(t,c,s)=>{const e=document.createElement('div');e.className='ln '+c;e.textContent=s+' '+t;o.appendChild(e)};
let i=0,j=0,ch=0;while(i<n||j<m){if(i<n&&j<m&&a[i]===b[j]){add(a[i],'',' ');i++;j++}else if(j>=m||(i<n&&dp[i+1][j]>=dp[i][j+1])){add(a[i],'r','-');i++;ch++}else{add(b[j],'a','+');j++;ch++}}
if(!ch){const e=document.createElement('div');e.className='ok';e.textContent='No differences found.';o.prepend(e)}}}}
];

