let players = ["Anos", "Alex", "Rahul", "Sara"];
let rounds = [];
let finished = false;

const tableHead = document.getElementById("playerRow");
const roundsBody = document.getElementById("rounds");
const totalsRow = document.getElementById("totals");

function init() {
  players.forEach(p => {
    tableHead.innerHTML += `<th>${p}</th>`;
    totalsRow.innerHTML += `<td id="total-${p}">0</td>`;
  });
}

function addRound() {
  if (finished) return;

  const roundIndex = rounds.length + 1;
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${roundIndex}</td>`;

  players.forEach(p => {
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
    document.querySelectorAll(`#rounds tr td:nth-child(${i + 2}) input`)
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

  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "<h2>Leaderboard</h2>";

  scores.forEach((p, i) => {
    lb.innerHTML += `<p>${i + 1}. ${p.name} — ${p.score}</p>`;
  });
}

init();
