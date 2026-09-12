# Vextor Motor Garage — landing page

Sitio de una sola página para el taller de motocicletas **Vextor**, en Girardota (Antioquia).
Sin frameworks ni dependencias: es HTML, CSS y JavaScript puro. Se abre con doble clic.

```
index.html          la página
css/estilos.css     colores, tipografía y diseño
js/datos.js         ← EL ARCHIVO QUE USTEDES EDITAN (negocio, precios, productos)
js/app.js           la lógica (catálogo, agenda, panel)
```

---

## 1. Lo primero: cambiar los datos de ejemplo

Abra `js/datos.js` con cualquier editor de texto. Arriba está el bloque `CONFIG`.
Todo lo que dice `// ⚠️ CAMBIAR` es un dato inventado para que la página se vea completa:

| Dato | Qué poner |
|---|---|
| `direccion` | La dirección real del local |
| `whatsapp` | El número **sin `+` ni espacios**, empezando por 57. Ej: `573001234567` |
| `telefonoVisible` | El mismo número como quieren que se lea |
| `correo`, `instagram`, `mapa` | Los reales |
| `bahias` | Cuántas motos atienden al mismo tiempo (define los cupos por hora) |

El horario se cambia en `HORARIO` (0 = domingo … 6 = sábado). Poner `null` cierra ese día.

## 2. Precios y productos

- **Servicios**: la lista `SERVICIOS`. `desde` es el precio de mano de obra; ponga `null`
  para que muestre "Según peritaje".
- **Catálogo**: la lista `CATALOGO`. Cada producto necesita `tipo` (`repuesto` o `accesorio`),
  `categoria`, `nombre`, `marca`, `precio` (sin puntos), `unidad` y `stock` (`true`/`false`).
  Las categorías se generan solas a partir de lo que escriban; no hay que declararlas aparte.
- **Preguntas frecuentes**: la lista `PREGUNTAS`.

### Fotos de los productos
Hoy cada producto muestra un ícono según su categoría. Para poner fotos reales:
guarde las imágenes en una carpeta `img/` y en `js/app.js`, dentro de `pintarProductos()`,
reemplace `${iconoDe(p.categoria)}` por `<img src="img/${p.id}.jpg" alt="${escapar(p.nombre)}">`.

---

## 3. Cómo funciona la agenda

### Los dos enlaces publicados

| | Para qué | Enlace |
|---|---|---|
| **Vextor Motor Garage** | El sitio que se le pasa a los clientes. Sin panel interno; el turno se solicita y llega por WhatsApp. | https://claude.ai/code/artifact/13edbe25-05d7-44c7-9660-b7cad5d73a2b |
| **Agenda Vextor** | Uso interno del taller. Misma página, pero las citas se guardan y el panel muestra la agenda en vivo. | https://claude.ai/code/artifact/1f935a1f-1e01-4d31-93f4-44d1706b9ab6 |

> El enlace público nace **privado**. Para que lo abra cualquier persona hay que entrar
> a esa página y activar el compartir desde su propio menú de *Share*. El enlace interno
> se deja como está: no se puede compartir públicamente porque usa base de datos.

La página tiene **dos modos** y cambia sola según dónde esté publicada:

- **Publicada como Artifact en Claude** → las citas se guardan en una base de datos
  compartida. El panel del taller muestra la agenda en vivo y se puede exportar a CSV.
- **En hosting propio** (Netlify, Vercel, un dominio, o abriendo el archivo) → no hay
  servidor, así que la cita queda guardada en el navegador de esa persona y el turno se
  confirma por el botón de WhatsApp. **Ese botón es el canal real de confirmación.**

Si quieren agenda compartida en el dominio propio, hay que conectar un backend
(Google Sheets vía Apps Script, Supabase o Firebase). Es un cambio acotado dentro de
`conectarBaseDeDatos()` en `js/app.js`.

### Panel del taller
El enlace **"Panel del taller"** está al final de la página, en el pie. Muestra todos
los turnos, permite cambiarles el estado (pendiente / confirmada / atendida / cancelada)
y descargar la agenda en CSV.

**No tiene contraseña.** Por eso está escondido en la versión pública: en `js/datos.js`,
`CONFIG.panelTaller` en `false` quita ese botón del pie. En los archivos de esta carpeta
viene en `true`; si suben el sitio a un dominio propio y no quieren que los clientes lo
vean, pónganlo en `false`.

---

## 4. Publicar el sitio

La forma más rápida, sin costo y sin configurar nada:

1. Entre a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastre **toda la carpeta** `Landing Page Vextor`.
3. Netlify le da una dirección al instante. Después se le conecta el dominio propio
   (por ejemplo `vextor.com.co`) desde *Domain settings*.

Cualquier hosting sirve: solo hay que subir los cuatro archivos respetando las carpetas
`css/` y `js/`.

---

## 5. Detalles de la marca

Tomados del logo: negro `#0A0C0E`, azul eléctrico `#1287E8` y degradado cromo para el
monograma V+E y el titular. Tipografías: **Montserrat** (la del wordmark), **Barlow**
para textos y **JetBrains Mono** para placas, códigos y precios.
El monograma está dibujado en SVG dentro de `index.html`, así que se ve nítido en
cualquier tamaño y no depende de un archivo de imagen.
