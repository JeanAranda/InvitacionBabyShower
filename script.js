// ============================================================
// ANIMACIÓN DE PARTÍCULAS (pétalos / estrellas / corazones)
// ============================================================
(function() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const EMOJIS = ['🌸','✨','💕','🌷','⭐','💖','🎀'];
    const COUNT = 22;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function makeParticle() {
        return {
            x: rand(0, W),
            y: rand(-80, H),
            vy: rand(0.4, 1.2),
            vx: rand(-0.5, 0.5),
            size: rand(14, 28),
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            angle: rand(0, Math.PI * 2),
            va: rand(-0.015, 0.015),
            alpha: rand(0.4, 0.9)
        };
    }

    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.font = p.size + 'px serif';
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
            ctx.restore();

            p.y += p.vy;
            p.x += p.vx;
            p.angle += p.va;

            if (p.y > H + 40) {
                p.y = -60;
                p.x = rand(0, W);
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ============================================================
// CUENTA REGRESIVA
// ============================================================
function updateCountdown() {
    const target = new Date("Jun 20, 2026 18:00:00").getTime();
    const now    = Date.now();
    const dist   = target - now;

    if (dist <= 0) {
        document.getElementById('cd-days').textContent  = '0';
        document.getElementById('cd-hours').textContent = '0';
        document.getElementById('cd-mins').textContent  = '0';
        document.getElementById('cd-secs').textContent  = '0';
        return;
    }

    const d = Math.floor(dist / 86400000);
    const h = Math.floor((dist % 86400000) / 3600000);
    const m = Math.floor((dist % 3600000)  / 60000);
    const s = Math.floor((dist % 60000)    / 1000);

    document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// FORMULARIO DE ASISTENCIA
// ============================================================
const STORAGE_KEY = 'bs_antonella_confirmados';

function getConfirmados() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) { return []; }
}

function saveConfirmados(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function mostrarToast(msg, isError) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = isError ? 'error' : '';
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 5000);
}

function confirmarAsistencia() {
    const nombre     = document.getElementById('nombre').value.trim();
    const asistentes = document.getElementById('asistentes').value;
    const mensaje    = document.getElementById('mensaje').value.trim();

    if (!nombre) {
        mostrarToast('⚠️ Por favor ingresa tu nombre para confirmar.', true);
        document.getElementById('nombre').focus();
        return;
    }

    const confirmados = getConfirmados();

    // Verificar duplicado
    const existe = confirmados.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        mostrarToast('✅ ' + nombre + ', ¡ya estás confirmado(a)! Te esperamos 🎀', false);
        renderConfirmados();
        return;
    }

    const nuevo = {
        nombre,
        asistentes,
        mensaje,
        fecha: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
    };

    confirmados.push(nuevo);
    saveConfirmados(confirmados);

    // Limpiar formulario
    document.getElementById('nombre').value   = '';
    document.getElementById('asistentes').value = '1';
    document.getElementById('mensaje').value  = '';

    mostrarToast('🎉 ¡Gracias ' + nombre + '! Tu asistencia fue confirmada 💕', false);
    renderConfirmados();
}

function renderConfirmados() {
    const lista = getConfirmados();
    const cont  = document.getElementById('confirmados-lista');
    const items = document.getElementById('confirmados-items');

    if (lista.length === 0) {
        cont.style.display = 'none';
        return;
    }

    cont.style.display = 'block';
    items.innerHTML = lista.map(c => `
        <div class="confirmado-item">
            <span class="nombre">🌸 ${c.nombre}</span>
            <span class="asistentes">${c.asistentes} persona${c.asistentes > 1 ? 's' : ''}</span>
        </div>
    `).join('');
}

// Asignar evento al botón después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmarBtn').addEventListener('click', confirmarAsistencia);
    renderConfirmados();
});