// player.js — Bingool (Firebase v8 – Realtime Database)

let room = null;
let playerName = null;

let card = null;
let marked = Array(5).fill().map(() => Array(5).fill(false));
let drawnNumbers = [];

let locked = false; // trava a cartela quando o admin inicia o jogo

// Entrar na sala
document.getElementById("joinRoom").onclick = () => {
    room = document.getElementById("roomCode").value.trim();
    playerName = document.getElementById("playerName").value.trim();

    if (!room || !playerName) {
        alert("Preencha seu nome e o código da sala.");
        return;
    }

    // Gerar cartela do jogador
    card = generateBingoCard();

    // Registrar jogador na sala
    database.ref(`rooms/${room}/players/${playerName}`).set({
        name: playerName,
        card: card
    });

    // Começar a ouvir o jogo
    startListeners();

    document.getElementById("checkBingo").disabled = false;
};

// Escutas principais
function startListeners() {
    // Começo/fim do jogo
    database.ref(`rooms/${room}/gameStarted`).on("value", snap => {
        locked = snap.val() === true;

        renderCard(
            card,
            marked,
            drawnNumbers,
            document.getElementById("bingoCard"),
            locked
        );
    });

    // Números sorteados
    database.ref(`rooms/${room}/drawnNumbers`).on("value", snap => {
        drawnNumbers = snap.val() || [];

        renderCard(
            card,
            marked,
            drawnNumbers,
            document.getElementById("bingoCard"),
            locked
        );
    });
}

// Chamar Bingo
document.getElementById("checkBingo").onclick = () => {
    if (!room || !playerName) return;

    if (checkBingo(card, marked)) {
        database.ref(`rooms/${room}/bingoCalls/${playerName}`).set({
            name: playerName,
            time: Date.now()
        });

        document.getElementById("status").innerHTML = "<b>BINGO enviado!</b>";
    } else {
        document.getElementById("status").innerHTML = "Ainda não é Bingo.";
    }
};