# Aggiornamenti Dashboard Strava

## Nuove Funzionalità

### 1. Tabella "Ultime 4 nuotate"
- Posizionata nella sezione in basso del dashboard
- Mostra le ultime 4 sessioni di nuoto con:
  - Data dell'allenamento
  - Passo reale per 100m (formato MM:SS)
  - Distanza totale nuotata
- Il passo è calcolato usando gli stream di Strava per escludere le pause

### 2. Calcolo del Passo Reale
Il nuovo algoritmo:
- Usa l'API `/activities/{id}/streams` di Strava per ottenere dati temporali dettagliati
- Identifica i secondi di nuoto attivo basandosi su:
  - Flag `moving` di Strava
  - Incremento della distanza > 0.1m
  - Cadenza delle bracciate > 0
- Applica filtri per:
  - Chiudere gap brevi (≤2s) 
  - Richiedere pause minime (≥5s)
- Calcola il passo finale solo sui secondi di movimento attivo

### 3. Frequenza Actions Aggiornata
- La GitHub Action ora gira ogni 20 minuti invece che ogni ora
- Più reattiva per nuovi allenamenti (entro 20 minuti max)

## File Modificati

### Backend/Fetch
- `fetch-strava-activities.js`: Aggiunta logica per calcolare passo reale nuoto
- `.github/workflows/main.yml`: Frequenza cambiata a 20 minuti, aggiunto `swim-paces.json`

### Frontend
- `src/components/dashboard/SwimPacesTable.tsx`: Nuovo componente tabella 2x2
- `src/pages/DashboardPage.tsx`: Integrata tabella nel layout, fetch di `swim-paces.json`

## API Utilizzate
- `GET /activities/{id}/streams` con keys: `["time", "distance", "moving", "cadence"]`
- Limite di 8 nuotate recenti per rispettare rate limits Strava

## File Generati
- `public/swim-paces.json`: Contiene passo reale per le ultime nuotate

## Come Testare
1. Esegui la workflow manualmente su GitHub Actions
2. Verifica che `swim-paces.json` sia generato con dati recenti
3. Controlla che la tabella appaia nel dashboard con i passi formattatati correttamente