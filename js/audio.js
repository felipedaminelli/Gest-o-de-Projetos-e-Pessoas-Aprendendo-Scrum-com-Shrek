/* ==========================================================
   GESTÃO DE PROJETOS COM SHREK
   AUDIO.JS - ÁUDIO DO VÍDEO DO YOUTUBE (DWbNTjMz9ks) + SINTETIZADOR
========================================================== */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.mutedFX = false;
        this.musicPlaying = false;
        this.musicTimer = null;
        this.musicStep = 0;
        this.ytPlayer = null;
        this.ytReady = false;
        this.initYouTubePlayer();
    }

    initYouTubePlayer() {
        // Carrega a API do YouTube iFrame dinamicamente para o vídeo DWbNTjMz9ks
        if (!document.getElementById("yt-api-script")) {
            const tag = document.createElement("script");
            tag.id = "yt-api-script";
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Cria o container do player oculto
        if (!document.getElementById("yt-player-container")) {
            const div = document.createElement("div");
            div.id = "yt-player-container";
            div.style.position = "absolute";
            div.style.top = "-9999px";
            div.style.left = "-9999px";
            div.style.width = "1px";
            div.style.height = "1px";
            div.style.pointerEvents = "none";
            div.innerHTML = '<div id="yt-player-element"></div>';
            document.body.appendChild(div);
        }

        const self = this;
        window.onYouTubeIframeAPIReady = () => {
            if (typeof YT !== "undefined" && YT.Player) {
                self.ytPlayer = new YT.Player("yt-player-element", {
                    height: "1",
                    width: "1",
                    videoId: "DWbNTjMz9ks", // Vídeo oficial solicitado pelo usuário
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        loop: 1,
                        playlist: "DWbNTjMz9ks"
                    },
                    events: {
                        onReady: () => {
                            self.ytReady = true;
                            console.log("Player de áudio do YouTube (DWbNTjMz9ks) pronto.");
                        }
                    }
                });
            }
        };
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
        } catch (e) {
            console.warn("Web Audio API desativado:", e);
        }
    }

    toggleMute() {
        this.mutedFX = !this.mutedFX;
        return this.mutedFX;
    }

    toggleMusic() {
        this.init();
        this.musicPlaying = !this.musicPlaying;

        if (this.musicPlaying) {
            this.playYouTubeAudio();
        } else {
            this.pauseYouTubeAudio();
        }

        return this.musicPlaying;
    }

    playYouTubeAudio() {
        if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === "function") {
            try {
                this.ytPlayer.playVideo();
                return;
            } catch (e) {
                console.warn("Erro ao iniciar áudio do YouTube, usando fallback:", e);
            }
        }
        // Fallback para o sintetizador se o YouTube estiver offline ou bloqueado
        this.startBackgroundMusic();
    }

    pauseYouTubeAudio() {
        if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === "function") {
            try {
                this.ytPlayer.pauseVideo();
            } catch (e) {}
        }
        this.stopBackgroundMusic();
    }

    /* FALLBACK SINTETIZADO */
    startBackgroundMusic() {
        if (!this.ctx || this.musicTimer) return;

        const melody = [
            523.25, 587.33, 659.25, 698.46, 783.99, 659.25, 523.25, 587.33,
            659.25, 698.46, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25,
            783.99, 783.99, 880.00, 783.99, 659.25, 523.25, 587.33, 659.25,
            523.25, 440.00, 493.88, 523.25, 587.33, 523.25, 392.00, 523.25
        ];

        const playNote = () => {
            if (!this.musicPlaying || !this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const freq = melody[this.musicStep % melody.length];

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1200, now);

                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.35);

                this.musicStep++;
            } catch (e) {}
        };

        playNote();
        this.musicTimer = setInterval(playNote, 400);
    }

    stopBackgroundMusic() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }

    /* EFEITOS SONOROS DE AÇÃO */
    playClick() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) {}
    }

    playWhoosh() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.18);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch (e) {}
    }

    playDonkey() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(640, now + 0.15);
            osc.frequency.linearRampToValueAtTime(280, now + 0.35);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.38);
        } catch (e) {}
    }

    playTransform() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [392, 493.88, 587.33, 783.99];
            const now = this.ctx.currentTime;
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.22);
            });
        } catch (e) {}
    }

    playDragon() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(90, now);
            osc.frequency.linearRampToValueAtTime(45, now + 0.5);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.5);
        } catch (e) {}
    }

    playVictory() {
        if (this.mutedFX) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            const now = this.ctx.currentTime;
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.12, now + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.12);
                osc.stop(now + i * 0.12 + 0.4);
            });
        } catch (e) {}
    }
}

window.soundFX = new SoundEffects();