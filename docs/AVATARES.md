# Avatares personalizados Vilvel

Asset: `assets/family-vilvel-v2.png`. Generado con herramienta integrada image_gen, tomando como referencia las cuatro fotografías familiares compartidas por el usuario. No se incorporan las fotos originales al repositorio.

Prompt final: hoja de sprites transparente 4 columnas por 3 filas, estilo 3D familiar, parecido facial conservado. Columnas: Ander (gafas negras rectangulares, pelo negro corto, barba), Dama (cabello negro recogido y pendientes), JP (cabello oscuro de lado), Helena (bebé con lazo y ropa rosa en cunita con ruedas). Adultos y JP con camisetas amarillas, hombros rojos, cuello azul y pantalones azul oscuro. Filas: reposo, paso izquierdo, paso derecho; Helena cambia brazos. Figuras completas sin texto ni escenario, fondo alfa transparente. Misma escala por personaje entre filas.

El resultado es ilustrativo. Los rectángulos de recorte se definen por personaje y pose en `room-game.js`; no usar filas uniformes porque la composición generada no tiene alturas idénticas. Se mantiene la hoja anterior para poder revertir. Personalizar personajes permite elegir Familia Vilvel 3D o el estilo dibujado editable.
