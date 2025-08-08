import React, { useMemo, useState } from 'react'
import Nav from './components/Nav.jsx'
import { cities, destinations, windows, fmtRange, identifyBottle, uid } from './utils.js'

export default function App(){
  const [active, setActive] = useState('home')
  const [city, setCity] = useState(cities[0].id)
  const [profile, setProfile] = useState({
    displayName:'RecyclingFan42',
    address:'123 Herzl St, Even Yehuda',
    contact:'WhatsApp',
    destination: destinations[0].id
  })
  const [confirmed, setConfirmed] = useState({})
  const [toast, setToast] = useState(null)
  const [streak, setStreak] = useState(0)
  const [runs, setRuns] = useState(0)
  const [recentIDs, setRecentIDs] = useState([])

  function notify(msg){ setToast(msg); setTimeout(()=>setToast(null), 2400) }
  function confirmWindow(w){ setConfirmed(p=>({...p,[w.id]:true})); setRuns(r=>r+1); setStreak(s=>s+1); notify('Pickup confirmed. You’re on a streak!') }
  function cancelWindow(w){ setConfirmed(p=>({...p,[w.id]:false})); setStreak(0); notify('Pickup canceled. Streak reset.') }

  const upcoming = useMemo(()=> windows.filter(w=> w.city===city), [city])

  return (
    <div>
      <Nav active={active} setActive={setActive} />
      <main className="container mx-auto px-6 py-6">
        {active==='home' && <Home city={city} setCity={setCity} profile={profile} setActive={setActive} />}
        {active==='windows' && <Windows upcoming={upcoming} confirmed={confirmed} onConfirm={confirmWindow} onCancel={cancelWindow} />}
        {active==='destinations' && <Destinations list={destinations.filter(d=>d.city===city)} profile={profile} setProfile={setProfile} />}
        {active==='accepted' && <Accepted />}
        {active==='reference' && <Reference recentIDs={recentIDs} setRecentIDs={setRecentIDs} />}
        {active==='impact' && <Impact runs={runs} streak={streak} />}
        {active==='leaderboard' && <Leaderboard />}
        {active==='admin' && <Admin upcoming={upcoming} />}
      </main>
      <div className={`fixed bottom-4 right-4 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 ${toast?'':'hidden'}`}>{toast}</div>
    </div>
  )
}

function Home({city, setCity, profile, setActive}){
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="hero col-span-12">
        <h1 className="text-3xl font-extrabold">Turn bottles into donations</h1>
        <p className="mt-1 text-slate-400">Even Yehuda pilot • 2‑hour pickup windows • ₪0.30 per bottle • Even split across your chosen destinations</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={()=>setActive('windows')}>See Collection Times</button>
          <button className="btn" onClick={()=>setActive('destinations')}>Choose My Destination</button>
        </div>
      </section>

      <section className="card col-span-12 lg:col-span-8">
        <h2 className="text-xl font-semibold">City & Settings</h2>
        <label className="mt-2 block text-sm text-slate-400">Your City</label>
        <select className="input" value={city} onChange={e=>setCity(e.target.value)}>
          {cities.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="kpi mt-3">
          <div className="stat"><div className="num">₪0.30</div><div className="text-slate-400">Per bottle (city)</div></div>
          <div className="stat"><div className="num">2 hrs</div><div className="text-slate-400">Pickup window</div></div>
          <div className="stat"><div className="num">Even Split</div><div className="text-slate-400">Across chosen destinations</div></div>
        </div>
      </section>

      <section className="card col-span-12 lg:col-span-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="text-slate-400 mt-1">Display Name</div>
        <div>{profile.displayName} <span className="badge ml-1">anonymous ok</span></div>
        <div className="text-slate-400 mt-2">Address</div>
        <div>{profile.address}</div>
        <div className="text-slate-400 mt-2">Preferred Destination</div>
        <div>WBAIS</div>
        <div className="text-slate-400 text-sm mt-3">Real address required for pickup; containers are not returned.</div>
      </section>
    </div>
  )
}

function Windows({upcoming, confirmed, onConfirm, onCancel}){
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">Collection Windows</h2>
      <div className="mt-3 flex flex-col gap-2">
        {upcoming.map(w => (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2" key={w.id}>
            <div className="flex items-center gap-3">
              <div className="pill">{new Date(w.start).toLocaleDateString()}</div>
              <div>{fmtRange(w.start, w.end)}</div>
            </div>
            <div>
              {confirmed[w.id] ? (
                <button className="btn" onClick={()=>onCancel(w)}>Cancel</button>
              ) : (
                <button className="btn btn-primary" onClick={()=>onConfirm(w)}>Confirm Pickup</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Destinations({list, profile, setProfile}){
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">Destinations</h2>
      <div className="mt-3 grid grid-cols-12 gap-3">
        {list.map(d => (
          <div className="card col-span-12 md:col-span-6" key={d.id}>
            <h3 className="text-lg font-semibold">{d.name}</h3>
            <p className="text-slate-400">{d.description}</p>
            <button className={`btn mt-2 ${profile.destination===d.id?'btn-primary':''}`} onClick={()=>setProfile({...profile, destination:d.id})}>
              {profile.destination===d.id? 'Selected' : 'Select as my destination'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function Accepted(){
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">What Bottles We Collect</h2>
      <p className="text-slate-300">We collect refundable beverage bottles covered by Israel’s Deposit Law. Each eligible bottle is worth ₪0.30 when returned. Place them outside in any container before your pickup window starts. Containers will not be returned.</p>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="card col-span-12 md:col-span-6">
          <h3 className="font-semibold">Accepted</h3>
          <ul className="list-disc pl-6">
            <li>Plastic beverage bottles (deposit-marked, 100 ml – 5 L)</li>
            <li>Glass beverage bottles (deposit-marked, 100 ml – 5 L)</li>
          </ul>
        </div>
        <div className="card col-span-12 md:col-span-6">
          <h3 className="font-semibold">Not Accepted (v1)</h3>
          <ul className="list-disc pl-6">
            <li>Metal cans</li>
            <li>Milk/dairy beverage containers</li>
            <li>Cartons, pouches, bags</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Reference({recentIDs, setRecentIDs}){
  const [fileName, setFileName] = useState(''); const [result, setResult] = useState(null)
  function onFakeIdentify(){
    const out = identifyBottle(fileName); setResult(out)
    const item = { id:uid(), name:fileName||'unknown.jpg', eligible:out.eligible, reason:out.reason, ts:new Date().toISOString() }
    setRecentIDs(prev => [item, ...prev].slice(0, 12))
  }
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">Bottle Reference</h2>
      <p className="text-slate-400">Official guidance: Ministry of Environmental Protection — beverage containers deposit.</p>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="card col-span-12 lg:col-span-7">
          <h3 className="font-semibold">Tap‑to‑Identify</h3>
          <label className="block text-sm text-slate-400">Upload or type a filename to simulate</label>
          <input className="input mt-1" placeholder="e.g., plastic_water_1-5L.jpg" value={fileName} onChange={e=>setFileName(e.target.value)} />
          <button className="btn btn-primary mt-2" onClick={onFakeIdentify}>Snap / Upload</button>
          {result && (
            <div className={`card mt-3 border ${result.eligible? 'border-green-400/40':'border-red-400/40'}`}>
              <div className="pill">{result.eligible? '✅ Eligible' : '❌ Not Eligible'}</div>
              <div className="mt-2">{result.reason}</div>
              <div className="text-slate-400 text-sm mt-1">Photos used for identification only, not stored.</div>
            </div>
          )}
        </div>
        <div className="card col-span-12 lg:col-span-5">
          <h3 className="font-semibold">Recent Identifications (48h)</h3>
          <div className="mt-2 flex flex-col gap-2">
            {recentIDs.length===0 && <div className="text-slate-400">No recent items yet.</div>}
            {recentIDs.map(it => (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2" key={it.id}>
                <div className="flex items-center gap-2">
                  <div className="pill">{it.eligible? '✅':'❌'}</div>
                  <div>{it.name}</div>
                </div>
                <div className="text-slate-400 truncate max-w-[220px]" title={it.reason}>{it.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Impact({runs, streak}){
  const badges = []; if(runs>=1) badges.push('First Run'); if(streak>=3) badges.push('Streak 3'); if(runs>=3) badges.push('Monthly Regular (example)')
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">My Impact</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="card"><div className="text-2xl font-extrabold">{runs}</div><div className="text-slate-400">Runs participated</div></div>
        <div className="card"><div className="text-2xl font-extrabold">{streak}</div><div className="text-slate-400">Current streak</div></div>
        <div className="card"><div className="text-2xl font-extrabold">1</div><div className="text-slate-400">Destinations supported</div></div>
      </div>
      <h3 className="mt-4 font-semibold">Badges</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {badges.length? badges.map(b => <div className="tab tab-active" key={b}>{b}</div>) : <div className="text-slate-400">No badges yet — confirm a pickup to get your first!</div>}
      </div>
    </section>
  )
}

function Leaderboard(){
  const rows = [
    { name:'GreenGuru', runs:7, streak:3, me:false },
    { name:'RecyclingFan42', runs:6, streak:2, me:true },
    { name:'GlassMaster', runs:6, streak:1, me:false },
    { name:'EvenYHero', runs:5, streak:5, me:false },
  ]
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">City Leaderboard</h2>
      <table className="mt-2 w-full text-left">
        <thead className="text-slate-300">
          <tr><th className="py-2">#</th><th>Display Name</th><th>Runs</th><th>Streak</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`${r.me? 'bg-blue-500/10':''}`}>
              <td className="py-2">{i+1}</td>
              <td>{r.name}{r.me && ' (you)'}</td>
              <td>{r.runs}</td>
              <td>{r.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-slate-400 text-sm mt-2">Ranking = runs; tiebreakers: current streak, earliest confirmation.</div>
    </section>
  )
}

function Admin({upcoming}){
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">Admin (Demo)</h2>
      <p className="text-slate-400">This is a non-authenticated demo. In production, gate with auth.</p>
      <h3 className="mt-2 font-semibold">Upcoming Windows ({upcoming.length})</h3>
      <ul className="list-disc pl-6">
        {upcoming.map(u => <li key={u.id}>{new Date(u.start).toLocaleDateString()} — {new Date(u.start).toLocaleTimeString([], {timeStyle:'short'})} to {new Date(u.end).toLocaleTimeString([], {timeStyle:'short'})}</li>)}
      </ul>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="card col-span-12 lg:col-span-6">
          <h3 className="font-semibold">Hidden Award System (Back-End Hook)</h3>
          <ul className="text-slate-400 list-disc pl-6">
            <li>Close Month → snapshot leaderboard (server-side)</li>
            <li>Winner: runs, streak, earliest confirmation</li>
            <li>Override winner with reason (admin)</li>
            <li>Log award: type/code/status (hidden until prizes_enabled=true)</li>
          </ul>
        </div>
        <div className="card col-span-12 lg:col-span-6">
          <h3 className="font-semibold">Run Summary (Window Totals)</h3>
          <p className="text-slate-400">Record total bottles / ₪ for a window, upload receipts, and publish public summary. No per-household counts.</p>
        </div>
      </div>
    </section>
  )
}