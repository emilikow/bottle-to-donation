import React from 'react'

export default function Nav({active, setActive}){
  const items = [
    ['home','Home'],
    ['windows','Collection Windows'],
    ['destinations','Destinations'],
    ['accepted','Accepted Bottles'],
    ['reference','Bottle Reference'],
    ['impact','My Impact'],
    ['leaderboard','Leaderboard'],
    ['admin','Admin'],
  ];
  return (
    <header>
      <div className="bar container">
        <div className="brand">Bottle<span className="dot">•</span>Donation <span className="badge">MVP</span></div>
        <nav>
          {items.map(([key,label])=> (
            <button key={key} className={'btn ' + (active===key? 'primary':'ghost')} onClick={()=>setActive(key)}>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}