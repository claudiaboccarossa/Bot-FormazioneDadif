# 🤖 Auto-Lezione BOT — formazione.dadif.com

Uno script per avanzare automaticamente tra le lezioni del corso su **formazione.dadif.com**, senza dover cliccare manualmente ogni volta.

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
3. Il bot controlla ogni 8 secondi il progresso della lezione corrente
4. Quando rileva **"Sei al 100%"**, clicca automaticamente la lezione successiva
5. Ripete il ciclo fino al completamento del corso
6. **90 secondi prima della scadenza della sessione**, ri-clicca automaticamente la lezione corrente per evitare interruzioni

### Pannello di controllo

| Elemento | Funzione |
|----------|----------|
| ⏹ Stop  | Mette in pausa il bot |
| ▶ Start | Riprende dopo uno stop |
| ⏱ Sessione scade in: MM:SS | Countdown alla scadenza della sessione (arancione) |

---

## 🧠 Come funziona internamente

Il bot identifica la lezione corrente cercando la prima voce nel menu laterale con una **progress bar inferiore al 100%** (tramite l'attributo `aria-valuenow`). Quando la pagina mostra "Sei al 100%", clicca la voce successiva nella lista e poi attende 20 secondi per dare tempo alla pagina di caricarsi prima di riprendere i controlli.

**Gestione scadenza sessione:** la piattaforma mostra in alto a destra il testo *"Questa Sessione Studio scadrà alle HH:MM"*. Il bot legge quell'orario ad ogni ciclo, lo mostra nel pannello come countdown e, 90 secondi prima della scadenza, ri-clicca automaticamente la lezione corrente per mantenere la sessione attiva. Il valore `SESSION_WARN_BEFORE` (riga 17 dello script) può essere modificato per anticipare o ritardare l'intervento.

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
- **Nuovo:** rilevamento automatico della scadenza della sessione dal testo *"scadrà alle HH:MM"* in pagina
- **Nuovo:** countdown alla scadenza visualizzato nel pannello (in arancione)
- **Nuovo:** ri-click automatico della lezione corrente 90 secondi prima della scadenza, per evitare interruzioni senza intervento manuale

### v3.1 → v3.2 (fix)
- **Fix:** il bot ora identifica correttamente la **prima lezione non completata** nella lista, invece di saltare alla lezione successiva all'ultima al 100%. Questo risolveva un bug per cui, quando la piattaforma sblocca più lezioni contemporaneamente o le lezioni non sono in ordine sequenziale di completamento, il bot saltava lezioni ancora da fare.
- **Fix:** eliminato un ulteriore salto di una lezione nella funzione di navigazione (`clickNextLesson`).

> ⚠️ **Aggiorna lo script in Tampermonkey** copiando il contenuto aggiornato di `corso_autoplay_v3.user.js`.
