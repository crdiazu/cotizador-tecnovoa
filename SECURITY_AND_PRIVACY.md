# 🛡️ Seguridad y Privacidad de Datos — TECNOVOA

Este documento detalla los lineamientos de seguridad de infraestructura, protección de secretos y privacidad en el manejo de datos de clientes para la aplicación del Catálogo B2B Privado de TECNOVOA.

---

## 🔒 Acceso por URL Privada

Al tratarse de una herramienta de uso estrictamente personal y comercial controlado (desarrollo propio no compartido públicamente), el acceso a la interfaz web se maneja bajo el principio de **seguridad por oscuridad**:
*   La aplicación no requiere inicio de sesión con credenciales (la autenticación visual está deshabilitada por diseño).
*   El control de acceso se basa en la privacidad de la URL de despliegue en Firebase Hosting (`cotizador-tecnovoa.web.app` y sus alias asociados).

---

## 🔑 Protección de Credenciales y Secretos

Es crítico evitar la exposición de credenciales y claves de API en repositorios de código (incluso si son privados).

1.  **Clave de Cuenta de Servicio (`serviceAccountKey.json`):**
    *   Este archivo otorga acceso administrativo completo a Firebase/Firestore.
    *   **Debe estar estrictamente listado en el archivo `.gitignore`** para evitar su subida accidental al control de versiones.
    *   Cada entorno de desarrollo local debe descargar y mantener su copia del archivo de forma aislada.

2.  **Tokens en la Interfaz Web:**
    *   La configuración del cliente de Firebase (`apiKey`, `authDomain`, `projectId`, etc.) embebida en el frontend no representa un riesgo crítico de seguridad ya que solo permite la escritura a través del endpoint controlado `logCotizacion` y la lectura pública del catálogo.
    *   Se implementa el bloqueo de CORS a nivel de Firebase Hosting y Cloud Functions para asegurar que solo peticiones del dominio autorizado puedan invocar los endpoints de registro.

---

## 💾 Privacidad y Ciclo de Vida de los Datos de Clientes

Las cotizaciones emitidas contienen datos comerciales sensibles como nombres de clientes, datos de contacto (WhatsApp/Email), descripciones de requerimientos y márgenes de ganancia.

1.  **Retención en Firestore:**
    *   Las cotizaciones se almacenan de forma **permanente** en la base de datos de Firestore. Esto permite realizar auditorías comerciales a largo plazo, calcular promedios de margen y reconstruir el historial en Obsidian mediante el sincronizador local.
    *   El campo `synced: true/false` se utiliza como bandera para evitar la duplicidad al descargar datos al vault.

2.  **Integración con Obsidian (Local):**
    *   El paso final de la información confidencial (costos detallados, ganancias netas y comisiones) se consolida en el equipo local del desarrollador en Obsidian.
    *   Esto garantiza que los datos financieros detallados del negocio vivan en un almacenamiento local seguro, fuera de servidores de terceros públicos.
