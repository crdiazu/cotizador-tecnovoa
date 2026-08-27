# 🚀 Deployment Guide — Ruta a Producción

Este documento detalla los pasos para compilar, desplegar y sincronizar los entornos del Catálogo B2B Privado de TECNOVOA tanto en la nube (Firebase) como en la estación de trabajo local (Obsidian CRM).

---

## ☁️ Despliegue en la Nube (Firebase)

La aplicación utiliza Google Firebase para el hosting estático y las funciones de backend.

### Requisitos Previos:
*   Tener instalado **Node.js** y **Firebase CLI** en la máquina.
*   Haber iniciado sesión con la cuenta de Firebase administradora:
    ```powershell
    firebase login
    ```

### 1. Despliegue del Frontend (Catálogo y Diseñador)
El catálogo estático (HTML, CSS, JS) vive en el directorio `/catalogo` y se sirve sin necesidad de compilación (Vanilla stack).
Para desplegar únicamente la interfaz visual:
```powershell
firebase deploy --only hosting
```
*   **URL de producción:** [https://cotizador-tecnovoa.web.app](https://cotizador-tecnovoa.web.app)

### 2. Despliegue de Backend (Cloud Functions)
Las funciones se encuentran en el directorio `/functions`. Si realizas cambios en el endpoint `logCotizacion` (Node.js):
```powershell
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 📈 Publicación de Google Sheets (Base de Datos)

Para que el catálogo web pueda cargar los productos de forma dinámica, la planilla de Google Sheets debe ser de acceso público en formato CSV.

### Pasos obligatorios en Google Sheets:
1.  Abre la planilla maestra de inventario.
2.  Ve a **Archivo** ➔ **Compartir** ➔ **Publicar en la Web**.
3.  Selecciona únicamente la pestaña correspondiente: **`Hoja 2`** (o `Tabla_1`).
4.  Selecciona el formato de salida: **Valores separados por comas (.csv)**.
5.  Haz clic en **Publicar** y copia el ID del documento generado.
6.  Asegúrate de que la URL del frontend (`SHEET_URL` en [app.js](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/catalogo/js/app.js)) apunte a ese ID exacto con el parámetro `&cache=` dinámico para evitar almacenamiento en caché viejo en el navegador del cliente.

---

## 💻 Despliegue y Ejecución Local (Obsidian CRM)

El sincronizador de base de datos lee los registros de Firestore y los convierte a notas Markdown locales.

### 1. Preparación del Entorno Windows:
Asegúrate de tener un entorno Python configurado con las credenciales correspondientes:
1.  Copia el archivo `serviceAccountKey.json` en la raíz de la carpeta `cotizador/`.
2.  Ejecuta PowerShell e instala dependencias:
    ```powershell
    pip install -r sync_requirements.txt
    ```

### 2. Sincronización del CRM:
Para procesar las cotizaciones en el Vault, abre PowerShell en el directorio del proyecto y ejecuta:
```powershell
python sync_cotizaciones.py
```
*   *Nota:* Este script debe ejecutarse bajo demanda (al inicio o cierre del día comercial) para descargar todas las proformas emitidas desde la web.

### 3. Ejecución del Servidor Local (Opcional):
Si deseas interactuar localmente con las APIs de creación de notas a través de la terminal o integraciones directas:
```powershell
python server.py
```
El backend estará disponible localmente en `http://localhost:8000`.
