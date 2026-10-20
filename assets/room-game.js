import { avatarLocation } from './presence-model.js';
const cast=[['anderson','Ander'],['damaris','Dama'],['jp','JP'],['helena','Helena']];
const sceneFor={living:0,kitchen:1,patio:2,parents:3,jp:4,helena:5,guest:3,bath1:1,bath2:1};
const activityRoom={comida:'kitchen',escuela:'patio',hogar:'patio',familia:'living',oracion:'living',iglesia:'living',sueno:'parents',trabajo:'helena',reunion:'helena',caminata:'patio',otro:'living'};
const palettes=['#447c89','#b56879','#d7a23c','#a38bb9'];
function avatar(id,style={}){
 if(style.mode!=='drawn'){
  const bounds={anderson:[[0,0,285,500],[0,500,290,455],[0,955,290,447]],damaris:[[300,0,270,500],[300,500,270,455],[300,955,270,447]],jp:[[595,100,235,400],[595,560,235,395],[595,990,235,412]],helena:[[850,150,272,350],[850,610,272,345],[850,1030,272,372]]}[id];
  return `<svg viewBox="0 0 100 180" aria-hidden="true" class="sprite-character">${bounds.map(([x,y,w,h],i)=>`<svg class="${['sprite-idle','sprite-step-a','sprite-step-b'][i]}" x="0" y="0" width="100" height="180" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMax meet" style="overflow:hidden"><image href="/assets/family-vilvel-v2.png" width="1122" height="1402"/></svg>`).join('')}</svg>`;
 }

 const child=id==='jp',baby=id==='helena',color=style.color||palettes[cast.findIndex(p=>p[0]===id)],hair=style.hair||'short';
 return `<svg viewBox="0 0 100 145" aria-hidden="true"><ellipse cx="50" cy="137" rx="30" ry="6" fill="#1e3029" opacity=".2"/><g class="character-body">${baby?`<ellipse cx="50" cy="100" rx="25" ry="34" fill="${color}"/><path d="M30 90q20 25 40 0M32 110q18 14 36 0" stroke="#fff7" fill="none" stroke-width="4"/>`:`<g class="leg leg-left"><path d="M40 101l-2 28" stroke="#405665" stroke-width="13" stroke-linecap="round"/><path d="M37 131h-9" stroke="#493a32" stroke-width="10" stroke-linecap="round"/></g><g class="leg leg-right"><path d="M60 101l2 28" stroke="#405665" stroke-width="13" stroke-linecap="round"/><path d="M63 131h9" stroke="#493a32" stroke-width="10" stroke-linecap="round"/></g><path d="M29 72l-7 27M71 72l7 27" stroke="#d5a17e" stroke-width="10" stroke-linecap="round"/><path d="M27 76q0-19 23-19t23 19v32H27Z" fill="${color}"/><path d="M46 66h8v25h-8" fill="#fff" opacity=".15"/>`}${hair==='long'?'<path d="M23 34q0-30 27-30t27 30v45H23Z" fill="#513b30"/>':''}<ellipse cx="50" cy="38" rx="${child||baby?25:23}" ry="28" fill="#e4b28b"/><ellipse cx="26" cy="39" rx="5" ry="7" fill="#dba581"/><ellipse cx="74" cy="39" rx="5" ry="7" fill="#dba581"/><path d="M26 32Q20 4 49 5Q80 3 74 30L66 20Q45 29 32 19Z" fill="#513b30"/>${hair==='curl'?'<path d="M27 19q-8-16 8-15q5-12 16-4q14-8 17 6q16 1 6 16" fill="#513b30"/>':''}<ellipse cx="41" cy="38" rx="3" ry="4" fill="#302f2b"/><ellipse cx="59" cy="38" rx="3" ry="4" fill="#302f2b"/><circle cx="42" cy="37" r="1" fill="white"/><circle cx="60" cy="37" r="1" fill="white"/><path d="M44 53q6 5 12 0" stroke="#a45e4c" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="48" rx="5" ry="3" fill="#d98f77" opacity=".5"/><ellipse cx="66" cy="48" rx="5" ry="3" fill="#d98f77" opacity=".5"/></g></svg>`;
}
function button(text,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=fn;return b;}
export function mountRoomGame({root,getStyles,getState,selectRoom,completeActivity,onMove,onSelectMember,getActiveMember}){
 let room=null,active=getActiveMember(),game=null,selectedObject=null,session=0,flipTimer=null;
 const positions=Object.fromEntries(cast.map(([id])=>[id,avatarLocation(getState(),id)]));
 const motionTimers=new Map();
 root.innerHTML=`<div class="scene-top"><div><span class="eyebrow">Dentro de nuestra casa</span><h3 class="scene-title"></h3></div><span class="scene-tag">Escenario ilustrado</span></div><div class="room-scene" tabindex="0" role="group" aria-label="Escenario interactivo. Toca el suelo para mover el personaje; también puedes usar las flechas."><div class="scene-art"></div><div class="scene-light"></div><div class="scene-cast"></div><div class="scene-spark" aria-hidden="true">✦</div></div><div class="cast-picker" aria-label="Personaje activo"></div><p class="scene-help">Elige un personaje y luego su destino en el plano. Solo se mueve ese personaje. Toca el suelo para caminar dentro de su habitación. En teclado, usa las flechas. Helena se desplaza en su cunita de juego.</p><div class="game-panel" aria-live="polite"></div><p class="game-status" role="status"></p>`;
 const stage=root.querySelector('.room-scene'),layer=root.querySelector('.scene-cast'),panel=root.querySelector('.game-panel'),status=root.querySelector('.game-status');
 cast.forEach(([id,name])=>{
 const el=document.createElement('div');el.className='scene-person '+(id==='jp'?'is-child':id==='helena'?'is-baby':'');el.dataset.actor=id;el.innerHTML=`${avatar(id,getStyles()[id])}<span>${name}</span>`;layer.append(el);
 root.querySelector('.cast-picker').append(button(name,()=>{active=id;onSelectMember(id);paintSelection();},'cast-choice'));
 el.addEventListener('transitionend',()=>el.classList.remove('walking'));
 });
 function paintSelection(){root.querySelectorAll('.cast-choice').forEach((b,i)=>b.setAttribute('aria-pressed',String(cast[i][0]===active)));layer.querySelectorAll('[data-actor]').forEach(el=>el.classList.toggle('is-active',el.dataset.actor===active));}
 function move(x,y){
  const id=active;if(!room)return;
  const previous=avatarLocation(getState(),id);
  if(previous.room!==room.id){status.textContent='Elige un destino en el plano para traer al personaje seleccionado.';return;}
  positions[id]={...previous,x:Math.max(12,Math.min(88,x)),y:Math.max(68,Math.min(89,y))};
  const el=layer.querySelector(`[data-actor="${id}"]`);el.classList.add('walking');position(el);
  clearTimeout(motionTimers.get(id));motionTimers.set(id,setTimeout(()=>el.classList.remove('walking'),1300));
  onMove(id,room.id,positions[id].x,positions[id].y);
 }
 function position(el){const p=positions[el.dataset.actor];el.style.left=p.x+'%';el.style.top=p.y+'%';}
 stage.onclick=e=>{const rect=stage.getBoundingClientRect();move((e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100);};
 stage.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const p=positions[active];move(p.x+(e.key==='ArrowLeft'?-7:e.key==='ArrowRight'?7:0),p.y+(e.key==='ArrowUp'?-5:e.key==='ArrowDown'?5:0));};
 function stop(){session++;clearTimeout(flipTimer);game=null;selectedObject=null;stage.classList.remove('celebrating','night-scene');}
 function heading(title,copy){panel.replaceChildren();const h=document.createElement('h4');h.textContent=title;const p=document.createElement('p');p.textContent=copy;panel.append(h,p);}
 function finish(){
 stage.classList.add('celebrating');heading('¡Un pequeño logro compartido!','El juego prepara el momento. Ahora vivan la actividad fuera de la pantalla.');
 if(!game.block){panel.append(button('Volver a explorar',()=>{stop();idle();}));status.textContent='Práctica terminada. No se registraron actividades ni XP.';return;}
 const b=game.block;const confirm=document.createElement('label');confirm.className='real-confirm';const check=document.createElement('input');check.type='checkbox';confirm.append(check,document.createTextNode('Ya realizamos esta actividad en la vida real.'));panel.append(confirm);
 const save=button('Registrar mi participación',async()=>{if(!check.checked)return;save.disabled=true;const token=session;let result;try{result=await completeActivity(b.id);}catch{result={ok:false,message:'No se pudo guardar. Intenta de nuevo.'};}if(token!==session)return;status.textContent=result.message;if(result.ok){heading('Momento registrado',result.message);panel.append(button('Seguir explorando',()=>{stop();idle();}));}else save.disabled=false;});save.disabled=true;check.onchange=()=>save.disabled=!check.checked;panel.append(save);
 }
 function idle(){heading('La casa cobra vida con ustedes.','Entra en una actividad de hoy o prueba el juego de este espacio.');panel.append(button('Probar un juego aquí',()=>play(null,room.id==='patio'?'escuela':room.id==='kitchen'?'comida':['parents','jp','helena','guest'].includes(room.id)?'sueno':'familia')));}
 function play(block,practiceType){
 stop();const type=block?.type||practiceType||'familia';game={block,type,room:block?(activityRoom[type]||'living'):room.id};status.textContent=block?'Juego vinculado a tu agenda.':'Modo práctica · sin XP ni cambios en la agenda';
 if(block){const target=activityRoom[type]||'living';selectRoom(target);}
 const exit=button('Salir del juego',()=>{stop();status.textContent='Juego cerrado sin registrar cambios.';idle();},'game-exit');
 if(['escuela','familia'].includes(type)){
 heading(block?.title||'Parejas para descubrir','Encuentra las tres parejas. Pueden turnarse para recordar dónde están.');
 const cards=['🌿','☀️','📚','🌿','☀️','📚'];for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
 let opened=[],matched=0,locked=false;const grid=document.createElement('div');grid.className='memory-grid';
 cards.forEach((symbol,i)=>{const card=button('?',()=>{if(locked||card.disabled||opened.some(x=>x.i===i))return;card.textContent=symbol;card.setAttribute('aria-label',symbol);opened.push({i,card,symbol});if(opened.length===2){if(opened[0].symbol===opened[1].symbol){opened.forEach(x=>{x.card.disabled=true;x.card.classList.add('matched');});opened=[];matched++;status.textContent=`${matched} de 3 parejas encontradas`;if(matched===3)finish();}else{locked=true;const token=session;flipTimer=setTimeout(()=>{if(token!==session)return;opened.forEach(x=>{x.card.textContent='?';x.card.setAttribute('aria-label',`Carta ${x.i+1}`);});opened=[];locked=false;},850);}}},'memory-card');card.setAttribute('aria-label',`Carta ${i+1}`);grid.append(card);});panel.append(grid);
 }else if(['comida','hogar'].includes(type)){
 const meal=type==='comida',items=meal?['Plato','Vaso','Cubiertos']:['Libro','Juguete','Ropa'];heading(block?.title||(meal?'Preparemos la mesa':'Cada cosa en su lugar'),'Elige un objeto y después toca su lugar.');
 const tray=document.createElement('div'),slots=document.createElement('div');tray.className=slots.className='object-row';let count=0;
 items.forEach((name,i)=>{const b=button(`${meal?['🍽️','🥛','🥄'][i]:['📚','🧸','👕'][i]} ${name}`,()=>{selectedObject=i;tray.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));},'game-object');tray.append(b);const target=button(meal?`Lugar: ${name}`:['Biblioteca','Canasta','Armario'][i],()=>{if(selectedObject===null){status.textContent='Primero elige un objeto.';return;}if(selectedObject!==i){status.textContent='Ese objeto va en otro lugar. Prueba de nuevo.';return;}b.disabled=true;target.disabled=true;target.textContent='✓ '+name;selectedObject=null;count++;move(30+i*20,82);status.textContent=`${count} de 3 objetos colocados`;if(count===3)finish();},'object-target');slots.append(target);});panel.append(tray,slots);
 }else{
 const sets={sueno:['Guardar los juguetes','Bajar la luz','Elegir un cuento'],oracion:['Dar gracias','Pensar en alguien','Compartir una oración'],iglesia:['Preparar lo necesario','Elegir una gratitud','Salir juntos'],caminata:['Observar una planta','Escuchar un sonido','Encontrar un color'],trabajo:['Elegir una prioridad','Preparar el escritorio','Acordar una pausa'],reunion:['Elegir el tema','Dar un turno a cada uno','Acordar el próximo paso'],otro:['Prepararnos','Compartir el momento','Recordar algo bonito']};
 const steps=sets[type]||sets.otro;let step=0;heading(block?.title||(type==='sueno'?'Un hogar que descansa':'Tres momentos para compartir'),'Sigue la secuencia. Cada paso cambia la escena; el registro de la actividad real es al final.');
 const clue=document.createElement('p');clue.className='step-clue';clue.textContent=`1 de 3 · ${steps[0]}`;panel.append(clue);const actions=document.createElement('div');actions.className='sequence-actions';
 [...steps].reverse().forEach(text=>{const b=button(text,()=>{if(text!==steps[step]){status.textContent=`Primero: ${steps[step]}`;return;}b.disabled=true;b.textContent='✓ '+text;step++;move(25+step*15,82);if(type==='sueno'&&step>=2)stage.classList.add('night-scene');status.textContent=`${step} de 3 pasos`;if(step===3)finish();else clue.textContent=`${step+1} de 3 · ${steps[step]}`;});actions.append(b);});panel.append(actions);
 }
 panel.append(exit);panel.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function update(next){const changed=room?.id!==next.id;if(changed&&game&&game.room!==next.id){stop();status.textContent='Cambiaste de espacio. El juego anterior se cerró sin registrar cambios.';}room=next;root.querySelector('.scene-title').textContent=room.name;const index=sceneFor[room.id]??0;const art=root.querySelector('.scene-art');art.style.backgroundPosition=`${(index%3)*50}% ${Math.floor(index/3)*100}%`;root.querySelector('.scene-tag').textContent=room.id.startsWith('bath')?'Vista interior de referencia':'Inspirado en sus fotos';if(room.id.startsWith('bath')){art.style.backgroundImage='none';art.classList.add('bath-scene');}else{art.style.backgroundImage='';art.classList.remove('bath-scene');}active=getActiveMember();layer.querySelectorAll('[data-actor]').forEach(el=>{
 const id=el.dataset.actor,p=avatarLocation(getState(),id),before=positions[id];el.hidden=p.room!==room.id;
 const styleKey=JSON.stringify(getStyles()[id]);if(el.dataset.styleKey!==styleKey){el.querySelector('svg').outerHTML=avatar(id,getStyles()[id]);el.dataset.styleKey=styleKey;}
 if(!el.hidden&&(before.room!==p.room||before.x!==p.x||before.y!==p.y)){el.classList.add('walking');clearTimeout(motionTimers.get(id));motionTimers.set(id,setTimeout(()=>el.classList.remove('walking'),1300));}
 positions[id]=p;position(el);
 });if(changed&&!game)idle();paintSelection();}
 paintSelection();return {update,play};
}
