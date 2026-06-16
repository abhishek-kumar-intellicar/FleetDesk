# vite-app

Vite + React client-side SPA for FleetDesk (no SSR).

## Development

```bash
cd vite-app
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Routing uses React Router (`react-router-dom`).
- Dashboard, pipeline, devices, and client detail pages use browser `localStorage` for demo data (seeded on first load).
- Clients list and create client use the backend API at `http://dmt2.intellicar.io:11014/api/v1/`.
