// ── STATE ──────────────────────────────────────────────────────────────────
const TOTAL = 11;
// currentScreen se define en cada HTML
let draggedItem = null;
let touchItem = null;
let sensoryExplored = 0;
let agreementsSelected = 0;

// ── PROGRESS BAR ───────────────────────────────────────────────────────────
function buildProgress() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    bar.innerHTML = '';
    const labels = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '🏆'];

    for (let i = 0; i < TOTAL; i++) {
        const dot = document.createElement('div');
        dot.className =
            'progress-dot' +
            (i < currentScreen ? ' done' : '') +
            (i === currentScreen ? ' active' : '');
        dot.textContent = labels[i];
        bar.appendChild(dot);

        if (i < TOTAL - 1) {
            const line = document.createElement('div');
            line.className = 'progress-line' + (i < currentScreen ? ' done' : '');
            bar.appendChild(line);
        }
    }
}

// ── NAVIGATION ─────────────────────────────────────────────────────────────
function goTo(n) {
    if (n === 0) {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'pantalla' + n + '.html';
    }
}

// ── RESTART ────────────────────────────────────────────────────────────────
function restart() {
    // Al usar vistas dinámicas, el estado visual del DOM se reinicia automáticamente 
    // al volver a inyectar el HTML, solo necesitamos reiniciar las variables lógicas.
    sensoryExplored = 0;
    agreementsSelected = 0;
    goTo(0);
}

// ── FEEDBACK HELPERS ───────────────────────────────────────────────────────
function showFeedback(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'block';
        el.classList.add('show');
    }
}

function hideFeedback(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
        el.classList.remove('show');
    }
}

// ── EMOTION CHECK – Screen 3 ───────────────────────────────────────────────
function checkEmotion(btn, result) {
    document.querySelectorAll('#s3 .emotion-btn').forEach(b => {
        b.classList.remove('selected');
        b.disabled = true;
    });
    btn.classList.add(result);

    if (result === 'correct') {
        showFeedback('fb3good');
        setTimeout(() => (document.getElementById('btn3next').style.display = 'inline-flex'), 800);
    } else {
        showFeedback('fb3bad');
        setTimeout(() => {
            document.querySelectorAll('#s3 .emotion-btn').forEach(b => {
                b.disabled = false;
                b.classList.remove('wrong');
            });
            hideFeedback('fb3bad');
        }, 1500);
    }
}

// ── EMOTION CHECK – Screen 5 ───────────────────────────────────────────────
function checkEmotion2(btn, result) {
    document.querySelectorAll('#s5 .emotion-btn').forEach(b => {
        b.classList.remove('selected');
        b.disabled = true;
    });
    btn.classList.add(result);

    if (result === 'correct') {
        new Audio('audio/audio5.mp3').play();
        showFeedback('fb5good');
        setTimeout(() => (document.getElementById('btn5next').style.display = 'inline-flex'), 800);
    } else {
        showFeedback('fb5bad');
        setTimeout(() => {
            document.querySelectorAll('#s5 .emotion-btn').forEach(b => {
                b.disabled = false;
                b.classList.remove('wrong');
            });
            hideFeedback('fb5bad');
        }, 1500);
    }
}

// ── CARACOL ────────────────────────────────────────────────────────────────
function activateCaracol() {
    const bubbles = document.querySelectorAll('.speech');
    bubbles.forEach((b, i) => setTimeout(() => b.classList.add('visible'), i * 350));
    setTimeout(() => {
        document.getElementById('fb4').style.display = 'block';
        document.getElementById('btn4next').style.display = 'inline-flex';
    }, 1400);
}

// ── DRAG AND DROP (desktop) ────────────────────────────────────────────────
function dragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('over');
}

function dropItem(e, zone) {
    e.preventDefault();
    e.currentTarget.classList.remove('over');
    if (!draggedItem) return;

    if (zone === 'castle') {
        const castle = document.getElementById('items-castle');
        const clone = draggedItem.cloneNode(true);
        clone.draggable = false;
        clone.style.cursor = 'default';
        castle.appendChild(clone);
        draggedItem.remove();
        draggedItem = null;

        if (document.querySelectorAll('#items-castle .drag-item').length >= 2) {
            document.getElementById('fb6').style.display = 'block';
            document.getElementById('btn6next').style.display = 'inline-flex';
        }
    } else {
        const target = document.getElementById('items-' + zone);
        if (target && draggedItem) {
            target.appendChild(draggedItem);
            draggedItem = null;
        }
    }
}

document.addEventListener('dragend', () => {
    document.querySelectorAll('.drag-zone').forEach(z => z.classList.remove('over'));
});

function resetDrag() {
    const itemsCastle = document.getElementById('items-castle');
    if (itemsCastle) itemsCastle.innerHTML = '';

    const itemsSierra = document.getElementById('items-sierra');
    if (itemsSierra) {
        itemsSierra.innerHTML = `
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="sierra">🧶<span>Tejidos</span></div>
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="sierra">🧸<span>Muñecos</span></div>
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="sierra">🌾<span>Semillas</span></div>`;
    }

    const itemsMar = document.getElementById('items-mar');
    if (itemsMar) {
        itemsMar.innerHTML = `
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="mar">🐚<span>Conchas</span></div>
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="mar">🐟<span>Peces</span></div>
        <div class="drag-item" draggable="true" ondragstart="dragStart(event)" data-zone="mar">⭐<span>Estrellas</span></div>`;
    }
}

// ── DRAG AND DROP (touch / mobile) ────────────────────────────────────────
document.addEventListener('touchstart', e => {
    const t = e.target.closest('.drag-item');
    if (t) { touchItem = t; t.style.opacity = '0.6'; }
});

document.addEventListener('touchend', e => {
    if (!touchItem) return;
    touchItem.style.opacity = '1';
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone = el && el.closest('.drag-zone');

    if (zone && zone.id === 'zone-castle') {
        const castle = document.getElementById('items-castle');
        const clone = touchItem.cloneNode(true);
        clone.draggable = false;
        clone.style.cursor = 'default';
        castle.appendChild(clone);
        touchItem.remove();

        if (document.querySelectorAll('#items-castle .drag-item').length >= 2) {
            document.getElementById('fb6').style.display = 'block';
            document.getElementById('btn6next').style.display = 'inline-flex';
        }
    }
    touchItem = null;
});

// ── RESTORATIVE CIRCLE ─────────────────────────────────────────────────────
function toggleAnswer(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
}

// ── AGREEMENTS ─────────────────────────────────────────────────────────────
function toggleAgreement(btn) {
    btn.classList.toggle('selected');
    agreementsSelected = document.querySelectorAll('#s8 .agreement-btn.selected').length;

    if (agreementsSelected >= 3) {
        document.getElementById('fb8').style.display = 'block';
        document.getElementById('btn8next').style.display = 'inline-flex';
    }
}

// ── SENSORY BOX ────────────────────────────────────────────────────────────
function exploreSensory(el) {
    if (!el.classList.contains('active')) {
        el.classList.add('active');
        sensoryExplored++;
        if (sensoryExplored >= 3) {
            document.getElementById('fb9').style.display = 'block';
            document.getElementById('btn9next').style.display = 'inline-flex';
        }
    } else {
        el.classList.remove('active');
    }
}

// ── INIT ───────────────────────────────────────────────────────────────────
window.onload = () => {
    buildProgress();
};
