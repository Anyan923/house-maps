// Presentation adapter: no persistence, authentication or scoring ownership.
export function mountAdventure({ getState, openActivity, openSchedule }) {
  let selectedPhase = null;
  const phases = [{id:'morning',label:'☀ Mañana',start:0,end:12},{id:'afternoon',label:'◒ Tarde',start:12,end:18},{id:'night',label:'☾ Noche',start:18,end:24}];
  const root = document.getElementById('day-adventure');
  root.innerHTML = `<div class="eyebrow">Un día, muchas pequeñas aventuras</div><h2>El siguiente paso, juntos.</h2><div class="day-phases" aria-label="Momentos del día"></div><div class="next-label"></div><h3 class="next-title"></h3><p class="next-copy"></p><button class="adventure-action" type="button"></button><div class="day-progress"><span></span><progress max="100" value="0" aria-label="Actividades compartidas completadas"></progress><p>Cada pequeño paso cuenta. La agenda se adapta a ustedes.</p></div>`;
  const phaseRoot=root.querySelector('.day-phases');
  for(const phase of phases){const button=document.createElement('button');button.type='button';button.textContent=phase.label;button.onclick=()=>{selectedPhase=phase.id;render();};button.dataset.phase=phase.id;phaseRoot.append(button);}
  function render(){
    const {blocks,checks,todayDayName}=getState();
    const hour=Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/Bogota',hour:'numeric',hourCycle:'h23'}).format(new Date()));
    const current=phases.find(p=>hour>=p.start&&hour<p.end);
    const phase=phases.find(p=>p.id===(selectedPhase||current.id));
    const today=blocks.filter(b=>b.day===todayDayName).sort((a,b)=>a.startTime.localeCompare(b.startTime));
    const done=b=>b.for.length>0&&b.for.every(id=>(checks[b.id]||[]).includes(id));
    const choices=today.filter(b=>{const h=Number(b.startTime.split(':')[0]);return h>=phase.start&&h<phase.end;});
    const next=choices.find(b=>!done(b));
    const count=today.filter(done).length;
    phaseRoot.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phase===phase.id)));
    root.querySelector('.next-label').textContent=next?`${next.startTime} · ${next.duration} MIN · EN FAMILIA`:'ESPACIO PARA RESPIRAR';
    root.querySelector('.next-title').textContent=next?next.title:choices.length?'Este capítulo está completo.':'Un momento sin planes.';
    root.querySelector('.next-copy').textContent=next?(next.description||'Compartan este momento a su ritmo. Pueden ver los detalles antes de empezar.'):'Pueden cerrar la app y disfrutar juntos. Su casa los espera cuando vuelvan.';
    const action=root.querySelector('.adventure-action');action.textContent=next?'Explorar esta actividad →':'Organizar nuestro día →';action.onclick=()=>next?openActivity(next.id):openSchedule();
    root.querySelector('.day-progress span').textContent=`${count} de ${today.length} actividades compartidas completadas`;
    root.querySelector('progress').value=today.length?count/today.length*100:0;
    document.getElementById('house-stage').dataset.phase=current.id;
    document.getElementById('world-season').textContent=current.label+' · Bogotá';
    document.getElementById('world-count').textContent=`${count} pequeños pasos hoy`;
  }
  return render;
}
