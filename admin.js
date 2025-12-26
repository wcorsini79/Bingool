// admin.js — Bingool (Firebase v8 – Realtime Database)

let roomId = null;
let drawn = [];
let numberPool = [...Array(75)].map((_, i) => i + 1);

// Criação da sala
document.getElementById("btnCreateRoom").onclick = () => {
    roomId = Math.random().toString(36).substr(2, 6).toUpperCase();

    database.ref("rooms/" + roomId).set({
        drawnNumbers: [],
        players: {},
        bingoCalls: {},
        gameStarted: false
    });

    document.getElementById("roomInfo").innerHTML = `Sala: <b>${roomId}</b>`;
    document.getElementById("btnDraw").disabled = false;
    document.getElementById("btnReset").disabled = false;

    // QR Code
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"),
         `https://wcorsini79.github.io/Bingool/player.html?room=${roomId}`
    );
};

// Sorteio
document.getElementById("btnDraw").onclick = () => {
    if (drawn.length === 0)
        database.ref("rooms/" + roomId + "/gameStarted").set(true);

    if (numberPool.length === 0) return;

    const idx = Math.floor(Math.random() * numberPool.length);
    const num = numberPool.splice(idx, 1)[0];

    drawn.push(num);

    database.ref("rooms/" + roomId + "/drawnNumbers").set(drawn);

    updateDrawnNumbers();
};

// Renderizar números sorteados
function updateDrawnNumbers() {
    const container = document.getElementById("drawnNumbers");
    container.innerHTML = "";

    for (let i = 1; i <= 75; i++) {
        const box = document.createElement("div");
        box.className = "nbox";
        box.textContent = i;

        if (drawn.includes(i)) {
            box.classList.add("drawn");
        }

        container.appendChild(box);
    }
}

// Escutar chamadas de Bingo
database.ref("rooms").on("value", snap => {
    if (!roomId) return;

    const data = snap.val()[roomId];
    const container = document.getElementById("bingoCalls");

    container.innerHTML = "";

    if (data && data.bingoCalls) {
        Object.values(data.bingoCalls).forEach(call => {
            const div = document.createElement("div");
            div.textContent = `${call.name} chamou BINGO!`;
            container.appendChild(div);
        });
    }
});

// Reset
document.getElementById("btnReset").onclick = () => {
    if (!confirm("Resetar a sala?")) return;

    numberPool = [...Array(75)].map((_, i) => i + 1);
    drawn = [];

    database.ref("rooms/" + roomId).update({
        drawnNumbers: [],
        bingoCalls: {},
        gameStarted: false
    });

    updateDrawnNumbers();

};
