let players = ["Anos", "Alex", "Rahul", "Sara"];
let rounds = [];
let finished = false;

const tableHead = document.getElementById("playerRow");
const roundsBody = document.getElementById("rounds");
const totalsRow = document.getElementById("totals");
const leaderboardDiv = document.getElementById("leaderboard");

function init() {
  renderHeader();
  renderTotals();
}

function renderHeader() {
  tableHead.innerHTML = "<th>Round</th>";
  players.forEach((p, i) => {
    tableHead.innerHTML += `
      <th>
        <input value="${p}" onchange="renamePlayer(${i}, this.value)">
      </th>`;
  });
}

function renderTotals() {
  totalsRow.innerHTML = "<th>TOTAL</th>";
  players.forEach(p => {
    totalsRow.innerHTML += `<td id="total-${p}">0</td>`;
  });
}

function renamePlayer(index, name) {
  players[index] = name;
  updateTotals();
}

function addPlayer() {
  if (finished) return;

  const name = `Player ${players.length + 1}`;
  players.push(name);

  renderHeader();
  renderTotals();

  document.querySelectorAll("#rounds tr").forEach(tr => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = 0;
    input.oninput = updateTotals;
    td.appendChild(input);
    tr.appendChild(td);
  });
}

function addRound() {
  if (finished) return;

  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${roundsBody.children.length + 1}</td>`;

  players.forEach(() => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = 0;
    input.oninput = updateTotals;
    td.appendChild(input);
    tr.appendChild(td);
  });

  roundsBody.appendChild(tr);
}

function updateTotals() {
  players.forEach((p, i) => {
    let sum = 0;
    document
      .querySelectorAll(`#rounds tr td:nth-child(${i + 2}) input`)
      .forEach(inp => sum += Number(inp.value));
    document.getElementById(`total-${p}`).innerText = sum;
  });
}

function finishGame() {
  finished = true;
  document.querySelectorAll("input").forEach(i => i.disabled = true);
  showLeaderboard();
}

function showLeaderboard() {
  const scores = players.map(p => ({
    name: p,
    score: Number(document.getElementById(`total-${p}`).innerText)
  }));

  scores.sort((a, b) => a.score - b.score);

  leaderboardDiv.innerHTML = "<h2>Leaderboard</h2>";
  scores.forEach((p, i) => {
    leaderboardDiv.innerHTML += `<p>${i + 1}. ${p.name} — ${p.score}</p>`;
  });
}

function resetGame() {
  finished = false;
  roundsBody.innerHTML = "";
  leaderboardDiv.innerHTML = "";
  document.querySelectorAll("input").forEach(i => i.disabled = false);
  renderHeader();
  renderTotals();
}

init();
