# House Mapp

Agenda familiar cooperativa para convertir las rutinas en pequeños momentos compartidos.

- Producción: https://house-maps.vercel.app
- Sin build: servir la raíz con `python3 -m http.server 8766`.
- HTML y módulos JavaScript nativos; Firebase Auth y Firestore; función Vercel en `api/chat.js`.
- La API de chat necesita el entorno de Vercel; el servidor estático local no la ejecuta.
- Cada push a main activa el deploy configurado en Vercel.

Concepto y alcance: [docs/EXPERIENCIA.md](docs/EXPERIENCIA.md).
Coordinación entre IAs: [docs/COORDINACION.md](docs/COORDINACION.md).
