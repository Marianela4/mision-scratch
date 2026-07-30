const categories=[
 {name:'Movimiento',icon:'↗',color:'#4C97FF'}, {name:'Apariencia',icon:'👁',color:'#9966FF'},
 {name:'Sonido',icon:'♪',color:'#CF63CF'}, {name:'Eventos',icon:'⚑',color:'#FFBF00'},
 {name:'Control',icon:'⟳',color:'#FFAB19'}, {name:'Sensores',icon:'◉',color:'#5CB1D6'},
 {name:'Operadores',icon:'＋',color:'#59C059'}, {name:'Variables',icon:'▣',color:'#FF8C1A'},
 {name:'Mis bloques',icon:'◆',color:'#FF6680'}
];
const colorOptions=[
 {name:'Azul',hex:'#4C97FF'},{name:'Violeta',hex:'#9966FF'},{name:'Fucsia',hex:'#CF63CF'},
 {name:'Amarillo',hex:'#FFBF00'},{name:'Naranja claro',hex:'#FFAB19'},{name:'Celeste',hex:'#5CB1D6'},
 {name:'Verde',hex:'#59C059'},{name:'Naranja',hex:'#FF8C1A'},{name:'Rosado',hex:'#FF6680'}
];
const cases=[
 {title:'El personaje inmóvil',scenario:'El gato debe avanzar diez posiciones cuando comienza la animación. Encuentra el bloque que produce ese desplazamiento.',answer:'Movimiento',hint:'Busca en una categoría relacionada con desplazarse por el escenario.'},
 {title:'Mensaje de bienvenida',scenario:'El personaje debe mostrar el texto “¡Hola!” durante dos segundos. Encuentra el bloque exacto que lo permite.',answer:'Apariencia',hint:'Esta categoría cambia lo que el personaje muestra o cómo se ve.'},
 {title:'Alarma sonora',scenario:'Cuando ocurra una acción, el proyecto debe reproducir el sonido “Miau”. Encuentra el bloque necesario.',answer:'Sonido',hint:'Investiga los bloques que controlan audio y volumen.'},
 {title:'Inicio del sistema',scenario:'Todo el programa debe comenzar al hacer clic en la bandera verde. Localiza el bloque que inicia el guion.',answer:'Eventos',hint:'Busca los bloques que reaccionan a acciones o sucesos.'},
 {title:'Patrulla repetida',scenario:'Una secuencia debe ejecutarse exactamente diez veces. Encuentra el bloque que encierra y repite instrucciones.',answer:'Control',hint:'Esta categoría organiza decisiones, pausas y repeticiones.'},
 {title:'Interrogatorio',scenario:'El programa debe preguntar el nombre del jugador y esperar su respuesta. Encuentra ese bloque.',answer:'Sensores',hint:'Busca bloques que obtienen información del usuario o del entorno.'}
];
const quiz=[
 {name:'girar 15 grados',answer:'Movimiento'}, {name:'siguiente disfraz',answer:'Apariencia'},
 {name:'detener todos los sonidos',answer:'Sonido'}, {name:'cuando se presione una tecla',answer:'Eventos'},
 {name:'si ... entonces',answer:'Control'}, {name:'¿tocando el puntero del ratón?',answer:'Sensores'},
 {name:'unir “Hola” y “mundo”',answer:'Operadores'}, {name:'cambiar puntos por 1',answer:'Variables'}
];
const storageKey='detectiveScratchGameV4';
const state=JSON.parse(localStorage.getItem(storageKey)||'{}');
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const options=()=>'<option value="">Selecciona una categoría</option>'+categories.map(c=>`<option>${c.name}</option>`).join('');
function persist(){ $$('[data-save]').forEach(el=>state[el.dataset.save]=el.value); localStorage.setItem(storageKey,JSON.stringify(state)); updateGame(); }
function restore(){ $$('[data-save]').forEach(el=>{if(state[el.dataset.save]!==undefined)el.value=state[el.dataset.save]}); }
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1900)}

// Mission 1: neutral cards with clickable color palette. The category name is never colored.
const catGrid=$('#categoriesGrid');
categories.forEach((cat,i)=>{
 catGrid.insertAdjacentHTML('beforeend',`<article class="category-card"><h3><span class="category-symbol">${cat.icon}</span>${cat.name}</h3><label>Selecciona su color<div class="color-palette" data-palette="${i}">${colorOptions.map(o=>`<button type="button" class="color-choice" style="background:${o.hex}" title="${o.name}" aria-label="${o.name}" data-color="${o.name}"></button>`).join('')}</div><input type="hidden" data-save="catColor${i}"></label><label>¿Para qué sirve?<textarea data-save="catFunction${i}" placeholder="Explícalo con tus palabras"></textarea></label></article>`);
});
catGrid.addEventListener('click',e=>{const btn=e.target.closest('.color-choice');if(!btn)return;const palette=btn.parentElement;palette.querySelectorAll('.color-choice').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');const input=document.querySelector(`[data-save="catColor${palette.dataset.palette}"]`);input.value=btn.dataset.color;persist();});

// Mission 2
const tabs=$('#caseTabs');cases.forEach((c,i)=>tabs.insertAdjacentHTML('beforeend',`<button class="case-tab ${i===0?'active':''}" data-case="${i}">Caso ${String(i+1).padStart(2,'0')}</button>`));
function renderCase(i){$$('.case-tab').forEach((b,n)=>b.classList.toggle('active',n===i));const c=cases[i];$('#caseView').innerHTML=`<div class="case-top"><div><span class="case-label">EVIDENCIA ${String(i+1).padStart(2,'0')}</span><h3>${c.title}</h3><p class="scenario">${c.scenario}</p><p>🔐 <b>Pista:</b> ${c.hint}</p></div><span class="evidence-icon">🕵️</span></div><div class="case-form"><label>Nombre exacto del bloque<input data-save="caseBlock${i}" placeholder="Investiga y escríbelo"></label><label>Categoría<select data-save="caseCategory${i}">${options()}</select></label><label>¿Qué hace y cómo lo usarías?<textarea data-save="caseExplain${i}" placeholder="Describe la función y da un ejemplo"></textarea></label></div>`;restore();}
tabs.addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b)renderCase(+b.dataset.case)});renderCase(0);

// Mission 3
const quizGrid=$('#quizGrid');quiz.forEach((q,i)=>quizGrid.insertAdjacentHTML('beforeend',`<article class="quiz-card" id="quizCard${i}"><div class="neutral-block">${q.name}</div><select data-save="quiz${i}">${options()}</select></article>`));
$('#checkQuizBtn').addEventListener('click',()=>{persist();let score=0;quiz.forEach((q,i)=>{const card=$(`#quizCard${i}`);card.classList.remove('correct','wrong');if(state[`quiz${i}`]===q.answer){score++;card.classList.add('correct')}else card.classList.add('wrong')});state.quizScore=score;localStorage.setItem(storageKey,JSON.stringify(state));$('#quizResult').textContent=`${score} de ${quiz.length} correctas`;toast(score===quiz.length?'¡Clasificación perfecta! +20 XP':'Revisa las tarjetas marcadas en rojo');updateGame();});

// Mission 4
const custom=$('#customGrid');for(let i=0;i<3;i++)custom.insertAdjacentHTML('beforeend',`<article class="custom-card"><h3>🔍 Hallazgo ${i+1}</h3><label>Nombre del bloque<input data-save="customName${i}" placeholder="Nombre exacto"></label><label>Categoría<select data-save="customCategory${i}">${options()}</select></label><label>¿Para qué sirve?<textarea data-save="customFunction${i}"></textarea></label><label>¿Dónde lo usarías?<textarea data-save="customUse${i}"></textarea></label></article>`);
restore();
// restore selected palette visuals
categories.forEach((_,i)=>{const val=state[`catColor${i}`];if(val)document.querySelector(`[data-palette="${i}"] [data-color="${val}"]`)?.classList.add('selected')});
document.addEventListener('input',e=>{if(e.target.matches('[data-save]'))persist()});document.addEventListener('change',e=>{if(e.target.matches('[data-save]'))persist()});

function groupKeys(){const g={identity:['studentName','studentGroup','codeName'],categories:[],blocks:[],quiz:[],custom:[],reflection:['reflection1','reflection2','reflection3']};categories.forEach((_,i)=>g.categories.push(`catColor${i}`,`catFunction${i}`));cases.forEach((_,i)=>g.blocks.push(`caseBlock${i}`,`caseCategory${i}`,`caseExplain${i}`));quiz.forEach((_,i)=>g.quiz.push(`quiz${i}`));for(let i=0;i<3;i++)g.custom.push(`customName${i}`,`customCategory${i}`,`customFunction${i}`,`customUse${i}`);return g;}
function updateGame(){const groups=groupKeys();let done=0,total=0,complete=0;Object.entries(groups).forEach(([name,keys])=>{const filled=keys.filter(k=>(state[k]||'').trim()).length;done+=filled;total+=keys.length;const ok=filled===keys.length;const section=document.querySelector(`[data-mission="${name}"]`);section?.classList.toggle('complete',ok);if(section)section.querySelector('.mission-chip').textContent=ok?'Completada':'Pendiente';if(ok)complete++;});const pct=Math.round(done/total*100)||0;const xp=Math.min(100,complete*20);$('#progressBar').style.width=pct+'%';$('#progressText').textContent=pct+'%';$('#xpBar').style.width=xp+'%';$('#xpText').textContent=xp+' XP';$('#badgeCount').textContent=complete;$('#levelNumber').textContent=Math.min(5,Math.max(1,complete));$('#caseStatus').textContent=pct===0?'Sin iniciar':pct===100?'Misión completada':'En investigación';const names=['Radar cromático','Analista forense','Clasificador experto','Rastreador digital','Detective Scratch'];$('#badges').innerHTML=names.map((n,i)=>`<span class="badge ${i<complete?'earned':''}">${i<complete?'✓':'🔒'} ${n}</span>`).join('');}

function report(){const g=k=>state[k]||'';let t=`MISIÓN: DESBLOQUEA A SCRATCH\nEXPEDIENTE DEL DETECTIVE DE BLOQUES\n\nNombre: ${g('studentName')}\nGrupo: ${g('studentGroup')}\nNombre clave: ${g('codeName')}\n\n1. RADAR CROMÁTICO\n`;categories.forEach((c,i)=>t+=`\n${c.name}\nColor elegido: ${g('catColor'+i)}\nFunción: ${g('catFunction'+i)}\n`);t+='\n2. ARCHIVO DE EVIDENCIAS\n';cases.forEach((c,i)=>t+=`\n${c.title}\nBloque: ${g('caseBlock'+i)}\nCategoría: ${g('caseCategory'+i)}\nExplicación: ${g('caseExplain'+i)}\n`);t+='\n3. CLASIFICACIÓN\n';quiz.forEach((q,i)=>t+=`${q.name}: ${g('quiz'+i)}\n`);t+=`Puntaje verificado: ${state.quizScore??'sin verificar'} de ${quiz.length}\n\n4. RASTREO LIBRE\n`;for(let i=0;i<3;i++)t+=`\nHallazgo ${i+1}: ${g('customName'+i)}\nCategoría: ${g('customCategory'+i)}\nFunción: ${g('customFunction'+i)}\nUso: ${g('customUse'+i)}\n`;t+=`\n5. INFORME FINAL\n1. ${g('reflection1')}\n2. ${g('reflection2')}\n3. ${g('reflection3')}\n`;return t;}
$('#downloadBtn').addEventListener('click',()=>{persist();const blob=new Blob([report()],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`expediente-scratch-${(state.studentName||'estudiante').trim().replace(/\s+/g,'-').toLowerCase()}.txt`;a.click();URL.revokeObjectURL(a.href);toast('Expediente descargado')});
$('#printBtn').addEventListener('click',()=>window.print());
$('#clearBtn').addEventListener('click',()=>{if(confirm('¿Seguro que deseas borrar todo el progreso?')){localStorage.removeItem(storageKey);location.reload()}});
const dialog=$('#howDialog');$('#howBtn').addEventListener('click',()=>dialog.showModal());$('#closeDialog').addEventListener('click',()=>dialog.close());
if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
updateGame();
