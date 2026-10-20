import { MEMBER_NAMES } from './presence-model.js';
import { avatar } from './room-game.js';
const sceneIndex={comida:2,escuela:2,hogar:2,familia:0,oracion:0,sueno:3,trabajo:5};
export function familySummary(state){
 const today=(state.blocks||[]).filter(b=>b.day===state.todayDayName).sort((a,b)=>a.startTime.localeCompare(b.startTime));
 const registered=b=>(b.for||[]).filter(id=>state.checks?.[b.id]?.includes(id));
 const complete=b=>b.for?.length>0&&registered(b).length===b.for.length;
 const shared=today.filter(b=>b.for?.length>1),next=shared.find(b=>!complete(b))||today.find(b=>!complete(b));
 const history=today.filter(b=>registered(b).length).map(b=>({block:b,members:registered(b),complete:complete(b)}));
 const counts={};let days=0;
 for(const [date,marks] of Object.entries(state.weekChecks||{})){if(date>=state.todayISO)continue;let any=false;for(const b of state.blocks||[]){if(b.for?.length>1&&Array.isArray(marks[b.id])&&marks[b.id].length){counts[b.type]=(counts[b.type]||0)+1;any=true;}}if(any)days++;}
 const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
 const suggestion=days>=2&&top?`En ${days} días con registros, ${top[1]} momentos compartidos fueron de ${({comida:'comida',familia:'tiempo en familia',escuela:'aprendizaje',hogar:'cuidado del hogar',sueno:'descanso',oracion:'oración',trabajo:'trabajo'})[top[0]]||top[0]}. ¿Les gustaría reservar otro momento parecido?`:next?`La agenda propone «${next.title}». ¿Qué necesita cada uno para compartirlo a gusto?`:'Podrían elegir juntos un momento sencillo para hoy. ¿Qué les gustaría compartir?';
 return {today,shared,next,history,done:today.filter(complete).length,registered,suggestion,evidence:days>=2&&top?'Basado en registros anteriores disponibles':'Propuesta basada en la agenda; todavía no hay suficiente historial para identificar una rutina'};
}
export function mountFamilyHome({root,getState}){
 root.className='family-home';root.innerHTML='<div class="home-panorama"><div class="home-panorama-art"></div><div class="home-daylight"></div><div class="home-caption"><span>NUESTRO HOGAR, JUNTOS</span><h3 class="home-moment-title"></h3><p class="home-moment-context"></p></div><div class="home-crew"></div><div class="home-bubble" role="status"></div></div><p class="home-illustration-note">Los avatares representan el momento familiar. La escena no detecta ubicaciones físicas.</p><div class="home-family-status"></div><div class="home-story"><section><h3>Lo que hemos vivido hoy</h3><p class="home-story-note">Participaciones registradas · orden de la agenda</p><ol class="home-timeline"></ol></section><section class="home-suggestion"><span>UNA IDEA PARA USTEDES</span><h3>El hogar encuentra su ritmo</h3><p class="suggestion-copy"></p><small class="suggestion-evidence"></small></section></div>';
 const crew=root.querySelector('.home-crew'),actors={};Object.entries(MEMBER_NAMES).forEach(([id,name],i)=>{const el=document.createElement('div');el.className='home-avatar';el.dataset.member=id;el.style.setProperty('--index',i);el.innerHTML=avatar(id,{mode:'3d'});const label=document.createElement('span');label.textContent=name;el.append(label);crew.append(el);actors[id]=el;});
 let previous=null;
 function render(){const s=getState(),summary=familySummary(s),moment=s.familyMoment?.date===s.todayISO&&s.blocks?.some(b=>b.id===s.familyMoment.blockId)?s.familyMoment:null,block=s.blocks?.find(b=>b.id===moment?.blockId)||summary.next;
 const index=sceneIndex[block?.type]??0;root.querySelector('.home-panorama-art').style.backgroundPosition=`${index%3*50}% ${Math.floor(index/3)*100}%`;
 root.querySelector('.home-moment-title').textContent=block?.title||'La casa está lista para su próximo momento';
 root.querySelector('.home-moment-context').textContent=moment&&block?`${MEMBER_NAMES[moment.startedBy]||'La familia'} propuso comenzar · ${block.for.map(id=>MEMBER_NAMES[id]).join(', ')}`:block?`Próximo momento propuesto · ${block.startTime} · ${block.for.map(id=>MEMBER_NAMES[id]).join(', ')}`:'Conversen con House Mapp para elegir qué sigue.';
 const key=moment?moment.blockId+moment.startedAt:'proposal';if(previous!==null&&key!==previous){root.classList.add('home-gathering');setTimeout(()=>root.classList.remove('home-gathering'),2400);}previous=key;
 Object.entries(actors).forEach(([id,el])=>{el.classList.toggle('home-participating',!!block?.for.includes(id));el.classList.toggle('home-done',!!(block&&summary.registered(block).includes(id)));});
 const roster=root.querySelector('.home-family-status');roster.replaceChildren();Object.entries(MEMBER_NAMES).forEach(([id,name])=>{const p=document.createElement('p');const status=block?.for.includes(id)?summary.registered(block).includes(id)?'Participación registrada':moment?'Invitado al momento compartido':'En la propuesta de hoy':'Con su propio ritmo';p.textContent=`${name} · ${status}`;roster.append(p);});
 const list=root.querySelector('.home-timeline');list.replaceChildren();if(!summary.history.length){const li=document.createElement('li');li.textContent='La historia de hoy comienza cuando nos cuenten su primer momento.';list.append(li);}for(const item of summary.history){const li=document.createElement('li'),title=document.createElement('strong'),detail=document.createElement('span');title.textContent=item.block.title;detail.textContent=`${item.members.map(id=>MEMBER_NAMES[id]).join(', ')} · ${item.complete?'momento completo':'participación registrada'}`;li.append(title,detail);list.append(li);}
 root.querySelector('.suggestion-copy').textContent=summary.suggestion;root.querySelector('.suggestion-evidence').textContent=summary.evidence;
 }
 window.addEventListener('house:state-updated',render);window.addEventListener('house:activity-complete',e=>{const bubble=root.querySelector('.home-bubble');bubble.textContent=`¡Un recuerdo más! ${e.detail.title}`;root.classList.add('home-celebrating');setTimeout(()=>{root.classList.remove('home-celebrating');bubble.textContent='';},5500);render();});window.addEventListener('house:signed-out',()=>{previous=null;render();});render();return render;
}
