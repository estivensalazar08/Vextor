/* ============================================================
   VEXTOR MOTOR GARAGE — Lógica de la página
   ------------------------------------------------------------
   Funciona en dos modos, sin cambiar nada:
   · Publicada como Artifact  → las citas se guardan de verdad
                                (base de datos compartida).
   · En hosting propio        → las citas quedan en el navegador
                                y se confirman por WhatsApp.
   ============================================================ */
"use strict";

/* ---------------------- Utilidades ---------------------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const pesos = (n) => "$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
const escapar = (t) => String(t).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const DIAS_SEM = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DIAS_LARGO = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/* Fechas en formato AAAA-MM-DD, siempre en hora local. */
const aISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const deISO = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };

function hora12(h) {
  const n = parseInt(h, 10);
  const suf = n < 12 ? "a.m." : "p.m.";
  const doce = n % 12 === 0 ? 12 : n % 12;
  return `${doce}:00 ${suf}`;
}
function fechaLarga(iso) {
  const d = deISO(iso);
  return `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"][d.getMonth()]}`;
}
function horasDe(iso) {
  const h = HORARIO[deISO(iso).getDay()];
  if (!h) return [];
  const salida = [];
  for (let i = h.abre; i < h.cierra; i++) salida.push(String(i).padStart(2, "0") + ":00");
  return salida;
}
function horarioTexto(dia) {
  const h = HORARIO[dia];
  return h ? `${hora12(h.abre)} – ${hora12(h.cierra)}` : "Cerrado";
}
const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const waLink = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

function aviso(mensaje, tono = "ok") {
  const el = $("#avisoFlotante");
  el.textContent = mensaje;
  el.dataset.tono = tono;
  el.dataset.visible = "si";
  clearTimeout(aviso._t);
  aviso._t = setTimeout(() => { el.dataset.visible = "no"; }, 3200);
}

/* ---------------------- Iconos del catálogo ---------------------- */
const TRAZO = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const ICONOS = {
  Lubricantes: `<path d="M12 3s6 6.5 6 10.5A6 6 0 016 13.5C6 9.5 12 3 12 3z" ${TRAZO}/>`,
  Cuidado:     `<path d="M4 20l6-6M14 4l6 6-9 3-3-3z" ${TRAZO}/><circle cx="17" cy="7" r="1.4" ${TRAZO}/>`,
  Frenos:      `<circle cx="12" cy="12" r="8" ${TRAZO}/><circle cx="12" cy="12" r="3" ${TRAZO}/><path d="M12 4v2M12 18v2M4 12h2M18 12h2" ${TRAZO}/>`,
  Llantas:     `<circle cx="12" cy="12" r="8.5" ${TRAZO}/><circle cx="12" cy="12" r="4" ${TRAZO}/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4" ${TRAZO}/>`,
  "Transmisión": `<circle cx="7" cy="12" r="3.2" ${TRAZO}/><circle cx="17" cy="12" r="4.6" ${TRAZO}/><path d="M7 8.8h10M7 15.2h10" ${TRAZO}/>`,
  Encendido:   `<path d="M13 2L5 13h6l-1 9 8-11h-6z" ${TRAZO}/>`,
  Eléctrico:   `<path d="M13 2L5 13h6l-1 9 8-11h-6z" ${TRAZO}/>`,
  "Iluminación": `<circle cx="12" cy="10" r="5" ${TRAZO}/><path d="M9 18h6M10 21h4M12 2v1.5M4.5 6l1 1M19.5 6l-1 1" ${TRAZO}/>`,
  Filtros:     `<path d="M4 5h16l-6 7v7l-4-2v-5z" ${TRAZO}/>`,
  Controles:   `<path d="M4 15c4 0 4-6 8-6s4 6 8 6" ${TRAZO}/><circle cx="4" cy="15" r="1.6" ${TRAZO}/><circle cx="20" cy="15" r="1.6" ${TRAZO}/>`,
  Motor:       `<rect x="4" y="8" width="12" height="9" rx="1.5" ${TRAZO}/><path d="M16 11h4v4h-4M8 8V5h4v3" ${TRAZO}/>`,
  "Protección":`<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" ${TRAZO}/>`,
  Seguridad:   `<rect x="5" y="10" width="14" height="10" rx="2" ${TRAZO}/><path d="M8 10V7a4 4 0 018 0v3" ${TRAZO}/>`,
  Carga:       `<path d="M4 8l8-4 8 4v8l-8 4-8-4z" ${TRAZO}/><path d="M4 8l8 4 8-4M12 12v8" ${TRAZO}/>`,
  "Tecnología":`<rect x="7" y="3" width="10" height="18" rx="2" ${TRAZO}/><path d="M11 18h2" ${TRAZO}/>`,
};
const iconoDe = (cat) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[cat] || ICONOS.Motor}</svg>`;

/* ============================================================
   ESTADO
   ============================================================ */
const app = {
  db: null,               // base de datos del Artifact (o null)
  citas: [],              // turnos agendados
  cotizacion: [],         // ids de productos en la lista de cotización
  filtro: { tipo: "todos", categoria: "todas", texto: "", orden: "destacado" },
  cita: { servicio: null, marca: "", modelo: "", placa: "", km: "", fecha: null, hora: null },
  paso: 1,
  filtroPanel: "todos",
};

const LS_COT = "vextor_cotizacion";
const LS_CITAS = "vextor_citas_local";

function leerLocal(clave, porDefecto) {
  try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; }
  catch { return porDefecto; }
}
function guardarLocal(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* modo privado */ }
}

/* ============================================================
   CONTENIDO ESTÁTICO
   ============================================================ */
function pintarServicios() {
  $("#rejillaServicios").innerHTML = SERVICIOS.map((s) => `
    <article class="servicio">
      <div class="servicio__cab">
        <h3>${escapar(s.nombre)}</h3>
        <span class="servicio__dur">${escapar(s.duracion)}</span>
      </div>
      <p>${escapar(s.detalle)}</p>
      <ul class="servicio__incluye">${s.incluye.map((i) => `<li>${escapar(i)}</li>`).join("")}</ul>
      <div class="servicio__pie">
        <span class="servicio__desde">${s.desde ? "Desde" : "Precio"}<b>${s.desde ? pesos(s.desde) : "Según peritaje"}</b></span>
        <button class="enlace-azul" data-agendar-servicio="${s.id}">
          Agendar
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </article>`).join("");
}

function pintarMarcas() {
  $("#marcas").innerHTML = MARCAS.map((m) => `<span>${escapar(m)}</span>`).join("");
}

function pintarFaq() {
  $("#faq").innerHTML = PREGUNTAS.map((q, i) => `
    <details${i === 0 ? " open" : ""}>
      <summary>${escapar(q.p)}</summary>
      <p>${escapar(q.r)}</p>
    </details>`).join("");
}

function pintarContacto() {
  $("#ctoDireccion").textContent = CONFIG.direccion;
  $("#ctoMapa").href = CONFIG.mapa;
  const tel = $("#ctoTel");
  tel.textContent = CONFIG.telefonoVisible;
  tel.href = waLink("Hola Vextor, quiero información sobre el taller.");
  tel.target = "_blank"; tel.rel = "noopener";
  $("#ctoIg").textContent = "@" + CONFIG.instagram;
  $("#ctoIg").href = "https://instagram.com/" + CONFIG.instagram;
  $("#ctoCorreo").textContent = CONFIG.correo;
  $("#ctoCorreo").href = "mailto:" + CONFIG.correo;
  $("#anio").textContent = new Date().getFullYear();
  $("#btnWhatsappGeneral").href = waLink("Hola Vextor, quiero agendar un turno para mi moto.");
  $("#fichaHorario").innerHTML = [1, 2, 3, 4, 5, 6, 0]
    .map((d) => `<li><span>${DIAS_LARGO[d].charAt(0).toUpperCase() + DIAS_LARGO[d].slice(1)}</span><b>${horarioTexto(d)}</b></li>`)
    .join("");
}

/* ============================================================
   CATÁLOGO
   ============================================================ */
function categoriasVisibles() {
  const base = app.filtro.tipo === "todos" ? CATALOGO : CATALOGO.filter((p) => p.tipo === app.filtro.tipo);
  return Array.from(new Set(base.map((p) => p.categoria))).sort((a, b) => a.localeCompare(b, "es"));
}

function pintarChips() {
  const cats = categoriasVisibles();
  if (!cats.includes(app.filtro.categoria)) app.filtro.categoria = "todas";
  $("#chipsCategoria").innerHTML =
    [`<button class="chip" data-categoria="todas" aria-pressed="${app.filtro.categoria === "todas"}">Todas</button>`]
      .concat(cats.map((c) => `<button class="chip" data-categoria="${escapar(c)}" aria-pressed="${app.filtro.categoria === c}">${escapar(c)}</button>`))
      .join("");
}

function productosFiltrados() {
  const t = app.filtro.texto.trim().toLowerCase();
  let lista = CATALOGO.filter((p) => {
    if (app.filtro.tipo !== "todos" && p.tipo !== app.filtro.tipo) return false;
    if (app.filtro.categoria !== "todas" && p.categoria !== app.filtro.categoria) return false;
    if (t && !`${p.nombre} ${p.marca} ${p.categoria} ${p.detalle}`.toLowerCase().includes(t)) return false;
    return true;
  });
  const orden = app.filtro.orden;
  if (orden === "menor") lista.sort((a, b) => a.precio - b.precio);
  else if (orden === "mayor") lista.sort((a, b) => b.precio - a.precio);
  else if (orden === "nombre") lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  else lista.sort((a, b) => (b.stock - a.stock) || (a.tipo === b.tipo ? 0 : a.tipo === "repuesto" ? -1 : 1) || a.id.localeCompare(b.id));
  return lista;
}

function pintarProductos() {
  const lista = productosFiltrados();
  $("#catalogoVacio").hidden = lista.length > 0;
  $("#rejillaProductos").innerHTML = lista.map((p) => {
    const enLista = app.cotizacion.includes(p.id);
    return `
    <article class="producto">
      <div class="producto__lamina">
        <span class="producto__etiq">${p.tipo === "repuesto" ? "Repuesto" : "Accesorio"}</span>
        ${p.stock ? "" : '<span class="producto__agotado">Por pedido</span>'}
        ${iconoDe(p.categoria)}
      </div>
      <div class="producto__cuerpo">
        <span class="producto__marca">${escapar(p.marca)} · ${escapar(p.categoria)}</span>
        <h3 class="producto__nombre">${escapar(p.nombre)}</h3>
        <p class="producto__detalle">${escapar(p.detalle)}</p>
        <div class="producto__pie">
          <span>
            <span class="producto__precio">${pesos(p.precio)}</span>
            <span class="producto__unidad">${escapar(p.unidad)}</span>
          </span>
          <button class="btn-agregar" data-producto="${p.id}" data-en-lista="${enLista ? "si" : "no"}">
            ${enLista ? "En la lista" : "Cotizar"}
          </button>
        </div>
      </div>
    </article>`;
  }).join("");
}

/* --------- Lista de cotización --------- */
function pintarBandeja() {
  const b = $("#bandeja");
  b.hidden = app.cotizacion.length === 0;
  $("#bandejaN").textContent = app.cotizacion.length;
}

function pintarCotizacion() {
  const items = app.cotizacion.map((id) => CATALOGO.find((p) => p.id === id)).filter(Boolean);
  $("#listaCot").innerHTML = items.length
    ? items.map((p) => `
      <div class="lista-cot__fila">
        <div>
          <strong>${escapar(p.nombre)}</strong>
          <small>${escapar(p.marca)} · ${escapar(p.unidad)}</small>
        </div>
        <span class="mono">${pesos(p.precio)}</span>
        <button class="quitar" data-quitar="${p.id}" aria-label="Quitar ${escapar(p.nombre)}">✕</button>
      </div>`).join("")
    : '<div class="lista-cot__fila"><div class="plomo">Tu lista está vacía.</div></div>';
  const total = items.reduce((s, p) => s + p.precio, 0);
  $("#totalCot").textContent = pesos(total);
  const texto = items.length
    ? `Hola Vextor, quiero cotizar estos productos:\n\n${items.map((p) => `• ${p.nombre} (${p.marca}) — ${pesos(p.precio)}`).join("\n")}\n\nTotal estimado: ${pesos(total)}`
    : "Hola Vextor, quiero cotizar unos repuestos.";
  $("#enviarCot").href = waLink(texto);
}

function alternarCotizacion(id) {
  const i = app.cotizacion.indexOf(id);
  if (i >= 0) { app.cotizacion.splice(i, 1); aviso("Quitado de la lista"); }
  else { app.cotizacion.push(id); aviso("Agregado a la lista de cotización"); }
  guardarLocal(LS_COT, app.cotizacion);
  pintarProductos(); pintarBandeja(); pintarCotizacion();
}

/* ============================================================
   AGENDA
   ============================================================ */
function citasActivas() {
  return app.citas.filter((c) => c.estado !== "cancelada");
}
function ocupacion(fecha, hora) {
  return citasActivas().filter((c) => c.fecha === fecha && c.hora === hora).length;
}
function horaPasada(fecha, hora) {
  const ahora = new Date();
  if (fecha !== aISO(ahora)) return false;
  return parseInt(hora, 10) <= ahora.getHours();
}
function libre(fecha, hora) {
  return !horaPasada(fecha, hora) && ocupacion(fecha, hora) < CONFIG.bahias;
}

function proximoTurno() {
  const hoy = new Date();
  for (let i = 0; i < CONFIG.diasAgendables; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    const iso = aISO(d);
    for (const h of horasDe(iso)) if (libre(iso, h)) return { fecha: iso, hora: h };
  }
  return null;
}

function pintarProximoTurno() {
  const hoyISO = aISO(new Date());
  const p = proximoTurno();
  $("#horarioHoy").textContent = horarioTexto(new Date().getDay());
  $("#libresHoy").textContent = horasDe(hoyISO).filter((h) => libre(hoyISO, h)).length + " turnos";
  if (!p) {
    $("#proxHora").textContent = "Agenda llena";
    $("#proxDia").textContent = "Escríbenos y te ubicamos";
    $("#proxEstado").innerHTML = '<i class="punto"></i> Lista de espera';
    $("#proxEstado").style.color = "var(--ambar)";
    return;
  }
  const esHoy = p.fecha === hoyISO;
  $("#proxHora").textContent = hora12(p.hora);
  $("#proxDia").textContent = esHoy ? "Hoy, " + fechaLarga(p.fecha) : capitalizar(fechaLarga(p.fecha));
  $("#proxEstado").innerHTML = '<i class="punto"></i> Bahía disponible';
  $("#proxEstado").style.color = "var(--verde)";
}

function pintarOpcionesServicio() {
  $("#opcionesServicio").innerHTML = SERVICIOS.map((s) => `
    <button class="opcion-servicio" data-servicio="${s.id}" aria-pressed="${app.cita.servicio === s.id}">
      <strong>${escapar(s.nombre)}</strong>
      <small>${s.desde ? "desde " + pesos(s.desde) : "según peritaje"} · ${escapar(s.duracion)}</small>
    </button>`).join("");
  const sel = $("#marca");
  if (sel.options.length <= 1) {
    sel.innerHTML = '<option value="">Selecciona…</option>' +
      MARCAS.map((m) => `<option>${escapar(m)}</option>`).join("") + '<option>Otra</option>';
  }
}

function pintarDias() {
  const hoy = new Date();
  let html = "";
  for (let i = 0; i < CONFIG.diasAgendables; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    const iso = aISO(d);
    const horas = horasDe(iso);
    const hayCupo = horas.some((h) => libre(iso, h));
    html += `
      <button class="dia" data-dia="${iso}" aria-pressed="${app.cita.fecha === iso}" ${hayCupo ? "" : "disabled"}
              aria-label="${fechaLarga(iso)}${hayCupo ? "" : " — sin turnos"}">
        <span class="dia__sem">${DIAS_SEM[d.getDay()]}</span>
        <span class="dia__num">${d.getDate()}</span>
        <span class="dia__mes">${MESES[d.getMonth()]}</span>
      </button>`;
  }
  $("#dias").innerHTML = html;
}

function pintarTurnos() {
  const cont = $("#turnos");
  if (!app.cita.fecha) { cont.innerHTML = '<p class="plomo" style="grid-column:1/-1">Elige primero un día.</p>'; return; }
  const horas = horasDe(app.cita.fecha);
  if (!horas.length) { cont.innerHTML = '<p class="plomo" style="grid-column:1/-1">Ese día el taller está cerrado.</p>'; return; }
  cont.innerHTML = horas.map((h) => {
    const disp = CONFIG.bahias - ocupacion(app.cita.fecha, h);
    const ok = libre(app.cita.fecha, h);
    const etiqueta = horaPasada(app.cita.fecha, h) ? "pasó" : (ok ? `${disp} cupo${disp === 1 ? "" : "s"}` : "lleno");
    return `<button class="turno-btn" data-hora="${h}" aria-pressed="${app.cita.hora === h}" ${ok ? "" : "disabled"}>
      ${hora12(h).replace(" ", " ")}<small>${etiqueta}</small>
    </button>`;
  }).join("");
  $("#notaDisponibilidad").textContent = app.db
    ? `Atendemos ${CONFIG.bahias} motos por hora. La disponibilidad se actualiza en vivo.`
    : `Atendemos ${CONFIG.bahias} motos por hora. Elige la que te sirva y te confirmamos el cupo por WhatsApp.`;
}

function resumenHTML() {
  const s = SERVICIOS.find((x) => x.id === app.cita.servicio);
  return `
    <div><span>Servicio</span><b>${escapar(s ? s.nombre : "—")}</b></div>
    <div><span>Moto</span><b>${escapar(app.cita.marca)} ${escapar(app.cita.modelo)}</b></div>
    <div><span>Placa</span><b class="mono">${escapar(app.cita.placa)}</b></div>
    <div><span>Día</span><b>${app.cita.fecha ? escapar(capitalizar(fechaLarga(app.cita.fecha))) : "—"}</b></div>
    <div><span>Hora</span><b>${app.cita.hora ? hora12(app.cita.hora) : "—"}</b></div>`;
}

function marcarError(id, hay) {
  const campo = $("#" + id).closest(".campo");
  campo.dataset.error = hay ? "si" : "no";
  return !hay;
}

function validarPaso1() {
  let ok = true;
  if (!app.cita.servicio) { aviso("Elige el servicio que necesitas", "error"); ok = false; }
  ok = marcarError("marca", !$("#marca").value) && ok;
  ok = marcarError("modelo", $("#modelo").value.trim().length < 2) && ok;
  const placa = $("#placa").value.trim().toUpperCase();
  ok = marcarError("placa", !/^[A-Z]{3}\d{2}[A-Z]?$/.test(placa)) && ok;
  if (ok) {
    app.cita.marca = $("#marca").value;
    app.cita.modelo = $("#modelo").value.trim();
    app.cita.placa = placa;
    app.cita.km = $("#km").value.trim();
  }
  return ok;
}

function validarPaso2() {
  if (!app.cita.fecha || !app.cita.hora) { aviso("Elige día y hora para tu turno", "error"); return false; }
  return true;
}

function irAPaso(n) {
  if (n > 1 && app.paso === 1 && !validarPaso1()) return;
  if (n > 2 && app.paso === 2 && !validarPaso2()) return;
  app.paso = n;
  [1, 2, 3].forEach((i) => { $("#hoja" + i).hidden = i !== n; });
  $("#hojaOk").hidden = true;
  $$("#pasos .paso").forEach((el, i) => {
    el.dataset.estado = i + 1 === n ? "activo" : (i + 1 < n ? "hecho" : "");
  });
  if (n === 2) { pintarDias(); pintarTurnos(); }
  if (n === 3) $("#resumenCita").innerHTML = resumenHTML();
  $("#agendar").scrollIntoView({ behavior: "smooth", block: "start" });
}

function nuevoCodigo() {
  return "VX-" + String(Math.floor(1000 + Math.random() * 9000));
}

async function confirmarTurno() {
  let ok = true;
  ok = marcarError("nombre", $("#nombre").value.trim().length < 3) && ok;
  const cel = $("#celular").value.replace(/\D/g, "");
  ok = marcarError("celular", !/^3\d{9}$/.test(cel)) && ok;
  if (!ok) return;

  if (!libre(app.cita.fecha, app.cita.hora)) {
    aviso("Ese turno se acaba de ocupar. Elige otro, por favor.", "error");
    irAPaso(2);
    return;
  }

  const servicio = SERVICIOS.find((s) => s.id === app.cita.servicio);
  const cita = {
    codigo: nuevoCodigo(),
    creado: new Date().toISOString(),
    fecha: app.cita.fecha,
    hora: app.cita.hora,
    servicioId: app.cita.servicio,
    servicio: servicio ? servicio.nombre : "",
    marca: app.cita.marca,
    modelo: app.cita.modelo,
    placa: app.cita.placa,
    km: app.cita.km,
    nombre: $("#nombre").value.trim(),
    celular: cel,
    notas: $("#notas").value.trim(),
    estado: "pendiente",
  };

  const btn = $("#btnConfirmar");
  btn.disabled = true;
  btn.textContent = "Guardando…";

  let guardada = false;
  if (app.db) {
    try {
      await app.db.collection("citas").add(cita);
      guardada = true;
    } catch (e) {
      const codigo = e && e.code;
      if (codigo === "quota_exceeded") aviso("La agenda llegó a su límite. Escríbenos por WhatsApp.", "error");
      else if (codigo === "resource_exhausted") aviso("Muchas solicitudes a la vez. Intenta en unos segundos.", "error");
      else aviso("No pudimos guardar el turno. Confírmalo por WhatsApp.", "error");
    }
  }
  if (!guardada) {
    // Sin base de datos: queda en este navegador y se confirma por WhatsApp.
    app.citas = app.citas.concat([Object.assign({ id: "local-" + Date.now() }, cita)]);
    guardarLocal(LS_CITAS, app.citas.filter((c) => String(c.id).startsWith("local-")));
    refrescarAgenda();
  }

  btn.disabled = false;
  btn.textContent = "Confirmar turno";

  const texto = `Hola Vextor, agendé un turno.\n\nCódigo: ${cita.codigo}\nServicio: ${cita.servicio}\nMoto: ${cita.marca} ${cita.modelo} (${cita.placa})\nDía: ${fechaLarga(cita.fecha)}\nHora: ${hora12(cita.hora)}\nNombre: ${cita.nombre}`;
  $("#btnWhatsappCita").href = waLink(texto);
  $("#okTitulo").textContent = app.db ? "Turno apartado" : "Turno solicitado";
  $("#okTexto").textContent = app.db
    ? "Guarda este código. Con él identificamos tu moto cuando llegues."
    : "Envíanos la solicitud por WhatsApp para que te confirmemos el cupo. Guarda el código.";
  $("#codigoCita").textContent = cita.codigo;
  $("#resumenOk").innerHTML = resumenHTML() + `<div><span>A nombre de</span><b>${escapar(cita.nombre)}</b></div>`;
  [1, 2, 3].forEach((i) => { $("#hoja" + i).hidden = true; });
  $("#hojaOk").hidden = false;
  $$("#pasos .paso").forEach((el) => { el.dataset.estado = "hecho"; });
  $("#agendar").scrollIntoView({ behavior: "smooth", block: "start" });
}

function reiniciarAgenda() {
  app.cita = { servicio: null, marca: "", modelo: "", placa: "", km: "", fecha: null, hora: null };
  ["modelo", "placa", "km", "nombre", "celular", "notas"].forEach((id) => { $("#" + id).value = ""; });
  $("#marca").value = "";
  $$(".campo").forEach((c) => { c.dataset.error = "no"; });
  pintarOpcionesServicio();
  irAPaso(1);
}

function refrescarAgenda() {
  pintarProximoTurno();
  if (app.paso === 2) { pintarDias(); pintarTurnos(); }
  pintarPanel();
}

/* ============================================================
   PANEL DEL TALLER
   ============================================================ */
function pintarPanel() {
  const cuerpo = $("#cuerpoCitas");
  if (!cuerpo) return;
  const lista = app.citas
    .filter((c) => app.filtroPanel === "todos" || c.estado === app.filtroPanel)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  $("#panelVacio").hidden = lista.length > 0;
  cuerpo.innerHTML = lista.map((c) => `
    <tr>
      <td class="col-mono">${escapar(c.fecha)}<br><span class="plomo">${hora12(c.hora)}</span></td>
      <td class="col-mono">${escapar(c.codigo)}</td>
      <td>${escapar(c.nombre)}<br><span class="plomo mono">${escapar(c.celular)}</span></td>
      <td>${escapar(c.marca)} ${escapar(c.modelo)}<br><span class="plomo mono">${escapar(c.placa)}</span></td>
      <td>${escapar(c.servicio)}${c.notas ? `<br><span class="plomo">${escapar(c.notas)}</span>` : ""}</td>
      <td><span class="estado estado--${escapar(c.estado)}">${escapar(c.estado)}</span></td>
      <td>
        <select class="mini-select" data-cambiar-estado="${escapar(c.id)}" aria-label="Cambiar estado">
          ${["pendiente", "confirmada", "atendida", "cancelada"]
            .map((e) => `<option value="${e}"${e === c.estado ? " selected" : ""}>${e}</option>`).join("")}
        </select>
      </td>
    </tr>`).join("");

  const pendientes = app.citas.filter((c) => c.estado === "pendiente").length;
  $("#panelResumen").textContent = app.db
    ? `${app.citas.length} turnos guardados · ${pendientes} sin confirmar`
    : `${app.citas.length} turnos en este navegador · conecta la versión publicada para agenda compartida`;
}

async function cambiarEstado(id, estado) {
  const cita = app.citas.find((c) => String(c.id) === String(id));
  if (!cita) return;
  if (app.db && !String(id).startsWith("local-")) {
    try { await app.db.doc("citas/" + id).update({ estado }); }
    catch { aviso("No se pudo cambiar el estado", "error"); return; }
  } else {
    cita.estado = estado;
    guardarLocal(LS_CITAS, app.citas.filter((c) => String(c.id).startsWith("local-")));
    refrescarAgenda();
  }
  aviso("Turno marcado como " + estado);
}

function csvCitas() {
  const cols = ["fecha", "hora", "codigo", "estado", "nombre", "celular", "marca", "modelo", "placa", "km", "servicio", "notas"];
  const filas = app.citas
    .slice()
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .map((c) => cols.map((k) => `"${String(c[k] ?? "").replace(/"/g, '""')}"`).join(","));
  return "﻿" + cols.join(",") + "\n" + filas.join("\n");
}

async function descargarCsv() {
  const contenido = csvCitas();
  const nombre = `vextor-agenda-${aISO(new Date())}.csv`;
  try {
    const descargas = await claudeUse("downloads");
    if (descargas) { await descargas.save({ filename: nombre, data: contenido }); return; }
  } catch { /* el visor puede rechazar la descarga */ }
  try {
    const url = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
  } catch { aviso("No se pudo descargar el archivo", "error"); }
}

/* ============================================================
   MODALES Y NAVEGACIÓN
   ============================================================ */
let ultimoFoco = null;
function abrirModal(id) {
  ultimoFoco = document.activeElement;
  $("#" + id).hidden = false;
  document.body.style.overflow = "hidden";
  const primero = $("#" + id).querySelector("button, a, select, input");
  if (primero) primero.focus();
}
function cerrarModal(id) {
  $("#" + id).hidden = true;
  document.body.style.overflow = "";
  if (ultimoFoco) ultimoFoco.focus();
}

/* ============================================================
   CAPACIDADES DEL ARTIFACT (si la página está publicada)
   ============================================================ */
async function claudeUse(nombre) {
  if (typeof window === "undefined" || !window.claude || typeof window.claude.use !== "function") return null;
  try { return await window.claude.use(nombre); } catch { return null; }
}

async function conectarBaseDeDatos() {
  const db = await claudeUse("db");
  if (!db) return;                     // hosting propio: seguimos en modo local
  app.db = db;
  try {
    db.collection("citas").orderBy("fecha", "desc").limit(500).onSnapshot(
      (snap) => {
        app.citas = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
        refrescarAgenda();
      },
      (err) => {
        if (err.code === "revoked" || err.code === "not_granted") app.db = null;
        refrescarAgenda();
      }
    );
  } catch {
    app.db = null;
  }
}

/* ============================================================
   ARRANQUE
   ============================================================ */
function conectarEventos() {
  // Menú móvil
  $("#menuBtn").addEventListener("click", () => {
    const nav = $("#nav");
    const abierto = !nav.hidden;
    nav.hidden = abierto;
    $("#menuBtn").setAttribute("aria-expanded", String(!abierto));
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => {
    if (window.innerWidth <= 780) { $("#nav").hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); }
    const tipo = a.dataset.tipo;
    if (tipo) { app.filtro.tipo = tipo; sincronizarTabs(); }
  }));

  // Catálogo
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    app.filtro.tipo = b.dataset.tipo;
    sincronizarTabs();
  }));
  $("#chipsCategoria").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-categoria]");
    if (!chip) return;
    app.filtro.categoria = chip.dataset.categoria;
    pintarChips(); pintarProductos();
  });
  $("#busqueda").addEventListener("input", (e) => {
    app.filtro.texto = e.target.value;
    pintarProductos();
  });
  $("#orden").addEventListener("change", (e) => {
    app.filtro.orden = e.target.value;
    pintarProductos();
  });
  $("#rejillaProductos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-producto]");
    if (b) alternarCotizacion(b.dataset.producto);
  });

  // Cotización
  $("#bandeja").addEventListener("click", () => { pintarCotizacion(); abrirModal("modalCot"); });
  $("#listaCot").addEventListener("click", (e) => {
    const b = e.target.closest("[data-quitar]");
    if (b) alternarCotizacion(b.dataset.quitar);
  });
  $("#vaciarCot").addEventListener("click", () => {
    app.cotizacion = [];
    guardarLocal(LS_COT, app.cotizacion);
    pintarProductos(); pintarBandeja(); pintarCotizacion();
  });

  // Servicios → agendar
  $("#rejillaServicios").addEventListener("click", (e) => {
    const b = e.target.closest("[data-agendar-servicio]");
    if (!b) return;
    app.cita.servicio = b.dataset.agendarServicio;
    pintarOpcionesServicio();
    irAPaso(1);
  });

  // Agenda
  $("#opcionesServicio").addEventListener("click", (e) => {
    const b = e.target.closest("[data-servicio]");
    if (!b) return;
    app.cita.servicio = b.dataset.servicio;
    pintarOpcionesServicio();
  });
  $("#dias").addEventListener("click", (e) => {
    const b = e.target.closest("[data-dia]");
    if (!b || b.disabled) return;
    app.cita.fecha = b.dataset.dia;
    app.cita.hora = null;
    pintarDias(); pintarTurnos();
  });
  $("#turnos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-hora]");
    if (!b || b.disabled) return;
    app.cita.hora = b.dataset.hora;
    pintarTurnos();
  });
  $$("[data-ir]").forEach((b) => b.addEventListener("click", () => irAPaso(Number(b.dataset.ir))));
  $("#btnConfirmar").addEventListener("click", confirmarTurno);
  $("#btnOtroTurno").addEventListener("click", reiniciarAgenda);
  $("#placa").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase(); });

  // Panel
  $("#abrirPanel").addEventListener("click", () => { pintarPanel(); abrirModal("modalPanel"); });
  $$("[data-estado-filtro]").forEach((b) => b.addEventListener("click", () => {
    app.filtroPanel = b.dataset.estadoFiltro;
    $$("[data-estado-filtro]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    pintarPanel();
  }));
  $("#cuerpoCitas").addEventListener("change", (e) => {
    const s = e.target.closest("[data-cambiar-estado]");
    if (s) cambiarEstado(s.dataset.cambiarEstado, s.value);
  });
  $("#exportarCsv").addEventListener("click", descargarCsv);

  // Modales
  $$("[data-cerrar]").forEach((b) => b.addEventListener("click", () => cerrarModal(b.dataset.cerrar)));
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) cerrarModal(m.id); }));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    $$(".modal").forEach((m) => { if (!m.hidden) cerrarModal(m.id); });
  });
}

function sincronizarTabs() {
  $$(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x.dataset.tipo === app.filtro.tipo)));
  pintarChips(); pintarProductos();
}

function iniciar() {
  app.cotizacion = leerLocal(LS_COT, []).filter((id) => CATALOGO.some((p) => p.id === id));
  app.citas = leerLocal(LS_CITAS, []);

  pintarServicios();
  pintarMarcas();
  pintarFaq();
  pintarContacto();
  pintarChips();
  pintarProductos();
  pintarBandeja();
  pintarCotizacion();
  pintarOpcionesServicio();
  pintarProximoTurno();
  pintarDias();
  pintarTurnos();
  pintarPanel();
  conectarEventos();

  if (CONFIG.panelTaller === false) $("#abrirPanel").hidden = true;

  // La base de datos llega después; la página ya funciona sin ella.
  conectarBaseDeDatos();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();
