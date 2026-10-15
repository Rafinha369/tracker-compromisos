// Textos 100 % sintéticos con los compromisos esperados (etiquetas) para medir la extracción.
// "anchor" es un fragmento distintivo de la oración que contiene el compromiso.
export const EVALUATION_SAMPLES = [
  {
    id: "reunion-cierre",
    title: "Reunión cierre de nómina octubre",
    meetingDate: "2026-10-12",
    traps: "Una decisión (corte el día 20), una idea (Power Automate), una pregunta (finiquitos) y dos compromisos sin fecha concreta.",
    notes: `Reunión cierre de nómina octubre — lunes 12/10/2026
Asistentes: Carla Muñoz (Payroll), Diego Rojas (HRIS), Valentina Soto (Finanzas), Tomás Pérez (TI)

Revisamos las diferencias del archivo de horas extra de septiembre; hubo 37 registros con monto distinto.
Diego va a corregir el mapeo de la columna "HE_50" antes del miércoles 14.
Se decidió que el corte de novedades será el día 20 de cada mes.
Valentina enviará la conciliación de centros de costo a Carla el viernes.
Podríamos automatizar el envío del reporte con Power Automate más adelante.
¿Quién valida los finiquitos de la planta de Rancagua? Nadie lo tiene claro.
Tomás se compromete a dar acceso de lectura a la carpeta compartida, pero depende de que Seguridad apruebe la solicitud.
Carla preparará el checklist de cierre para el próximo comité.`,
    gold: [
      { anchor: "mapeo de la columna", action: "Corregir el mapeo de la columna HE_50", owner: "Diego Rojas", dueDate: "2026-10-14" },
      { anchor: "conciliacion de centros de costo", action: "Enviar la conciliación de centros de costo", owner: "Valentina Soto", dueDate: "2026-10-16" },
      { anchor: "acceso de lectura", action: "Dar acceso de lectura a la carpeta compartida", owner: "Tomás Pérez", dueDate: null },
      { anchor: "checklist de cierre", action: "Preparar el checklist de cierre", owner: "Carla Muñoz", dueDate: null },
    ],
  },
  {
    id: "hilo-ausentismo",
    title: "Hilo #rrhh-reportes — ausentismo",
    meetingDate: "2026-10-12",
    traps: "Un recordatorio, una idea (filtro por turno), una pregunta (licencia médica), una decisión y un pedido sin responsable (“alguien de TI”).",
    notes: `Canal #rrhh-reportes — 12/10/2026
[09:12] Andrea Fuentes: Les recuerdo que el reporte de ausentismo se publica el 31.
[09:15] Matías Lagos: Ok, yo actualizo el dashboard de ausentismo con los datos de octubre antes del 30.
[09:16] Andrea Fuentes: Perfecto. Sería bueno agregar un filtro por turno algún día.
[09:20] Javiera Núñez: Yo me encargo de pedir a las jefaturas los justificativos pendientes mañana.
[09:22] Matías Lagos: ¿Alguien sabe si el campo "licencia médica" viene en el nuevo formato?
[09:25] Andrea Fuentes: Alguien de TI debería revisar por qué falla la carga automática del lunes.
[09:30] Javiera Núñez: Listo, quedamos así: el cierre de ausentismo es responsabilidad de Matías desde este mes.`,
    gold: [
      { anchor: "dashboard de ausentismo", action: "Actualizar el dashboard de ausentismo", owner: "Matías Lagos", dueDate: "2026-10-30" },
      { anchor: "justificativos pendientes", action: "Pedir los justificativos pendientes", owner: "Javiera Núñez", dueDate: "2026-10-13" },
      { anchor: "falla la carga automatica", action: "Revisar la falla de la carga automática", owner: null, dueDate: null },
    ],
  },
  {
    id: "correo-auditoria",
    title: "Correo: pendientes auditoría de beneficios",
    meetingDate: "2026-10-12",
    traps: "Una decisión (seguro complementario), una idea (apoyo externo), “esta semana” como fecha y un pedido escrito como pregunta.",
    notes: `De: Rodrigo Díaz
Para: Fernanda Castro; Sebastián Vera
Fecha: lunes 12 de octubre de 2026
Asunto: Pendientes auditoría de beneficios

Hola equipo:
Tras la reunión con auditoría quedaron estos puntos.
Fernanda, por favor envía el detalle de bonos de escolaridad pagados en 2026 a más tardar el 23 de octubre.
Yo revisaré las 14 excepciones marcadas por auditoría esta semana.
Sobre el seguro complementario, la decisión fue mantener el proveedor actual hasta marzo.
Sebastián, una vez que Fernanda envíe el detalle, ¿puedes cruzarlo con la base de pagos antes del 28?
Quizás convenga contratar apoyo externo para la próxima auditoría.

Saludos,
Rodrigo`,
    gold: [
      { anchor: "bonos de escolaridad", action: "Enviar el detalle de bonos de escolaridad", owner: "Fernanda Castro", dueDate: "2026-10-23" },
      { anchor: "14 excepciones", action: "Revisar las 14 excepciones de auditoría", owner: "Rodrigo Díaz", dueDate: "2026-10-16" },
      { anchor: "base de pagos", action: "Cruzar el detalle con la base de pagos", owner: "Sebastián Vera", dueDate: "2026-10-28" },
    ],
  },
];
