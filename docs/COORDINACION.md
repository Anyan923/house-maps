# Coordinación entre IAs

Repositorio: Anyan923/house-maps. Publicación actual: main → Vercel.

Antes de editar: `git fetch origin`, revisar `git status` y actualizar con `git pull --ff-only` cuando el árbol esté limpio. Antes de publicar, volver a traer cambios y revisar la integración. Nunca usar force push ni sobrescribir cambios ajenos. Si main avanza, integrar y verificar antes del push.

## Distribución de archivos
- `assets/adventure.css`: nueva dirección visual y adaptación de pantallas existentes.
- `assets/adventure.js`: presentación del día, sin escrituras ni acceso directo a Firebase. Recibe estado y callbacks de index.html.
- `index.html`: aplicación original, autenticación, Firestore, agenda, álbum, XP. Contiene enlaces a assets, markup del tablero y llamada a renderAdventure.
- `api/chat.js`: asistente existente, sin cambios en esta entrega.
- `docs/EXPERIENCIA.md`: concepto implementado y mecánicas futuras, claramente separadas.

Para reducir conflictos, acordar archivos antes de trabajar simultáneamente. La IA que continúe backend puede conservar el contrato `mountAdventure({getState, openActivity, openSchedule})`, que devuelve una función de render. `getState` necesita blocks, checks y todayDayName. No hay esquema nuevo de Firestore.

## Limitaciones existentes que merecen otra entrega
El contador nuevo es diario; los XP y logros conservan la semántica original. Los registros de actividades simultáneos deben auditarse por concurrencia en Firestore. El frontend autoriza correos, pero las reglas de seguridad reales deben verificarse en Firebase. No se modificaron permisos. Unificar el manejo de fechas de toda la app en America/Bogota antes de admitir familias que viajen: el reloj del nuevo panel usa Bogotá, mientras que el calendario original usa la zona del dispositivo.

## Casa virtual (20 de octubre)
`assets/home-world.js` y `assets/home-world.css` implementan el mapa esquemático de dos pisos a partir de los dibujos suministrados. No se copiaron fotos ni planos originales al repositorio. `mountHomeWorld({getState,openActivity})` devuelve el render que ahora usa `renderHouse`. Las actividades se sugieren por tipo; no se modifica su ubicación en Firestore. Los estilos de personajes se guardan en localStorage; las posiciones son una maqueta temporal, no presencia real ni sincronizada. El altillo no se incluye porque los planos entregados cubren dos pisos. No se implementó reconstrucción automática ni carga de imágenes.

Verificado en navegador con fixture sin Firebase: cambio de piso, selección de Helena/oficina, editor de color y movimiento de Ander hacia el espacio seleccionado. Sintaxis de módulos y diff verificados. No se realizaron escrituras a datos familiares para probar esta entrega.

### Contrato de juegos
`mountHomeWorld` ahora también recibe `completeActivity(bid)` que devuelve `{ok,message}` y expone `render.play(block)`. `completeGameActivity` en index.html escribe mediante `runTransaction` solo la marca del usuario autenticado asignado. No cambiar esto por toggle: repetir un cierre nunca debe desmarcar una actividad. `room-game` mantiene la partida en memoria y la cancela al cambiar a otra habitación. No hay avance de juego persistente ni seguimiento de ubicación. Escenarios y sprites son assets generados; consultar las limitaciones de fidelidad en EXPERIENCIA.md.

Validación de esta revisión: navegador de escritorio y viewport 390×844 sin desbordamiento horizontal; movimiento por flecha cambia posición; error y acierto en objetos; bloqueo de registro hasta confirmar actividad real; cierre con callback simulado; memoria con parejas incorrectas/correctas y final; descanso con iluminación nocturna; arranque completo hasta Google sin errores de consola. Firebase real no fue escrito durante QA. Los sprites transparentes tienen recortes por pose en SVG y animación CSS; se conserva la alternativa dibujada editable.
