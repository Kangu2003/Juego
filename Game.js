// ── LOCALIZED INTERACTIONS ───────────────────────────────────────────────

function checkP3(btn, status) {
    if (status === 'correct') {
        alert('¡Así es! Se sintió triste y enojado porque se burlaron de algo muy valioso para él.');
    } else {
        alert('Piénsalo de nuevo. ¿Cómo te sentirías tú?');
    }
}

function activateCaracol() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((b, i) => {
        setTimeout(() => {
            b.style.backgroundColor = '#D4EFDF';
            b.style.borderColor = '#2ECC71';
            b.style.fontWeight = 'bold';
        }, i * 400);
    });
}

// ── DRAG AND DROP (Panel 6) ────────────────────────────────────────────────
let draggedItem = null;

document.querySelectorAll('.d-item').forEach(item => {
    item.addEventListener('dragstart', function (e) {
        draggedItem = this;
        setTimeout(() => this.style.opacity = '0.4', 0);
    });

    item.addEventListener('dragend', function (e) {
        setTimeout(() => {
            draggedItem = null;
            this.style.opacity = '1';
        }, 0);
    });
});

const castleZone = document.getElementById('zone-castle');

castleZone.addEventListener('dragover', e => {
    e.preventDefault();
    castleZone.style.backgroundColor = '#EAEDED';
});

castleZone.addEventListener('dragleave', e => {
    castleZone.style.backgroundColor = '';
});

castleZone.addEventListener('drop', e => {
    e.preventDefault();
    castleZone.style.backgroundColor = '';
    if (draggedItem) {
        castleZone.appendChild(draggedItem);
        draggedItem.style.opacity = '1';
        draggedItem.style.fontSize = '2rem'; // Make them smaller inside the castle

        // Simple visual feedback when building
        castleZone.style.transform = 'scale(1.05)';
        setTimeout(() => castleZone.style.transform = 'scale(1)', 200);
    }
});

// ── SIMPLE CLICK ANIMATIONS ────────────────────────────────────────────────
document.querySelectorAll('.sound-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.style.transform = 'scale(1.2)';
        setTimeout(() => this.style.transform = 'scale(1)', 200);
        // En un juego real, aquí iría: new Audio('sound.mp3').play();
    });
});

document.querySelectorAll('.emo-card, .agr-card, .s-circle').forEach(card => {
    card.addEventListener('click', function () {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => this.style.transform = '', 300);
    });
});

document.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const originalText = this.innerText;
        this.innerText = "Reflexionando...";
        setTimeout(() => this.innerText = originalText, 1500);
    });
});