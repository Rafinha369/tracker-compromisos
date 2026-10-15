# Requisitos: tracker de compromisos

Problema: los compromisos quedan dispersos en minutas, chats y correos; no se sabe quién es el dueño, cuándo vence, de qué depende ni si se cumplió.

## R1. Acceso
- R1.1 Una persona crea su cuenta con email y contraseña.
- R1.2 Una persona inicia sesión y cierra sesión.
- R1.3 Sin sesión, cualquier página privada redirige a /login.
- R1.4 Una persona nunca ve ni modifica compromisos de otra (verificado con 2 cuentas).

## R2. Extraer y revisar
- R2.1 La persona pega notas (20 a 15.000 caracteres), indica título y fecha de reunión.
- R2.2 La IA clasifica cada enunciado en compromiso, decisión, idea o pregunta, y extrae acción, responsable, fecha, dependencia, prioridad, frase de origen y confianza.
- R2.3 Reglas sin IA: la frase de origen debe existir en las notas; la fecha debe ser válida; se marcan posibles duplicados; confianza menor a 80 % va a revisión.
- R2.4 Los ítems se agrupan en: listos para aprobar, requieren revisión, no son compromisos.
- R2.5 Al seleccionar un ítem, su frase de origen se resalta en las notas.
- R2.6 Nada entra al tracker sin que la persona lo apruebe; puede editar antes de aprobar.
- R2.7 Si la IA no responde, la persona puede agregar compromisos a mano.

## R3. Tracker
- R3.1 Lista de compromisos con acción, responsable, fecha, prioridad y estado.
- R3.2 Estados: pendiente → en progreso / bloqueado / cancelado; en progreso → bloqueado / completado / cancelado; bloqueado → en progreso / cancelado. Completado y cancelado son finales.
- R3.3 Completar exige registrar evidencia.
- R3.4 Filtros: abiertos, vencidos, bloqueados, completados, todos; y por responsable.
- R3.5 Cada cambio de estado queda en un historial.

## R4. Métricas
- R4.1 Evaluación sobre 3 textos sintéticos con 10 compromisos etiquetados.
- R4.2 Muestra precisión, recall, responsable correcto, fecha correcta y compromisos falsos.
- R4.3 Comparación de minutos a mano frente a minutos asistidos.

## Fuera de alcance
Integración con Slack o correo, lectura de PDF, equipos compartidos, notificaciones.
