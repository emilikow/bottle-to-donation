// App.jsx
import React, { useMemo, useState } from 'react'
import Nav from './components/Nav.jsx'
import { cities, destinations, windows, fmtRange, identifyBottle, uid } from './utils.js'

export default function App(){
  const [active, setActive] = useState('home')
  const [city, setCity] = useState(cities[0].id)
  const [profile, setProfile] = useState({
    displayName:'RecyclingFan42',
    address:'123 Herzl St, Even Yehuda',
    notes:'Blue gate, leave by plant',
    contact:'WhatsApp',
    destination: destinations[0].id
  })
  const [confirmed, setConfirmed] = useState({})
  const [toast, setToast] = useState(null)
  const [streak, setStreak] = useState(0)
  const [runs, setRuns] = useState(0)
  const [recentIDs, setRecentIDs] = useState([])
  const [prizesEnabled] = useState(false)

  function notify(msg){ setToast(msg); setTimeout(()=>setToast(null), 2800) }

  function confirmWindow(w){
    setConfirmed(prev => ({...prev, [w.id]: true}))
    setRuns(r => r+1)
    setStreak(s => s+1)
    notify('Pickup confirmed. You’re on a streak!')
  }
  function cancelWindow(w){
    setConfirmed(prev => ({...prev, [w.id]: false}))
    setStreak(0)
    notify('Pickup canceled. Streak reset.')
  }

  const upcoming = useMemo(()=> windows.filter(w=> w.city===city), [city])

  return (
    <div>
      <Nav active={active} setActive={setActive} />
      <main className="container" style={{paddingTop:20}}>
        {/* pages */}
      </main>
      <div className={'toast ' + (toast?'show':'')}>{toast}</div>
    </div>
  )
}
