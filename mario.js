// riferimento agli elementi HTML
var mario = document.getElementById("mario");
var minimario = document.getElementById("minimario");
var tubo = document.getElementById("koopa");
var fungo = document.getElementById("goomba");
var ghost = document.getElementById("ghost");
var punteggio = document.getElementById("score");
var timerDisplay = document.getElementById("timer");
var musicaDiSfondo = document.getElementById("background-music");
var suonoDiSalto = document.getElementById("jump-sound");
var btnInizia = document.getElementById("start-btn");
var muteButton = document.getElementById("mute-button");

// Variabili di stato
var isMuted = false;
var timerInterval;
var tempo = 0;

// listener per il click al pulsante di inizio
btnInizia.addEventListener("click", function () {
    // Avvia il gioco qui
    musicaDiSfondo.play(); // Avvia la musica di sfondo
    btnInizia.style.display = "none"; // Nascondi il pulsante di inizio
    document.getElementById("game-container").style.display = "block"; // Mostra il contenitore di gioco
    iniziaGioco(); // Chiama la funzione per iniziare il gioco
    startTimer(); // Avvia il timer
});

// listener per il click sul pulsante mute/unmute
muteButton.addEventListener("click", function () {
    if (isMuted) {
        musicaDiSfondo.play(); // Riprendi la musica di sfondo
        muteButton.src = "./assets/unmute.webp"; // Cambia immagine a unmute
    } else {
        musicaDiSfondo.pause(); // Metti in pausa la musica di sfondo
        suonoDiSalto.pause(); // Metti in pausa il suono di salto
        suonoDiSalto.currentTime = 0; // Riavvia il suono del salto per essere pronti per la prossima riproduzione
        muteButton.src = "./assets/mute.png"; // Cambia immagine a mute
    }
    isMuted = !isMuted; // Cambia lo stato di mute
});

// Funzione per avviare il timer
function startTimer() {
    timerInterval = setInterval(function () {
        tempo++; // Incrementa il tempo di gioco
        timerDisplay.innerText = `Tempo: ${tempo}s`; // Aggiorna il display del timer
    }, 1000); // Incrementa il tempo ogni secondo
}

// Funzione per fermare il timer
function stopTimer() {
    clearInterval(timerInterval); // Ferma l'intervallo del timer
}

// funzione per iniziare il gioco
function iniziaGioco() {
    // Inizializza le variabili di stato del gioco
    var marioSalta = false;
    var marioSiMuoveDestra = false;
    var marioSiMuoveSinistra = false;
    var ostacoli = [tubo, ghost, fungo]; // Array contenente gli ostacoli
    var punteggioGioco = 0; // Punteggio iniziale
    punteggio.innerText = punteggioGioco; // Aggiorna il punteggio nell'HTML
    var larghezzaContenitoreGioco = document.getElementById("game-container").offsetWidth; // Larghezza del contenitore di gioco
    var posizioneMario = 400; // Posizione iniziale di Mario

    // funzione per far saltare Mario
    function salta() {
        if (!marioSalta) {
            marioSalta = true; // Imposta Mario in stato di salto
            if (!isMuted) {
                suonoDiSalto.play(); // Riproduci il suono di salto
            }

            // parametri per l'animazione del salto
            var posIniziale = 50;
            var posFinale = 180;
            var velocita = 5;

            // Intervallo per l'animazione del salto
            var intervalloSalto = setInterval(function () {
                if (posIniziale < posFinale) {
                    posIniziale += velocita;
                    mario.style.bottom = posIniziale + "px"; // Aggiorna la posizione verticale di Mario
                } else {
                    clearInterval(intervalloSalto); // Interrompi l'intervallo quando il salto è completato
                    caduta(); // Esegui la fase di caduta
                }
            }, 20); // tempo per l'animazione del salto
        }
    }

    // funzione per far cadere Mario dopo il salto
    function caduta() {
        var posIniziale = 180;
        var posFinale = 60;
        var velocita = 8;

        // Intervallo per l'animazione della caduta
        var intervalloCaduta = setInterval(function () {
            if (posIniziale > posFinale) {
                posIniziale -= velocita;
                mario.style.bottom = posIniziale + "px"; // Aggiorna la posizione verticale di Mario
            } else {
                clearInterval(intervalloCaduta); // Interrompi l'intervallo quando la caduta è completata
                marioSalta = false; // Ripristina lo stato di Mario a terra
            }
        }, 20); // Intervallo di tempo per l'animazione della caduta
    }

    // funzione per muovere Mario a sinistra o a destra
    function muoviMario(direzione) {
        var posizioneProposta = posizioneMario + (direzione === "destra" ? 20 : -20); // Calcola la nuova posizione proposta di Mario
        var posizioneMassimaMario = larghezzaContenitoreGioco - mario.offsetWidth; // Calcola la posizione massima di Mario nel contenitore

        // Controlla che la nuova posizione proposta sia all'interno del contenitore di gioco
        if (posizioneProposta >= 0 && posizioneProposta <= posizioneMassimaMario) {
            posizioneMario = posizioneProposta;
            mario.style.left = posizioneMario + "px"; // Imposta la nuova posizione di Mario
            // Aggiorna la classe CSS per il flip di Mario se si muove a sinistra
            if (direzione === "destra") {
                mario.classList.remove("flipped");
            } else {
                mario.classList.add("flipped");
            }
        }
    }

    // funzione per verificare la collisione tra Mario e un ostacolo
    function verificaCollisione(posizioneOstacolo) {
        return posizioneOstacolo < posizioneMario + 100 && posizioneOstacolo > posizioneMario; // Verifica se Mario collide con l'ostacolo
    }

    // funzione per muovere un ostacolo
    function muoviOstacolo(ostacolo) {
        var larghezzaContenitoreGioco = document.getElementById("game-container").offsetWidth; // Larghezza del contenitore di gioco
        var posizioneOstacolo = Math.random() < 0.5 ? -60 : larghezzaContenitoreGioco + 60; // Posizione iniziale casuale (a sinistra o a destra fuori dal contenitore)
        var direzione = posizioneOstacolo < 0 ? 1 : -1; // Direzione del movimento (1 per destra, -1 per sinistra)
        var velocitaOstacolo = 10; // Velocità iniziale dell'ostacolo

        // Imposta la posizione iniziale dell'ostacolo
        ostacolo.style.left = posizioneOstacolo + "px";
        ostacolo.style.display = "block"; // Mostra l'ostacolo

        // Flippa l'ostacolo se compare sul lato sinistro
        if (direzione === 1) {
            ostacolo.classList.add('flipped');
        } else {
            ostacolo.classList.remove('flipped');
        }

        // Intervallo per muovere l'ostacolo
        var timerOstacolo = setInterval(function () {
            if ((direzione === 1 && posizioneOstacolo > larghezzaContenitoreGioco) || 
                (direzione === -1 && posizioneOstacolo < -60)) {
                ostacolo.style.display = "none"; // Nascondi l'ostacolo quando esce dallo schermo
                posizioneOstacolo = Math.random() < 0.5 ? -60 : larghezzaContenitoreGioco + 60; // Riposiziona l'ostacolo fuori dallo schermo in posizione casuale
                direzione = posizioneOstacolo < 0 ? 1 : -1; // Reimposta la direzione del movimento
                velocitaOstacolo += 2; // Aumenta la velocità dell'ostacolo

                // Flippa l'ostacolo se compare sul lato sinistro
                if (direzione === 1) {
                    ostacolo.classList.add('flipped');
                } else {
                    ostacolo.classList.remove('flipped');
                }

                setTimeout(() => {
                    ostacolo.style.display = "block"; // Mostra l'ostacolo dopo un breve ritardo
                }, 100);
                punteggioGioco++; // Incrementa il punteggio
                punteggio.innerText = punteggioGioco; // Aggiorna il punteggio nell'HTML
            } else if (verificaCollisione(posizioneOstacolo) && marioSalta) {
                posizioneOstacolo += direzione * velocitaOstacolo; // Muovi l'ostacolo utilizzando la velocità corrente
            } else if (verificaCollisione(posizioneOstacolo) && !marioSalta) {
                clearInterval(timerOstacolo); // Interrompi il movimento dell'ostacolo
                // Ferma l'animazione di tutti gli ostacoli
                ostacoli.forEach(function (ostacolo) {
                    ostacolo.style.animationPlayState = "paused";
                });
                // Richiedi la ricarica della pagina dopo aver mostrato un messaggio di Game Over
                if (confirm("GAME OVER! Hai ucciso: " + punteggioGioco + " mostri rimanendo in vita " + tempo +" sec")) {
                    location.reload();
                } else {
                    location.reload();
                }
            } else {
                posizioneOstacolo += direzione * velocitaOstacolo; // Muovi l'ostacolo utilizzando la velocità corrente
            }

            ostacolo.style.left = posizioneOstacolo + "px"; // Aggiorna la posizione dell'ostacolo nell'HTML
        }, Math.random() * (200 - 50) + 50); // Imposta un intervallo di tempo casuale per il movimento dell'ostacolo
    }

    // listener per la pressione dei tasti della tastiera
    window.addEventListener("keydown", function (evento) {
        switch (evento.key) {
            case " ":
                salta(); // Se viene premuto lo spazio, fa saltare Mario
                break;
            case "d":
                marioSiMuoveDestra = true; // Se viene premuto "d", Mario si muove a destra
                break;
            case "a":
                marioSiMuoveSinistra = true; // Se viene premuto "a", Mario si muove a sinistra
                break;
            case "D":
                marioSiMuoveDestra = true; // Se viene premuto "D", Mario si muove a destra
                break;
            case "A":
                marioSiMuoveSinistra = true; // Se viene premuto "A", Mario si muove a sinistra
                break;
        }
    });

    // listener per il rilascio dei tasti della tastiera
    window.addEventListener("keyup", function (evento) {
        switch (evento.key) {
            case "d":
                marioSiMuoveDestra = false; // Quando viene rilasciato "d", Mario smette di muoversi a destra
                break;
            case "a":
                marioSiMuoveSinistra = false; // Quando viene rilasciato "a", Mario smette di muoversi a sinistra
                break;
            case "D":
                marioSiMuoveDestra = false; // Quando viene rilasciato "D", Mario smette di muoversi a destra
                break;
            case "A":
                marioSiMuoveSinistra = false; // Quando viene rilasciato "A", Mario smette di muoversi a sinistra
                break;
        }
    });

    // Imposta un intervallo per muovere continuamente Mario a destra o a sinistra in base all'input
    setInterval(function () {
        if (marioSiMuoveDestra) {
            muoviMario("destra"); // Muovi Mario a destra se il tasto "d" o "D" è premuto
        } else if (marioSiMuoveSinistra) {
            muoviMario("sinistra"); // Muovi Mario a sinistra se il tasto "a" o "A" è premuto
        }
    }, 100); // Esegui l'intervallo ogni 100 millisecondi

    // Mostra gli ostacoli uno per uno dopo un certo ritardo e muovili
    ostacoli.forEach(function (ostacolo, indice) {
        setTimeout(function () {
            ostacolo.style.display = "block"; // Mostra l'ostacolo
            muoviOstacolo(ostacolo); // Muovi l'ostacolo
        }, indice * 2000); // Ritarda l'inizio del movimento di ogni ostacolo di 2 secondi
    });
}
