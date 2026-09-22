(function(){
  if(typeof PLAYERS==="undefined"||typeof APLUS==="undefined") return;
  function rowRank(p){
    const aplus=p.flag==="A+"||p.aplus?0:1;
    const twos=(p.src||0)>=2?0:1;
    const score=-(p.aplus||p.kScore||p.score||0);
    return [aplus,twos,-(p.src||0),score,p.last||""];
  }
  function cmpRank(a,b){
    const A=rowRank(a),B=rowRank(b);
    for(let i=0;i<A.length;i++){ if(A[i]<B[i]) return -1; if(A[i]>B[i]) return 1; }
    return 0;
  }
  viewConsensus=function(){
    const rows=filtered().sort(cmpRank);
    const live=PLAYERS.filter(p=>p.flag!=="PPD"&&p.flag!=="OUT"&&p.flag!=="OVER");
    const val=live.filter(p=>String(p.venom).includes("VALUE"));
    const aplusLive=APLUS.filter(a=>a.game!=="TOR@BAL");
    const twoSrc=PLAYERS.filter(p=>p.src>=2&&p.flag!=="PPD"&&p.flag!=="OUT"&&p.flag!=="OVER");
    return `<section class="block">
      <h3 style="margin:0 0 8px;color:var(--goldhi)">Common Names Consensus</h3>
      <p class="lede">HOLD stays on. A+ HR is pinned at the top so it cannot sink under Kasper heat. Live A+: Hernández, Burger, Muncy, Langeliers. PPD A+ stays tape. Payoff and Barry still out.</p>
      <div class="card" style="margin:0 0 12px">
        <div class="chip chip-gold">A+ HR · LIVE</div>
        <table><thead><tr><th>Hitter</th><th>Game</th><th>Vs</th><th>A+</th><th>Shop</th><th>Sit</th></tr></thead>
        <tbody>${aplusLive.map(a=>`<tr>
          <td>${logo(a.team)}${nameBtn(a)} <span class="muted">${a.team}</span></td>
          <td>${a.game}</td><td class="muted">${a.vs}</td>
          <td><span class="heat h-g">${a.pct}%</span></td>
          <td>${a.shop||"—"} <span class="muted">${a.book||""}</span></td>
          <td>${a.lu||"LIVE"}</td>
        </tr>`).join("")}</tbody></table>
      </div>
      <div class="card" style="margin:0 0 12px">
        <div class="chip chip-pine">TWO-SOURCE</div>
        ${twoSrc.length?`<table><thead><tr><th>Hitter</th><th>Game</th><th>Sources</th><th>Venom</th><th>Kasper</th><th>Flag</th></tr></thead>
        <tbody>${twoSrc.map(p=>`<tr>
          <td>${logo(p.team)}${nameBtn(p)}</td><td>${p.game}</td>
          <td>${(p.sources||[]).join(" + ")}</td><td>${p.venom||"—"}</td>
          <td>${p.kasper?("K"+p.kasper):"—"}</td><td>${flagChip(p.flag)}</td>
        </tr>`).join("")}</tbody></table>`:`<p class="muted">No two-source names after filters.</p>`}
      </div>
      <div class="chips" style="margin-bottom:12px">
        <span class="chip chip-pine">A+ LIVE</span>
        <span class="chip chip-amber">No published ticket</span>
        <span class="chip chip-pine">${live.length} live</span>
        <span class="chip chip-gold">${PLAYERS.filter(p=>p.src>=2).length} two-src</span>
        <span class="chip chip-gold">${val.length} VALUE</span>
        <span class="chip chip-ice">Viper on</span>
      </div>
      ${toolbar()}
      <table><thead><tr><th>Hitter</th><th>Game</th><th>Sit</th><th>Src</th><th>Venom</th><th>Kasper</th><th>A+</th><th>Score</th><th>Price</th><th>Impl.</th><th>Flag</th></tr></thead>
        <tbody>${rows.map(p=>`<tr>
          <td>${logo(p.team)}${nameBtn(p)} <span class="muted">${p.team}</span></td>
          <td>${p.game}</td>
          <td class="muted">${p.sit||"—"}</td>
          <td>${p.src||0}</td>
          <td>${p.venom||"—"}</td>
          <td>${p.kasper?("K"+p.kasper):"—"}</td>
          <td>${p.aplus?`<span class="heat h-g">${p.aplus}%</span>`:"—"}</td>
          <td><span class="heat ${p.score>=75?"h-g":p.score>=70?"h-y":"h-o"}">${p.score}</span></td>
          <td>${price(p)}${p.book?` <span class="muted">${p.book}</span>`:""}${p.edge?` <span class="muted">edge ${p.edge}%</span>`:""}</td>
          <td>${fmtPct(implied(price(p)))}</td>
          <td>${flagChip(p.flag)}</td>
        </tr>`).join("")}</tbody></table>
    </section>
    <div class="grid g2" style="margin-top:12px">
      <section class="block">
        <h3 style="margin:0 0 8px;color:var(--goldhi)">Parked, not credited</h3>
        ${VAULT_PARK.map(p=>`<p class="why">${logo(p.team)}${p.player} · ${p.game} · overall ${p.overall} · ${p.tag} · ${p.payoff}. ${p.note}</p>`).join("")}
      </section>
      <section class="block">
        <h3 style="margin:0 0 8px;color:var(--goldhi)">Lift-hold checklist</h3>
        <ul class="check">
          <li class="ok">StatsAPI slate in — 16 games</li>
          <li class="ok">Official 1–9s on six full games + KC/CHC homes</li>
          <li class="ok">Game Vault Venom Score — Homer 1–20 + VALUE staged</li>
          <li class="wait">Payoff 9/22 sheet</li>
          <li class="wait">Barry 9/22 juice</li>
          <li class="ok">Kasper 15 cards typed — rank 1 credited</li>
          <li class="ok">SportsPredict Home Runs Model page — 4 live A+ HR</li>
        </ul>
      </section>
    </div>`;
  };
  openPlayer=function(last){
    const p=allNames().find(x=>x.last===last||x.player===last);
    if(!p) return;
    const watched=STATE.watch.includes(p.last);
    playerModal.innerHTML=`<div class="player-card">
      <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div><h2>${logo(p.team)}${p.player}</h2><p class="sub">${p.team} · ${p.game}${p.spot?" · "+p.spot+" "+p.pos:""}</p></div>
        <button class="xbtn" data-close="1">✕</button>
      </header>
      <div class="chips" style="margin:12px 0">
        <span class="chip chip-gold">SRC ${p.src||0}</span>
        ${flagChip(p.flag)}
        <span class="chip chip-amber">HOLD</span>
      </div>
      <table><tbody>
        <tr><td>Sources</td><td>${(p.sources||[]).join(" · ")||"—"}</td></tr>
        <tr><td>Sit</td><td>${p.sit||"—"}</td></tr>
        <tr><td>Venom</td><td>${p.venom||"—"}</td></tr>
        <tr><td>Viper</td><td>${p.viper||"—"}</td></tr>
        <tr><td>Kasper</td><td>${p.kasper?("K"+p.kasper+" · "+(p.kScore||p.score)):"—"}</td></tr>
        <tr><td>A+</td><td>${p.aplus?(p.aplus+"% vs "+(p.vs||"")):"—"}</td></tr>
        <tr><td>Shop / payoff</td><td>${price(p)}${p.book?" · "+p.book:""}${p.edge!=null?" · edge "+p.edge+"%":""}</td></tr>
        <tr><td>Implied</td><td>${fmtPct(implied(price(p)))}</td></tr>
        <tr><td>Lineup</td><td>${p.spot?p.spot+" "+p.pos:(p.sit||"not on a posted 1–9")}</td></tr>
      </tbody></table>
      ${gateDots()}
      <p class="why">${p.note||""}</p>
      <div class="toolbar" style="margin-top:12px">
        <button class="tab" data-watch="${p.last}">${watched?"Remove watch":"Watch"}</button>
      </div>
    </div>`;
    playerModal.classList.remove("hidden");
  };
  if(typeof draw==="function") draw(false);
})();
