# 🚀 Guía de Despliegue y Ejecución — TECNOVOA B2B

Este documento detalla los pasos para desplegar, ejecutar y mantener el Catálogo B2B Privado de **TECNOVOA**.

---

## 🌐 Opciones de Despliegue en Producción

Al tratarse de una aplicación estática (HTML, CSS, JavaScript Vanilla), no requiere servidores de aplicación complejos ni procesos de compilación (build steps).

### Opción 1: GitHub Pages (Recomendada)
1. Sube el código al repositorio de GitHub: `https://github.com/crdiazu/cotizador-tecnovoa.git`.
2. En la configuración de GitHub (*Settings* ➔ *Pages*):
   * Fuente: `Deploy from a branch`.
   * Rama: `master` / Carpeta: `/catalogo` (o `/root` si se redirige mediante un index raíz).
3. La aplicación quedará disponible en el dominio público/privado asignado por GitHub.

### Opción 2: Hosting Estático (Vercel, Netlify, Cloudflare Pages o Servidor Web Propio)
* Configura el directorio raíz de publicación como `catalogo/`.
* No se requieren variables de entorno de compilación ni dependencias de Node.js.

---

## 📈 Publicación y Vinculación de Google Sheets

Para que el catálogo cargue los productos en vivo:

1. Abre la planilla maestra de inventario de TECNOVOA.
2. Ve a **Archivo** ➔ **Compartir** ➔ **Publicar en la Web**.
3. Selecciona la pestaña de productos (`Hoja 2` / `CATALOGO`).
4. Selecciona el formato de salida: **Valores separados por comas (.csv)**.
5. Haz clic en **Publicar** y copia el ID generado.
6. Verifica que la constante `SHEET_URL` en `catalogo/js/app.js` apunte al ID correspondiente con el parámetro dinámico `&cache=` para evitar cacheos desactualizados en el navegador.

---

## 💻 Ejecución Local en Estación de Trabajo

Para correr el catálogo localmente con soporte de persistencia de logs y overrides de productos:

### 1. Iniciar con Python
Abre PowerShell o terminal en la raíz del proyecto y ejecuta:
```powershell
python server.py
```
El servidor quedará disponible en:
```
http://localhost:8000
```

### 2. Abrir Directamente en el Navegador
También puedes abrir el archivo directamente en cualquier navegador moderno:
* Ruta local: `catalogo/index.html`
*(Nota: algunas funciones de guardado de logs locales requieren que `server.py` esté activo para responder en el puerto 8000).*
