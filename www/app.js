let players = [];
let finished = false;

// DOM refs (safe because script loads last)
const setupDiv = document.getElementById("setup");
const gameDiv = document.getElementById("game");
const playerInputsDiv = document.getElementById("playerInputs");

const tableHead = document.getElementById("playerRow");
const roundsBody = document.getElementById("rounds");
const totalsRow = document.getElementById("totals");
const leaderboardDiv = document.getElementById("leaderboard");

// Buttons
document.getElementById("addPlayerBtn").onclick = addPlayerInput;
document.getElementById("startGameBtn").onclick = startGame;
document.getElementById("addRoundBtn").onclick = addRound;
document.getElementById("finishGameBtn").onclick = finishGame;
document.getElementById("resetGameBtn").onclick = resetGame;

/* ---------- SETUP ---------- */

function addPlayerInput() {
  const input = document.createElement("input");
  input.placeholder = "Player name";
  playerInputsDiv.appendChild(input);
}

function startGame() {
  players = [];
  document.querySelectorAll("#playerInputs input").forEach(inp => {
    if (inp.value.trim()) players.push(inp.value.trim());
  });

  if (players.length < 2) {
    alert("Add at least 2 players");
    return;
  }

  setupDiv.style.display = "none";
  gameDiv.style.display = "block";

  renderHeader();
  renderTotals();
}

/* ---------- GAME ---------- */

function renderHeader() {
  tableHead.innerHTML = "<th>Round</th>";
  players.forEach(p => {
    tableHead.innerHTML += `<th>${p}</th>`;
  });
}

function renderTotals() {
  totalsRow.innerHTML = "<th>TOTAL</th>";
  players.forEach(p => {
    totalsRow.innerHTML += `<td id="total-${p}">0</td>`;
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
    input.inputMode = "numeric";
    input.pattern = "[0-9]";
    input.value = "";
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
      .forEach(inp => {
        const val = inp.value.trim();
        sum += val === "" ? 0 : parseInt(val, 10);
      });

    document.getElementById(`total-${p}`).innerText = sum;
  });
}


function finishGame() {
  finished = true;
  document.querySelectorAll("#rounds input").forEach(i => i.disabled = true);

  showLeaderboard();

  // Copy leaderboard into overlay
  document.getElementById("overlayLeaderboard").innerHTML =
    document.getElementById("leaderboard").innerHTML;

  document.getElementById("finishOverlay").style.display = "flex";
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
  players = [];
  finished = false;

  roundsBody.innerHTML = "";
  leaderboardDiv.innerHTML = "";
  playerInputsDiv.innerHTML = "";

  document.getElementById("finishOverlay").style.display = "none";

  gameDiv.style.display = "none";
  setupDiv.style.display = "flex";
console.log("resetGame() called");

}

console.log("overlay btn:", document.getElementById("overlayResetBtn"));

// ---------- FINISH OVERLAY LOGIC (BULLETPROOF) ----------
document.addEventListener("DOMContentLoaded", () => {
  const finishOverlay = document.getElementById("finishOverlay");

  if (!finishOverlay) {
    console.error("finishOverlay not found");
    return;
  }

  // Event delegation: catches clicks even if DOM changes
  finishOverlay.addEventListener("click", (e) => {
    const resetBtn = e.target.closest("#overlayResetBtn");

    if (!resetBtn) return;

    e.preventDefault();
    e.stopPropagation();

    console.log("Overlay reset clicked");

    finishOverlay.style.display = "none";
    resetGame();
  });
});

