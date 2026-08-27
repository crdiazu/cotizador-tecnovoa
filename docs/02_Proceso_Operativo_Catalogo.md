# Proceso Operativo del Catálogo VESTAS

Este documento define el ciclo de vida de la información de productos entre Tecnovoa y Vestas.

## Fase 1: Recolección y Actualización de Datos (Tecnovoa Interno)
1. **Validación de Part Numbers (PN):** Ventas (Jaime/Ursula) obtienen el listado exacto de PNs autorizados por Vestas y los cruzan con el stock de mayoristas.
2. **Cálculo de Lead Time:** Se define el plazo de entrega **estricto en días** para cada PN, considerando los tiempos del mayorista + logística interna de Tecnovoa hacia Vestas (Incoterm DAP).
3. **Fijación de Precios:** Se calculan los precios finales basados en el margen acordado. Estos deben respetar el periodo de vigencia (anual o trimestral) que determine Francesco Settembre.

## Fase 2: Actualización de la Plataforma
1. **Actualización del CSV:** El archivo maestro (`productos.csv`) se actualiza con los nuevos PNs, Stocks, Precios y Tiempos de Entrega (Lead Times).
2. **Despliegue / Sincronización:** Si se utiliza Google Sheets, los datos se reflejan automáticamente en el prototipo web. Si es local, se reemplaza el archivo en el servidor.
3. **Validación Visual:** Cristian / Equipo revisan que la interfaz muestre correctamente los PNs y la información coincida con la plantilla CIF original enviada por Vestas.

## Fase 3: Interacción del Cliente (Vestas)
1. **Acceso al Catálogo:** Los usuarios de Vestas acceden a la URL del catálogo de Tecnovoa.
2. **Selección de Productos:** Agregan productos al "pedido".
3. **Generación de Cotización (PDF):** El sistema emite un PDF formal (`Pedido_TECNOVOA_...pdf`) con la solicitud.
4. **Envío y Gestión en SAP:** Vestas (Francesco u otro solicitante) ingresa la cotización al sistema SAP de Vestas para la generación de la Orden de Compra (PO) asociada al Vendor ID 5010432.

## Fase 4: Despacho y Facturación
1. Recepción de la PO de Vestas.
2. Despacho en condiciones DAP.
3. Facturación con términos de pago: 60 días + EOM + 5 días.
