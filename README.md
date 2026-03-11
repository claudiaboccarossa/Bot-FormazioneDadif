# 🤖 Auto-Lezione BOT — formazione.dadif.com

Uno script per avanzare automaticamente tra le lezioni del corso su **formazione.dadif.com**, senza dover cliccare manualmente ogni volta.
(Crediti idea a L.Carucci)
---

## 📋 Requisiti

- Browser **Google Chrome** (o Firefox)
- Estensione **Tampermonkey** installata

---

## ⚙️ Installazione

### 1. Installa Tampermonkey
Vai sul Chrome Web Store e cerca **Tampermonkey**, poi clicca *Aggiungi a Chrome* e conferma.

### 2. Installa lo script
1. Clicca sull'icona di Tampermonkey in alto a destra nel browser
2. Seleziona **Dashboard**
3. Clicca sulla scheda **Utilità** oppure sul pulsante **+** per creare un nuovo script
4. Cancella tutto il testo già presente nell'editor
5. Incolla il contenuto del file `corso_autoplay_v3.user.js`
6. Premi `Ctrl + S` per salvare

---

## 🚀 Utilizzo

1. Vai su [formazione.dadif.com](https://formazione.dadif.com) e apri il corso
2. Lo script si avvia automaticamente — comparirà un **pannello verde** in basso a sinistra
3. Il bot clicca automaticamente la lezione corrente e avvia il video
4. Controlla ogni 8 secondi il progresso della lezione
5. Quando rileva **"Sei al 100%"**, clicca automaticamente la lezione successiva e avvia il video
6. Ripete il ciclo fino al completamento del corso
7. **90 secondi prima della scadenza della sessione**, ricarica la pagina, chiude il popup, ri-clicca la lezione e avvia il video

### Pannello di controllo

| Elemento | Funzione |
|----------|----------|
| ⏹ Stop  | Mette in pausa il bot |
| ▶ Start | Riprende dopo uno stop |
| ⏱ Sessione scade in: MM:SS | Countdown alla scadenza della sessione (arancione) |

---

## 🧠 Come funziona internamente

Il bot identifica la lezione corrente cercando la prima voce nel menu laterale con una **progress bar inferiore al 100%** (tramite l'attributo `aria-valuenow`). All'avvio, se non c'è ancora nessun video caricato, clicca subito la lezione per aprirla e poi avvia il video. Quando la pagina mostra "Sei al 100%", clicca la voce successiva nella lista, attende 4 secondi che il video carichi e clicca play. Poi attende 20 secondi prima di riprendere i controlli.

**Gestione scadenza sessione:** la piattaforma mostra in alto a destra il testo *"Questa Sessione Studio scadrà alle HH:MM"*. Il bot legge quell'orario ad ogni ciclo, lo mostra nel pannello come countdown e, 90 secondi prima della scadenza, **ricarica la pagina** per rinnovare la sessione. Al riavvio, chiude automaticamente il popup "Messaggio Sessione Studio", clicca la lezione corrente e avvia il video. Il valore `SESSION_WARN_BEFORE` (riga 17 dello script) può essere modificato per anticipare o ritardare l'intervento.

---

## ⚠️ Note importanti

- Tieni la **scheda del browser aperta e visibile** — alcuni browser sospendono le schede in background
- Non chiudere il browser mentre il bot è in esecuzione
- Il bot **non salta** le lezioni: aspetta sempre il completamento al 100% prima di avanzare
- Se il corso viene aggiornato dalla piattaforma e la struttura HTML cambia, lo script potrebbe smettere di funzionare

---
✅ Puoi fare:

Aprire altre schede e navigare su altri siti
Usare altre applicazioni sul PC

⚠️ Non devi:

Chiudere o ricaricare la scheda del corso — il bot vive in quella scheda e si azzera
Mettere in sleep/ibernazione il PC — lo script si ferma

---

## 🗂️ File inclusi

| File | Descrizione |
|------|-------------|
| `corso_autoplay_v3.user.js` | Script principale da installare in Tampermonkey |
| `README.md` | Questo file |

---

## 📝 Changelog

### v3.2 → v3.3
- **Nuovo:** click automatico sulla lezione all'avvio (non serve più aprire manualmente la lezione)
- **Nuovo:** click automatico sul play del video dopo ogni cambio lezione e all'avvio
- **Nuovo:** rilevamento automatico della scadenza della sessione dal testo *"scadrà alle HH:MM"* in pagina
- **Nuovo:** countdown alla scadenza visualizzato nel pannello (in arancione)
- **Nuovo:** 90 secondi prima della scadenza, ricarica automatica della pagina per rinnovare la sessione
- **Nuovo:** chiusura automatica del popup "Messaggio Sessione Studio" ad ogni caricamento della pagina
- **Fix:** dopo il reload da scadenza sessione, il bot ri-clicca la lezione e avvia il video senza intervento manuale

### v3.1 → v3.2 (fix)
- **Fix:** il bot ora identifica correttamente la **prima lezione non completata** nella lista, invece di saltare alla lezione successiva all'ultima al 100%. Questo risolveva un bug per cui, quando la piattaforma sblocca più lezioni contemporaneamente o le lezioni non sono in ordine sequenziale di completamento, il bot saltava lezioni ancora da fare.
- **Fix:** eliminato un ulteriore salto di una lezione nella funzione di navigazione (`clickNextLesson`).

> ⚠️ **Aggiorna lo script in Tampermonkey** copiando il contenuto aggiornato di `corso_autoplay_v3.user.js`.
