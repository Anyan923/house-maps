# Revisión de experiencia: compañía familiar por voz

## Problema corregido
La experiencia principal requería navegar, jugar minijuegos y marcar pasos para registrar rutinas. Se reemplaza esa entrada por una sesión conversacional que acompaña la actividad real. El mapa y las aventuras visuales siguen disponibles como exploración opcional; el registro diario deja de depender de ellos.

## Implementado
- Inicio explícito de micrófono, respuestas habladas, alternancia entre escuchar y hablar y reanudación de escucha mientras la app está visible. No requiere tocar cada turno.
- «Empecemos» selecciona la próxima actividad pendiente; «listo» registra la actividad activa. «Ya terminé el desayuno» registra directamente si identifica una sola actividad pendiente del adulto autenticado. Ambigüedades se resuelven con nombre o número por voz. Negaciones, preguntas y futuro no confirman logros.
- «Deshacer» revierte el último registro creado por esta conversación, solo para ese adulto y el día actual, mediante transacción. Registros repetidos no suman XP. No se atribuyen automáticamente logros a otros integrantes.
- Celebración hablada, siguiente paso y aviso del horario en la sesión activa; actualización del avance. Nuevos logros de otros integrantes se celebran cuando llegan por la suscripción de agenda y la compañía está activa.
- Canal interno: «Dile a Dama que…», se repite el mensaje y «enviar» lo confirma. Últimos 30 textos en `families/vilvel.familyMessages`, por transacción; destinatario Ander, Dama o familia. Lectura en voz alta solo con compañía activa; historial visible en app. No llamadas ni audio almacenado. No prueba mensajes reales enviada por el agente.
- Consultas abiertas por `/api/chat` con agenda pertinente y conversación reciente, máximo ocho turnos en memoria. Las respuestas IA nunca ejecutan acciones ni se interpretan como comandos. Fallback local cuando API falla.
- Pantalla de acompañamiento con estado real del micrófono, animación ambiental, progreso y acceso secundario al mundo/avatar; modo de movimiento reducido.

## Límites y trabajo restante para el producto completo
No observa ni verifica automáticamente la actividad física: necesita una frase o una integración futura con sensores. La escucha se pausa al ocultar/bloquear el teléfono, al cerrar sesión y ante errores; puede necesitar reinicio manual en Safari. No promete escucha permanente, palabra de activación en segundo plano ni identificación de hablantes. Un iPhone representa al adulto que inició sesión.

No hay llamadas de voz en directo, notificaciones push ni alertas con app cerrada. Para una compañía fiable con pantalla bloqueada hace falta diseñar y validar una implementación nativa/servicios del sistema, distribución en iPhone, permisos y backend de notificaciones. Web Push en iOS requiere instalación en pantalla de inicio y autorización; no concede escucha en segundo plano.

El entorno sigue siendo ilustrado con animación CSS, no un mundo 3D navegable. Este cambio resuelve el flujo de acompañamiento, no esa reconstrucción gráfica. Las acciones de agenda soportadas son consultar, iniciar, registrar y deshacer; edición/reprogramación sigue en agenda.

## Validación
`node --test tests/voice-intents.test.mjs`: ocho pruebas de identificación, negaciones, ambigüedad, actividad activa, elecciones habladas, permisos por integrante y mensajes. Navegador con fixture aislada verifica registro sin casillas, deshacer, envío tras confirmación y ausencia de errores. Pendiente comprobar reconocimiento real, turnos audio/micrófono, interrupciones y dos cuentas en ambos iPhone; no se simula que esas pruebas ya pasaron.

Fuentes revisadas:
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/

Prueba adicional con reconocimiento y síntesis simulados: inicia, escucha, procesa una frase, registra, celebra, retoma escucha y pausa. Vista móvil 390 px sin desbordamiento horizontal. Esta simulación no sustituye la prueba en Safari real.
