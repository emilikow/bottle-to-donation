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

  function notify(msg){ setToast(msg); setTimeout(()=>setToast(null), 2800) }
  function confirmWindow(w){ setConfirmed(p=>({...p,[w.id]:true})); setRuns(r=>r+1); setStreak(s=>s+1); notify('Pickup confirmed. You’re on a streak!') }
  function cancelWindow(w){ setConfirmed(p=>({...p,[w.id]:false})); setStreak(0); notify('Pickup canceled. Streak reset.') }

  const upcoming = useMemo(()=> windows.filter(w=> w.city===city), [city])

  return (
    <div>
      <Nav active={active} setActive={setActive} />
      <main className="container" style={{paddingTop:20}}>
        {active==='home' && <Home city={city} setCity={setCity} profile={profile} setActive={setActive} />}
        {active==='windows' && <Windows upcoming={upcoming} confirmed={confirmed} onConfirm={confirmWindow} onCancel={cancelWindow} />}
        {active==='destinations' && <Destinations list={destinations.filter(d=>d.city===city)} profile={profile} setProfile={setProfile} />}
        {active==='accepted' && <Accepted />}
        {active==='reference' && <Reference recentIDs={recentIDs} setRecentIDs={setRecentIDs} />}
        {active==='impact' && <Impact runs={runs} streak={streak} profile={profile} />}
        {active==='leaderboard' && <Leaderboard />}
        {active==='admin' && <Admin upcoming={upcoming} />}
      </main>
      <div className={'toast ' + (toast?'show':'')}>{toast}</div>
    </div>
  )
}

function Home({city, setCity, profile, setActive}){
  return (
    <div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
      <section className="card" style={{gridColumn:'span 8'}}>
        <h2>Welcome</h2>
        <p className="muted">City:</p>
        <select value={city} onChange={e=>setCity(e.target.value)}>
          {cities.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{height:10}} />
        <div className="kpi">
          <div className="stat"><div className="num">₪0.30</div><div className="muted">Per bottle (city setting)</div></div>
          <div className="stat"><div className="num">2 hrs</div><div className="muted">Pickup window</div></div>
          <div className="stat"><div className="num">Even Split</div><div className="muted">Across chosen destinations</div></div>
        </div>
        <div style={{height:12}} />
        <button className="btn primary" onClick={()=>setActive('windows')}>See Collection Times</button>
      </section>
      <section className="card" style={{gridColumn:'span 4'}}>
        <h3>Profile Snapshot</h3>
        <div className="muted">Display Name</div>
        <div>{profile.displayName} <span className="badge">anonymous ok</span></div>
        <div className="muted" style={{marginTop:6}}>Address</div>
        <div>{profile.address}</div>
        <div className="muted" style={{marginTop:6}}>Preferred Destination</div>
        <div>WBAIS</div>
        <div className="hint" style={{marginTop:12}}>Real address required for pickup; containers are not returned.</div>
      </section>
    </div>
  )
}

function Windows({upcoming, confirmed, onConfirm, onCancel}){
  return (
    <section className="card">
      <h2>Collection Windows</h2>
      <div className="list">
        {upcoming.map(w => (
          <div className="row" key={w.id}>
            <div className="left">
              <div className="pill">{new Date(w.start).toLocaleDateString()}</div>
              <div>{fmtRange(w.start, w.end)}</div>
            </div>
            <div>
              {confirmed[w.id] ? (
                <button className="btn" onClick={()=>onCancel(w)}>Cancel</button>
              ) : (
                <button className="btn primary" onClick={()=>onConfirm(w)}>Confirm Pickup</button>
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
      <h2>Destinations</h2>
      <div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
        {list.map(d => (
          <div className="card" key={d.id} style={{gridColumn:'span 6'}}>
            <h3>{d.name}</h3>
            <p className="muted">{d.description}</p>
            <button className="btn" onClick={()=>setProfile({...profile, destination:d.id})}>
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
      <h2>What Bottles We Collect</h2>
      <p>We collect refundable beverage bottles covered by Israel’s Deposit Law. Each eligible bottle is worth ₪0.30 when returned. Place them outside in any container before your pickup window starts. Containers will not be returned.</p>
      <div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
        <div className="card" style={{gridColumn:'span 6'}}>
          <h3>Accepted</h3>
          <ul>
            <li>Plastic beverage bottles (deposit-marked, 100 ml – 5 L)</li>
            <li>Glass beverage bottles (deposit-marked, 100 ml – 5 L)</li>
          </ul>
        </div>
        <div className="card" style={{gridColumn:'span 6'}}>
          <h3>Not Accepted (v1)</h3>
          <ul>
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
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)

  function onFakeIdentify(){
    const out = identifyBottle(fileName)
    setResult(out)
    const item = { id:uid(), name:fileName||'unknown.jpg', eligible:out.eligible, reason:out.reason, ts:new Date().toISOString() }
    setRecentIDs(prev => [item, ...prev].slice(0, 12))
  }

  return (
    <section className="card">
      <h2>Bottle Reference</h2>
      <p className="muted">Official guidance: Israel Ministry of Environmental Protection — beverage containers deposit (link available when deployed).</p>
      <div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
        <div className="card" style={{gridColumn:'span 7'}}>
          <h3>Tap-to-Identify</h3>
          <label className="label">Upload or type a filename to simulate</label>
          <input className="input" placeholder="e.g., plastic_water_1-5L.jpg" value={fileName} onChange={e=>setFileName(e.target.value)} />
          <div style={{height:10}} />
          <button className="btn primary" onClick={onFakeIdentify}>Snap / Upload</button>
          {result && (
            <div className="card" style={{marginTop:12, borderColor: result.eligible ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}}>
              <div className="pill" style={{borderColor: result.eligible ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'}}>
                {result.eligible ? '✅ Eligible' : '❌ Not Eligible'}
              </div>
              <div style={{marginTop:8}}>{result.reason}</div>
              <div className="hint" style={{marginTop:6}}>Photos used for identification only, not stored.</div>
            </div>
          )}
        </div>
        <div className="card" style={{gridColumn:'span 5'}}>
          <h3>Recent Identifications (48h)</h3>
          <div className="list">
            {recentIDs.length===0 && <div className="muted">No recent items yet.</div>}
            {recentIDs.map(it => (
              <div className="row" key={it.id}>
                <div className="left">
                  <div className="pill">{it.eligible? '✅':'❌'}</div>
                  <div>{it.name}</div>
                </div>
                <div className="muted" title={it.reason} style={{maxWidth:220, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Impact({runs, streak}){
  const badges = []
  if(runs>=1) badges.push('First Run')
  if(streak>=3) badges.push('Streak 3')
  if(runs>=3) badges.push('Monthly Regular (example)')
  return (
    <section className="card">
      <h2>My Impact</h2>
      <div className="kpi">
        <div className="stat"><div className="num">{runs}</div><div className="muted">Runs participated</div></div>
        <div className="stat"><div className="num">{streak}</div><div className="muted">Current streak</div></div>
        <div className="stat"><div className="num">1</div><div className="muted">Destinations supported</div></div>
      </div>
      <div style={{height:12}} />
      <h3>Badges</h3>
      <div className="tabs">
        {badges.length? badges.map(b => <div className="tab active" key={b}>{b}</div>) : <div className="muted">No badges yet — confirm a pickup to get your first!</div>}
      </div>
      <div className="hint">Display name can be anonymous; real address is required for pickup logistics.</div>
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
      <h2>City Leaderboard</h2>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Display Name</th><th>Runs</th><th>Streak</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{background: r.me? 'rgba(96,165,250,0.08)' : 'transparent'}}>
              <td>{i+1}</td>
              <td>{r.name}{r.me && ' (you)'}</td>
              <td>{r.runs}</td>
              <td>{r.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="hint" style={{marginTop:8}}>Ranking = runs participated; tiebreakers: current streak, earliest confirmation.</div>
    </section>
  )
}

function Admin({upcoming}){
  return (
    <section className="card">
      <h2>Admin (Demo)</h2>
      <p className="muted">This is a non-authenticated demo. In production, gate with auth.</p>
      <h3>Upcoming Windows ({upcoming.length})</h3>
      <ul>
        {upcoming.map(u => <li key={u.id}>{new Date(u.start).toLocaleDateString()} — {new Date(u.start).toLocaleTimeString([], {timeStyle:'short'})} to {new Date(u.end).toLocaleTimeString([], {timeStyle:'short'})}</li>)}
      </ul>
      <div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)', marginTop:12}}>
        <div className="card" style={{gridColumn:'span 6'}}>
          <h3>Hidden Award System (Back-End Hook)</h3>
          <ul className="muted">
            <li>Close Month → snapshot leaderboard (server-side)</li>
            <li>Winner selection: runs, streak, earliest confirmation</li>
            <li>Override winner with reason (admin)</li>
            <li>Log award: type/code/status (hidden until prizes_enabled=true)</li>
          </ul>
        </div>
        <div className="card" style={{gridColumn:'span 6'}}>
          <h3>Run Summary (Window-Level Totals)</h3>
          <p className="muted">Record total bottles / ₪ for a window, upload receipts, and publish public summary. No per-household counts.</p>
        </div>
      </div>
    </section>
  )
}