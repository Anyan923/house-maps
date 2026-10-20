import { avatarLocation, presenceLabel, MEMBER_NAMES, ROOM_NAMES } from './presence-model.js';
import { mountRoomGame } from './room-game.js';
// Hand-drawn plans translated into a schematic, not a measured floor plan.
const rooms=[
 {id:'living',floor:1,name:'Sala',x:200,y:25,w:330,h:230,tone:'#eadbc4',types:['familia','oracion'],detail:'El ventanal y el detalle azul del techo de su sala.',kind:'sofa'},
 {id:'bath1',floor:1,name:'Baño',x:30,y:265,w:110,h:105,tone:'#dce8e8',types:[],detail:'Baño del primer piso.',kind:'bath'},
 {id:'kitchen',floor:1,name:'Cocina',x:30,y:380,w:170,h:185,tone:'#e5e6da',types:['comida'],detail:'Gabinetes blancos y mesón gris, conectados con el patio.',kind:'kitchen'},
 {id:'guest',floor:1,name:'Huéspedes',x:210,y:375,w:320,h:190,tone:'#efe1c9',types:['sueno'],detail:'Habitación del primer piso para recibir a quienes los visitan.',kind:'bed'},
 {id:'patio',floor:1,name:'Patio · mesa · homeschool',x:30,y:575,w:500,h:155,tone:'#dfe8cf',types:['escuela','comida','hogar'],detail:'Un mismo patio para comer junto a la fuente y aprender en familia. Lavadero a la izquierda; fuente a la derecha.',kind:'patio'},
 {id:'parents',floor:2,name:'Ander y Dama',x:200,y:25,w:330,h:230,tone:'#e5dac8',types:['sueno'],detail:'Dormitorio principal con madera cálida y clóset junto al distribuidor.',kind:'bed'},
 {id:'bath2',floor:2,name:'Baño',x:30,y:265,w:110,h:105,tone:'#dce8e8',types:[],detail:'Baño del segundo piso, junto al distribuidor.',kind:'bath'},
 {id:'jp',floor:2,name:'José Pablo',x:30,y:410,w:190,h:280,tone:'#f1e3bb',types:['familia','sueno'],detail:'Dormitorio de JP, con su clóset. Un rincón para cuentos e imaginación.',kind:'kid'},
 {id:'helena',floor:2,name:'Helena · oficina',x:230,y:375,w:300,h:315,tone:'#e5ddeb',types:['trabajo','sueno'],detail:'Dormitorio de Helena sin clóset y oficina de Ander y Dama: descanso y trabajo en dos rincones.',kind:'office'}
];
const people=[{id:'anderson',name:'Ander',color:'#447c89',room:'living'},{id:'damaris',name:'Dama',color:'#b56879',room:'patio'},{id:'jp',name:'JP',color:'#d7a23c',room:'jp'},{id:'helena',name:'Helena',color:'#a38bb9',room:'helena'}];
const colors=['#447c89','#b56879','#d7a23c','#a38bb9','#467d56','#bf7043'];
function furniture(r){
 const x=r.x+20,y=r.y+46,w=r.w;
 switch(r.kind){
 case 'sofa':return `<rect x="${x}" y="${y}" width="155" height="57" rx="12" fill="#8fa6b4"/><path d="M${x+8} ${y+18}h139M${x+51} ${y+18}v30M${x+103} ${y+18}v30" stroke="#e4eced" fill="none"/><rect x="${x+55}" y="${y+85}" width="125" height="56" rx="25" fill="#c7ab83"/><path d="M${x+20} ${r.y+7}h240" stroke="#8bb6c2" stroke-width="7"/>`;
 case 'bed':case 'kid':return `<rect x="${x+12}" y="${y}" width="${r.kind==='kid'?80:135}" height="112" rx="9" fill="#9d7754"/><rect x="${x+16}" y="${y+5}" width="${r.kind==='kid'?72:127}" height="32" rx="6" fill="#fffaf0"/><rect x="${x+16}" y="${y+42}" width="${r.kind==='kid'?72:127}" height="65" rx="4" fill="${r.kind==='kid'?'#d2ad53':'#9eafa0'}"/>${r.id==='parents'||r.kind==='kid'?`<rect x="${x}" y="${r.y+r.h-32}" width="${w-40}" height="20" rx="3" fill="#ac8059"/>`:''}`;
 case 'bath':return `<rect x="${x-10}" y="${y}" width="36" height="39" rx="4" fill="#fafafa"/><ellipse cx="${x+54}" cy="${y+19}" rx="15" ry="20" fill="#fff"/>`;
 case 'kitchen':return `<rect x="${x-10}" y="${y}" width="42" height="115" rx="4" fill="#fffdf5" stroke="#bac0b7"/><rect x="${x-6}" y="${y+5}" width="34" height="35" rx="3" fill="#727c76"/><circle cx="${x+3}" cy="${y+15}" r="5" fill="#303e36"/><circle cx="${x+19}" cy="${y+29}" r="5" fill="#303e36"/><rect x="${x-5}" y="${y+67}" width="32" height="27" rx="6" fill="#aebebc"/>`;
 case 'patio':return `<rect x="${x-10}" y="${y+14}" width="66" height="45" rx="6" fill="#b9c1b3"/><rect x="${x+127}" y="${y+2}" width="155" height="65" rx="18" fill="#bd9367"/>${[125,175,225].map(a=>`<rect x="${x+a}" y="${y-10}" width="30" height="15" rx="5" fill="#d6b58c"/><rect x="${x+a}" y="${y+64}" width="30" height="15" rx="5" fill="#d6b58c"/>`).join('')}<rect x="${x+155}" y="${y+16}" width="30" height="22" rx="2" fill="#fff5cf"/><ellipse cx="${x+415}" cy="${y+34}" rx="32" ry="30" fill="#a89777"/><ellipse cx="${x+415}" cy="${y+34}" rx="24" ry="21" fill="#8bc2c1"/><circle cx="${x+415}" cy="${y+29}" r="10" fill="#c8e4df"/>`;
 case 'office':return `<rect x="${x}" y="${y}" width="85" height="115" rx="12" fill="#f9f1e4" stroke="#b49b86" stroke-width="5"/>${[15,35,55,75].map(a=>`<path d="M${x+a} ${y}v115" stroke="#cbb6a0" stroke-width="3"/>`).join('')}<rect x="${x+130}" y="${y+115}" width="120" height="55" rx="6" fill="#b88d63"/><rect x="${x+145}" y="${y+123}" width="40" height="25" rx="3" fill="#65868c"/><rect x="${x+195}" y="${y+123}" width="40" height="25" rx="3" fill="#65868c"/><circle cx="${x+158}" cy="${y+189}" r="17" fill="#a1b4a0"/><circle cx="${x+216}" cy="${y+189}" r="17" fill="#a1b4a0"/>`;
 default:return '';
 }
}
export function mountHomeWorld({getState,openActivity,completeActivity,onMove,onSharing}){
 const root=document.getElementById('house-stage');root.classList.add('home-world');
 let floor=1,selected='living',member=getState().memberId||'anderson',prefs={};
 try{prefs=JSON.parse(localStorage.getItem('house-mapp-avatar-style-v1')||'{}');}catch{}
 const styles={};people.forEach(p=>{const s=prefs?.[p.id];styles[p.id]={color:colors.includes(s?.color)?s.color:p.color,hair:['short','long','curl'].includes(s?.hair)?s.hair:'short',mode:s?.mode==='drawn'?'drawn':'3d'};});
 root.innerHTML=`<div class="home-live-layout"><div class="live-scene-column"><div class="floor-switch" aria-label="Pisos"><button type="button" data-floor="1">Primer piso</button><button type="button" data-floor="2">Segundo piso</button></div><p class="move-instruction"></p><div class="room-shortcuts"></div><div class="room-game"></div><div class="room-detail"></div></div><aside class="presence-map" aria-label="Plano y presencia familiar"><h3>¿Dónde estamos?</h3><p class="presence-status" role="status"></p><div class="live-plans"></div><div class="presence-roster"></div><details class="connection-controls"><summary>Celulares y sincronización</summary><p class="presence-legend">Ubicaciones indicadas en la app. El plano no detecta la posición física.</p><button type="button" class="sharing-toggle"></button><button type="button" class="room-checkin">Estoy en esta habitación</button><button type="button" class="copy-home-link">Conectar otro celular</button><p class="connection-feedback" role="status"></p></details></aside></div><section id="family-voice" aria-label="Asistente de voz familiar"></section><details class="avatar-settings"><summary>Personalizar personajes</summary><p>Personajes inspirados en las fotos de Ander, Dama, JP y Helena. El estilo se guarda en este dispositivo.</p><label>Integrante <select id="world-member">${people.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Estilo <select id="world-mode"><option value="3d">Familia Vilvel 3D</option><option value="drawn">Dibujado editable</option></select></label><label>Ropa (dibujado) <select id="world-color">${colors.map((c,i)=>`<option value="${c}">${['Azul','Rosa','Mostaza','Lavanda','Verde','Terracota'][i]}</option>`).join('')}</select></label><label>Cabello (dibujado) <select id="world-hair"><option value="short">Corto</option><option value="long">Largo</option><option value="curl">Rizado</option></select></label><p role="status" class="avatar-feedback"></p></details>`;
 const feedback=root.querySelector('.connection-feedback');
 const roomGame=mountRoomGame({root:root.querySelector('.room-game'),getStyles:()=>styles,getState,completeActivity,onMove,getActiveMember:()=>member,onSelectMember:chooseMember,selectRoom:id=>navigate(id,true)});
 const selector=root.querySelector('#world-member'),color=root.querySelector('#world-color'),hair=root.querySelector('#world-hair'),mode=root.querySelector('#world-mode');
 function controls(){selector.value=member;color.value=styles[member].color;hair.value=styles[member].hair;mode.value=styles[member].mode;}
 function chooseMember(id){member=id;const loc=avatarLocation(getState(),id);selected=loc.room;floor=rooms.find(r=>r.id===selected).floor;controls();render();}
 function navigate(id,move=false){const target=rooms.find(r=>r.id===id);if(!target)return;selected=id;floor=target.floor;if(move)onMove(member,id,50,82);render();}
 selector.onchange=()=>chooseMember(selector.value);
 function save(){styles[member]={color:color.value,hair:hair.value,mode:mode.value};try{localStorage.setItem('house-mapp-avatar-style-v1',JSON.stringify(styles));root.querySelector('.avatar-feedback').textContent='Estilo guardado.';}catch{root.querySelector('.avatar-feedback').textContent='Estilo conservado durante esta visita.';}render();}
 color.onchange=save;hair.onchange=save;mode.onchange=save;
 root.querySelector('.sharing-toggle').onclick=async()=>{await onSharing(!getState().sharePresence);render();};
 root.querySelector('.room-checkin').onclick=()=>{const id=getState().memberId;if(!id)return;member=id;onMove(id,selected,50,82,'room-link');render();};
 root.querySelector('.copy-home-link').onclick=async()=>{const url=location.origin+'/?room='+selected;try{await navigator.clipboard.writeText(url);feedback.textContent='Enlace copiado. Ábrelo en el otro iPhone, entra con su cuenta de Google y activa compartir movimientos.';}catch{feedback.textContent='Abre '+url+' en el otro iPhone, entra con su cuenta y activa compartir movimientos.';}};
 root.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{floor=Number(b.dataset.floor);selected=rooms.find(r=>r.floor===floor).id;render();});
 function mapSVG(level,state){
  const visible=rooms.filter(r=>r.floor===level);
  return `<svg viewBox="0 0 560 755" role="group" aria-label="Plano del piso ${level}"><path d="M140 255H540V375H220V410H140Z" fill="#e5ddce"/><rect x="300" y="270" width="230" height="90" fill="#c3b79f"/>${visible.map(r=>`<g role="button" tabindex="0" aria-label="Enviar ${MEMBER_NAMES[member]} a ${r.name}" data-room="${r.id}" class="map-room"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="5" fill="${r.tone}" stroke="${selected===r.id?'#3a795e':'#9a8971'}" stroke-width="${selected===r.id?6:2}"/><text x="${r.x+10}" y="${r.y+30}" fill="#344838" font-size="22" font-weight="600">${r.name}</text><g aria-hidden="true">${furniture(r)}</g></g>`).join('')}${people.filter(p=>visible.some(r=>r.id===avatarLocation(state,p.id).room)).map(p=>{
   const loc=avatarLocation(state,p.id),r=rooms.find(r=>r.id===loc.room);const x=r.x+r.w*loc.x/100,y=r.y+r.h*(.4+(loc.y-68)/21*.45);
   return `<g class="world-person" data-map-person="${p.id}" transform="translate(${x} ${y})" aria-label="${p.name} en ${r.name}"><circle r="24" fill="${p.color}" stroke="${p.id===member?'#233f31':'white'}" stroke-width="4"/><text text-anchor="middle" y="7" font-size="19" font-weight="700" fill="white">${p.id==='anderson'?'A':p.id==='damaris'?'D':p.id==='jp'?'JP':'H'}</text></g>`;
  }).join('')}</svg>`;
 }
 function render(){
  const state=getState();root.querySelectorAll('[data-floor]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.floor)===floor)));
  root.querySelector('.move-instruction').textContent=`${MEMBER_NAMES[member]} seleccionado · toca su próximo destino. Los demás permanecen en su habitación.`;
  root.querySelector('.room-shortcuts').innerHTML=rooms.filter(r=>r.floor===floor).map(r=>`<button type="button" data-room="${r.id}" aria-pressed="${selected===r.id}">${r.name}</button>`).join('');
  root.querySelector('.live-plans').innerHTML=[1,2].map(level=>`<div class="live-floor"><strong>Piso ${level}</strong>${mapSVG(level,state)}</div>`).join('');
  root.querySelectorAll('[data-room]').forEach(el=>{el.onclick=()=>navigate(el.dataset.room,true);if(el.tagName.toLowerCase()==='g')el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();navigate(el.dataset.room,true);}};});
  const roster=root.querySelector('.presence-roster');roster.replaceChildren();people.forEach(p=>{const loc=avatarLocation(state,p.id);const b=document.createElement('button');b.type='button';b.className='presence-person';b.setAttribute('aria-pressed',String(member===p.id));const strong=document.createElement('strong');strong.textContent=`${p.name} · ${ROOM_NAMES[loc.room]}`;const small=document.createElement('small');small.textContent=presenceLabel(loc);b.append(strong,small);b.onclick=()=>chooseMember(p.id);roster.append(b);});
  const labels={syncing:'Enviando movimientos…',loading:'Conectando el plano familiar…',synced:'Plano familiar actualizado',cache:'Sin conexión confirmada · última información disponible',error:'No se pudo sincronizar el plano'};
  root.querySelector('.presence-status').textContent=labels[state.presenceStatus]||'Modo local';
  root.querySelector('.sharing-toggle').textContent=state.sharePresence?'Pausar compartir movimientos':'Compartir movimientos de este celular';
  root.querySelector('.sharing-toggle').setAttribute('aria-pressed',String(!!state.sharePresence));
  const room=rooms.find(r=>r.id===selected),detail=root.querySelector('.room-detail');detail.replaceChildren();const title=document.createElement('h3');title.textContent=room.name;const desc=document.createElement('p');desc.textContent=room.detail;detail.append(title,desc);
  const label=document.createElement('p');label.textContent='Actividades de hoy para este espacio';detail.append(label);
  const activities=state.blocks.filter(b=>b.day===state.todayDayName&&room.types.includes(b.type));
  if(!activities.length)label.textContent='Sin actividades asociadas hoy. Puedes practicar un juego.';
  activities.forEach(b=>{const btn=document.createElement('button');btn.type='button';btn.textContent=`${b.startTime} · ${b.title} →`;btn.onclick=()=>roomGame.play(b);detail.append(btn);});
  roomGame.update(room);
 }
 render.play=block=>roomGame.play(block);render.selectMember=chooseMember;render.viewRoom=id=>navigate(id,false);
 controls();const linkedRoom=new URLSearchParams(location.search).get('room');if(Object.hasOwn(ROOM_NAMES,linkedRoom)){selected=linkedRoom;floor=rooms.find(r=>r.id===selected).floor;feedback.textContent='Confirma «Estoy en esta habitación» si este es tu lugar actual.';}
 return render;
}
