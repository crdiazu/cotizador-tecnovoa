# 📦 Instructivo de Uso — Catálogo B2B TECNOVOA

> **Versión:** 1.0 · **Fecha:** Junio 2026  
> **Contacto comercial:** Cristian Díaz — Contacto Comercial  cristian@tecnovoa.cl

---

## ¿Qué es este catálogo?

Es una plataforma web **privada B2B** que muestra el inventario de productos IT disponibles a través de **TECNOVOA SPA**. Permite explorar el catálogo, armar una solicitud de productos y generar un **PDF de cotización formal** listo para enviar o adjuntar a una Orden de Compra.

> ⚠️ **Importante:** Los precios se muestran en **CLP$ + IVA** y están sujetos a confirmación según disponibilidad y tipo de cambio del día.

---

## 🖥️ Estructura de la pantalla

```
┌─────────────────┬────────────────────────────┬──────────────────┐
│  PANEL IZQUIERDO│      GRILLA DE PRODUCTOS   │  PANEL DERECHO   │
│  (Navegación)   │      (Área principal)       │  (Mi Pedido)     │
│                 │                             │                  │
│ • Búsqueda      │  Tarjetas de productos      │ Resumen rápido   │
│ • Categorías    │  con imagen, PN y precio    │ del pedido actual│
│ • Estado datos  │                             │ + botón Ver PDF  │
└─────────────────┴────────────────────────────┴──────────────────┘
```

---

## 🔍 Paso 1 — Buscar productos

Tienes **dos formas** de encontrar lo que necesitas:

### Por categoría (panel izquierdo)
Haz clic en cualquier categoría de la lista:
- `Todos los Productos` — muestra el catálogo completo
- `MONITORES`, `NOTEBOOKS`, `SERVIDORES`, etc. — filtra por tipo

### Por búsqueda de texto
Escribe en el campo **"Buscar por modelo o marca..."**:
- Busca por **nombre de producto** (ej: `Lenovo T24`)
- Busca por **Part Number** (ej: `64A4MARXCL`)

> 💡 La búsqueda y el filtro de categoría funcionan **al mismo tiempo**.

---

## 🛒 Paso 2 — Agregar productos al pedido

1. Encuentra el producto que necesitas en la grilla
2. Verifica el precio en formato **`CLP$ 150.000 + iva`**
3. Haz clic en el botón **"Agregar al Pedido"** de la tarjeta
4. El contador en el **Panel derecho** (Mi Pedido) se actualizará automáticamente

> Puedes agregar el mismo producto varias veces o usar los controles **`+` / `-`** para ajustar cantidades.

---

## 📋 Paso 3 — Revisar el pedido

En el **Panel derecho** verás un resumen rápido con:
- Nombre del producto
- Precio unitario (`CLP$ ... + iva`)
- Controles de cantidad (`+` / `-`)
- **Total acumulado** del pedido

Para ver el detalle completo, haz clic en:

```
[ Ver Pedido Completo ]
```

Esto abre el **modal de resumen** donde puedes:
- Ver todos los ítems con PN y precio
- Ajustar cantidades o eliminar productos
- Revisar el **Total Estimado**

---

## 📄 Paso 4 — Generar el PDF de Cotización

Desde el modal de pedido, haz clic en:

```
[ Generar PDF de Cotización ]
```

El PDF se descarga automáticamente con:

| Campo | Detalle |
|---|---|
| Encabezado | TECNOVOA SPA |
| Fecha | Fecha actual automática |
| Tabla | PN · Descripción · Cant. · P. Unit. · Subtotal |
| Precios | En formato `CLP$ ... + iva` |
| Total | Total estimado del pedido |
| Alcances legales | Nota sobre stock, tipo de cambio y validez |

> 📌 El archivo se guarda con el nombre:  
> `Cotizacion_TECNOVOA_[timestamp].pdf`

---

## 🔄 Estado de actualización de datos

En la parte inferior del **panel izquierdo** verás el estado de los datos:

| Indicador | Significado |
|---|---|
| ✅ `✓ Datos de hoy` | El inventario fue actualizado hoy |
| ⚠️ `Desactualizado` | Los datos son de una fecha anterior — consultar con el ejecutivo |

Los datos se sincronizan automáticamente desde **Google Sheets** cada vez que se carga la página.

---

## ❓ Preguntas frecuentes

**¿Los precios incluyen IVA?**  
No. Todos los precios son **netos (sin IVA)**. El `+ iva` es un recordatorio de que el precio final tendrá el 19% adicional.

**¿El stock es en tiempo real?**  
El stock se actualiza manualmente en el sistema de origen. Verifica el indicador de fecha antes de hacer una OC.

**¿Puedo enviar el PDF directamente como OC?**  
No. El PDF es una **Solicitud de Cotización formal**, no una factura ni un compromiso de compra. Debe ser confirmada por TECNOVOA antes de emitir la OC.

**¿Qué hago si un producto no aparece?**  
Contáctate con la ejecutiva comercial. El catálogo puede no incluir todo el portafolio disponible bajo pedido.

---

## 📞 Contacto

| | |
|---|---|
| **Contacto** | Cristian Díaz — Contacto Comercial |
| **Email** | cristian@tecnovoa.cl |
| **Teléfono** | +56 9 4943 8288 |
| **Empresa** | TECNOVOA SPA |

---

*Catálogo B2B Privado — Uso interno de clientes autorizados TECNOVOA.*
