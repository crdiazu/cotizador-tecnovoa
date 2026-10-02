# 📦 Catálogo B2B y Cotizador Comercial — TECNOVOA

Plataforma comercial privada diseñada exclusivamente para la fuerza de ventas y operaciones de **TECNOVOA**. Permite explorar el inventario de hardware y tecnología, cotizar a clientes con cálculo automático de márgenes, generar proformas comerciales en PDF y diseñar flyers promocionales de productos en segundos.

---

## 🚀 Accesos y Recursos

* **Repositorio en GitHub:** [crdiazu/cotizador-tecnovoa](https://github.com/crdiazu/cotizador-tecnovoa)
* **Planilla Maestra de Productos:** [Google Sheets (Hoja 2 - CATALOGO)](https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/edit#gid=1034642903)
* **Catálogo Local:** [catalogo/index.html](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/catalogo/index.html)
* **Servidor Local de Utilidades:** [server.py](file:///c:/Users/Cristian/Obsidian/Cristian/CDU/PROYECTOS/TECNOVOA/cotizador/server.py)

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 Semántico, Vanilla JavaScript (ES6+ modular), Vanilla CSS con estética ejecutiva oscura y responsiva.
* **Motor de PDF:** `jsPDF` para renderizado y descarga directa en el navegador de proformas comerciales con diseño editorial corporativo.
* **Diseñador de Flyers:** Renderizado sobre HTML5 Canvas para exportar imágenes promocionales de productos individuales.
* **Fuente de Datos:** Google Sheets publicado en formato CSV (sincronización en vivo sin necesidad de re-compilar).
* **Backend de Soporte (Local):** Python 3 (`http.server` nativo) para servir la aplicación estática y gestionar bitácora local (`cotizaciones_log.json`, `cotizaciones_log.md`) y personalizaciones de producto (`product_overrides.json`).

---

## 💻 Ejecución y Uso

### 1. Ejecutar con Servidor Local (Recomendado)
Para tener habilitado el guardado de bitácora local y overrides de productos:
```powershell
python server.py
```
Abre en tu navegador:
```
http://localhost:8000
```

### 2. Abrir Directamente en Navegador
Puedes abrir directamente el archivo `catalogo/index.html` en Chrome, Edge o Firefox. La lectura de productos desde Google Sheets funcionará de forma inmediata.

---

## 📁 Estructura del Repositorio

```text
├── catalogo/                      # Aplicación Web Frontend
│   ├── index.html                 # Pantalla principal (Catálogo, Cotizador y Diseñador)
│   ├── css/
│   │   └── style.css              # Estilos visuales del sistema
│   ├── js/
│   │   └── app.js                 # Lógica de carga de datos, cálculo y PDFs
│   └── data/
│       └── product_overrides.json # Modificaciones locales de productos
├── docs/                          # Documentación técnica adicional
├── server.py                      # Servidor local Python para desarrollo y logs
├── cotizaciones_log.json          # Historial estructurado de cotizaciones emitidas
├── cotizaciones_log.md            # Bitácora en Markdown de cotizaciones
├── ARCHITECTURE.md                # Arquitectura técnica del sistema
├── DEPLOYMENT.md                  # Guía de despliegue y configuración
├── DESIGN.md                      # Lineamientos de diseño y UI/UX
├── INSTRUCTIVO_DATOS_SHEETS.md    # Guía para actualizar la planilla Google Sheets
├── PROPUESTA_MINI_CRM.md          # Especificación del mini-CRM de TECNOVOA
├── ROADMAP_AI_FEATURES.md         # Hoja de ruta y futuras funciones
├── SECURITY_AND_PRIVACY.md        # Políticas de privacidad y seguridad de datos
└── Terminos_y_Condiciones_Generales_Venta_TECNOVOA.md
```
