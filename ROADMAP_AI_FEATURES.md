# 🗺️ Roadmap & Futuras Capacidades — Catálogo B2B TECNOVOA

Este documento detalla la hoja de ruta y la evolución funcional del Catálogo B2B Privado de TECNOVOA, enfocándose en la automatización del marketing y la generación de documentos comerciales avanzados.

---

## 🎨 Fase 1: Diseñador de Flyers Inteligente (Asistido por Antigravity)

Actualmente, el generador de flyers dibuja de forma estática la información del producto sobre un canvas. La evolución planificada incluye:

1.  **Redacción de Copy Comercial:**
    *   *Funcionalidad:* El motor de IA (Gemini) sugerirá de forma automática textos de marketing breves y persuasivos basados en el Part Number y la marca seleccionados.
    *   *Propósito:* Evitar descripciones genéricas o excesivamente técnicas en el flyer, reemplazándolas por ganchos comerciales orientados al beneficio del cliente (ej. "Ideal para teletrabajo", "Rendimiento óptimo en servidores corporativos").
2.  **Alineación Dinámica de Marca:**
    *   *Funcionalidad:* Centrado y redimensionamiento inteligente de los logotipos de partners (Lenovo, HP, Cisco) y del producto en el canvas según el ratio de aspecto, evitando recortes extraños y garantizando consistencia visual premium.

---

## 📖 Fase 2: Catálogo Revista Multipágina

Se desarrollará una herramienta de exportación editorial premium que consolide múltiples productos seleccionados por el vendedor:

1.  **Formato Editorial:**
    *   *Funcionalidad:* En lugar de fichas técnicas individuales, se generará un documento PDF multipágina con portadas automatizadas que integren la marca TECNOVOA y la del cliente destino.
2.  **Índice y Estructuración Automática:**
    *   *Funcionalidad:* Generación dinámica de un índice y cartas de presentación corporativas introductorias.
    *   *Propósito:* Facilitar el envío de propuestas integrales de renovación de hardware a grandes cuentas corporativas, sintiéndose como una revista personalizada y sofisticada de productos IT.

---

## 🔗 Fase 3: Evolución del CRM Local y Automatización de Pedidos

Aumentar la integración con el Vault de Obsidian sin añadir capas de backend complejas:

1.  **Gatillante de Notificación de Cotización:**
    *   *Funcionalidad:* Integrar un botón en la interfaz de pedidos que no solo descargue el PDF, sino que envíe una notificación directa al comercial con el resumen de la propuesta.
2.  **Enriquecimiento Automático de Clientes:**
    *   *Funcionalidad:* Que el sincronizador de Obsidian pueda cruzar los datos del cliente con las notas existentes en `Clientes/` e inserte automáticamente los enlaces a las nuevas cotizaciones, manteniendo el grafo de Obsidian interconectado al 100%.
