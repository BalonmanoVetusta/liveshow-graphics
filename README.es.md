
> [!IMPORTANT]  
> Este proyecto está pensado para funcionar en local. Poner este proyecto expuesto en una red pública (ej. usando un servidor virtual) expondrá la REST-API a cualquiera ya que carece de seguridad. Usalo bajo tu propio riesgo.

<p style='text-align: center'>
<a href='README.md' alt='Link to english version'>
🇬🇧 This document is also available in english
</a>
</p>

## Qué es este proyecto

Este proyecto está pensado para incrustar los gráficos en los directos de los partidos de balonmano del [Club Balonmano Vetusta](https://balonmanovetusta.com). No lo he programado pensando en que cualquiera sin conocimiento ninguno pueda personalizar completamente la interfaz, por lo que si quieres cambiar colores y/o disposiciones de elementos debes hacerlo con código HTML+CSS+Javascript.

En este caso este proyecto nace porque las emisiones se hacen usando una mezcladora ATEM Mini Pro ISO, lo cual permite hacer las emisiones con una buena calidad a 1080p25 que son los requisitos que nos ponen del canal por el que se emite luego el partido en diferido y la ATEM nos permite hacer la grabación en simultaneo.

Usando este proyecto y usando la opción de Chroma Key que trae podemos incrustar los gráficos sin problemas y sin la necesidad de un ordenador potente para hacer las emisiones ya que no necesitamos usar OBS. Con la ATEM también podemos añadir el audio sin necesidad de ningún otro dispositivo como una interfaz de audio o una mesa mezcladora.

## Recomendaciones de equipo para emisiones y sobre las emisiones

> [!WARNING]  
> No recomiendo usar wifi para hacer un directo bajo ninguna circunstancia.

### Equipo Mínimo

- Regleta de enchufes.
- ATEM Mini
- Cámara de vídeo (con calidad al menos FullHD), si tiene opción de entrada de microfono puedes enchufarlo directamente ahí ya que te captará también el sonido ambiente en la medida que necesitas para hacer el directo. Si no tiene la opción de microfono como es mi caso, puedes mezclar el audio en la propia ATEM como estimes oportuno.
- Trípode.
- Ordenador (no hace falta que sea muy potente) para correr este proyecto e incrustar los gráficos a través del HDMI de la ATEM.
- Switch. Es recomendable conectar por cable, al menos, la ATEM. Pero en si es posible, el ordenador también.
- Necesitas subir al menos a 6 Mbps suponiendo que uses un bitrate de 3 Mb.

### Equipo adicional Recomendado

- Aplicación Bitfocus Companion y Stream Deck (15 botones o 32 botones). Esto te permitirá usar la API para tener todo accesible y así no tener que usar el ordenador y el ratón para añadir goles. Con esta opción puedes hacer de cámara y controlar el stream a la vez.
- Router 4G con salida ethernet, si tiene entrada y salida para poder failover en caso de que se caiga la línea del pabellón mejor.
- Micrófono/s, si son wireless mucho mejor (notarás por mucho la diferencia).
- SAI (UPS). Para mantener todo alimentado con seguridad en caso de apagón.
- Disco duro con tasa de lectura/escritura alta para grabar la emisión.

## ¿Cómo emitimos nosotros?

### Equipo

- ATEM Mini Pro ISO
- Disco duro externo USB-C para grabar.
- Cámara Panasonic con salida mini-HDMI y sin entrada externa de audio.
- Rode Wireless Pro (1ª Generación).
- Pantalla portátil externa HDMI para la monitorización del stream.
- Stream Deck XL.
- Raspberry Pi.
- Trípode.
- Mesa y silla.
- Router 4G Netgear M1 Nightwatch
- Switch Flex Mini.
- Cableado para todo. Ordenador a la ATEM, audio a la ATEM, mini-HDMI a HDMI, USBs...
- Alargador de al menos 8 metros y 4 enchufes.
- Cargador de móvil o similar para el router.
- Macbook Pro 15" 2015, i7 y 16 Gb RAM.
- Software de la ATEM.
- Bitfocus Companion.
