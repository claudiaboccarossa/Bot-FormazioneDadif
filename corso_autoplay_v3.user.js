// ==UserScript==
// @name         Corso Auto-Avanzamento Lezioni v3.2
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Avanza automaticamente alla lezione successiva su formazione.dadif.com, con gestione scadenza sessione
// @author       Bot Automatico
// @match        *://formazione.dadif.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL_MS    = 8000;  // controlla ogni 8 secondi
    const POST_CLICK_WAIT      = 20000; // dopo il click aspetta 20s prima di ricontrollare
    const SESSION_WARN_BEFORE  = 90;    // secondi prima della scadenza: ri-clicca la lezione

    // ── Pannello UI ────────────────────────────────────────────────────────────
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'al-panel';
        panel.style.cssText = `
            position:fixed; bottom:20px; left:20px;
            background:#111827; color:#f3f4f6;
            padding:14px 18px; border-radius:12px;
            font-family:monospace; font-size:13px;
            z-index:999999; box-shadow:0 4px 24px rgba(0,0,0,0.6);
            border:1px solid #10b981; min-width:300px; line-height:1.6;
        `;
        panel.innerHTML = `
            <div style="color:#10b981;font-weight:bold;margin-bottom:6px;font-size:14px;">🤖 Auto-Lezione BOT v3.2</div>
            <div id="al-status">⏳ Avvio...</div>
            <div id="al-info" style="color:#9ca3af;font-size:11px;margin-top:3px;"></div>
            <div id="al-session" style="color:#f59e0b;font-size:11px;margin-top:3px;"></div>
            <div style="margin-top:10px;display:flex;gap:8px;">
                <button id="al-stop"  style="background:#ef4444;color:#fff;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;">⏹ Stop</button>
                <button id="al-start" style="background:#10b981;color:#fff;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;">▶ Start</button>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('al-stop').onclick  = () => { running = false; setStatus('⏹ Fermato'); };
        document.getElementById('al-start').onclick = () => { running = true;  lastClickTime = 0; setStatus('▶ Riavviato'); };
    }

    function setStatus(msg) {
        const el = document.getElementById('al-status');
        if (el) el.textContent = msg;
        console.log('[AutoLezione]', msg);
    }
    function setInfo(msg) {
        const el = document.getElementById('al-info');
        if (el) el.textContent = msg;
    }
    function setSession(msg) {
        const el = document.getElementById('al-session');
        if (el) el.textContent = msg;
    }

    // ── Gestione scadenza sessione ──────────────────────────────────────────────

    // Cerca nel DOM il testo "scadrà alle HH:MM" e restituisce i secondi mancanti.
    // Ritorna null se non trovato.
    function getSessionSecondsLeft() {
        const match = document.body.innerText.match(/scadr[àa]\s+alle\s+(\d{1,2}):(\d{2})/i);
        if (!match) return null;

        const now = new Date();
        const expiry = new Date();
        expiry.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);

        // Se l'orario è già passato rispetto a ora, la scadenza è domani
        if (expiry <= now) expiry.setDate(expiry.getDate() + 1);

        return Math.floor((expiry - now) / 1000);
    }

    let sessionReclickDone = false; // evita click multipli per la stessa scadenza

    function checkSessionExpiry() {
        const secs = getSessionSecondsLeft();
        if (secs === null) {
            setSession('');
            return;
        }

        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');

        if (secs <= 0) {
            setSession('⚠️ Sessione scaduta!');
            sessionReclickDone = false; // reset per la prossima sessione
            return;
        }

        setSession(`⏱ Sessione scade in: ${mm}:${ss}`);

        // Ri-clicca la lezione corrente SESSION_WARN_BEFORE secondi prima della scadenza
        if (secs <= SESSION_WARN_BEFORE && !sessionReclickDone && running) {
            sessionReclickDone = true;
            setStatus('🔄 Rinnovo sessione: ri-click lezione...');
            clickNextLesson();
            lastClickTime = Date.now();
        }

        // Reset del flag quando siamo di nuovo lontani dalla scadenza (nuova sessione)
        if (secs > SESSION_WARN_BEFORE + 60) {
            sessionReclickDone = false;
        }
    }

    // ── Logica principale ──────────────────────────────────────────────────────

    function getLessons() {
        return Array.from(document.querySelectorAll('li.list-group-item[onclick]'))
            .filter(li => li.style.display !== 'none');
    }

    // Trova la prima lezione non ancora al 100%
    function findCurrentLesson(lessons) {
        return lessons.find(li => {
            const bar = li.querySelector('.progress-bar[aria-valuenow]');
            return !bar || parseInt(bar.getAttribute('aria-valuenow')) < 100;
        }) || null;
    }

    // Controlla se la lezione corrente è al 100% (nel pannello "Sei al 100%")
    function isCurrentLessonComplete() {
        return /sei al\s*100\s*%/i.test(document.body.innerText);
    }

    // Clicca la prossima lezione da fare (prima non al 100%)
    function clickNextLesson() {
        const lessons = getLessons();
        const next = findCurrentLesson(lessons);

        if (!next) {
            setStatus('🏁 Tutte le lezioni completate!');
            return false;
        }

        const title = next.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
        console.log('[AutoLezione] Click su:', title);
        next.click();
        setInfo(`→ Click su: ${title}`);
        return true;
    }

    // ── Loop ───────────────────────────────────────────────────────────────────
    let running = true;
    let lastClickTime = 0;

    async function mainLoop() {
        while (true) {
            await sleep(CHECK_INTERVAL_MS);

            checkSessionExpiry(); // aggiorna countdown e ri-clicca se necessario

            if (!running) continue;

            const now = Date.now();
            if (now - lastClickTime < POST_CLICK_WAIT) {
                const remaining = Math.round((POST_CLICK_WAIT - (now - lastClickTime)) / 1000);
                setStatus(`⏳ Attendo caricamento... (${remaining}s)`);
                continue;
            }

            if (isCurrentLessonComplete()) {
                setStatus('✅ 100%! Passo alla prossima...');
                await sleep(2500);
                const clicked = clickNextLesson();
                if (clicked) {
                    lastClickTime = Date.now();
                    setStatus('➡️ Click! Attendo caricamento nuova lezione...');
                }
            } else {
                const lessons = getLessons();
                const current = findCurrentLesson(lessons);
                if (current) {
                    const bar = current.querySelector('.progress-bar[aria-valuenow]');
                    const pct = bar ? bar.getAttribute('aria-valuenow') : '?';
                    const title = current.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
                    setStatus(`⏳ In corso: ${pct}%`);
                    setInfo(title);
                } else {
                    setStatus('🔍 Ricerca lezione in corso...');
                }
            }
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ── Avvio ─────────────────────────────────────────────────────────────────
    function init() {
        if (!document.getElementById('al-panel')) {
            createPanel();
            mainLoop();
            console.log('[AutoLezione] Bot v3.2 avviato.');
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1500));
    }

})();