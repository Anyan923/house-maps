export const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
export function pendingActivities(s){return (s.blocks||[]).filter(b=>b.day===s.todayDayName&&b.for?.includes(s.memberId)&&!(s.checks?.[b.id]||[]).includes(s.memberId)).sort((a,b)=>a.startTime.localeCompare(b.startTime));}
export function nextActivity(s,exclude){return pendingActivities(s).find(b=>b.id!==exclude);}
const rooms={living:['sala'],kitchen:['cocina'],patio:['patio','comedor','homeschool'],guest:['huespedes'],parents:['habitacion principal'],jp:['cuarto de jp','habitacion de jose pablo'],helena:['oficina','cuarto de helena'],bath1:['bano del primer piso','bano de abajo'],bath2:['bano del segundo piso','bano de arriba']};
export function matchRoom(text){const n=normalize(text);return Object.keys(rooms).find(id=>rooms[id].some(a=>n.includes(a)));}
const ignored=new Set('ya termine terminamos terminado acabamos acabe complete completamos hicimos hice listo lista el la los las de del en a y con un una al hemos he actividad por favor house mapp'.split(' '));
function tokens(text){return normalize(text).split(' ').filter(t=>t.length>2&&!ignored.has(t));}
export function activityMatches(text,list){const n=normalize(text),terms=tokens(text);return list.filter(b=>{const title=normalize(b.title),words=tokens(b.title);return n.includes(title)||words.length&&terms.some(t=>words.includes(t));});}
export function interpret(text,state,activeId=null,choiceIds=[]){
 const n=normalize(text);
 if(/^(pausa|pausar|silencio|deja de escuchar|detener|para de escuchar)$/.test(n))return {kind:'pause'};
 if(/^(deshacer|deshaz el ultimo registro|me equivoque|deshacer ultimo logro)$/.test(n))return {kind:'undo'};
 const message=text.match(/^(?:house mapp[, ]*)?(?:dile|avisa|avisale|envia un mensaje)\s+a\s+(dama|damaris|ander|anderson|todos|la familia)\s+(?:que\s+)?(.+)$/i);
 if(message)return {kind:'message',to:/dama/i.test(message[1])?'damaris':/ander/i.test(message[1])?'anderson':'family',text:message[2].trim().slice(0,500)};
 if(/^(si|confirmar|confirmo|enviar|envialo)$/.test(n))return {kind:'confirm'};
 if(/^(no|cancelar|cancela)$/.test(n))return {kind:'cancel'};
 if(/que sigue|que toca|siguiente actividad|que tenemos|agenda de hoy/.test(n))return {kind:'next'};
 if(/como vamos|nuestro progreso|cuantos logros/.test(n))return {kind:'progress'};
 if(/mensajes|que dijo dama|que dijo ander/.test(n))return {kind:'messages'};
 if(/\b(no|todavia|aun|casi|manana|despues|voy a|vamos a|quiero|podria)\b/.test(n)&&/termin|complet|acab|hice|hicimos|hecho/.test(n))return {kind:'not-done'};
 if(/[¿?]/.test(text)&&/termin|complet|acab|hice|hicimos|hecho/.test(n))return {kind:'chat'};
 if(/estoy en|llegue a/.test(n)&&!n.includes('no estoy'))return {kind:'location',room:matchRoom(n)};
 const list=pendingActivities(state),choices=list.filter(b=>choiceIds.includes(b.id));
 if(choices.length){const ord=['primera','segunda','tercera','cuarta','quinta'];let index=ord.findIndex(w=>n.includes(w));if(/^\d+$/.test(n))index=Number(n)-1;if(index>=0&&choices[index])return {kind:'complete',block:choices[index]};const found=activityMatches(text,choices);if(found.length===1)return {kind:'complete',block:found[0]};}
 if(/\b(termine|terminamos|acabamos|acabe|complete|completamos|ya hice|ya hicimos|listo|ya esta|hemos terminado|he terminado)\b/.test(n)){
 const found=activityMatches(text,list);if(found.length===1)return {kind:'complete',block:found[0]};if(!found.length&&/^(listo|ya esta|termine|ya termine|terminamos)$/.test(n)){const active=list.find(b=>b.id===activeId);if(active)return {kind:'complete',block:active};}return {kind:'choose',blocks:found.length?found:list};}
 if(/empecemos|comencemos|vamos a empezar|iniciemos/.test(n)){const found=activityMatches(text,list);return {kind:'start',block:found.length===1?found[0]:(list.find(b=>b.for.length>1)||nextActivity(state))};}
 return {kind:'chat'};
}
