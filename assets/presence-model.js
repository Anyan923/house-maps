export const ROOM_NAMES={living:'Sala',kitchen:'Cocina',patio:'Patio',guest:'Huéspedes',parents:'Ander y Dama',jp:'José Pablo',helena:'Helena y oficina',bath1:'Baño del primer piso',bath2:'Baño del segundo piso'};
export const MEMBER_NAMES={anderson:'Ander',damaris:'Dama',jp:'JP',helena:'Helena'};
export const INITIAL_ROOMS={anderson:'living',damaris:'patio',jp:'jp',helena:'helena'};
export function validPresence(value){
 const out={};
 for(const id of Object.keys(MEMBER_NAMES)){
  const p=value?.[id];
  if(!p || !Object.hasOwn(ROOM_NAMES,p.room) || !Number.isFinite(p.x) || !Number.isFinite(p.y))continue;
  out[id]={room:p.room,x:Math.max(12,Math.min(88,p.x)),y:Math.max(68,Math.min(89,p.y)),source:['manual','voice','room-link'].includes(p.source)?p.source:'manual',updatedAt:typeof p.updatedAt?.toMillis==='function'?p.updatedAt.toMillis():Number.isFinite(p.updatedAt)?p.updatedAt:0,clientMutationId:typeof p.clientMutationId==='string'?p.clientMutationId:'',localOnly:!!p.localOnly,pending:!!p.pending};
 }
 return out;
}
export function mergedPresence(state){return validPresence({...state.remotePresence,...state.localPresence});}
export function avatarLocation(state,id){return mergedPresence(state)[id]||{room:INITIAL_ROOMS[id],x:50,y:82,updatedAt:0,source:'initial',localOnly:true};}
export function presenceLabel(p,now=Date.now()){
 if(!p.updatedAt)return 'Posición inicial de juego';
 if(p.pending)return 'Pendiente de sincronizar';
 if(p.localOnly)return 'Solo este dispositivo';
 const mins=Math.max(0,Math.floor((now-p.updatedAt)/60000));
 return mins<1?'Indicada ahora':mins<60?`Indicada hace ${mins} min`:'Última ubicación indicada · '+new Date(p.updatedAt).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
}
