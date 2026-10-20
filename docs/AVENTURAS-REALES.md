# El corazón de House Mapp: explorar, ensayar, vivir, recordar

Referencia revisada: https://ask.jig.com/ y su ejemplo https://ask.jig.com/j/V7DtyB2BrAMV (explicación de un procedimiento sobre bicicleta). Adaptación original del patrón de exploración y guía, sin reutilizar código ni recursos de Jig.

Implementación: `assets/real-adventure.js` reemplaza los minijuegos genéricos de `room-game.js`. Siete recorridos por tipo: comida, hogar, escuela, familia, sueño, oración y trabajo; los otros tipos conservan el título/descripción de agenda y usan una guía general. Explorar tres objetos, practicar la secuencia, realizar tres pasos fuera de pantalla y confirmar el logro real. El recorrido del día está primero y abre directamente la experiencia.

El progreso intermedio se conserva localmente por usuario, fecha y actividad. La reflexión es opcional, local y se elimina del almacenamiento al completar el recorrido. Solo la confirmación final registra el logro mediante la transacción existente; práctica no escribe XP. Tras completar se ofrece la siguiente actividad pendiente del adulto autenticado. Se puede salir, volver atrás y reanudar. Un cambio de habitación cancela la vista conservando el avance.

Límites: perspectiva CSS e ilustraciones, no modelos 3D rotables ni generación arbitraria de simulaciones como Jig. No existe verificación automática de la actividad física. Los pasos son plantillas por categoría; no son instrucciones personalizadas por IA para cualquier título. Progreso intermedio no sincronizado entre dispositivos; logros sí usan Firestore.

Pruebas: sintaxis módulos y módulo principal; navegador con datos aislados, exploración, orden incorrecto, secuencia correcta, paso real, recarga/reanudación, bloqueo del registro sin confirmación y finalización única. Sin escrituras de prueba en Firebase familiar.
