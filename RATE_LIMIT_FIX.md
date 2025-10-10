# Fix Rate Limit Strava + Tabella Nuoto Vuota

## Problema Identificato

### Rate Limit Eccesso
**Configurazione precedente:**
- Frequenza: ogni 20 minuti (72 run/giorno)
- Chiamate per run: ~63 (1 token + 1 athlete + 1 stats + ~5 activities + 24 detailed + 24 zones + 8 streams)
- **Totale giornaliero: ~4536 richieste** ❌ (limite: 1000/giorno)
- **Totale ogni 15min: ~189 richieste** ❌ (limite: 100/15min)

**Risultato:** Rate limit raggiunto entro 3-4 ore dall'inizio giornata.

### Tabella Nuoto Vuota
Il file `swim-paces.json` era `[]` perché:
1. Lo script falliva per rate limit PRIMA di arrivare al calcolo nuoto
2. Nessun graceful degradation - tutto falliva

## Soluzione Implementata

### 1. Riduzione Frequenza ⏰
```yaml
# Da: ogni 20 minuti
- cron: '*/20 * * * *'

# A: ogni 2 ore
- cron: '0 */2 * * *'
```
**Beneficio:** 12 run/giorno invece di 72 → riduzione 83% delle chiamate totali

### 2. Riduzione Limiti per Chiamate Extra 📉
```yaml
env:
  BEST_EFFORTS_LIMIT: 6    # era 24
  ZONES_LIMIT: 6           # era 24
  SWIM_PACE_LIMIT: 4       # era 8
```

**Nuovo calcolo per run:**
- 1 token + 1 athlete + 1 stats = 3
- ~5 activities paginate = 5
- 6 detailed activities = 6
- 6 zones = 6
- 4 streams nuoto = 4
- **Totale: ~24 richieste/run** ✅

**Totale giornaliero:** 12 run × 24 = **288 richieste/giorno** ✅ (sotto il limite di 1000)
**Totale ogni 15min:** max 24 richieste ✅ (sotto il limite di 100)

### 3. Graceful Degradation 🛡️
Aggiunta gestione intelligente rate limit:
- Se rate limit durante best efforts → salva quelli già ottenuti e continua
- Se rate limit durante zones → salva quelle già ottenute e continua  
- Se rate limit durante nuoto → salva quelle già calcolate e continua
- Script non fallisce più con exit(1) per rate limit, usa exit(0) con warning
- Deploy avviene con dati parziali invece di fallire completamente

### 4. Logging Migliorato 📊
```javascript
console.log(`Fetching best efforts for ${recentRunIds.length} runs...`);
console.log(`Fetching zones for ${recentForZones.length} activities...`);
console.log(`Calculating real pace for ${recentSwimActivities.length} recent swim activities...`);
console.log(`✅ Generated swim-paces.json with ${swimPaces.length} entries.`);
```

## Risultati Attesi

### Tabella Nuoto
- ✅ Mostrerà le ultime 4 nuotate con passo reale
- ✅ Si aggiornerà ogni 2 ore se ci sono nuove nuotate
- ✅ Dati parziali se rate limit viene raggiunto

### Rate Limits
- ✅ **Margine sicurezza giornaliero:** 712 richieste disponibili (71% del limite)
- ✅ **Margine sicurezza 15min:** 76 richieste disponibili (76% del limite)
- ✅ Script continua anche con rate limit parziale

## Come Verificare

### 1. Check GitHub Actions
```bash
# Vai su https://github.com/markegidiDev/markegidiDev.github.io/actions
# Verifica che i run NON falliscano più per rate limit
```

### 2. Check JSON Generati
```powershell
# Verifica swim-paces.json
Invoke-WebRequest -Uri "https://markegidiDev.github.io/swim-paces.json" | Select-Object -ExpandProperty Content

# Dovrebbe mostrare array con dati, non []
```

### 3. Check Dashboard
```
https://markegididev.github.io/dashboard
# La sezione "Ultime 4 nuotate" dovrebbe mostrare dati
```

## Opzioni Avanzate (Se Serve Più Dati)

### Opzione A: Aumenta Frequenza Solo di Notte
```yaml
# Run ogni ora dalle 00:00 alle 08:00, ogni 4 ore il resto del giorno
- cron: '0 0-8 * * *'    # Ogni ora di notte
- cron: '0 */4 9-23 * * *'  # Ogni 4 ore di giorno
```

### Opzione B: Usa Strava Webhooks
Invece di polling, ricevi notifiche push quando aggiungi attività.
Richiede server con endpoint pubblico.

### Opzione C: Paga Strava API
Piano Enterprise offre rate limits più alti.

## Monitoraggio

Controlla i log delle Actions per:
```
⚠️ Rate limit hit while fetching...
✅ Generated swim-paces.json with X entries
```

Se vedi rate limit warnings ma lo script completa, significa che sta salvando dati parziali correttamente.
