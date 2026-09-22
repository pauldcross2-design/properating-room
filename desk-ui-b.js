function viewLab(){
  const selected=STATE.lab.map(playerByLast).filter(Boolean);
  const games=[...new Set(selected.map(p=>p.game))];
  const moons=selected.filter(p=>p.flag==="MOON");
  const pivots=selected.filter(p=>p.flag==="PIVOT");
  const combo=comboImplied(selected.map(p=>p.payoff));
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Ticket Lab</h3>
    <p class="lede">Sandbox only. Nothing here publishes to the Parlay Card while the hold is on. Add names from Consensus, then read price, correlation, and process flags before you would ever write a ticket.</p>
    <div class="toolbar">
      <select id="labAdd"><option value="">Add a name…</option>${PLAYERS.map(p=>`<option value="${p.last}">${p.last} · ${p.game} · ${p.payoff}</option>`).join("")}</select>
      <button class="tab" id="labClear">Clear lab</button>
      <button class="tab" id="labCopy">Copy legs</button>
    </div>
    <div class="grid g2">
      <div class="card">
        <div class="chip chip-gold">${selected.length} LEG${selected.length===1?"":"S"}</div>
        ${selected.length?selected.map(p=>`<div style="padding:8px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:8px">
          <div>${logo(p.team)}${nameBtn(p)} ${flagChip(p.flag)} <span class="muted">${p.game}</span></div>
          <div>${p.payoff} · ${fmtPct(implied(p.payoff))} <button class="linkish" data-unlab="${p.last}">remove</button></div>
        </div>`).join(""):`<div class="empty">Empty lab</div>`}
      </div>
      <div class="card">
        <p class="why">Independent combo implied (naive, no correlation): <b style="color:var(--goldhi)">${fmtPct(combo)}</b></p>
        <p class="why">Naive American: <b style="color:var(--goldhi)">${amerFromProb(combo)}</b></p>
        <p class="why">Games touched: ${games.length?games.join(" · "):"—"}</p>
        <p class="${games.length===1&&selected.length>1?"warn":"ok"}">${games.length===1&&selected.length>1?"Same-game stack. Legal later. Price the correlation; do not treat legs as independent.":"Cross-game or single. Independence assumption is less violent."}</p>
        <p class="${moons.length?"warn":"ok"}">${moons.length?("Moon legs: "+moons.map(p=>p.last).join(", ")+" — do not grade."):"No moon legs."}</p>
        <p class="${pivots.length?"warn":"ok"}">${pivots.length?("Pivot legs: "+pivots.map(p=>p.last).join(", ")+" — not dashed locks."):"No pivot legs."}</p>
        <p class="warn">Hold is on. Lab output is not a ticket.</p>
      </div>
    </div>
  </section>`;
}
function viewCappers(){
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Season-to-date cappers</h3>
    <p class="lede">Weights start equal. 9 AM snapshot — nobody has a hit yet. Grade typed locks after first pitch, not moons, pivots, or dump sheets. Hit = that batter homered that slate.</p>
    <table><thead><tr><th>Handle</th><th>Status</th><th>When</th><th>Today</th><th>How we credit</th><th>Wt</th></tr></thead>
    <tbody>${HANDLES.map(h=>`<tr>
      <td>@${h.handle}</td>
      <td><span class="chip ${h.status==="landed"?"chip-pine":h.status==="waiting"?"chip-amber":"chip-mute"}">${h.status}</span></td>
      <td>${h.when}</td><td>${h.today}</td><td>${h.credit}</td><td>${h.weight}</td>
    </tr>`).join("")}</tbody></table>
  </section>`;
}
function viewData(){
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Data tray + house rules</h3>
    <p class="lede">9:00 AM CT rewind. Slate and probables are in. Lineups are not. Drop Venom, typed Kasper 3/game, and the SP Home Runs Model page to lift the hold. Zero A+ after that page posts is a legal lift.</p>
    <div class="grid g2">
      <div class="card"><div class="chip chip-amber">WAITING</div><p class="why">venom.csv · kasper.csv · sp_hr.csv</p></div>
      <div class="card"><div class="chip chip-pine">PULLED</div><p class="why">StatsAPI 824787 / 824221 / 823169 · Payoff 6:40 · Barry 6:53 · HRK overnight · Kasper video 2:50</p></div>
    </div>
    <ul class="check" style="margin-top:12px">${RULES.map(r=>`<li>${r}</li>`).join("")}</ul>
    <p class="muted">Watchlist is local to this browser. Persist key 9am-hold-v2 so later slates cannot leak in.</p>
  </section>`;
}
function viewMLB(){
  return {consensus:viewConsensus,matchups:viewMatchups,games:viewGames,parlay:viewParlay,lab:viewLab,cappers:viewCappers,data:viewData}[STATE.tab]();
}
function viewOther(){
  if(STATE.sport==="nba") return `<section class="block"><h3 style="margin:0 0 8px;color:var(--goldhi)">Prop Desk</h3><p class="lede">No NBA games Monday 9/21. Preseason opens October. WNBA tape is parked off this desk. Do not backfill summer names onto a blank Monday.</p></section>`;
  if(STATE.sport==="nfl"&&STATE.tab==="week3") return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Week 3 slate</h3>
    <p class="lede">W3 is not open at 9 AM Monday. Look-ahead only. Do not spend BUF / DET / DEN / BAL / LAR without a written reason. TNF is ATL @ GB.</p>
    <div class="grid g2">
      <div class="card"><div class="chip chip-gold">SAVE LIST</div><p class="why">BUF · DET · DEN · BAL · LAR. Cody W2 future-value lived in the 90s on those clubs. Spending one on a Thursday look-ahead is a path error.</p></div>
      <div class="card"><div class="chip chip-amber">TNF LOOK-AHEAD</div><p class="why">ATL @ GB. Circa should not go 100% GB the minute the window opens. Wait for the actual board, not the leftover chalk reflex.</p></div>
    </div>
  </section>`;
  if(STATE.sport==="nfl") return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Monday Night</h3>
    <p class="lede">9 AM CT. Giants (1-0) at Rams (0-1), 8:15 ET, SoFi, ESPN/ABC. Morning market band LAR -6.5 to -7, total 47.5–48. Puka replacement is the injury question. No laser until a sheet lands.</p>
    <div class="grid g3">
      <div class="card"><img src="${NFL("nyg")}" width="28" alt=""> <strong>Giants</strong><p class="why">Road MNF after a short week is the fade case, not a lock. 1-0 can still be a dog for a reason.</p></div>
      <div class="card"><img src="${NFL("lar")}" width="28" alt=""> <strong>Rams</strong><p class="why">Home get-right after Australia. Number sits -6.5 / -7. Not a laser yet.</p></div>
      <div class="card">
        <div class="chip chip-gold">MARKET MATH</div>
        <p class="why">-6.5 favorite is roughly a 70–72% moneyline equivalent before juice. -7 is the key number; crossing it is a different ticket than sitting on -6.5.</p>
        <p class="why">Total 47.5–48 is a copy band, not a play. Wait for the injury answer on Puka before writing a receiver prop.</p>
        <p class="warn">Laser tab stays empty. No model-vs-market sheet at 9 AM.</p>
      </div>
    </div>
  </section>`;
  if(STATE.tab==="chalk") return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Chalk</h3>
    <p class="lede">Sunday already happened before this clock. Splash W2 wrecking ball was TB 29.3%. SF cashed. W3 is not open.</p>
    <table><thead><tr><th>Week</th><th>Public split</th><th>Result</th></tr></thead>
    <tbody>
      <tr><td>W2 Yahoo</td><td>SF / TB ~33% each</td><td>TB dead · SF cashed</td></tr>
      <tr><td>W2 Atlas / Circa proj</td><td>TB 31 · SF 28 · BAL 10 · PHI 8 · LAC 6 · NE 5</td><td>Projection, not a pick board</td></tr>
      <tr><td>W2 Splash</td><td>TB 29.3%</td><td>~48.6% of that field gone</td></tr>
    </tbody></table>
  </section>`;
  if(STATE.tab==="path") return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Path</h3>
    <p class="lede">Log burns from Sunday. Do not post a W3 pick board at 9 AM Monday. Future-value is a constraint list, not a Wednesday lock.</p>
    <table><thead><tr><th>Team</th><th>Cody FV (0–100)</th><th>Read</th></tr></thead>
    <tbody>
      <tr><td>BUF</td><td>100</td><td>Do not spend without a written reason</td></tr>
      <tr><td>DET</td><td>98</td><td>Same</td></tr>
      <tr><td>DEN</td><td>96</td><td>Same</td></tr>
      <tr><td>BAL</td><td>94</td><td>Same</td></tr>
      <tr><td>LAR</td><td>93</td><td>Same — and they play tonight</td></tr>
      <tr><td>SF</td><td>83</td><td>Already used by a lot of the field</td></tr>
      <tr><td>LAC</td><td>27</td><td>Replaceable</td></tr>
      <tr><td>TB</td><td>22</td><td>Burned on Splash</td></tr>
    </tbody></table>
  </section>`;
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Survivor Board</h3>
    <p class="lede">9 AM Monday. Sunday is in the book (TB dead, SF cashed). MNF still tonight. W3 is not open.</p>
    <div class="grid g3">
      <div class="card"><div class="chip chip-brick">W2 DEATH</div><h3>Buccaneers</h3><p class="why">29.3% of Splash. Cody FV on TB was 22. That is the wrecking-ball case study, not a new pick.</p></div>
      <div class="card"><div class="chip chip-pine">W2 CASH</div><h3>49ers</h3><p class="why">Public co-chalk that actually won. Path cost: SF is now off those tickets.</p></div>
      <div class="card"><div class="chip chip-amber">W3 CLOSED</div><h3>Not open yet</h3><p class="why">TNF ATL @ GB is look-ahead only. Do not post GB as a 100% Circa reflex.</p></div>
    </div>
  </section>`;
}
function openPlayer(last){
  const p=PLAYERS.find(x=>x.last===last); if(!p) return;
  const watched=STATE.watch.includes(p.last);
  playerModal.innerHTML=`<div class="player-card">
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
      <div><h2>${logo(p.team)}${p.player}</h2><p class="sub">${p.team} · ${p.game} · lineups unposted</p></div>
      <button class="xbtn" data-close="1">✕</button>
    </header>
    <div class="chips" style="margin:12px 0">
      <span class="chip chip-gold">SRC ${p.src}</span>
      ${flagChip(p.flag)}
      <span class="chip chip-amber">HOLD</span>
      <span class="chip chip-mute">${p.role}</span>
    </div>
    <table><tbody>
      <tr><td>Sources</td><td>${p.sources.join(" · ")}</td></tr>
      <tr><td>Payoff</td><td>${p.payoff}${p.payoffTag?" · "+p.payoffTag:""}</td></tr>
      <tr><td>Implied HR</td><td>${fmtPct(implied(p.payoff))} <span class="muted">naive from American, no juice strip</span></td></tr>
      <tr><td>Barry</td><td>${p.barry}</td></tr>
      <tr><td>Venom</td><td>Waiting · not posted by 9 AM</td></tr>
      <tr><td>Kasper</td><td>Video only · ranks not typed</td></tr>
      <tr><td>A+</td><td>0</td></tr>
      <tr><td>Lineup</td><td>Unposted · not a SIT call</td></tr>
    </tbody></table>
    ${gateDots()}
    <p class="why">${p.note}</p>
    <div class="toolbar" style="margin-top:12px">
      <button class="tab" data-watch="${p.last}">${watched?"Remove watch":"Watch"}</button>
      <button class="tab" data-lab="${p.last}">Add to lab</button>
    </div>
  </div>`;
  playerModal.classList.remove("hidden");
}
function bindMain(){
  document.querySelectorAll("[data-player]").forEach(btn=>btn.onclick=e=>{e.preventDefault();openPlayer(btn.dataset.player)});
  document.querySelectorAll("[data-lab]").forEach(btn=>btn.onclick=()=>{const last=btn.dataset.lab;if(!STATE.lab.includes(last)) STATE.lab.push(last);STATE.tab="lab"; draw()});
  document.querySelectorAll("[data-unlab]").forEach(btn=>btn.onclick=()=>{STATE.lab=STATE.lab.filter(x=>x!==btn.dataset.unlab); draw(false)});
  document.querySelectorAll("[data-watch]").forEach(btn=>btn.onclick=()=>{const last=btn.dataset.watch;STATE.watch=STATE.watch.includes(last)?STATE.watch.filter(x=>x!==last):STATE.watch.concat(last);saveWatch(); openPlayer(last)});
  const labAdd=document.getElementById("labAdd");
  if(labAdd) labAdd.onchange=()=>{if(labAdd.value&&!STATE.lab.includes(labAdd.value)){STATE.lab.push(labAdd.value);draw(false)}};
  const labClear=document.getElementById("labClear");
  if(labClear) labClear.onclick=()=>{STATE.lab=[];draw(false)};
  const labCopy=document.getElementById("labCopy");
  if(labCopy) labCopy.onclick=()=>{const text=STATE.lab.join(" / ");if(navigator.clipboard) navigator.clipboard.writeText(text);labCopy.textContent="Copied"};
  bindToolbar();
}
function draw(updateHash=true){
  renderSports(); renderTabs();
  kpis.innerHTML=STATE.sport==="mlb"?kpisMLB():"";
  kpis.style.display=STATE.sport==="mlb"?"":"none";
  banner.innerHTML = STATE.sport==="mlb"
    ? `<div><p><strong>Morning hold · 9:00 AM CT.</strong> Three games, zero first pitches, lineups unposted, Venom unposted, 0 A+. Consensus stays dark.</p>
        <p class="why" style="margin-top:6px">Landed: Payoff 6:40 AM · Barry 6:53 AM · HRK overnight dump · Kasper video. Overlap on tape only: Eldridge and Basallo.</p></div>
       <div class="chips"><span class="chip chip-amber">HOLD</span><span class="chip chip-pine">3 landed sheets</span><span class="chip chip-gold">0 A+</span><span class="chip chip-mute">lineups unposted</span></div>`
    : `<div><p>Same 9:00 AM CT rewind. MLB hold does not change the other desks. Do not write a W3 survivor card or an NBA ticket on a dark Monday.</p></div>`;
  main.innerHTML=STATE.sport==="mlb"?viewMLB():viewOther();
  bindMain();
  if(updateHash) location.hash=`${STATE.sport}/${STATE.tab}`;
}
sports.onclick=e=>{const b=e.target.closest("[data-sport]");if(!b)return;STATE.sport=b.dataset.sport;STATE.tab=TABS[STATE.sport][0][0];STATE.q="";draw()};
tabs.onclick=e=>{const b=e.target.closest("[data-tab]");if(!b)return;STATE.tab=b.dataset.tab;draw()};
playerModal.onclick=e=>{if(e.target===playerModal||e.target.dataset.close)playerModal.classList.add("hidden")};
document.onkeydown=e=>{
  if(e.key==="Escape") playerModal.classList.add("hidden");
  if(e.key==="/" && document.activeElement.tagName!=="INPUT"){e.preventDefault();const q=document.getElementById("q"); if(q) q.focus()}
};
(function boot(){
  const h=(location.hash||"").replace("#","").split("/");
  if(TABS[h[0]]) {STATE.sport=h[0]; if(TABS[h[0]].some(t=>t[0]===h[1])) STATE.tab=h[1]}
  draw(false);
})();
