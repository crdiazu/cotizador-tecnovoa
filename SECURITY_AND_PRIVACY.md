# 🛡️ Seguridad y Privacidad de Datos — TECNOVOA

Este documento detalla los lineamientos de seguridad, protección de información comercial confidencial y privacidad en el manejo de datos para el Catálogo B2B Privado de **TECNOVOA**.

---

## 🔒 Acceso y Uso Privado

La herramienta está pensada para la fuerza de ventas y operaciones de TECNOVOA:
* La aplicación opera de forma directa con la planilla maestra de inventario mediante lectura pública en formato CSV.
* Las cotizaciones se calculan y generan directamente en el navegador del usuario utilizando `jsPDF`, sin transmitir datos confidenciales a bases de datos de terceros.

---

## 🔑 Protección de Información Comercial Sensible

1. **Costos y Márgenes de Ganancia:**
   * La vista de cliente oculta los costos y márgenes de ganancia internos, mostrando únicamente los valores netos y totales acordados.
   * Los registros históricos locales de cotizaciones (`cotizaciones_log.json` y `cotizaciones_log.md`) se guardan localmente en la máquina del comercial o servidor privado, manteniéndose protegidos contra accesos no autorizados.

2. **Control de Versiones y Repositorio en GitHub:**
   * El archivo `.gitignore` previene la inclusión accidental de claves de acceso, archivos temporales, credenciales o notas personales.
   * No se incluyen tokens ni credenciales de administración en el código fuente.
