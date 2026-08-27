const fs = require('fs');

function parseCurrencyString(str) {
    if (!str) return 0;
    let clean = str.replace(/[^\d.,-]/g, '').trim();
    if (!clean) return 0;
    if (clean.includes('.') && clean.includes(',')) {
        clean = clean.replace(/\./g, '').replace(',', '.');
    } else if (clean.includes(',')) {
        clean = clean.replace(',', '.');
    }
    return parseFloat(clean) || 0;
}

function convertToUSD(val, rate) {
    if (val > 1000) {
        return val / rate;
    }
    return val;
}

const csvText = `Part Number,marca,Producto,Categoria,Sub Categoria,Stock,Precio,Imagen,Update ,Moneda,Costo Calculado,Costo,desc corta,desc Larga,Margen,distri,seleccion,Columna 1,Columna 2
Genérico,Logitech,Privacy screen protector for iPhone 16,Accesorios Móvil,,50,"$17,86",https://http2.mlstatic.com/D_NQ_NP_2X_755331-MLC78804738492_092024-F.webp,26/5/2026,USD,"13,39130435","13,39130435",,,"25,00%",,,,
`;

const lines = csvText.trim().split('\n');
const result = [];
let sheetExchangeRate = 940;

let headerIndex = -1;
for (let i = 0; i < lines.length; i++) {
    const rowParts = lines[i].split(',');
    if (rowParts.length > 1 && (rowParts[0].trim().toUpperCase() === 'PN' || rowParts[0].trim().toUpperCase() === 'PART NUMBER' || rowParts[1].trim().toUpperCase() === 'PRODUCTO' || rowParts[2].trim().toUpperCase() === 'PRODUCTO')) {
        headerIndex = i;
        break;
    }
}
if (headerIndex === -1) {
    headerIndex = 0; // Fallback
}

for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
            if (inQuotes && line[c + 1] === '"') {
                current += '"';
                c++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            parts.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    parts.push(current);

    if (parts.length >= 5 && parts[0].trim() !== '') {
        let productName = parts[2] ? parts[2].trim() : '';
        if (productName.startsWith('"') && productName.endsWith('"')) {
            productName = productName.substring(1, productName.length - 1).replace(/""/g, '"');
        }
        
        const rawPrice = parts.length > 6 ? parts[6].trim() : '';
        const rawCost = parts.length > 11 ? parts[11].trim() : '';
        const rawMargin = parts.length > 14 ? parts[14].trim() : '';

        const parsedPrice = parseCurrencyString(rawPrice);
        const priceVal = convertToUSD(parsedPrice, sheetExchangeRate);

        let costVal = 0;
        let marginVal = 20;

        if (rawCost !== '') {
            costVal = convertToUSD(parseCurrencyString(rawCost), sheetExchangeRate);
            if (rawMargin !== '') {
                marginVal = parseCurrencyString(rawMargin);
            } else if (priceVal > 0) {
                marginVal = 100 * (priceVal - costVal) / priceVal;
                marginVal = Math.round(marginVal * 10) / 10;
            }
        } else if (rawMargin !== '') {
            marginVal = parseCurrencyString(rawMargin);
            costVal = priceVal * (1 - marginVal / 100);
        } else {
            marginVal = 20;
            costVal = priceVal * 0.8;
        }

        const stockVal = parts.length > 5 ? (parseInt(parts[5].replace(/[^\d]/g, '')) || 0) : 0;
        const brandVal = parts.length > 1 ? parts[1].trim() : '';
        
        result.push({
            id: i,
            pn: parts[0].trim(),
            name: productName,
            category: parts[3] ? parts[3].trim() : '',
            stock: stockVal,
            price: priceVal,
            rawPrice,
            image: parts[7] ? parts[7].trim() : '',
            date: parts[8] ? parts[8].trim() : '',
            cost: costVal,
            margin: marginVal,
            brand: brandVal
        });
    }
}
console.log(JSON.stringify(result, null, 2));
