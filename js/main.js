/* ==========================================================
   GESTÃO DE PROJETOS COM SHREK
   MAIN.JS - CONTROLADOR DA APRESENTAÇÃO (13 SLIDES)
========================================================== */

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_SLIDES = 13;
let currentSlideIndex = 1;

/* ==========================================
   LOADER & INICIALIZAÇÃO SEGURA
========================================== */

function hideLoader() {
    const loader = document.getElementById("loader");
    if (!loader || loader.style.display === "none") return;

    if (typeof gsap !== "undefined") {
        gsap.to("#loader", {
            opacity: 0,
            duration: 0.8,
            onComplete() {
                loader.style.display = "none";
                initIntroAnimations();
                initParticles();
                initLeaves();
            }
        });
    } else {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            initIntroAnimations();
            initParticles();
            initLeaves();
        }, 500);
    }
}

window.addEventListener("load", hideLoader);
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hideLoader, 1200);
    document.getElementById("loader")?.addEventListener("click", hideLoader);
});

/* ==========================================
   ANIMAÇÕES DE INTRODUÇÃO
========================================== */

function initIntroAnimations() {
    if (typeof gsap !== "undefined") {
        gsap.from("#slide1 h1", { y: 30, opacity: 0, duration: 0.8 });
    }
}

/* ==========================================
   PARTÍCULAS MÁGICAS DO PÂNTANO & FOLHAS VOANDO
========================================== */

function initParticles() {
    const container = document.querySelector(".fireflies-container") || document.querySelector(".particles");
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.animationDuration = (6 + Math.random() * 10) + "s";
        p.style.animationDelay = Math.random() * 5 + "s";
        p.style.opacity = (Math.random() * 0.8 + 0.2).toString();
        p.style.transform = `scale(${Math.random() * 1.2 + 0.3})`;
        container.appendChild(p);
    }
}

function initLeaves() {
    const container = document.querySelector(".leaves-container");
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 45; i++) {
        const leaf = document.createElement("div");
        leaf.className = "flying-leaf";
        leaf.style.left = (100 + Math.random() * 25) + "vw";
        leaf.style.top = (Math.random() * 110 - 20) + "vh";
        leaf.style.animationDuration = (6 + Math.random() * 9) + "s";
        leaf.style.animationDelay = (Math.random() * 14) + "s";
        leaf.style.transform = `scale(${Math.random() * 0.9 + 0.5})`;
        container.appendChild(leaf);
    }
}

/* ==========================================
   NAVEGAÇÃO ENTRE SLIDES
========================================== */

function goToSlide(slideNum) {
    if (slideNum < 1) slideNum = 1;
    if (slideNum > TOTAL_SLIDES) slideNum = TOTAL_SLIDES;

    currentSlideIndex = slideNum;
    const targetSlide = document.getElementById(`slide${slideNum}`);
    if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateHUD(slideNum);
        if (window.soundFX) window.soundFX.playWhoosh();
    }
}

function updateHUD(slideNum) {
    currentSlideIndex = slideNum;
    const counter = document.getElementById("slide-counter");
    if (counter) counter.innerText = `Slide ${slideNum} de ${TOTAL_SLIDES}`;

    const progressBar = document.getElementById("bar");
    if (progressBar) {
        const pct = (slideNum / TOTAL_SLIDES) * 100;
        progressBar.style.width = `${pct}%`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-prev")?.addEventListener("click", () => {
        goToSlide(currentSlideIndex - 1);
    });

    document.getElementById("btn-next")?.addEventListener("click", () => {
        goToSlide(currentSlideIndex + 1);
    });

    document.getElementById("btn-go-thanks")?.addEventListener("click", () => {
        goToSlide(13);
    });

    document.getElementById("btn-restart")?.addEventListener("click", () => {
        goToSlide(1);
    });

    // Botão de Música de Fundo
    document.getElementById("btn-music")?.addEventListener("click", function () {
        if (window.soundFX) {
            const isPlaying = window.soundFX.toggleMusic();
            this.innerText = isPlaying ? "Música: ON" : "Música: OFF";
            if (isPlaying) {
                this.classList.add("primary-btn");
            } else {
                this.classList.remove("primary-btn");
            }
        }
    });

    // Botão de Efeitos Sonoros
    document.getElementById("btn-sound")?.addEventListener("click", function () {
        if (window.soundFX) {
            const muted = window.soundFX.toggleMute();
            this.innerText = muted ? "Efeitos: OFF" : "Efeitos: ON";
        }
    });
});

// Atalhos de Teclado
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
    }
});

// Rastreamento por Scroll Observer
if (typeof IntersectionObserver !== "undefined") {
    const slides = document.querySelectorAll(".scene");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idStr = entry.target.id;
                const num = parseInt(idStr.replace("slide", ""), 10);
                if (!isNaN(num)) {
                    updateHUD(num);
                }
            }
        });
    }, { threshold: 0.4 });

    slides.forEach(slide => observer.observe(slide));
}

/* ==========================================
   INTERATIVIDADE SLIDE 5: CHAT DO BURRO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const btnSpam = document.getElementById("btn-spammed-daily");
    if (btnSpam) {
        btnSpam.addEventListener("click", () => {
            const solution = document.getElementById("scrum-solution");
            if (solution) {
                solution.style.display = "block";
                if (window.soundFX) window.soundFX.playVictory();
                btnSpam.innerText = "Scrum Aplicado com Sucesso!";
                btnSpam.style.background = "#ffd700";
                btnSpam.style.color = "#2c1d0d";
            }
        });
    }

    const burroQuotes = [
        "Burro: Já chegamos? Já chegamos?",
        "Burro: E agora? Falta muito?",
        "Burro: E se a Fiona quiser um waffle de sobremesa?",
        "Burro: O Shrek já respondeu o e-mail?"
    ];

    function triggerDonkeyMessage() {
        const chatBody = document.getElementById("chat-messages");
        if (!chatBody) return;
        const randomQuote = burroQuotes[Math.floor(Math.random() * burroQuotes.length)];
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-msg burro-msg";
        msgDiv.innerText = randomQuote;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        if (window.soundFX) window.soundFX.playDonkey();
    }

    setInterval(() => {
        if (currentSlideIndex === 5) {
            const solution = document.getElementById("scrum-solution");
            if (!solution || solution.style.display === "none") {
                triggerDonkeyMessage();
            }
        }
    }, 4500);

    /* ==========================================
       INTERATIVIDADE SLIDE 7: KANBAN BOARD
    ========================================== */

    document.querySelectorAll(".k-card").forEach(card => {
        card.addEventListener("click", function () {
            const colTodo = document.querySelector("#col-todo .kanban-cards");
            const colDoing = document.querySelector("#col-doing .kanban-cards");
            const colDone = document.querySelector("#col-done .kanban-cards");

            if (this.parentElement === colTodo) {
                colDoing.appendChild(this);
                this.className = "k-card in-progress";
            } else if (this.parentElement === colDoing) {
                colDone.appendChild(this);
                this.className = "k-card completed";
            } else {
                colTodo.appendChild(this);
                this.className = "k-card";
            }
            if (window.soundFX) window.soundFX.playClick();
        });
    });

    /* ==========================================
       INTERATIVIDADE SLIDE 8: TRANSFORMAÇÃO DA FIONA
    ========================================== */

    let isOgre = false;
    const btnFiona = document.getElementById("btn-transform-fiona");
    const fionaBox = document.getElementById("fiona-box");
    const fionaImgGif = document.getElementById("fiona-img-gif");
    const fionaTitle = document.getElementById("fiona-state-title");
    const fionaDesc = document.getElementById("fiona-state-desc");
    const scopeAlert = document.getElementById("scope-warning");

    if (btnFiona) {
        btnFiona.addEventListener("click", () => {
            isOgre = !isOgre;
            if (isOgre) {
                if (fionaBox) fionaBox.classList.add("ogre-mode");
                if (fionaImgGif) fionaImgGif.src = "assets/images/fiona_ogra_tenor.gif";
                if (fionaTitle) fionaTitle.innerText = "Fiona (Requisito Oculto: Ogra)";
                if (fionaDesc) fionaDesc.innerText = "'À noite de um jeito, de dia de outro!' O escopo mudou completamente.";
                if (scopeAlert) scopeAlert.style.display = "block";
                btnFiona.innerText = "Voltar ao Dia (Escopo Original)";
                if (window.soundFX) window.soundFX.playTransform();
            } else {
                if (fionaBox) fionaBox.classList.remove("ogre-mode");
                if (fionaImgGif) fionaImgGif.src = "assets/images/fiona_humana_tenor.gif";
                if (fionaTitle) fionaTitle.innerText = "Fiona (Escopo Inicial: Princesa)";
                if (fionaDesc) fionaDesc.innerText = "'O requisito inicial parecia simples e direto...'";
                if (scopeAlert) scopeAlert.style.display = "none";
                btnFiona.innerText = "Simular Chegada da Noite (Mudança de Escopo)";
                if (window.soundFX) window.soundFX.playClick();
            }
        });
    }

    /* ==========================================
       INTERATIVIDADE SLIDE 9: DRAGÃO / DEADLINE
    ========================================== */

    let dragonScale = 1.0;
    const dragonSprite = document.getElementById("dragon-sprite");
    const timerFill = document.getElementById("timer-fill");
    const btnShrink = document.getElementById("btn-shrink-dragon");

    if (btnShrink) {
        btnShrink.addEventListener("click", () => {
            dragonScale = 0.85;
            if (dragonSprite) dragonSprite.style.transform = `scale(${dragonScale})`;
            if (timerFill) timerFill.style.width = "75%";
            btnShrink.innerText = "Risco Mitigado & Prazo Sob Controle!";
            btnShrink.style.background = "#ffd700";
            btnShrink.style.color = "#2c1d0d";
            if (window.soundFX) window.soundFX.playVictory();
        });
    }

    setInterval(() => {
        if (currentSlideIndex === 9 && dragonSprite && dragonScale > 0.9) {
            dragonScale = dragonScale === 1.0 ? 1.2 : 1.0;
            dragonSprite.style.transform = `scale(${dragonScale})`;
            if (dragonScale > 1.1 && window.soundFX) {
                window.soundFX.playDragon();
            }
        }
    }, 2500);

    /* ==========================================
       INTERATIVIDADE SLIDE 11: MATRIZ COMPARATIVA
    ========================================== */

    document.querySelectorAll(".matrix-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            if (window.soundFX) window.soundFX.playClick();
        });
    });

    /* ==========================================
       INTERATIVIDADE SLIDE 12: TROFÉUS DO PÂNTANO
    ========================================== */

    document.querySelectorAll(".trophy-card").forEach(card => {
        const btn = card.querySelector(".btn-claim");
        
        const claimTrophy = () => {
            card.classList.add("claimed");
            if (btn) {
                btn.innerText = "✓ Conquistado!";
                btn.style.background = "#ffd700";
                btn.style.color = "#2c1d0d";
            }
            if (window.soundFX) window.soundFX.playVictory();
        };

        if (btn) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                claimTrophy();
            });
        }

        card.addEventListener("click", claimTrophy);
    });
});
