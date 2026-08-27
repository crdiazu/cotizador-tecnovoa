# Brechas, Pendientes y Conexiones Faltantes

Para que la herramienta y el proceso cumplan al 100% con los requerimientos de Vestas, el equipo interno de Tecnovoa debe resolver los siguientes puntos:

## 1. Datos Faltantes (Urgente)
- [ ] **Completar Part Numbers (PN):** Todos los productos en el catálogo actualmente dicen `TBD` (To Be Defined). Jaime/Ursula deben proveer los SKUs exactos de los mayoristas que correspondan a las descripciones genéricas.
- [ ] **Definir "Lead Times" (Tiempos de Entrega):** Vestas requiere el tiempo de entrega en días. El prototipo web aún no muestra este dato en la tarjeta del producto. **(Brecha Técnica)**
- [ ] **Cargar Archivo CIF Original:** Confirmar que los campos que pide el `CIF Template VESTAS - NEW` coinciden con los que podemos exportar del catálogo actual.

## 2. Definiciones de Negocio (Con Vestas)
- [ ] **Vigencia del Catálogo:** Ursula debe confirmar con Francesco si el catálogo se mantendrá con revisión anual (hasta fin de diciembre) o si será trimestral.
- [ ] **Procedimiento de ABM (Apple Business Manager):** Validar cómo se comunicará a Vestas que el enrolamiento de los equipos Apple ha sido exitoso tras cada compra.

## 3. Conexiones Técnicas (Prototipo Web)
- [ ] **Integrar Lead Time en la Interfaz:** Modificar la aplicación para mostrar "Lead Time: X días" debajo de cada precio.
- [ ] **Migración a Producción:** Definir dónde vivirá el catálogo real. Actualmente es un prototipo local (`index.html`). ¿Se subirá a un dominio de tecnovoa (ej. `vestas.tecnovoa.cl`)?
- [ ] **Automatización de Pedidos:** Actualmente la web genera un PDF que el usuario debe descargar. Idealmente, el botón "Enviar Pedido" debería gatillar un correo automático a `ventas@tecnovoa.cl` (o Ursula) adjuntando el PDF.
