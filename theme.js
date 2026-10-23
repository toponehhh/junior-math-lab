/* ============================================================
   共享主题切换（初中数学演示实验室）
   - 亮 / 暗双主题，右上角圆形按钮切换
   - localStorage 记忆手动选择（键名 jml-theme）
   - 未手动选择时跟随系统 prefers-color-scheme
   - 支持 URL 参数 ?theme=dark / ?theme=light（便于分享与测试）
   - 暗色下自动重着色 SVG 中的网格 / 坐标轴 / 刻度 / 标注
   - A4 打印页（data-page="a4"）不翻转内容配色，仅暗化背景衬底
   ============================================================ */
(function(){
'use strict';
var KEY='jml-theme';
var html=document.documentElement;
var isA4=html.getAttribute('data-page')==='a4';

/* ---------- 深色样式（A4 页不注入变量翻转，保持纸面可打印） ---------- */
if(!isA4){
 var st=document.createElement('style');
 st.textContent=
'html[data-theme=dark]{color-scheme:dark;'+
'--ink:#e9eef5;--bg:#10151c;--card:#161d26;--line:#2a3441;--muted:#8f99a8;'+
'--blue:#5c9ded;--red:#ff922b;--green:#38d9a9;--purple:#b197fc;--teal:#2ee6c8;--accent:#7cb0e8;'+
'--sub:#b6c0cc;--soft:#1c2430}\n'+
'html[data-theme=dark] body{background:var(--bg);color:var(--ink)}\n'+
'html[data-theme=dark] .sub,html[data-theme=dark] .note,html[data-theme=dark] .caption,'+
'html[data-theme=dark] .chk,html[data-theme=dark] .foot{color:var(--sub)}\n'+
'html[data-theme=dark] .formula,html[data-theme=dark] .ro,html[data-theme=dark] .qa .q'+
'{background:var(--soft);border-color:var(--line)}\n'+
'html[data-theme=dark] #svg,html[data-theme=dark] .card svg{background:#1a212b}\n'+
'html[data-theme=dark] .grid line{stroke:#242e3a}\n'+
'html[data-theme=dark] .axis{stroke:#b6c0cc}\n'+
'html[data-theme=dark] input[type=range]{accent-color:#8f99a8}\n'+
'html[data-theme=dark] table,html[data-theme=dark] th,html[data-theme=dark] td'+
'{background:#161d26;border-color:#333e4c}\n'+
'html[data-theme=dark] th{background:#1e2833}\n'+
'html[data-theme=dark] tbody tr:hover{background:#1e2833}\n'+
'html[data-theme=dark] tbody tr.sel{background:#243040}\n'+
'html[data-theme=dark] .btn{--c:#aeb9c6;border-color:#8f99a8;color:#cfd8e3;background:#161d26}\n'+
'html[data-theme=dark] .btn:hover{background:#1e2833}\n'+
'html[data-theme=dark] .anim{background:#161d26}\n'+
'html[data-theme=dark] .anim:hover{background:#14301f}\n'+
'html[data-theme=dark] .tip{background:#2d2813;border-color:#6b5a14}\n'+
'html[data-theme=dark] .tip b{color:#ffd43b}\n'+
'html[data-theme=dark] .warn{background:#331d1d;border-color:#6e2a2a}\n'+
'html[data-theme=dark] .warn b{color:#ff8787}\n'+
'html[data-theme=dark] b.hl{background:#4a3d0e;color:#ffe066}\n'+
'html[data-theme=dark] .badge{background:#12352c;color:#38d9a9}\n'+
'html[data-theme=dark] .hero .badge{background:#15273d;color:#5c9ded}\n'+
'html[data-theme=dark] .hero p,html[data-theme=dark] .tile p{color:#aeb9c6}\n'+
'html[data-theme=dark] .tile .tag{background:#1e2833;color:#aeb9c6}\n'+
'html[data-theme=dark] .tile .tag.new{background:#12352c;color:#38d9a9}\n'+
'html[data-theme=dark] .tile .tag.print{background:#3a2a14;color:#ffa94d}\n'+
'html[data-theme=dark] .tile .tag.hot{background:#3d1c28;color:#f783ac}\n'+
'html[data-theme=dark] a.tile:hover{border-color:#3a4959;box-shadow:0 8px 22px rgba(0,0,0,.5)}\n'+
'html[data-theme=dark] .sep{background:#333e4c}\n'+
'html[data-theme=dark] footer{color:#7f8a97}';
 document.head.appendChild(st);
}

/* ---------- 切换按钮（所有页面，含 A4） ---------- */
var bst=document.createElement('style');
bst.textContent=
'#themeToggle{position:fixed;top:14px;right:14px;z-index:9999;width:40px;height:40px;'+
'border-radius:50%;border:1px solid rgba(128,140,155,.5);background:rgba(255,255,255,.9);'+
'color:#33404e;cursor:pointer;font-size:19px;line-height:1;display:flex;align-items:center;'+
'justify-content:center;padding:0;box-shadow:0 2px 8px rgba(16,24,40,.18);font-family:inherit;'+
'transition:transform .12s}\n'+
'#themeToggle:hover{transform:scale(1.08)}\n'+
'html[data-theme=dark] #themeToggle{background:rgba(22,29,38,.9);color:#e9eef5;'+
'border-color:rgba(143,153,168,.45)}\n'+
'@media print{#themeToggle{display:none!important}}';
document.head.appendChild(bst);

var btn=document.createElement('button');
btn.id='themeToggle';btn.type='button';
btn.setAttribute('aria-label','切换亮色/暗色主题');
document.body.appendChild(btn);

function icon(){
 var dark=html.dataset.theme==='dark';
 btn.textContent=dark?'☀':'☾';
 btn.title=dark?'切换到亮色主题':'切换到暗色主题';
}
btn.addEventListener('click',function(){
 var next=html.dataset.theme==='dark'?'light':'dark';
 html.dataset.theme=next;
 try{localStorage.setItem(KEY,next);}catch(e){}
 icon();
 if(!isA4)retint();
});

/* ---------- SVG 重着色：亮↔暗颜色映射 ---------- */
var MAP={
 '#212529':'#e9eef5',  /* 深墨文字/轴线 → 亮色 */
 '#495057':'#b6c0cc',  /* 次级文字 → 浅灰蓝 */
 '#868e96':'#8f99a8',  /* 弱化文字 */
 '#adb5bd':'#77828f',  /* 参考虚线抛物线 */
 '#fff'   :'#1c232d'   /* 点的白色描边/填充 → 深底色 */
};
var RMAP={};
Object.keys(MAP).forEach(function(k){RMAP[MAP[k]]=k;});

function retint(){
 var dark=html.dataset.theme==='dark';
 var m=dark?MAP:RMAP;
 /* fill：按“当前值”查映射表（正反映射互为逆运算） */
 document.querySelectorAll('svg [fill]').forEach(function(e){
  if(e.dataset.defFilled)return; /* 默认黑字文本由下方逻辑单独处理 */
  var v=e.getAttribute('fill');
  if(v&&m[v]!==undefined)e.setAttribute('fill',m[v]);
 });
 /* 无 fill 的文本默认黑色：暗色补亮色；切回亮色时还原为默认（移除属性） */
 document.querySelectorAll('svg text').forEach(function(e){
  if(dark){
   if(!e.dataset.defFilled&&!e.getAttribute('fill')){
    e.dataset.defFilled='1';
    e.setAttribute('fill','#e9eef5');
   }
  }else if(e.dataset.defFilled){
   e.removeAttribute('fill');
   delete e.dataset.defFilled;
  }
 });
 /* stroke：同样按当前值映射 */
 document.querySelectorAll('svg [stroke]').forEach(function(e){
  var v=e.getAttribute('stroke');
  if(v&&m[v]!==undefined)e.setAttribute('stroke',m[v]);
 });
}

/* ---------- 初始状态 ---------- */
icon();
if(!isA4&&html.dataset.theme==='dark')retint();

/* 未手动选择时，跟随系统主题实时变化 */
if(window.matchMedia){
 var stored=null;
 try{stored=localStorage.getItem(KEY);}catch(e){}
 var mq=window.matchMedia('(prefers-color-scheme: dark)');
 if(!stored&&mq.addEventListener){
  mq.addEventListener('change',function(e){
   html.dataset.theme=e.matches?'dark':'light';
   icon();
   if(!isA4)retint();
  });
 }
}
})();
