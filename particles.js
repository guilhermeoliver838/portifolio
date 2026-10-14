
/* =========================================================
   1. SELEÇÃO DO CANVAS
   Obtém o elemento HTML onde desenharemos as partículas.
   ========================================================= */

const canvas = document.getElementById("particles-bg");
const ctx = canvas.getContext("2d");


/* =========================================================
   2. CONFIGURAÇÕES DA ANIMAÇÃO
   Valores que controlam a quantidade, velocidade e conexões.
   ========================================================= */

let particles = [];

const particleCount = 45; // Quantidade de partículas
const maxDistance = 180; // Distância máxima entre partículas
const particleSpeed = 0.4; // Velocidade de movimentação

// Configurações da interação com o mouse
const mouse = {
    x: null,
    y: null
};

const mouseRadius = 130; // Distância máxima para conectar o mouse


/* =========================================================
   3. AJUSTE DO TAMANHO DO CANVAS
   Faz o fundo acompanhar o tamanho da janela.
   ========================================================= */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


/* =========================================================
   4. CRIAÇÃO DAS PARTÍCULAS
   Cada partícula recebe uma posição e uma direção aleatória.
   ========================================================= */

function createParticles() {
    particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            // Define a direção horizontal
            vx: (Math.random() - 0.5) * particleSpeed,

            // Define a direção vertical
            vy: (Math.random() - 0.5) * particleSpeed,

            // Define o tamanho do ponto
            radius: Math.random() * 1.5 + 1
        });
    }
}


/* =========================================================
   5. DESENHO DAS PARTÍCULAS
   Desenha cada ponto na posição atual.
   ========================================================= */

function drawParticles() {
    particles.forEach(particle => {
        ctx.beginPath();

        // Define a posição e o tamanho do círculo
        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        // Define a cor do ponto
        ctx.fillStyle = "#0FBDF2";

        // Preenche o círculo
        ctx.fill();
    });
}


/* =========================================================
   6. CONEXÃO ENTRE PARTÍCULAS
   Desenha linhas quando dois pontos estão próximos.
   ========================================================= */

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {

            const p1 = particles[i];
            const p2 = particles[j];

            // Calcula a distância horizontal e vertical
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;

            // Calcula a distância real entre os dois pontos
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Só conecta se estiverem suficientemente próximos
            if (distance < maxDistance) {

                // Quanto mais distantes, mais transparente fica a linha
                const opacity = 1 - distance / maxDistance;

                ctx.beginPath();

                // Define o início e o final da linha
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                // Define a cor e a transparência da conexão
                ctx.strokeStyle = `rgba(15, 189, 242, ${opacity * 0.5})`;

                // Define a espessura da linha
                ctx.lineWidth = 1;

                // Desenha a linha
                ctx.stroke();
            }
        }
    }
}


/* =========================================================
   7. CONEXÃO DO MOUSE COM AS PARTÍCULAS
   Desenha linhas entre o cursor e as partículas próximas.
   As linhas desaparecem quando o cursor se afasta.
   ========================================================= */

function connectMouse() {

    // Verifica se o mouse está dentro da janela
    if (mouse.x === null || mouse.y === null) {
        return;
    }

    particles.forEach(particle => {

        // Calcula a distância entre o mouse e a partícula
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Conecta somente as partículas próximas do cursor
        if (distance < mouseRadius) {

            // Calcula a transparência de acordo com a distância
            const opacity = 1 - distance / mouseRadius;

            ctx.beginPath();

            // A linha começa na posição do mouse
            ctx.moveTo(mouse.x, mouse.y);

            // A linha termina na posição da partícula
            ctx.lineTo(particle.x, particle.y);

            // Define a cor e a transparência da linha
            ctx.strokeStyle = `rgba(15, 189, 242, ${opacity * 0.8})`;

            // Define a espessura da linha
            ctx.lineWidth = 1;

            // Desenha a conexão
            ctx.stroke();
        }
    });
}


/* =========================================================
   8. MOVIMENTAÇÃO DAS PARTÍCULAS
   Atualiza as posições e faz os pontos voltarem ao entrar
   em contato com as bordas da tela.
   ========================================================= */

function moveParticles() {
    particles.forEach(particle => {

        // Atualiza a posição horizontal
        particle.x += particle.vx;

        // Atualiza a posição vertical
        particle.y += particle.vy;

        // Inverte a direção ao atingir as laterais
        if (
            particle.x < 0 ||
            particle.x > canvas.width
        ) {
            particle.vx *= -1;
        }

        // Inverte a direção ao atingir o topo ou a base
        if (
            particle.y < 0 ||
            particle.y > canvas.height
        ) {
            particle.vy *= -1;
        }
    });
}


/* =========================================================
   9. DETECÇÃO DO MOVIMENTO DO MOUSE
   Atualiza a posição do cursor para criar as conexões.
   ========================================================= */

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Remove as conexões quando o cursor sai da janela
window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
        mouse.x = null;
        mouse.y = null;
    }
});


/* =========================================================
   10. ANIMAÇÃO PRINCIPAL
   Limpa o quadro anterior, redesenha as conexões e movimenta
   as partículas continuamente.
   ========================================================= */

function animateParticles() {

    // Apaga o desenho do quadro anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as conexões entre as próprias partículas
    connectParticles();

    // Desenha as conexões entre o mouse e as partículas
    connectMouse();

    // Desenha os pontos
    drawParticles();

    // Atualiza as posições
    moveParticles();

    // Solicita o próximo quadro da animação
    requestAnimationFrame(animateParticles);
}


/* =========================================================
   11. INICIALIZAÇÃO
   Prepara o fundo e inicia a animação.
   ========================================================= */

// Ajusta o canvas quando a janela muda de tamanho
window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

// Prepara a tela
resizeCanvas();

// Cria as partículas iniciais
createParticles();

// Inicia a animação
animateParticles();