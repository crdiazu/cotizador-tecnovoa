# TECNOVOA Commerce Workspace — Guía de Diseño

## Propósito
Aplicación privada de TECNOVOA para gestionar un catálogo comercial, construir cotizaciones elegantes en PDF, registrar actividad en el CRM dentro del vault y producir piezas comerciales como flyers y catálogo tipo revista.

La experiencia debe sentirse como una herramienta interna premium: sobria, rápida, clara y orientada a cerrar oportunidades comerciales con mejor presentación.

## Alcance del proyecto
- Catálogo privado de productos con búsqueda, filtros y selección rápida
- Cotizador interno con vista comercial para cliente
- Exportación de cotizaciones en PDF con carácter editorial premium
- Registro comercial en el vault como CRM operativo
- Generación de flyers individuales como addon del catálogo
- Generación futura de catálogo revista desde productos seleccionados

## Principio rector
- Esta guía describe la arquitectura visual y operativa de una aplicación privada propia y exclusiva de TECNOVOA.

---

## Visión de experiencia

### Idea central
Una sola pantalla principal concentra el trabajo diario. El usuario explora, compara, selecciona, cotiza y exporta sin sentir que cambia de aplicación.

### Carácter de producto
- Privado
- Ejecutivo
- Comercial
- Preciso
- Editorial

### Principios de diseño
- **Claridad primero:** los datos deben leerse rápido incluso en tablas densas
- **Jerarquía comercial:** el precio, la selección y la acción deben dominar la experiencia
- **Oscuro, pero refinado:** evitar el aspecto de dashboard genérico
- **Edición controlada:** lo interno puede ser flexible; lo que ve el cliente debe sentirse impecable
- **Un flujo, varias salidas:** catálogo, cotización, flyer y revista parten desde la misma selección

---

## Arquitectura de experiencia

### Workspace principal
Aplicación desktop-first de tres zonas persistentes:

1. **Panel izquierdo**
   - marca TECNOVOA
   - búsqueda
   - filtros y categorías
   - acceso a acciones de contenido
   - disparador del addon de flyer
   - contexto o enriquecimiento desde el vault

2. **Zona central**
   - grilla o stream de productos
   - lectura visual del catálogo
   - selección rápida
   - comparación ligera

3. **Panel derecho**
   - seleccionados
   - resumen comercial
   - cotizador en vivo
   - acciones de exportación
   - acceso a PDF y CRM

### Ventanas funcionales
Las vistas del sistema quedan redefinidas así:

1. **Pantalla principal unificada**
2. **Cotizador expandido interno**
3. **Vista cliente / proforma**
4. **Salida PDF de cotización**
5. **Editor de flyer**
6. **Generador de catálogo revista**

### Lo que se elimina
- overlay de acceso/login

---

## Dirección visual

### Tono visual
TECNOVOA debe proyectar una mezcla de:
- distribución tecnológica seria
- oficina comercial contemporánea
- documento corporativo bien diseñado

No debe sentirse como ecommerce público ni como ERP antiguo.

### Estilo visual recomendado
- Base oscura y elegante
- Superficies limpias con contraste controlado
- Acentos fríos para interacción
- Verde reservado para precios, utilidad y confirmaciones
- Composición amplia con aire visual
- Tipografía sobria con jerarquía nítida

### Lenguaje formal
- Español de Chile
- Terminología comercial consistente
- Etiquetas claras, no excesivamente técnicas
- PDF y salidas visuales con redacción más ejecutiva que operativa

---

## Sistema visual

### Paleta principal
- **Background base:** `#0f172a`
- **Surface primary:** `#1e293b`
- **Surface secondary:** `#23324a`
- **Surface elevated:** `#2a3a52`
- **Border subtle:** `#334155`
- **Border strong:** `#475569`
- **Text primary:** `#f1f5f9`
- **Text secondary:** `#94a3b8`
- **Text muted:** `#64748b`
- **Accent action:** `#3b82f6`
- **Accent highlight:** `#06b6d4`
- **Success:** `#22c55e`
- **Warning:** `#f59e0b`
- **Danger:** `#ef4444`

### Colores de uso
- **Azul principal:** botones primarios, foco, tabs activas, links
- **Cian:** tags, categorías, elementos de filtrado y énfasis informativo
- **Verde:** precios, totales, estados positivos, métricas de utilidad
- **Ámbar:** advertencias de actualización o disponibilidad
- **Rojo:** errores, borrado, estados críticos

### Tipografía
- **Base UI:** `Inter`, sans-serif
- **Títulos de interfaz:** 600 a 700
- **Texto funcional:** 400 a 500
- **Códigos y P/N:** monospace, 700
- **Documentos/PDF premium:** usar una jerarquía más editorial, con títulos más aireados y subtítulos sobrios

### Escala tipográfica
- **Display / title page:** 32–40px
- **Heading L:** 24px
- **Heading M:** 18px
- **Heading S:** 14–16px
- **Body:** 13–14px
- **Meta / helper:** 11–12px

### Espaciado
- Base: `4px`
- Ritmo común: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`
- Separaciones grandes de layout: `40px`, `48px`

### Radios
- **Small:** `6px`
- **Medium:** `10px`
- **Large:** `14px`
- **Pill:** `9999px`

### Sombras
- **Card:** `0 8px 24px rgba(0,0,0,0.28)`
- **Modal:** `0 24px 70px rgba(0,0,0,0.45)`
- **Focused surface:** `0 0 0 1px rgba(59,130,246,0.5), 0 10px 30px rgba(59,130,246,0.12)`

---

## Módulos principales

### 1. Catálogo
Objetivo: explorar y seleccionar productos con rapidez.

Debe incluir:
- búsqueda por nombre, marca y P/N
- filtros por categoría, marca y disponibilidad
- lectura clara de imagen, nombre, P/N, stock y precio
- selección inmediata hacia el cotizador
- señales de actualización de datos

### 2. Cotizador
Objetivo: convertir selección en propuesta comercial.

Debe incluir:
- control de cantidades
- costo y margen en vista interna
- tipo de cambio
- cálculo de totales
- edición de campos comerciales
- vista limpia para cliente
- exportación PDF elegante

### 3. CRM en vault
Objetivo: registrar y conectar actividad comercial con conocimiento.

Debe incluir:
- creación de nota por cotización
- actualización de índice e historial
- asociación con cliente, contacto y fecha
- posibilidad de enriquecer una cotización con notas del vault

### 4. Flyer
Objetivo: producir una pieza promocional rápida desde un producto seleccionado.

Debe incluir:
- preview en vivo
- control de titular, specs, precio y CTA
- branding TECNOVOA consistente
- exportación lista para compartir

### 5. Catálogo revista
Objetivo: componer una salida editorial con múltiples productos.

Debe incluir:
- portada
- páginas por categoría o campaña
- fichas de producto curadas
- continuidad visual entre páginas
- salida más narrativa que el flyer

---

## Diseño de pantallas

### Pantalla 1: Workspace principal

**Layout general**
- izquierda: navegación, filtros y herramientas de contenido
- centro: grilla de catálogo
- derecha: seleccionados + cotizador resumido

**Prioridades visuales**
- primero: encontrar productos
- segundo: entender rápidamente el valor comercial
- tercero: agregar y construir selección

**Panel izquierdo**
- logo TECNOVOA
- etiqueta de entorno privado
- buscador principal
- filtros persistentes
- categorías
- bloque de estado de actualización
- acceso a términos
- acceso a flyer desde producto seleccionado
- tarjetas de conocimiento desde el vault cuando existan

**Zona central**
- encabezado con categoría o modo actual
- contador de resultados
- ordenamiento
- tarjetas de producto más limpias y mejor proporcionadas
- posibilidad futura de vista grid y vista compacta

**Panel derecho**
- lista de seleccionados
- subtotal
- datos rápidos de cotización
- CTA para abrir cotizador expandido
- CTA para generar PDF

### Pantalla 2: Cotizador expandido interno
Pantalla densa, orientada a operación comercial y control de margen.

Debe sentirse como una herramienta profesional, no como una tabla improvisada.

Incluye:
- tabla editable
- métricas superiores
- edición de cliente
- condiciones comerciales
- totales claros
- foco visual en utilidad, precio y total

### Pantalla 3: Vista cliente / proforma
Versión limpia del cotizador.

Debe ocultar:
- costos
- márgenes
- observaciones internas
- controles de edición irrelevantes

Debe destacar:
- identidad TECNOVOA
- datos del cliente
- detalle claro de ítems
- subtotal, IVA y total
- términos y vigencia

### Pantalla 4: PDF de cotización
Documento con lenguaje editorial premium.

Debe sentirse:
- más cercano a una propuesta comercial que a un export técnico
- limpio, respirado y confiable

Estructura:
- cabecera TECNOVOA
- bloque cliente
- tabla de productos
- resumen de montos
- términos
- cierre comercial y contacto

### Pantalla 5: Editor de flyer
Addon del catálogo, no pantalla madre.

Debe priorizar:
- preview grande
- controles breves
- estética publicitaria simple
- salida rápida

### Pantalla 6: Generador de catálogo revista
Modo editorial de selección múltiple.

Debe trabajar desde una colección de productos seleccionados y permitir:
- elegir orden
- agrupar por criterio
- definir portada o tema
- producir páginas con coherencia visual

---

## Componentes base

### ProductCard
Debe incluir:
- imagen bien contenida
- nombre de producto en 2 líneas máximo
- marca
- P/N legible
- categoría como etiqueta
- precio protagonista
- stock y estado
- acción primaria clara

### SelectedItem
Elemento compacto para panel derecho.

Debe incluir:
- nombre corto
- P/N
- cantidad
- precio
- controles rápidos

### FilterBlock
Grupo visual para filtros del panel izquierdo.

Debe verse estable, ordenado y escaneable.

### StatCard
Componente para:
- costo total
- margen promedio
- utilidad estimada
- total general

### QuoteTableRow
Fila con alta densidad de información pero con lectura limpia.

Estados:
- normal
- activa
- editable
- error
- bloqueada para vista cliente

### KnowledgeCard
Tarjeta para mostrar enriquecimiento desde el vault:
- compatibilidades
- notas comerciales
- recomendaciones
- advertencias

---

## Interacciones clave

- **Buscar:** filtra por texto en tiempo real
- **Filtrar:** combina categorías, marca y disponibilidad
- **Agregar a selección:** actualiza panel derecho de inmediato
- **Editar cantidades:** recalcula subtotales y totales
- **Editar costo/margen:** recalcula PVP y utilidad
- **Cambiar vista:** pasa de interna a cliente sin perder contexto
- **Generar PDF:** crea salida limpia y presentable
- **Crear flyer:** toma el producto actual y abre editor
- **Crear revista:** toma la selección actual como colección base
- **Registrar CRM:** guarda cotización y la enlaza al vault

---

## Datos y fuentes

### Fuente maestra
- Google Sheets como origen principal del catálogo

### Fuente alternativa
- CSV local bajo demanda

### Enriquecimiento
- El vault aporta contexto comercial, observaciones, compatibilidades y memoria operativa

### Regla importante
- La app debe soportar datos incompletos y degradar con elegancia cuando falten imágenes, stock o atributos secundarios

---

## Reglas de contenido

### Precios
- Mostrar con formato consistente
- Separar con claridad neto, IVA y total
- Diferenciar precio visible al cliente de costo interno

### Disponibilidad
- Debe expresarse con frases comerciales comprensibles
- Evitar tecnicismos innecesarios en la salida cliente

### Términos
- Usar base legal/comercial de TECNOVOA
- La versión PDF debe ser editable antes de exportar

### Marcas y categorías
- Deben sentirse consistentes en nomenclatura
- Las categorías no deben fragmentarse por errores de escritura

---

## Criterios de calidad

- La pantalla principal debe permitir trabajar horas sin fatiga visual
- La tabla del cotizador debe ser más clara que una planilla tradicional
- El PDF debe verse enviable sin retoques manuales
- El flyer debe sentirse parte del ecosistema TECNOVOA
- La salida revista debe tener valor comercial real, no ser una simple concatenación de productos

---

## No objetivos actuales

- No diseñar para móvil
- No convertir esto en tienda pública
- No mezclar branding de clientes externos con la identidad base de TECNOVOA

---

## Próxima fase sugerida

1. Diseñar la pantalla principal unificada
2. Rediseñar el cotizador expandido
3. Definir la plantilla premium del PDF
4. Refinar el addon de flyer
5. Diseñar el modo catálogo revista
6. Conectar el enriquecimiento desde el vault de forma visible y útil
