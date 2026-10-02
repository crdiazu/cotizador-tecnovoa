---
fecha: 2026-08-27
tipo: "propuesta"
titulo: "Propuesta de mini-CRM para TECNOVOA (cotizaciones + clientes + métricas)"
estado: "CONFIRMADO TECNOVOA"
---

# Propuesta de mini-CRM — TECNOVOA

Solución ligera y desacoplada para registrar clientes y monitorear el ciclo de vida de las cotizaciones comerciales de **TECNOVOA**.

## Decisiones Principales

1. **Clientes** → Pestaña `CLIENTES` en la planilla de Google Sheets.
2. **Persistencia** → Google Sheets como base compartida y almacenamiento local JSON/Markdown para desarrollo y respaldo rápido.
3. **Alcance** → Cotizaciones emitidas + Clientes + Estados comerciales + Dashboard analítico.
4. **Exclusividad** → Catálogo e identidad 100% TECNOVOA.
5. **Repositorio** → Gestión de versiones centralizada en **GitHub**.

## Estructura de Pestañas en Google Sheets

- **`CATALOGO`** (Hoja principal de productos):
  `PN, Producto, Categoria, Stock, Precio, Imagen, FechaActualizacion`.
- **`CLIENTES`**:
  `ID, Nombre / Razón Social, Contacto, Email, Teléfono, Empresa / RUT, Dirección, Ciudad, País, Origen, Estado, Notas, Fecha Creación`.
- **`COTIZACIONES`**:
  `Folio, Fecha, Cliente (ID/Nombre), Items (Part Numbers / Desc), Total CLP, Total USD, Estado, Vendedor, Notas, Link PDF, Fecha Cierre`.

## Arquitectura

```
catalogo/ (web, lee CATALOGO vía CSV)
   │  cotización (genera PDF + folio)
   ▼
[Generación PDF]
   │
   ├──► Descarga inmediata en cliente (jsPDF)
   └──► Registro local en cotizaciones_log.json / .md (cuando server.py está activo)
```

## Módulos del mini-CRM

1. **Carga de Clientes:** Directorio comercial de empresas y contactos asociados.
2. **Registro de Cotización:** Captura automática de ítems, márgenes, tipo de cambio y totales.
3. **Estados Comerciales:** Emitida → En Negociación → Aprobada / Rechazada.
4. **Dashboard:** Vista ejecutiva de métricas clave (totales cotizados, ticket promedio, margen ponderado).
