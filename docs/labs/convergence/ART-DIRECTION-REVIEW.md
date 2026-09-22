# CONVERGENCE — revisión de dirección artística

22 de septiembre de 2026. Revisión sobre la implementación existente, con diagnóstico visual antes de leer el código y tres ciclos de cambios e inspección.

## Siete debilidades y correcciones

1. **Composición sin jerarquía espacial.** Las partículas, barras y texto compartían el mismo plano y se tapaban. La escena tiene ahora un área reservada; el texto ocupa una columna editorial. Móvil utiliza una composición vertical y un área propia para el producto.
2. **Cámara sin encuadres sostenidos.** El movimiento continuo y las aproximaciones recortaban el objeto. La cámara mantiene cada capítulo, cambia durante las transiciones y abre el encuadre durante la separación de las piezas.
3. **Iluminación ilegible.** Los negros se fundían y las sombras de baja resolución tenían dientes. Se sustituyen por iluminación de estudio y un campo de reflejos generado una vez, sin mapas de sombras por fotograma.
4. **Materiales sin carácter.** Los prismas oscuros carecían de bordes y respuesta superficial. Ahora hay biseles, distintas rugosidades, metal satinado, insertos mates y pequeños detalles de ensamblaje. El ámbar está reservado a la entrada y a la señal activa.
5. **Ritmo sin tensión ni resolución.** Las capas se acumulaban y la física no producía un momento de contacto repetible al retroceder. El ensamblaje tiene aproximación, separación adicional, pausa, cierre breve y asentamiento. El movimiento está dirigido por scroll, no es una simulación física. El sonido sigue siendo optativo: anticipación tenue, golpe breve y silencio.
6. **Tipografía y controles demasiado uniformes.** El largo titular final competía con un panel flotante; en móvil desaparecían las etiquetas. Se reduce la copia final, se cambian las proporciones, se separan entrada y salida del texto entre capítulos y los controles quedan integrados en la columna. Las etiquetas móviles permanecen visibles.
7. **Producto desconectado del relato.** La última escena parecía otra escultura. Las mismas tres piezas atraviesan las fases y se ensamblan en el Signal Composer: entrada, seis canales de organización y salida. La selección levanta un canal, el envío lo recorre y la salida se ilumina después de la llegada.

## Sustracción

- Campo de 1.200–4.200 partículas sustituido por 100–260 señales con dirección hacia la entrada.
- Eliminados: grafo de nodos, planos/grillas auxiliares, anillo de impacto, sacudida y flash de exposición, grano, sombras dinámicas dentadas y panel de cristal desenfocado.
- Eliminado el seguimiento global del cursor. La reacción del campo queda local a la trayectoria de la señal.
- Eliminado `@react-three/rapier` y sus dependencias transitivas: no se carga WASM para el ensamblaje dirigido.
- El modo de lectura utiliza imágenes de los mismos encuadres, conserva los controles HTML y desmonta WebGL.

## Verificación

- Recorrido completo mediante scroll y navegación de las seis fases; capturas de cada fase en `evidence/art-direction/`.
- Escritorio: 1440×900 y 1920×1080. Pantalla baja: 1200×630 (se corrigió un solapamiento del producto).
- Retrato: 390×844 y 768×1024; aproximación, pausa y ensamblaje sin cortar las piezas.
- Orden por prioridad, selección, envío, salida diferida y reset comprobados en navegador.
- Modo de lectura probado con controles funcionales, cero canvas y sin desbordamiento horizontal. Las preferencias de movimiento reducido y colores forzados usan esta misma presentación; se conservan sus listeners.
- Capturas finales de producto actualizadas para el hub y Open Graph.
- Perfil orientativo en el navegador del equipo: media de 16,67 ms en calidad baja y 17,35 ms en media, muestras de 180 fotogramas. Escena final: 43 llamadas de dibujo, 4.240 triángulos, cuatro texturas. No son mediciones de GPU ni garantías para hardware móvil.
- Los documentos HTML de `/` y `/labs` no referencian el chunk que contiene Three/PMREM. Se mantiene la importación dinámica exclusiva de la experiencia.
- `npm run lint`, `npm run build` y `git diff --check`: correctos.
- Sin errores de consola. Permanece un aviso de deprecación de `THREE.Clock` utilizado por React Three Fiber.

## Limitaciones

No se han probado dispositivos iOS/Android físicos, lectores de pantalla reales ni el cambio de preferencia del sistema operativo. El modo sin movimiento se revisó a través de la presentación de lectura. La convergencia es una secuencia dirigida y reversible, no una colisión física. La dirección actual es deliberadamente un instrumento gráfico mecanizado; no pretende simular un producto industrial fabricable.

Esta revisión reemplaza las decisiones visuales y de simulación del blueprint inicial; ese documento se conserva como registro de la propuesta original.
