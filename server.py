import http.server
import json
import os
import sys
from datetime import datetime

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
VAULT_ROOT = os.path.abspath(os.path.join(DIRECTORY, ".."))
DIARIO_DIR = os.path.join(VAULT_ROOT, "04_Diario_y_Agenda", "00_DIARIO")
COM_DIR = os.path.join(VAULT_ROOT, "_Comunicaciones")
INDEX_PATH = os.path.join(COM_DIR, "_Comunicaciones_INDEX.md")
HISTORY_PATH = os.path.join(VAULT_ROOT, "tecnovoa_quotation_history.md")





def parse_log_date(date_str):
    """Parsea fecha tipo '11-06-2026 4:32:31 a. m.' y devuelve (iso_date, weekday_es)"""
    try:
        raw = date_str.strip().split(" ")[0]
        day, month, year = raw.split("-")
        dt = datetime(int(year), int(month), int(day))
        weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        return dt.strftime("%Y-%m-%d"), weekdays[dt.weekday()]
    except Exception:
        today = datetime.now()
        weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        return today.strftime("%Y-%m-%d"), weekdays[today.weekday()]


def write_comunicacion_note(log_entry, iso_date):
    """Crea nota en _Comunicaciones/cotizacion_COT-XXXX.md con frontmatter completo"""
    doc_no = log_entry.get("document_no", "N/A")
    client_name = log_entry.get("client_name", "Desconocido")
    client_contact = log_entry.get("client_contact", "")
    exchange_rate = log_entry.get("exchange_rate", 940)
    total_net = log_entry.get("total_net_usd", "0")
    total_gross = log_entry.get("total_gross_usd", "0")
    avg_margin = log_entry.get("average_margin", "0")
    total_profit = log_entry.get("total_profit_usd", "0")
    estado = log_entry.get("estado", "emitida")
    date_str = log_entry.get("date", "")

    items_lines = [
        "| # | Cant | U/M | P/N | Marca | Descripción | Costo USD | Margen % | PVP USD | Total USD | Obs | Disponibilidad | Comentarios |",
        "|---|------|-----|-----|-------|-------------|-----------|----------|---------|-----------|-----|---------------|-------------|"
    ]
    for idx, item in enumerate(log_entry.get("items", [])):
        items_lines.append(
            f"| {idx+1} | {item.get('qty', '')} | {item.get('um', 'UND')} | "
            f"{item.get('pn', '')} | {item.get('brand', '')} | {item.get('name', '')} | "
            f"{item.get('cost', '')} | {item.get('margin', '')}% | {item.get('price', '')} | "
            f"{item.get('subtotal', '')} | {item.get('obs', '')} | {item.get('dispo', '')} | "
            f"{item.get('comments', '')} |"
        )
    items_table = "\n".join(items_lines)

    com_note = f"""---
fecha: "{iso_date}"
tipo: cotizacion
cliente: "{client_name}"
contacto: "{client_contact}"
documento: "{doc_no}"
exchange_rate: {exchange_rate}
monto_neto_usd: {total_net}
monto_bruto_usd: {total_gross}
margen_promedio: {avg_margin}
ganancia_usd: {total_profit}
estado: "{estado}"
tags: [cotizacion]
---

# Cotización {doc_no} — {client_name}

**Cliente:** {client_name}  
**Contacto:** {client_contact}  
**Documento:** {doc_no}  
**Fecha:** {date_str}  
**Tipo de Cambio:** {exchange_rate} CLP/USD  

## Resumen

| Métrica | Valor |
|---------|-------|
| Total Neto | USD$ {total_net} |
| Total Bruto | USD$ {total_gross} |
| Margen Promedio | {avg_margin}% |
| Ganancia Estimada | USD$ {total_profit} |

## Ítems Cotizados

{items_table}

---

*Generado desde Cotizador TECNOVOA*
"""
    filename = f"cotizacion_{doc_no}.md"
    filepath = os.path.join(COM_DIR, filename)
    os.makedirs(COM_DIR, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(com_note.lstrip("\n"))
    return filename


def append_to_daily_note(iso_date, weekday, filename, doc_no, client_name, total_net, avg_margin, estado="emitida"):
    """Agrega entrada de cotización en la nota diaria del día correspondiente"""
    daily_path = os.path.join(DIARIO_DIR, f"{iso_date}.md")
    daily_entry = f"- 📄 [[_Comunicaciones/{filename}|{doc_no}]] — {client_name} — USD$ {total_net} — Margen {avg_margin}% — {estado}\n"
    cotizacion_header = "### Cotizaciones\n"
    notas_header = "## 📝 Notas y Registros\n"

    if not os.path.exists(daily_path):
        os.makedirs(DIARIO_DIR, exist_ok=True)
        content = f"""---
fecha: "[[{iso_date}]]"
fecha_creacion: "[[{iso_date}]]"
fecha_modificacion: "[[{iso_date}]]"
tipo: "diario"
tags: [cotizacion]
---

# 📅 {weekday.capitalize()}, [[{iso_date}]]

{notas_header}
{cotizacion_header}{daily_entry}
"""
        with open(daily_path, "w", encoding="utf-8") as f:
            f.write(content.lstrip("\n"))
        return

    with open(daily_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Buscar sección ## 📝 Notas y Registros
    notas_idx = None
    for i, line in enumerate(lines):
        if line.startswith("## ") and "Notas" in line:
            notas_idx = i
            break

    # Buscar ### Cotizaciones dentro de Notas
    if notas_idx is not None:
        cot_idx = None
        next_section_idx = len(lines)
        for i in range(notas_idx + 1, len(lines)):
            if lines[i].startswith("### Cotizaciones"):
                cot_idx = i
            if lines[i].startswith("## ") and i > (cot_idx if cot_idx else notas_idx):
                next_section_idx = i
                break

        if cot_idx is not None:
            # Insertar después del último ítem de la lista dentro de ### Cotizaciones
            insert_pos = next_section_idx
            for i in range(cot_idx + 1, next_section_idx):
                line = lines[i].strip()
                if line.startswith("- ") or line.startswith("* "):
                    insert_pos = i + 1
                elif line == "":
                    if insert_pos == next_section_idx:
                        insert_pos = i
            lines.insert(insert_pos, daily_entry)
        else:
            # Insertar ### Cotizaciones dentro de ## Notas
            lines.insert(next_section_idx, f"\n{cotizacion_header}{daily_entry}")
    else:
        # No existe ## Notas — agregar al final
        lines.append(f"\n{notas_header}\n{cotizacion_header}{daily_entry}\n")

    with open(daily_path, "w", encoding="utf-8") as f:
        f.writelines(lines)


def update_index(filename, doc_no, iso_date, client_name, total_net):
    """Agrega fila a la tabla de cotizaciones en _Comunicaciones_INDEX.md"""
    os.makedirs(COM_DIR, exist_ok=True)
    row = f"| [[_Comunicaciones/{filename}|{doc_no}]] | {iso_date} | {client_name} | USD$ {total_net} |\n"

    if not os.path.exists(INDEX_PATH):
        content = f"""---
tipo: indice
tags: [indice, comunicaciones]
---

# Comunicaciones

Registro de conversaciones extraidas de chats WhatsApp.

| Persona | Periodo | Mensajes | Chat Original |
|---------|---------|----------|---------------|

## Cotizaciones

| Documento | Fecha | Cliente | Monto |
|-----------|-------|---------|-------|
{row}"""
        with open(INDEX_PATH, "w", encoding="utf-8") as f:
            f.write(content.lstrip("\n"))
        return

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    cot_section = "## Cotizaciones\n"
    if cot_section not in content:
        content += f"\n{cot_section}\n| Documento | Fecha | Cliente | Monto |\n|-----------|-------|---------|-------|\n{row}"
    else:
        # Insertar después del separador de la tabla o al final de la sección
        cot_idx = content.index(cot_section)
        rest = content[cot_idx + len(cot_section):]
        table_sep = "|-----------|-------|---------|-------|\n"
        if table_sep in rest:
            sep_end = rest.index(table_sep) + len(table_sep)
            insert_at = cot_idx + len(cot_section) + sep_end
            content = content[:insert_at] + row + content[insert_at:]
        else:
            table_header = "| Documento | Fecha | Cliente | Monto |\n"
            if table_header not in rest:
                content = content[:cot_idx + len(cot_section)] + table_header + table_sep + row + content[cot_idx + len(cot_section):]
            else:
                content += row

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(content)


def update_quotation_history():
    """Regenera tecnovoa_quotation_history.md desde cotizaciones_log.json"""
    log_file = os.path.join(DIRECTORY, "cotizaciones_log.json")
    if not os.path.exists(log_file):
        return

    with open(log_file, "r", encoding="utf-8") as f:
        logs = json.load(f)

    today = datetime.now().strftime("%Y-%m-%d")
    lines = [
        "---",
        "tipo: dashboard",
        "tags: [dashboard, cotizaciones, historial, quotation_history]",
        f"fecha_actualizacion: {today}",
        "---",
        "",
        "# Historial de Cotizaciones TECNOVOA",
        "",
    ]

    lines += [
        "## Dashboard",
        "",
        "| # | Documento | Fecha | Cliente | Contacto | Total Neto (USD) | Margen | Ganancia (USD) | Estado |",
        "|---|---|---|---|---|---|---|---|---|",
    ]

    logs_sorted = sorted(logs, key=lambda x: x.get("date", ""), reverse=True)
    for idx, entry in enumerate(logs_sorted, 1):
        doc_no = entry.get("document_no", "N/A")
        raw_date = entry.get("date", "")
        date_short = raw_date[:10] if len(raw_date) >= 10 else raw_date
        client = entry.get("client_name", "?")
        contact = entry.get("client_contact", "") or "—"
        net = entry.get("total_net_usd", "0")
        margin = entry.get("average_margin", "0")
        profit = entry.get("total_profit_usd", "0")
        estado = entry.get("estado", "emitida")
        try:
            net_f = f"{float(net):,.2f}"
            profit_f = f"{float(profit):,.2f}"
        except Exception:
            net_f = net
            profit_f = profit
        lines.append(
            f"| {idx} | [[_Comunicaciones/cotizacion_{doc_no}|{doc_no}]] | {date_short} | {client} | {contact} | {net_f} | {margin}% | {profit_f} | {estado} |"
        )

    lines += ["", "## Detalle por Cotización", ""]

    for entry in reversed(logs_sorted):
        doc_no = entry.get("document_no", "N/A")
        client = entry.get("client_name", "?")
        raw_date = entry.get("date", "")
        contact = entry.get("client_contact", "") or "—"
        tc = entry.get("exchange_rate", "?")
        net = entry.get("total_net_usd", "0")
        gross = entry.get("total_gross_usd", "0")
        margin = entry.get("average_margin", "0")
        profit = entry.get("total_profit_usd", "0")

        estado = entry.get("estado", "emitida")
        lines += [
            f"### {doc_no} — {client}",
            f"**Fecha:** {raw_date}",
            f"**Estado:** {estado}",
            f"**Contacto:** {contact}",
            f"**T.C.:** {tc} CLP/USD",
            f"**Total Neto:** USD$ {net}",
            f"**Total Bruto:** USD$ {gross}",
            f"**Margen Promedio:** {margin}%",
            f"**Ganancia Estimada:** USD$ {profit}",
            "",
            "| Cant | P/N | Descripción | Costo USD | Margen | PVP USD | Total |",
            "|------|-----|-------------|-----------|--------|---------|-------|",
        ]
        for item in entry.get("items", []):
            qty = item.get("qty", "")
            pn = item.get("pn", "")
            name = item.get("name", "")
            cost = item.get("cost", "")
            imargin = item.get("margin", "")
            price = item.get("price", "")
            subtotal = item.get("subtotal", "")
            lines.append(f"| {qty} | {pn} | {name} | {cost} | {imargin}% | {price} | {subtotal} |")

        lines += ["", "---", ""]

    lines += [f"*Generado desde cotizador — Última actualización: {today}*", ""]

    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(DIRECTORY, "catalogo"), **kwargs)

    def do_GET(self):
        if self.path == '/api/product-overrides':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            overrides = {}


            # 2. Mezclar con archivo local JSON
            local_path = os.path.join(DIRECTORY, "catalogo", "data", "product_overrides.json")
            if os.path.exists(local_path):
                try:
                    with open(local_path, 'r', encoding='utf-8') as f:
                        local_overrides = json.load(f)
                        for k, v in local_overrides.items():
                            if k not in overrides:
                                overrides[k] = v
                except Exception as e:
                    print(f"Error al leer overrides locales: {e}")
                    
            self.wfile.write(json.dumps(overrides).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/log':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                log_entry = json.loads(post_data.decode('utf-8'))
                log_entry["estado"] = log_entry.get("estado", "emitida")

                # 1. Guardar en cotizaciones_log.json
                log_file_path = os.path.join(DIRECTORY, "cotizaciones_log.json")
                logs = []
                if os.path.exists(log_file_path):
                    try:
                        with open(log_file_path, 'r', encoding='utf-8') as f:
                            logs = json.load(f)
                    except Exception:
                        pass
                logs.append(log_entry)
                with open(log_file_path, 'w', encoding='utf-8') as f:
                    json.dump(logs, f, indent=4, ensure_ascii=False)

                # 2. Guardar en cotizaciones_log.md
                md_file_path = os.path.join(DIRECTORY, "cotizaciones_log.md")
                first_time = not os.path.exists(md_file_path)
                with open(md_file_path, 'a', encoding='utf-8') as f:
                    if first_time:
                        f.write("# Historial de Cotizaciones Generadas\n\n")
                    f.write(f"## Cotización: {log_entry.get('document_no', 'N/A')}\n")
                    f.write(f"- **Fecha:** {log_entry.get('date', 'N/A')}\n")
                    f.write(f"- **Cliente:** {log_entry.get('client_name', 'N/A')}\n")
                    f.write(f"- **Contacto:** {log_entry.get('client_contact', 'N/A')}\n")
                    f.write(f"- **Tipo de Cambio (1 USD -> CLP):** {log_entry.get('exchange_rate', 'N/A')} CLP\n")
                    f.write(f"- **Total Neto (USD):** USD$ {log_entry.get('total_net_usd', '0.00')}\n")
                    f.write(f"- **Total Bruto (USD):** USD$ {log_entry.get('total_gross_usd', '0.00')}\n")
                    f.write(f"- **Margen Promedio:** {log_entry.get('average_margin', '0.00')}%\n")
                    f.write(f"- **Ganancia Total Estimada (USD):** USD$ {log_entry.get('total_profit_usd', '0.00')}\n")
                    f.write("\n### Ítems Cotizados:\n")
                    f.write("| # | Cant | U/M | P/N | Marca | Descripción | Costo Unit. (USD) | Margen % | PVP Unit. (USD) | Total Venta (USD) | Obs | Disponibilidad | Comentarios |\n")
                    f.write("|---|---|---|---|---|---|---|---|---|---|---|---|---|\n")
                    for idx, item in enumerate(log_entry.get('items', [])):
                        f.write(f"| {idx+1} | {item.get('qty')} | {item.get('um', 'UND')} | {item.get('pn')} | {item.get('brand')} | {item.get('name')} | {item.get('cost')} | {item.get('margin')}% | {item.get('price')} | {item.get('subtotal')} | {item.get('obs')} | {item.get('dispo')} | {item.get('comments')} |\n")
                    f.write("\n---\n\n")

                # 3. Integración con CRM Obsidian
                iso_date, weekday = parse_log_date(log_entry.get("date", ""))
                doc_no = log_entry.get("document_no", "N/A")
                client_name = log_entry.get("client_name", "Desconocido")
                total_net = log_entry.get("total_net_usd", "0")
                avg_margin = log_entry.get("average_margin", "0")

                estado = log_entry.get("estado", "emitida")
                com_filename = write_comunicacion_note(log_entry, iso_date)
                append_to_daily_note(iso_date, weekday, com_filename, doc_no, client_name, total_net, avg_margin, estado)
                update_index(com_filename, doc_no, iso_date, client_name, total_net)
                update_quotation_history()

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Log guardado + CRM actualizado"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/update-product':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                override_data = json.loads(post_data.decode('utf-8'))
                pn = override_data.get("pn")
                if not pn:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"PN (Part Number) es requerido")
                    return



                # 2. Guardar en JSON local
                local_path = os.path.join(DIRECTORY, "catalogo", "data", "product_overrides.json")
                local_overrides = {}
                if os.path.exists(local_path):
                    try:
                        with open(local_path, 'r', encoding='utf-8') as f:
                            local_overrides = json.load(f)
                    except Exception:
                        pass
                
                local_overrides[pn] = override_data
                
                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                with open(local_path, 'w', encoding='utf-8') as f:
                    json.dump(local_overrides, f, indent=4, ensure_ascii=False)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Override guardado con éxito"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()



if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, CustomHandler)
    print(f"Servidor ejecutándose en http://localhost:{PORT}")
    print(f"CRM Obsidian: {VAULT_ROOT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
