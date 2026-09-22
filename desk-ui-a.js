function viewConsensus(){
  const rows=filtered();
  const overlap=PLAYERS.filter(p=>p.src>=2);
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Common Names Consensus</h3>
    <p class="lede">HOLD. No Venom chip. No Kasper #1/#2. No SP A+. Two-source tape is Eldridge and Basallo — that is overlap, not a gold-row. Filter the morning tape; do not promote it.</p>
    <div class="chips" style="margin-bottom:12px">
      <span class="chip chip-amber">HOLD</span>
      <span class="chip chip-gold">0 A+</span>
      <span class="chip chip-mute">lineups unposted</span>
      <span class="chip chip-pine">2-src tape Eldridge · Basallo</span>
      <span class="chip chip-brick">moons ungraded</span>
    </div>
    ${toolbar()}
    <table>
      <thead><tr><th>Hitter</th><th>Game</th><th>Src</th><th>Sources</th><th>Price</th><th>Impl.</th><th>Barry</th><th>Flag</th><th></th></tr></thead>
      <tbody>${rows.map(p=>`<tr>
        <td>${logo(p.team)}${nameBtn(p)} <span class="muted">${p.team}</span></td>
        <td>${p.game}</td>
        <td><span class="heat ${heat(p.src)}">${p.src}</span></td>
        <td>${p.sources.join(" · ")}</td>
        <td>${p.payoff}${p.payoffTag?` <span class="muted">${p.payoffTag}</span>`:""}</td>
        <td>${fmtPct(implied(p.payoff))}</td>
        <td>${p.barry}</td>
        <td>${flagChip(p.flag)}</td>
        <td><button class="tab" data-lab="${p.last}">+ lab</button></td>
      </tr>`).join("")}</tbody>
    </table>
  </section>
  <div class="grid g2" style="margin-top:12px">
    <section class="block">
      <h3 style="margin:0 0 8px;color:var(--goldhi)">What the overlap is</h3>
      ${overlap.map(p=>`<p class="why">${logo(p.team)}${nameBtn(p)} · ${p.sources.join(" + ")} · ${p.flag} · ${p.payoff}</p>`).join("")}
      <p class="lede" style="margin-top:10px">Two handles on a name before lineups and before Venom is a research flag, not a ticket.</p>
    </section>
    <section class="block">
      <h3 style="margin:0 0 8px;color:var(--goldhi)">Lift-hold checklist</h3>
      <ul class="check">
        <li class="ok">StatsAPI slate in — TOR@BAL / WSH@DET / MIN@SF</li>
        <li class="ok">Payoff sheet 6:40 AM CT</li>
        <li class="ok">Barry juice 6:53 AM CT</li>
        <li class="wait">Venom Homer / Viper / Edge</li>
        <li class="wait">Kasper 3/game typed</li>
        <li class="wait">SportsPredict Home Runs Model page (0 A+ would lift)</li>
        <li class="no">Official 1–9s — unposted</li>
      </ul>
    </section>
  </div>`;
}
function viewMatchups(){
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Matchups · environment first</h3>
    <p class="lede">Morning slate only. Lineups unposted. Kasper 3/game not typed. Pitcher scores from later kHR stay parked. Read the park tax before the name.</p>
    <div class="grid g3">${GAMES.map(g=>{
      const pool=PLAYERS.filter(p=>p.game===g.game);
      const shortest=pool.filter(p=>implied(p.payoff)).sort((a,b)=>implied(b.payoff)-implied(a.payoff))[0];
      return `<div class="card">
        <div class="chips"><span class="chip chip-mute">${g.et}</span><span class="chip chip-brick">HR Wx ${g.hrwx}</span></div>
        <h3 style="margin:8px 0">${logo(g.away)}${g.away} @ ${logo(g.home)}${g.home}</h3>
        <div class="sub">${g.park}</div>
        <p class="why">${g.wx}</p>
        <p class="why">${g.sp}</p>
        <p class="why">Total: ${g.ou}</p>
        <p class="why">${g.note}</p>
        <p class="why">Shortest typed price: ${shortest?nameBtn(shortest)+" "+shortest.payoff+" ("+fmtPct(implied(shortest.payoff))+")":"—"}</p>
        <div class="muted" style="margin-top:8px">${pool.length} names on tape</div>
      </div>`;
    }).join("")}</div>
    ${gateDots()}
  </section>`;
}
function viewGames(){
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Game Board</h3>
    <p class="lede">Unstarted only. TOP 2 stays empty until the hold lifts. House rule after lift: at least two real names per game, ranked if more clear the bar. Tape under each card is Payoff/Barry only.</p>
    <div class="grid g3">${GAMES.map(g=>{
      const pool=PLAYERS.filter(p=>p.game===g.game).sort((a,b)=>b.src-a.src||a.last.localeCompare(b.last));
      return `<div class="card">
        <span class="chip chip-amber">HOLD</span> <span class="chip chip-mute">lineups unposted</span>
        <h3 style="margin:8px 0">${logo(g.away)}${g.away} @ ${logo(g.home)}${g.home}</h3>
        <div class="sub">${g.et} · ${g.sp}</div>
        <div class="empty">TOP 2 empty · hold</div>
        <div class="sub">Morning tape</div>
        ${pool.map(p=>`<div style="padding:7px 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:8px;align-items:center">
          <div>${logo(p.team)}${nameBtn(p)} <span class="muted">${p.sources.join(" · ")}</span></div>
          <div>${flagChip(p.flag)}</div>
        </div>`).join("")}
      </div>`;
    }).join("")}</div>
  </section>`;
}
function viewParlay(){
  const rows=[["5 STRAIGHTS",5,5],["3 TWO-LEG",3,2],["3 THREE-LEG",3,3],["3 FOUR-LEG",3,4],["2 FIVE-LEG",2,5]];
  return `<section class="block">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Parlay Card</h3>
    <p class="lede">Grid stays drawn. Tickets stay empty. Hold is on. Payoff pairings sit on the rail as tape, not composed tickets. Same-game stacks will be legal after lift — they are not legal to publish this morning.</p>
    <div class="grid g2">${rows.map(([t,n,legs])=>`<div class="card"><div class="chip chip-mute">${t}</div><div class="empty">${n} tickets × ${legs} name${legs>1?"s":""} · empty on purpose</div></div>`).join("")}</div>
  </section>
  <section class="block" style="margin-top:12px">
    <h3 style="margin:0 0 8px;color:var(--goldhi)">Payoff pairings · tape</h3>
    <table><thead><tr><th>Label</th><th>Price</th><th>Impl. combo</th><th>Legs</th><th>Note</th></tr></thead>
    <tbody>${PAIRS.map(x=>{
      const odds=x.legs.map(l=>(playerByLast(l)||{}).payoff);
      return `<tr><td>${x.label}</td><td>${x.price}</td><td>${fmtPct(comboImplied(odds))}</td><td>${x.legs.map(l=>nameBtn(playerByLast(l)||{last:l})).join(" · ")}</td><td class="why" style="margin:0">${x.note}</td></tr>`;
    }).join("")}</tbody></table>
    <p class="lede" style="margin-top:10px">HRK dump tape (not tickets): ${HRK.join(" · ")}</p>
  </section>`;
}
