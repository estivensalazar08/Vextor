/* ============================================================
   VEXTOR — Datos del negocio
   ------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAN EDITAR PARA:
   cambiar teléfono, dirección, horarios, precios y productos.
   Los datos marcados con  // ⚠️ CAMBIAR  son de ejemplo.
   ============================================================ */

const CONFIG = {
  nombre: "Vextor",
  eslogan: "Motor Garage",
  ciudad: "Girardota, Antioquia",
  direccion: "Cra. 15 # 10-25, Girardota, Antioquia",   // ⚠️ CAMBIAR
  whatsapp: "573148216601",                              // formato: 57 + número, sin espacios ni +
  telefonoVisible: "+57 314 821 6601",
  correo: "hola@vextor.com.co",                          // ⚠️ CAMBIAR
  instagram: "vextor.taller",                            // ⚠️ CAMBIAR
  mapa: "https://maps.google.com/?q=Girardota,+Antioquia", // ⚠️ CAMBIAR por el enlace exacto del local
  panelTaller: false, // true muestra el enlace "Panel del taller" del pie
  bahias: 2,          // cuántas motos pueden atender al mismo tiempo
  diasAgendables: 21, // con cuánta anticipación se puede agendar
};

/* Horario de atención. 0 = domingo, 1 = lunes ... 6 = sábado.
   "abre" y "cierra" en formato de 24 horas. null = cerrado.       */
const HORARIO = {
  0: null,
  1: { abre: 8, cierra: 18 },
  2: { abre: 8, cierra: 18 },
  3: { abre: 8, cierra: 18 },
  4: { abre: 8, cierra: 18 },
  5: { abre: 8, cierra: 18 },
  6: { abre: 8, cierra: 14 },
};

/* ---------------------- SERVICIOS DEL TALLER ---------------------- */
const SERVICIOS = [
  {
    id: "preventivo",
    nombre: "Mantenimiento preventivo",
    detalle: "Cambio de aceite y filtro, ajuste de cadena, revisión de frenos, luces y presión de llantas.",
    incluye: ["Aceite 20W-50", "Filtro de aire", "Lubricación de guayas", "Reporte de 18 puntos"],
    desde: 70000,
    duracion: "45 min",
  },
  {
    id: "sincronizacion",
    nombre: "Sincronización y carburación",
    detalle: "Calibración de válvulas, limpieza de inyector o carburador y ajuste de ralentí.",
    incluye: ["Calibración de válvulas", "Limpieza de inyección", "Ajuste de ralentí"],
    desde: 60000,
    duracion: "1 h",
  },
  {
    id: "frenos",
    nombre: "Sistema de frenos",
    detalle: "Cambio de pastillas o bandas, purga de líquido y rectificación de discos.",
    incluye: ["Purga de líquido DOT 3", "Revisión de mordaza", "Prueba en ruta"],
    desde: 50000,
    duracion: "45 min",
  },
  {
    id: "arrastre",
    nombre: "Kit de arrastre",
    detalle: "Cambio de piñón, sprocket y cadena con tensión y alineación de rueda.",
    incluye: ["Alineación de rueda", "Tensión a especificación", "Lubricación"],
    desde: 45000,
    duracion: "1 h",
  },
  {
    id: "electrico",
    nombre: "Eléctrico y diagnóstico",
    detalle: "Arranque, alternador, batería, luces e instalación de accesorios eléctricos.",
    incluye: ["Prueba de carga", "Revisión de arnés", "Diagnóstico con multímetro"],
    desde: 55000,
    duracion: "1 h",
  },
  {
    id: "llantas",
    nombre: "Llantas y suspensión",
    detalle: "Montaje de llantas, balanceo, cambio de neumático y revisión de amortiguadores.",
    incluye: ["Montaje y balanceo", "Revisión de rines", "Ajuste de suspensión"],
    desde: 30000,
    duracion: "40 min",
  },
  {
    id: "motor",
    nombre: "Reparación de motor",
    detalle: "Rectificación, cambio de anillos, empaques y armado completo de motor.",
    incluye: ["Desarme y peritaje", "Cotización escrita", "Prueba de compresión"],
    desde: null,
    duracion: "2 h (recepción)",
  },
  {
    id: "revision",
    nombre: "Revisión pre-tecnomecánica",
    detalle: "Chequeo de los puntos que evalúa el CDA para que pase la revisión de una vez.",
    incluye: ["Frenos y luces", "Emisiones", "Ruido y suspensión"],
    desde: 40000,
    duracion: "40 min",
  },
];

/* ---------------------- CATÁLOGO ----------------------
   tipo: "repuesto" | "accesorio"
   precio en pesos colombianos, sin puntos.               */
const CATALOGO = [
  // ----- REPUESTOS -----
  { id: "r01", tipo: "repuesto", categoria: "Lubricantes", nombre: "Aceite 20W-50 semisintético", marca: "Motul", precio: 38000, unidad: "1 L", stock: true,
    detalle: "Para motores de 4 tiempos de 100 a 250 cc. Cambio recomendado cada 2.000 km." },
  { id: "r02", tipo: "repuesto", categoria: "Frenos", nombre: "Pastillas de freno delanteras", marca: "Brembo", precio: 45000, unidad: "juego", stock: true,
    detalle: "Compuesto orgánico. Referencias para Pulsar, FZ, CB110 y Discover." },
  { id: "r03", tipo: "repuesto", categoria: "Frenos", nombre: "Bandas de freno traseras", marca: "Ferodo", precio: 28000, unidad: "juego", stock: true,
    detalle: "Freno de campana. Incluye limpieza de la campana en la instalación." },
  { id: "r04", tipo: "repuesto", categoria: "Transmisión", nombre: "Kit de arrastre 125–150 cc", marca: "DID", precio: 185000, unidad: "kit", stock: true,
    detalle: "Piñón, sprocket y cadena con retenes. Rinde entre 18.000 y 25.000 km." },
  { id: "r05", tipo: "repuesto", categoria: "Encendido", nombre: "Bujía de iridio", marca: "NGK", precio: 18000, unidad: "unidad", stock: true,
    detalle: "Mejora el arranque en frío y el consumo. Cambio cada 10.000 km." },
  { id: "r06", tipo: "repuesto", categoria: "Filtros", nombre: "Filtro de aire lavable", marca: "K&N", precio: 32000, unidad: "unidad", stock: true,
    detalle: "Se lava y se vuelve a usar. Sube un poco la respuesta del motor." },
  { id: "r07", tipo: "repuesto", categoria: "Eléctrico", nombre: "Batería sellada 12V 5Ah", marca: "Willard", precio: 135000, unidad: "unidad", stock: true,
    detalle: "Libre de mantenimiento. Un año de garantía contra defecto de fábrica." },
  { id: "r08", tipo: "repuesto", categoria: "Llantas", nombre: "Llanta trasera 100/90-17", marca: "Michelin", precio: 195000, unidad: "unidad", stock: true,
    detalle: "Dibujo mixto para calle y trocha liviana. Montaje y balanceo incluidos." },
  { id: "r09", tipo: "repuesto", categoria: "Controles", nombre: "Guaya de embrague", marca: "Genérica", precio: 22000, unidad: "unidad", stock: true,
    detalle: "Cable forrado con alma de acero. Se entrega lubricada." },
  { id: "r10", tipo: "repuesto", categoria: "Motor", nombre: "Juego de empaques de motor", marca: "Original", precio: 78000, unidad: "juego", stock: false,
    detalle: "Empaques de cabezote, cilindro y tapas. Se pide bajo referencia de la moto." },
  { id: "r11", tipo: "repuesto", categoria: "Eléctrico", nombre: "Regulador de voltaje", marca: "SH", precio: 68000, unidad: "unidad", stock: true,
    detalle: "Evita que se quemen los bombillos y que la batería se descargue." },
  { id: "r12", tipo: "repuesto", categoria: "Transmisión", nombre: "Cadena reforzada 428H", marca: "DID", precio: 72000, unidad: "unidad", stock: true,
    detalle: "120 eslabones. Se corta a la medida de la moto en el taller." },

  // ----- ACCESORIOS -----
  { id: "a01", tipo: "accesorio", categoria: "Protección", nombre: "Casco abatible certificado", marca: "Shaft", precio: 220000, unidad: "unidad", stock: true,
    detalle: "Cumple norma NTC 4533. Visor antirrayas y doble certificación DOT." },
  { id: "a02", tipo: "accesorio", categoria: "Protección", nombre: "Guantes con protección de nudillo", marca: "Vexo", precio: 85000, unidad: "par", stock: true,
    detalle: "Palma reforzada y dedo táctil para el celular." },
  { id: "a03", tipo: "accesorio", categoria: "Protección", nombre: "Chaqueta impermeable con protecciones", marca: "Vexo", precio: 160000, unidad: "unidad", stock: true,
    detalle: "Codos, hombros y espalda con protección. Cintas reflectivas." },
  { id: "a04", tipo: "accesorio", categoria: "Carga", nombre: "Baúl trasero 45 L con parrilla", marca: "Givi", precio: 210000, unidad: "kit", stock: true,
    detalle: "Cabe un casco integral. Incluye base y parrilla universal." },
  { id: "a05", tipo: "accesorio", categoria: "Seguridad", nombre: "Candado de disco con alarma", marca: "Xena", precio: 95000, unidad: "unidad", stock: true,
    detalle: "Alarma de 110 dB y cable recordatorio para no arrancar con el candado puesto." },
  { id: "a06", tipo: "accesorio", categoria: "Tecnología", nombre: "Soporte de celular con cargador USB", marca: "Vexo", precio: 45000, unidad: "unidad", stock: true,
    detalle: "Anclaje al manubrio, salida 2.1 A y bloqueo antivibración." },
  { id: "a07", tipo: "accesorio", categoria: "Iluminación", nombre: "Kit de luces LED auxiliares", marca: "Vexo", precio: 120000, unidad: "par", stock: true,
    detalle: "6.000 K con relé y switch. Instalación eléctrica incluida." },
  { id: "a08", tipo: "accesorio", categoria: "Protección", nombre: "Sliders protectores de motor", marca: "Vexo", precio: 70000, unidad: "par", stock: true,
    detalle: "Nailon de alta densidad. Amortiguan el golpe en una caída a baja velocidad." },
  { id: "a09", tipo: "accesorio", categoria: "Cuidado", nombre: "Cobertor impermeable para moto", marca: "Vexo", precio: 60000, unidad: "unidad", stock: true,
    detalle: "Tela con recubrimiento UV. Talla única hasta 200 cc." },
  { id: "a10", tipo: "accesorio", categoria: "Cuidado", nombre: "Kit de limpieza y lubricación de cadena", marca: "Motul", precio: 78000, unidad: "kit", stock: true,
    detalle: "Desengrasante, lubricante en spray y cepillo de tres caras." },
];

const MARCAS = ["Bajaj", "AKT", "Yamaha", "Honda", "Suzuki", "TVS", "Hero", "Victory", "KTM", "Kawasaki", "Royal Enfield", "Benelli"];

const PREGUNTAS = [
  { p: "¿Tengo que agendar o puedo llegar directo?",
    r: "Puede llegar directo, pero con turno agendado la moto entra a la bahía a la hora que reservó. Sin turno depende de cómo esté el taller ese día." },
  { p: "¿Me cotizan antes de arreglar la moto?",
    r: "Siempre. Revisamos, le mandamos la cotización por WhatsApp y solo intervenimos la moto cuando usted la aprueba." },
  { p: "¿Qué garantía tienen los trabajos?",
    r: "Tres meses o 3.000 kilómetros en mano de obra, lo que ocurra primero. Los repuestos van con la garantía del fabricante y su factura." },
  { p: "¿Puedo llevar mis propios repuestos?",
    r: "Sí. En ese caso cobramos solo la mano de obra y la garantía cubre el trabajo, no la pieza que usted trajo." },
  { p: "¿Atienden motos de alto cilindraje?",
    r: "Sí, hasta 650 cc para mantenimiento y eléctrico. Para motor de alto cilindraje pedimos cita previa porque el peritaje toma más tiempo." },
  { p: "¿Cómo puedo pagar?",
    r: "Efectivo, transferencia, Nequi, Daviplata y tarjeta débito o crédito con datáfono." },
];
