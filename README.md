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

### Pannello di controllo

| Pulsante | Funzione |
|----------|----------|
| ⏹ Stop  | Mette in pausa il bot |
| ▶ Start | Riprende dopo uno stop |

---

## 🧠 Come funziona internamente

Il bot identifica la lezione corrente cercando la prima voce nel menu laterale con una **progress bar inferiore al 100%** (tramite l'attributo `aria-valuenow`). Quando la pagina mostra "Sei al 100%", clicca la voce successiva nella lista e poi attende 20 secondi per dare tempo alla pagina di caricarsi prima di riprendere i controlli.

---

## ⚠️ Note importanti

- Tieni la **scheda del browser aperta e visibile** — alcuni browser sospendono le schede in background
- Non chiudere il browser mentre il bot è in esecuzione
- Il bot **non salta** le lezioni: aspetta sempre il completamento al 100% prima di avanzare
- Se il corso viene aggiornato dalla piattaforma e la struttura HTML cambia, lo script potrebbe smettere di funzionare

---

## 🗂️ File inclusi

| File | Descrizione |
|------|-------------|
| `corso_autoplay_v3.user.js` | Script principale da installare in Tampermonkey |
| `README.md` | Questo file |

---

## 📝 Versioni

| Versione | Novità |
|----------|--------|
| v1.0 | Prima versione, selettori generici |
| v2.0 | Selettori specifici per dadif.com |
| v3.0 | Logica basata su `aria-valuenow`, nessuna dipendenza da classi attive |
