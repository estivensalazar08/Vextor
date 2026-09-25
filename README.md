# Vexttor — landing page

Sitio de una sola página para el taller de motocicletas **Vexttor**, en Girardota (Antioquia).
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

### Los dos enlaces internos de Claude

Además de este sitio existen dos páginas publicadas como Artifact en Claude: una para
clientes y otra de uso interno con la agenda guardada y el panel de turnos. Los enlaces
no van aquí porque este repositorio es público; están en la conversación de Claude y en
la galería de Artifacts de la cuenta.

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
2. Arrastre **toda la carpeta** `Landing Page Vexttor`.
3. Netlify le da una dirección al instante. Después se le conecta el dominio propio
   (por ejemplo `vextor.com.co`) desde *Domain settings*.

Cualquier hosting sirve: solo hay que subir los cuatro archivos respetando las carpetas
`css/` y `js/`.

---

## 5. Detalles de la marca

Tomados del letrero del local: negro `#0B0B0C`, rojo `#E11D22` y degradado cromo.
Tipografías: **Saira** (la más parecida al wordmark del letrero), **Barlow** para
textos y **JetBrains Mono** para placas, códigos y precios.

El monograma —la V angular roja con filo cromado— está dibujado en SVG dentro de
`index.html`, así que se ve nítido en cualquier tamaño y no depende de una imagen.
**Es una aproximación hecha a partir de la foto de la fachada.** Si consiguen el
archivo original del logo (SVG, AI o PNG con fondo transparente) con quien hizo el
aviso, se reemplaza y queda exacto.
