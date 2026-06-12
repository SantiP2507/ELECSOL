# ELECSOL — Live Solar Dashboard

Real-time monitoring dashboard for ELECSOL's solar farms in Panama:
**Oro Solar, San Carlos Solar, Mendoza Solar (Las Mendozas), Rodeo Solar, Brillo Solar, Cacao Solar.**

Data comes from the public real-time system (SITR) of Panama's **Centro Nacional de Despacho (CND / ETESA)**.

## How it works

- `index.html` — single-page dashboard (vanilla JS + Chart.js). Auto-refreshes every 60 s.
- `api/data.js` — Vercel serverless function that proxies the CND feeds (avoids CORS):
  - `GET /api/data?f=gen` → `https://sitr.cnd.com.pa/m/pub/data/gen.json` (per-unit live MW)
  - `GET /api/data?f=vert` → `https://sitr.cnd.com.pa/m/pub/data/vert.json` (national demand, MRG)
- Edge-cached 60 s so the CND servers are never hammered.

## Dashboard shows

- Live MW per farm with telemetry status (normal / no telemetry / manual entry)
- Fleet total and each farm's share
- ELECSOL output as % of national solar generation
- National generation mix and national demand
- Session trend chart of fleet output

## Deploy

```bash
npm i -g vercel
vercel deploy --prod
```

No build step, no dependencies.

## Data source & attribution

Public information per **Ley No. 6 de 1997** (Panama). Source must be cited:
**EMPRESA DE TRANSMISIÓN ELÉCTRICA, S.A. (ETESA)** — https://sitr.cnd.com.pa
Values shown are informational; official figures are those published by ETESA.

## Notes

- Farm names match the CND feed exactly (`Las Mendozas Solar`, `Rodeo Solar`, etc.). If CND renames a unit, update the `FARMS` list at the top of `index.html`.
- Solar output is 0 MW at night — that's the sun, not a bug.
