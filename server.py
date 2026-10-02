import http.server
import json
import os
import sys
from datetime import datetime

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))







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

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Log guardado localmente"}).encode('utf-8'))
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
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
