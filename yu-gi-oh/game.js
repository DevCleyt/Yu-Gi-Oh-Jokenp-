// Referências de elementos
const roundEl = document.getElementById("round");
const btnReset = document.getElementById("btn-reset");
const choiceButtons = document.querySelectorAll(".card");

const imgPlayer = document.getElementById("img-player");
const imgCpu = document.getElementById("img-cpu");
const labelPlayer = document.getElementById("label-player");
const labelCpu = document.getElementById("label-cpu");
const scorePlayer = document.getElementById("score-player");
const scoreCpu = document.getElementById("score-cpu");
const result = document.getElementById("result");

// Estado do jogo
let state = { player: 0, cpu: 0, round: 1 };
let CARDS = {}; // Vai ser carregado da API

// Carregar cartas da API
async function loadCards() {
  const cardNames = [
    { key: "dragao-branco", apiName: "Blue-Eyes White Dragon", type: "pedra" },
    { key: "mago-negro", apiName: "Dark Magician", type: "papel" },
    { key: "exodia", apiName: "Exodia the Forbidden One", type: "tesoura" },
  ];

  for (const { key, apiName, type } of cardNames) {
    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(apiName)}`
    );
    const data = await response.json();
    const card = data.data[0];
    CARDS[key] = {
      name: card.name,
      type,
      img: card.card_images[0].image_url,
    };

    // Atualiza botão no HTML
    const btn = document.querySelector(`[data-card="${key}"] img`);
    if (btn) btn.src = card.card_images[0].image_url;
  }
}

// CPU escolhe aleatório
function cpuDraw() {
  const keys = Object.keys(CARDS);
  const pick = keys[Math.floor(Math.random() * keys.length)];
  return CARDS[pick];
}

// Regras (pedra, papel, tesoura)
function getWinner(p, c) {
  if (p.type === c.type) return 0;
  if (
    (p.type === "pedra" && c.type === "tesoura") ||
    (p.type === "papel" && c.type === "pedra") ||
    (p.type === "tesoura" && c.type === "papel")
  ) {
    return 1;
  }
  return -1;
}

// Atualiza UI
function updateUI(pCard, cCard, outcome) {
  imgPlayer.src = pCard.img;
  imgCpu.src = cCard.img;
  labelPlayer.textContent = `${pCard.name} (${pCard.type})`;
  labelCpu.textContent = `${cCard.name} (${cCard.type})`;

  let message = "";
  if (outcome === 1) {
    state.player++;
    message = "🎉 Você venceu a rodada!";
  } else if (outcome === -1) {
    state.cpu++;
    message = "💀 CPU venceu a rodada!";
  } else {
    message = "🤝 Empate!";
  }

  scorePlayer.textContent = state.player;
  scoreCpu.textContent = state.cpu;
  result.textContent = message;

  state.round++;
  roundEl.textContent = state.round;
}

// Jogador escolhe
function onChoose(evt) {
  const key = evt.currentTarget.dataset.card;
  const pCard = CARDS[key];
  const cCard = cpuDraw();
  const outcome = getWinner(pCard, cCard);
  updateUI(pCard, cCard, outcome);
}

// Reset
function resetGame() {
  state = { player: 0, cpu: 0, round: 1 };
  imgPlayer.src = "assets/src/icons/question.png";
  imgCpu.src = "assets/src/icons/question.png";
  labelPlayer.textContent = "—";
  labelCpu.textContent = "—";
  scorePlayer.textContent = 0;
  scoreCpu.textContent = 0;
  roundEl.textContent = 1;
  result.textContent = "Escolha sua carta para começar!";
}

// Eventos
choiceButtons.forEach(btn => btn.addEventListener("click", onChoose));
btnReset.addEventListener("click", resetGame);

// Inicializa
loadCards();
