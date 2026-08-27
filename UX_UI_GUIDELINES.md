# 🎨 UX/UI Design Guidelines — Catálogo B2B TECNOVOA

Este documento detalla los principios de diseño de interfaz (UI), experiencia de usuario (UX) y lenguaje visual para la aplicación del Catálogo B2B Privado de TECNOVOA.

---

## 📐 Estructura de Tres Columnas (Desktop-First)

La pantalla principal se concibe como una sola mesa de trabajo persistente para que el usuario no sienta transiciones pesadas de página:

1.  **Panel Izquierdo (Control y Filtros):**
    *   *Propósito:* Búsqueda por texto (PN y modelo), selección de categorías y estado de sincronización.
    *   *Comportamiento:* Menú de filtro lateral de acceso rápido y reactivo.
2.  **Zona Central (Stream de Productos):**
    *   *Propósito:* Grilla o lista de productos con lectura clara de imagen, P/N, stock, marca y precio.
    *   *Comportamiento:* Las tarjetas cambian de estado visual al agregarse al carrito o al agotarse el stock.
3.  **Panel Derecho (Resumen y Cotizador):**
    *   *Propósito:* Resumen en vivo del pedido actual (carrito de compras) con controles de cantidad y botón para generar proforma o PDF.

---

## 🎨 Tono Visual y Paleta de Colores

El diseño debe sentirse como una herramienta interna premium corporativa (base oscura con contrastes controlados):

*   **Fondo Base (`#0f172a`):** Slate oscuro para evitar fatiga visual durante su uso diario.
*   **Superficies (`#1e293b` y `#23324a`):** Cards y paneles secundarios claramente separados por bordes sutiles (`#334155`).
*   **Verde Éxito (`#22c55e`):** Reservado estrictamente para los precios netos, totales y ganancias estimadas.
*   **Acciones y Enlaces (`#3b82f6`):** Azul corporativo para botones principales e interactivos.
*   **Monospace en Part Numbers:** Los códigos de fabricante (P/N) deben usar tipografía de ancho fijo (`monospace`) para facilitar su lectura y comparación exacta con planillas.

---

## ⚙️ Estados y Retroalimentación de la Interfaz

1.  **Carga del Catálogo (Google Sheets CSV):**
    *   Mientras se parsean los datos del Sheet, se debe mostrar un spinner de carga o skeleton screens en la grilla central con el texto `"Cargando catálogo..."`.
2.  **Stock Agotado (`Stock: 0`):**
    *   La tarjeta del producto debe atenuar su opacidad, desactivar el botón de `"Agregar al Pedido"` y mostrar un tag claro en tono apagado o rojo tenue (`Sin Stock`).
3.  **Indicador de Datos del Día:**
    *   Un pequeño indicador en el panel izquierdo valida si la planilla tiene la fecha de hoy (`✅ ✓ Datos de hoy`) o si está desactualizada (`⚠️ Datos de fecha anterior`).

---

## 🖼️ UX del Diseñador de Flyer Promocional

El catálogo incluye un generador de flyers comerciales individuales basado en Canvas HTML5:

*   **Previsualización Dinámica:** Al seleccionar un producto y activar el editor de flyer, la UI dibuja en tiempo real el producto, su Part Number, precio, logo de la marca y un código QR del sitio web sobre el canvas.
*   **Tratamiento de Imágenes (CORS Proxy):** Dado que las imágenes provienen de URLs externas, la interfaz implementa el proxy `images.weserv.nl` de forma transparente para evitar errores de seguridad CORS en el canvas.
*   **Descarga Directa:** El botón de descarga convierte el Canvas en PNG instantáneamente en el navegador del usuario sin requerir procesamiento en servidores.
