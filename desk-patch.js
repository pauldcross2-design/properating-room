function toolbar(){
  const games=["ALL",...GAMES.map(g=>g.game)];
  const flags=["ALL","OPEN","PIVOT","MOON","DIRTY SP"];
  return `<div class="toolbar">
    <input type="search" id="q" placeholder="Search a name, game, handle" />
    <select id="gameFilter">${games.map(g=>`<option ${STATE.game===g?"selected":""}>${g}</option>`).join("")}</select>
    <select id="flagFilter">${flags.map(g=>`<option ${STATE.flag===g?"selected":""}>${g}</option>`).join("")}</select>
    <select id="sortFilter">
      <option value="src" ${STATE.sort==="src"?"selected":""}>Sort: sources</option>
      <option value="price" ${STATE.sort==="price"?"selected":""}>Sort: shortest price</option>
      <option value="game" ${STATE.sort==="game"?"selected":""}>Sort: game</option>
      <option value="name" ${STATE.sort==="name"?"selected":""}>Sort: name</option>
    </select>
  </div>`;
}
function bindToolbar(){
  const q=document.getElementById("q");
  if(!q) return;
  q.value=STATE.q;
  q.oninput=()=>{STATE.q=q.value;draw(false)};
  gameFilter.onchange=()=>{STATE.game=gameFilter.value;draw(false)};
  flagFilter.onchange=()=>{STATE.flag=flagFilter.value;draw(false)};
  sortFilter.onchange=()=>{STATE.sort=sortFilter.value;draw(false)};
}
