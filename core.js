// core.js — Funções centrais do Bingo (compatível com Firebase v8)

// Gera uma cartela 5x5 no formato correto de Bingo
// B = 1–15, I = 16–30, N = 31–45, G = 46–60, O = 61–75
function generateBingoCard() {
    const card = [];
    const used = new Set();

    for (let col = 0; col < 5; col++) {
        card[col] = [];
        const start = col * 15 + 1;
        const end = start + 14;

        for (let row = 0; row < 5; row++) {
            if (col === 2 && row === 2) {
                card[col][row] = "FREE";
                continue;
            }

            let number;
            do {
                number = Math.floor(Math.random() * (end - start + 1)) + start;
            } while (used.has(number));

            used.add(number);
            card[col][row] = number;
        }
    }

    return card;
}

// Verifica se o jogador tem Bingo
// Linhas, colunas ou diagonais completas
function checkBingo(card, marked) {
    // linhas
    for (let r = 0; r < 5; r++) {
        if (marked[r].every(x => x)) return true;
    }

    // colunas
    for (let c = 0; c < 5; c++) {
        if (marked.every(row => row[c])) return true;
    }

    // diagonal principal
    if (marked.every((row, i) => row[i])) return true;

    // diagonal secundária
    if (marked.every((row, i) => row[4 - i])) return true;

    return false;
}

// Renderiza a cartela no HTML (estilo Neon Suave Moderno)
function renderCard(card, marked, drawnNumbers, container, locked) {
    container.innerHTML = "";

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const value = card[c][r];
            const cell = document.createElement("div");
            cell.className = "cell";

            cell.textContent = value;

            if (marked[r][c]) cell.classList.add("marked");
            if (drawnNumbers.includes(value)) cell.classList.add("drawn");

            if (!locked && drawnNumbers.includes(value) && value !== "FREE") {
                cell.onclick = () => {
                    marked[r][c] = !marked[r][c];
                    renderCard(card, marked, drawnNumbers, container, locked);
                };
            }

            container.appendChild(cell);
        }
    }
}