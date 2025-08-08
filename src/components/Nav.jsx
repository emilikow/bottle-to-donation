import React from 'react'
import { Recycle, CalendarDays, MapPin, Camera, Trophy, Settings } from 'lucide-react'

export default function Nav({active, setActive}){
  const items = [
    ['home','Home', <Recycle key='i' size={16}/>],
    ['windows','Collection Windows', <CalendarDays key='i' size={16}/>],
    ['destinations','Destinations', <MapPin key='i' size={16}/>],
    ['accepted','Accepted Bottles', <Camera key='i' size={16}/>],
    ['reference','Bottle Reference', <Camera key='i' size={16}/>],
    ['impact','My Impact', <Trophy key='i' size={16}/>],
    ['leaderboard','Leaderboard', <Trophy key='i' size={16}/>],
    ['admin','Admin', <Settings key='i' size={16}/>],
  ]
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="container mx-auto flex items-center gap-3 px-6 py-4">
        <div className="text-lg font-extrabold tracking-tight">
          Bottle<span className="text-green-400">•</span>Donation <span className="badge ml-2">Beta</span>
        </div>
        <nav className="ml-auto flex flex-wrap gap-2">
          {items.map(([key,label,icon])=>(
            <button
              key={key}
              className={`btn ${active===key? 'btn-primary':''}`}
              onClick={()=>setActive(key)}
              title={label}
            >
              {icon}{label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}