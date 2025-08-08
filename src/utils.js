export const cities = [{ id:'even-yehuda', name:'Even Yehuda', refund:0.30 }];

export const destinations = [
  { id:'wbais', name:'WBAIS', description:'School philanthropy', city:'even-yehuda', logo:'' },
];

export const windows = [
  { id:'w1', city:'even-yehuda', start:'2025-08-10T09:00:00+03:00', end:'2025-08-10T11:00:00+03:00' },
  { id:'w2', city:'even-yehuda', start:'2025-08-12T18:00:00+03:00', end:'2025-08-12T20:00:00+03:00' },
  { id:'w3', city:'even-yehuda', start:'2025-08-15T08:00:00+03:00', end:'2025-08-15T10:00:00+03:00' },
];

export function fmtRange(startISO, endISO){
  const s = new Date(startISO), e = new Date(endISO);
  return s.toLocaleString([], { dateStyle:'medium', timeStyle:'short' }) + ' – ' + e.toLocaleTimeString([], { timeStyle:'short' });
}

export function uid(){ return Math.random().toString(36).slice(2); }

export function identifyBottle(fileName=''){
  const name = (fileName||'').toLowerCase();
  if(name.includes('milk') || name.includes('carton')) return { eligible:false, reason:'Milk/dairy containers are excluded.' };
  if(name.includes('can')) return { eligible:false, reason:'Metal cans are not accepted in v1.' };
  if(name.includes('glass')) return { eligible:true, reason:'Glass beverage bottle 100 ml–5 L (deposit-marked).' };
  if(name.includes('plastic') || name.includes('water') || name.includes('cola') || name.includes('sprite')) return { eligible:true, reason:'Plastic beverage bottle 100 ml–5 L (deposit-marked).' };
  return { eligible:true, reason:'If deposit-marked and 100 ml–5 L, it is eligible.' };
}