# Manual Operativo: Sistema de Control de Cambios (ITIL 4)

Este documento sirve como guía para los usuarios encargados de probar y validar el sistema de gestión de cambios.

---

## 1. Acceso al Sistema

- **URL**: [https://sistema-control-de-cambio.vercel.app](https://sistema-control-de-cambio.vercel.app)
- **Nota**: El sistema permite cambiar de rol mediante el panel de **"Debug Role"** en la esquina superior derecha para probar diferentes niveles de acceso.

---

## 2. El Dashboard (Tablero de Control)

El Dashboard es la vista principal donde se listan todos los cambios.

- **Aging (Alertas)**: Notarás que algunos tickets aparecen en **rojo**. Esto indica que el ticket ha estado en estado "Información Requerida" por más de **48 horas**.
- **Acción**: Haz clic en **"Gestionar"** para entrar al detalle de cualquier cambio.

---

## 3. Flujo de un Cambio (Paso a Paso)

### fase A: Creación e Inicio

1. Haz clic en **"+ Nuevo Cambio"**.
2. Completa los campos obligatorios: **Título** y **Justificación**.
3. **Aprobadores**: Ingresa el correo electrónico de los aprobadores y pulsa **"Agregar"**.

### fase B: Evaluación y Aprobación

1. Una vez completada la info, pulsa **"Enviar a Evaluación"**.
2. El sistema bloqueará la edición de campos críticos y notificará (simuladamente) a los aprobadores.

### fase C: Aprobación Interactiva (Simulador)

Para facilitar las pruebas sin depender de correos reales, hemos incluido un **Simulador de Notificaciones** (cuadro azul abajo a la derecha):

1. Cuando agregas un aprobador, su "notificación" aparecerá en este cuadro.
2. Puedes actuar como el aprobador pulsando:
   - **Aprobar**: El aprobador queda marcado en verde.
   - **Pedir Info**: El aprobador queda en amarillo y se registra en el historial.
3. Una vez que el cambio es autorizado, puedes avanzar a **Programado**.

### fase D: Implementación y Cierre

1. **Programar**: Define cuándo se hará el cambio.
2. **Implementación**: Marca el inicio de la actividad técnica.
3. **PIR (Post-Implementation Review)**: Tras finalizar, es **obligatorio** documentar el "Resultado" y las "Lecciones Aprendidas" antes de que el sistema te permita cerrar el ticket.

---

## 4. Funcionalidades de Auditoría

- **Muro de Iteración**: Ubicado en el lateral derecho del detalle del cambio. Registra automáticamente cada cambio de estado, aprobación y comentario, incluyendo quién y cuándo lo hizo.
- **Documentación e Integridad**: Al subir un archivo, el sistema genera un "Hash SHA256". Si el archivo fuera modificado externamente, el hash ya no coincidiría, garantizando la integridad de la evidencia técnica.

---

## 5. Casos de Prueba Sugeridos para Testers

1. **Validación de Vacíos**: Intenta enviar a evaluación un cambio sin título o sin aprobadores.
2. **Flujo de Rechazo**: Pide "Información Requerida" como aprobador y observa cómo el solicitante debe responder para volver a evaluación (la versión del cambio aumentará de V1 a V2 automáticamente).
3. **Cierre sin PIR**: Intenta cerrar un ticket sin completar las lecciones aprendidas.

---
> [!NOTE]
> Este sistema es una versión de simulación funcional. Los datos se almacenan de forma local en la sesión de navegación para propósitos de prueba visual.
