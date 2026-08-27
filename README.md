# 📦 Catálogo B2B Privado — TECNOVOA

Plataforma privada B2B diseñada para que la fuerza de ventas de TECNOVOA explore el inventario de hardware y licencias de tecnología, cotice a clientes, genere flyers promocionales y automatice el registro comercial (CRM) dentro de Obsidian.

---

## 🚀 Accesos Rápidos

*   **Planilla Maestra de Productos:** [Google Sheets (Hoja 2)](https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/edit#gid=1034642903)
*   **Plataforma de Producción:** [Firebase Hosting — cotizador-tecnovoa](https://cotizador-tecnovoa.web.app)
*   **Catálogo Local (Desarrollo):** [catalogo/index.html](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/catalogo/index.html)
*   **Script de Sincronización Local:** [sync_cotizaciones.py](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/sync_cotizaciones.py)
*   **Dashboard del CRM en Vault:** [CRM_HOME.md](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/99_SISTEMA/CRM_HOME.md)

---

## 🛠️ Guía de Configuración Local

### Requisitos Previos

1.  **Python 3.x** instalado.
2.  **Node.js & npm** instalados (para Firebase CLI y Functions).
3.  **Firebase CLI** configurado:
    ```powershell
    npm install -g firebase-tools
    firebase login
    ```

### Paso 1: Clonar y Ubicar Credenciales

El backend local y los scripts requieren la clave de cuenta de servicio de Firebase para autenticarse con Firestore.

1.  Descarga el archivo `serviceAccountKey.json` desde Firebase Console.
2.  Ubícalo en el directorio raíz del proyecto:
    `c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/serviceAccountKey.json`

### Paso 2: Configurar Dependencias de Python

Instala las librerías necesarias para el script de sincronización con Obsidian:
```powershell
pip install -r sync_requirements.txt
```

### Paso 3: Configurar Firebase Functions

Navega a la carpeta de funciones e instala las dependencias de Node.js:
```powershell
cd functions
npm install
cd ..
```

---

## 💻 Comandos de Ejecución y Despliegue

### 1. Iniciar Servidor Local y Sincronizador CRM
Para iniciar el backend local que procesa los registros de cotizaciones en Obsidian:
```powershell
python server.py
```
*El servidor escuchará en el puerto `8000` localmente.*

### 2. Sincronizar Cotizaciones Pendientes de Firestore
Para descargar nuevas proformas y cotizaciones creadas en producción e insertarlas en las notas diarias y CRM de Obsidian:
```powershell
python sync_cotizaciones.py
```

### 3. Probar Catálogo Localmente
Abre directamente en el navegador el archivo principal del catálogo:
*   [index.html](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/catalogo/index.html)

### 4. Desplegar Cambios a Producción
Para desplegar la interfaz web y las Cloud Functions de Firebase:
```powershell
firebase deploy
```

---

## 📁 Estructura del Proyecto

*   [catalogo/](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/catalogo): Interfaz frontend vanilla (HTML, JS, CSS) con el catálogo y flyer designer.
*   [functions/](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/functions): Cloud Functions de Firebase para almacenamiento de cotizaciones.
*   [docs/](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/docs): Documentación operativa de flujos y brechas de integración.
*   [server.py](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/server.py): Servidor local de integración con Obsidian.
*   [sync_cotizaciones.py](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/sync_cotizaciones.py): Agente de sincronización Firestore ➔ Vault CRM.
*   [Terminos_y_Condiciones_Generales_Venta_TECNOVOA.md](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/Terminos_y_Condiciones_Generales_Venta_TECNOVOA.md): Términos legales de Tecnovoa.
