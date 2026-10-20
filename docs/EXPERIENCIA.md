# House Mapp · Un hogar, un equipo

## Promesa
Abrir la app, encontrar el siguiente momento compartido, vivirlo y guardar su huella. El éxito es facilitar la vida familiar con consultas breves; el tiempo dentro de la app no es el objetivo.

## Dirección visual implementada
Un pequeño mundo cálido: verde jardín, papel crema, acentos terracota y tipografía editorial Fraunces. La casa es el centro emocional. Sus ventanas representan días con actividad de la semana (no habitaciones desbloqueadas). El tablero combina el mapa y la siguiente actividad; en móvil se apilan. La agenda, álbum, perfiles y logros mantienen sus funciones existentes.

## Un juego que acompaña todo el día
- Mañana: elegir el rumbo, oración, desayuno y aprendizaje.
- Tarde: explorar, cuidar la casa y compartir tiempo.
- Noche: bajar el ritmo, agradecer, recordar y descansar.

Los adultos operan la herramienta. José Pablo participa en las actividades reales acompañado; Helena recibe cuidado, no tareas ni obligaciones de interacción. Los perfiles infantiles existentes representan participación familiar, nunca una evaluación de su valor o desarrollo.

## Ciclo de interacción
1. Señal contextual: la hora de Bogotá selecciona el momento inicial.
2. Decisión pequeña: una actividad pendiente de ese momento, en orden de agenda.
3. Acción real: leer el detalle y vivirla fuera de la pantalla.
4. Registro: usar los controles existentes de agenda/misiones.
5. Respuesta visible: XP existente, progreso del día y ventanas de la semana.
6. Cierre: si no quedan actividades en ese momento, invitar a descansar.

El botón «Explorar» abre detalles; no marca automáticamente la actividad. El contador considera completa una actividad cuando todos sus participantes asignados están marcados.

## Adherencia por conexión
Tomamos como patrones de diseño la identidad, progreso visible, objetivos pequeños, respuesta inmediata y recuerdos compartidos. Son hipótesis de producto; no se afirma haber medido su eficacia en esta familia. Las recompensas deben ser predecibles y cooperativas. No implementar feed infinito, premios aleatorios, presión por volver, rankings entre familiares ni castigos por ausencias. La racha existente se presenta como celebración; su cómputo no se modificó.

## Próximas mecánicas (diseñadas, aún no implementadas)
- Construcción persistente: jardín, biblioteca y mesa familiar como hitos colectivos; requiere modelo de datos y transacciones idempotentes.
- Acuerdo diario: los adultos eligen hasta tres prioridades realistas y pueden reprogramarlas sin penalización.
- Cierre del día: una gratitud y una foto opcional; los recuerdos permanecen aunque no haya racha.
- Pausa familiar: simplificar la agenda ante enfermedad, cansancio o viajes.
- Álbum finito por día con reacciones privadas de los adultos.

No asociar premios a sueño, comida o hitos del bebé. No usar XP como comparación de afecto, fe o rendimiento de los niños.

## Evaluación propuesta
Preguntar semanalmente si la agenda redujo fricción, si ambos adultos pudieron participar y si la app se sintió como ayuda o carga. Evaluar tareas encontradas/completadas y facilidad de reprogramación, sin añadir telemetría ni perseguir minutos de pantalla.

## Validación de esta entrega
Sintaxis de módulos verificada. Acceso inicial y tablero revisados en navegador con un fixture local aislado de Firebase. Selección de momentos comprobada. El fixture no se publica. La escritura autenticada, sincronización entre dispositivos y carga real de fotos requieren una sesión autorizada y no se probaron en esta entrega.
