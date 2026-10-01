document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const categoryList = document.getElementById('categoryList');
    const searchInput = document.getElementById('searchInput');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const productCount = document.getElementById('productCount');
    
    // Google Drive Config - Cache buster added to ensure fresh data
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/export?format=csv&cache=' + new Date().getTime();

    // UI Elements
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const sendOrderBtn = document.getElementById('sendOrderBtn');
    
    // Right Sidebar Elements
    const sideCartItems = document.getElementById('sideCartItems');
    const sideCartTotal = document.getElementById('sideCartTotal');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const sideViewFullBtn = document.getElementById('sideViewFullBtn');

    let allProducts = [];
    let currentCategory = 'Todos';
    let currentBrand = 'Todos';
    let currentCurrency = 'USD'; // 'USD' | 'CLP'
    let cart = [];
    let sheetExchangeRate = 940;
    let currentViewMode = 'calc';
    let activeRowId = null;
    let isListView = false;
    
    // Preload Flyer Background and Logo
    const flyerBgImg = new Image();
    flyerBgImg.src = 'img/flyer_bg.png';
    const flyerLogoImg = new Image();
    flyerLogoImg.src = 'img/tecnovoa_logo.png';

    // List of all brand logos in the folder
    const brandLogos = [
        "1452871010130_access_pro.jpeg", "2017-msi-dragon_spirit_logo_h_4c_b.jpeg",
        "2500px-JBL_logo.svg.jpeg", "9a3894dce7785128499972189ba99569.webp",
        "AMD-Small.jpeg", "APC.jpeg", "ASUS-removebg-preview.png", "ASUS.jpeg",
        "Allot-logo.jpeg", "Astro-logo.jpeg", "Avaya.jpeg", "Belkin_Wordmark_3.0.jpeg",
        "Brand.jpeg", "Braven-logo.jpeg", "Brother.jpeg", "Cisco20Logo.jpeg",
        "CompanyLogo_Small.jpeg", "Computer20CasesNZXT-logo.jpeg", "Corsair.jpeg",
        "Custom-logo.jpeg", "Cyrus20Technology20US20Inc.-logo.jpeg", "DLink.jpeg",
        "Dell_Logo_Blue_4c-Small.jpeg", "EC-line.jpeg", "Extreme20Networks-logo.jpeg",
        "EyeSight20Mobile20Technologies20Ltd.-logo.jpeg", "FireEye20Inc.-logo.jpeg",
        "FireLite_Logo.jpeg", "ForzaLogo.jpeg", "Gaming20Video20Captureelgato-logo.jpeg",
        "Global-Technology-Systems-logo.jpeg", "HARMAN_KARDON_4.jpeg", "HPE20Aruba.jpeg",
        "HiLook-2.jpeg", "Hikvision-Small.jpeg", "Homedics-logo.jpeg", "Honor2021.jpeg",
        "HpE.jpeg", "Hurricane-Web.jpeg", "IFROGZ-Logo-Small.jpeg", "KlipXtreme_Logo_Nuevo2.jpeg",
        "Kyocera-Lock-Up-Jpeg.jpeg", "LCI_Logo_Horz_Blk.jpeg", "LG20logo.jpeg",
        "Legrand-Red-JPG.jpeg", "Lite-On20Logo.jpeg", "Logo-Furukawa-Small.jpeg",
        "LogoSolidgm-01-small.jpeg", "Logo_Gear4.jpeg", "Logo_Jabra.jpeg",
        "Logo_Logitech.jpeg", "Logo_Samsung.jpeg", "Logo_Xbox.jpeg", "Logo_Xtech.jpeg",
        "MFEaton.jpeg", "MGC_logo_color.jpeg", "Milestone-Logo.jpeg",
        "Modern_Image_CLearPlex_Logo.jpeg", "NCR-Logo.jpeg", "Newland20Latin20America20LLC-logo.jpeg",
        "Nexxt_Connectivity_small.jpeg", "Nexxt_Infrastructure_small.jpeg",
        "Nexxt_Security_small.jpeg", "Nokia.jpeg", "OnePlus-Logo.jpeg",
        "PCtronix-Logo.jpeg", "PNY20Logo.jpeg", "Panduit-Logo.jpeg", "Playstation-Logo.jpeg",
        "Poly-Logo.jpeg", "Primus_logo.jpeg", "QNAP_logo.jpeg", "Razer.jpeg",
        "Rexel2.jpeg", "Riverbed-Logo.jpeg", "Ruckus-Logo.jpeg", "Samsung_techwin_logo.jpeg",
        "Sandisk20Logo.jpeg", "Sennheiser.jpeg", "Sewoo-Logo.jpeg", "SonicWall-Logo.jpeg",
        "StarTech-Logo.jpeg", "TSC-Logo.jpeg", "Thule_logo_Small.jpeg", "Toshiba-01.jpeg",
        "Ubiquiti_U-Logo_New-7-large.jpeg", "Vivo-Logo.jpeg", "WD.jpeg",
        "Wacom_logo-Small.jpeg", "Weit-Power-Logo.jpeg", "Xiaomi_logo.jpeg",
        "ZKTeco_logo_0316.jpeg", "Zebra-logo-2015-logotype-1024x768.jpeg",
        "actiontec.jpeg", "akg.jpeg", "aorus-small.jpeg", "apollo.jpeg",
        "asus_rog_logos.jpeg", "axis_logo.jpeg", "branding_lenovo-logo_lenovologoposred_high_res.jpeg",
        "dellemc2.jpeg", "dreamline.jpeg", "elo.jpeg", "epson.jpeg", "fitbit_logo.jpeg",
        "genius.jpeg", "gigabyte.jpeg", "google_2015_logo_detail.jpeg", "haier.jpeg",
        "hanwha-logo20LOG.jpeg", "hidlogo.jpeg", "honeywell_logo.jpeg", "hp-logo.jpeg",
        "hw_000353.jpeg", "hyperXmanufacturer.jpeg", "ibm.jpeg", "intelbrand.jpeg",
        "iris20GmbH-logo.jpeg", "iss.jpeg", "kensington-logo_160PX.jpeg", "kingstonSmall.jpeg",
        "kodak.jpeg", "logo-new.jpeg", "logo_valueram_150w.jpeg", "meraki-logo.jpeg",
        "mobileye-Logo.jpeg", "mophie-logo.jpeg", "motorola.jpeg", "mslogo1.jpeg",
        "orange_cougar_logo.jpeg", "panasonic.jpeg", "rbh.jpeg", "seagate-Small.jpeg",
        "secolarm.jpeg", "sony.jpeg", "tdb.jpeg", "templatemo_logo.jpeg", "tplink.jpeg",
        "unitechlogo.jpeg", "viewsonic.jpeg", "xlogo.jpeg", "ysoft.jpeg", "zagg2.jpeg"
    ];

    function getBrandLogoFilename(brandName) {
        if (!brandName) return null;
        const name = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (name === 'brother') return 'Brother.jpeg';
        if (name === 'lenovo') return 'branding_lenovo-logo_lenovologoposred_high_res.jpeg';
        if (name === 'dell') return 'Dell_Logo_Blue_4c-Small.jpeg';
        if (name === 'hp') return 'hp-logo.jpeg';
        if (name === 'hpe') return 'HpE.jpeg';
        if (name === 'logitech') return 'Logo_Logitech.jpeg';
        if (name === 'samsung') return 'Logo_Samsung.jpeg';
        if (name === 'asus') return 'ASUS.jpeg';
        if (name === 'tplink') return 'tplink.jpeg';
        if (name === 'dlink') return 'DLink.jpeg';
        if (name === 'kingston') return 'kingstonSmall.jpeg';
        if (name === 'wd' || name === 'westerndigital') return 'WD.jpeg';
        if (name === 'seagate') return 'seagate-Small.jpeg';
        if (name === 'intel') return 'intelbrand.jpeg';
        if (name === 'amd') return 'AMD-Small.jpeg';
        if (name === 'ubiquiti' || name === 'ubnt') return 'Ubiquiti_U-Logo_New-7-large.jpeg';
        if (name === 'epson') return 'epson.jpeg';
        
        let bestMatch = null;
        let bestScore = 0;
        for (const filename of brandLogos) {
            const cleanFile = filename.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (cleanFile.includes(name)) {
                const score = name.length / cleanFile.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = filename;
                }
            } else if (name.includes(cleanFile)) {
                const score = cleanFile.length / name.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = filename;
                }
            }
        }
        return bestMatch;
    }

    // Brand Logo Cache for Flyer
    let currentBrandLogoImage = null;
    let currentBrandLogoUrl = '';

    function loadBrandLogoImage(brandName) {
        if (!brandName) {
            currentBrandLogoImage = null;
            currentBrandLogoUrl = '';
            return;
        }
        const filename = getBrandLogoFilename(brandName);
        if (!filename) {
            currentBrandLogoImage = null;
            currentBrandLogoUrl = '';
            return;
        }
        const url = `img/logos_500x500_blancas/${filename}`;
        if (currentBrandLogoUrl === url && currentBrandLogoImage) {
            return;
        }
        currentBrandLogoUrl = url;
        currentBrandLogoImage = new Image();
        currentBrandLogoImage.crossOrigin = "anonymous";
        currentBrandLogoImage.src = url;
        currentBrandLogoImage.onload = () => {
            drawFlyer();
        };
        currentBrandLogoImage.onerror = () => {
            console.warn(`Could not load brand logo: ${url}`);
            currentBrandLogoImage = null;
            drawFlyer();
        };
    }

    // Product Image Cache for Flyer
    let currentProductImage = null;
    let currentProductImageUrl = '';

    function loadProductImage(url) {
        if (!url) {
            currentProductImage = null;
            currentProductImageUrl = '';
            return;
        }
        if (currentProductImageUrl === url && currentProductImage) {
            return; // Already loaded/loading
        }
        currentProductImageUrl = url;
        currentProductImage = new Image();
        currentProductImage.crossOrigin = "anonymous";
        
        // Usar proxy de imágenes de weserv.nl para evitar bloqueo de CORS en el canvas
        if (url.startsWith('http://') || url.startsWith('https://')) {
            currentProductImage.src = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
        } else {
            currentProductImage.src = url;
        }
        
        currentProductImage.onload = () => {
            drawFlyer();
        };
        
        currentProductImage.onerror = () => {
            console.warn(`Could not load product image via CORS proxy, retrying direct: ${url}`);
            currentProductImage = new Image();
            // Cargar sin anonymous para que al menos se muestre si el servidor no tiene cabeceras de CORS
            currentProductImage.src = url;
            currentProductImage.onload = () => {
                drawFlyer();
            };
            currentProductImage.onerror = () => {
                console.error(`Failed to load product image entirely: ${url}`);
                currentProductImage = null;
                drawFlyer();
            };
        };
    }

    // QR Image Cache for Flyer
    let currentQrImage = null;
    let currentQrUrl = '';

    function loadQrImage(webUrl) {
        const url = webUrl || 'https://www.tecnovoa.cl/';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=150x150&color=0f172a&bgcolor=ffffff&qzone=1`;
        if (currentQrUrl === qrUrl && currentQrImage) {
            return;
        }
        currentQrUrl = qrUrl;
        currentQrImage = new Image();
        currentQrImage.crossOrigin = "anonymous";
        currentQrImage.src = qrUrl;
        currentQrImage.onload = () => {
            drawFlyer();
        };
    }



    // --- AUTENTICACIÓN DESHABILITADA ---
    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay) {
        loginOverlay.classList.add('hidden');
        loginOverlay.style.display = 'none';
    }

    function loadCatalog(isInit = true) {
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="loading">Cargando catálogo...</div>`;
        }

        fetch(SHEET_URL)
            .then(response => {
                if (!response.ok) throw new Error('Carga fallida');
                return response.text();
            })
            .then(csvText => {
                allProducts = parseCSV(csvText);
                
                // Fetch overrides and apply them
                return fetchProductOverrides()
                    .then(overrides => {
                        allProducts.forEach(p => {
                            if (overrides[p.pn]) {
                                const ov = overrides[p.pn];
                                if (ov.brand) p.brand = ov.brand;
                                if (ov.category) p.category = ov.category;
                                if (ov.name) p.name = ov.name;
                                if (ov.stock !== undefined) p.stock = parseInt(ov.stock) || 0;
                                if (ov.costUsd !== undefined) {
                                    p.cost = parseFloat(ov.costUsd) || 0;
                                    p.costUsd = parseFloat(ov.costUsd) || 0;
                                    p.costClp = (parseFloat(ov.costUsd) || 0) * sheetExchangeRate;
                                }
                                if (ov.margin !== undefined) p.margin = parseFloat(ov.margin) || 0;
                                if (ov.priceUsd !== undefined) {
                                    p.price = parseFloat(ov.priceUsd) || 0;
                                    p.priceUsd = parseFloat(ov.priceUsd) || 0;
                                    p.priceClp = (parseFloat(ov.priceUsd) || 0) * sheetExchangeRate;
                                }
                                if (ov.image) p.image = ov.image;
                            }
                        });
                        console.log('Overrides de productos aplicados:', overrides);
                    })
                    .catch(err => {
                        console.warn('No se pudieron aplicar overrides de productos:', err);
                    })
                    .finally(() => {
                        if (isInit) {
                            initApp();
                        } else {
                            checkUpdateDate();
                            extractAndRenderCategories();
                            currentBrand = 'Todos';
                            extractAndRenderBrands();
                            if (searchInput) searchInput.value = '';
                            renderProducts(allProducts);
                        }
                    });
            })
            .catch(error => {
                console.error("Error al cargar catálogo:", error);
                if (productsGrid) {
                    productsGrid.innerHTML = `<div class="loading">Error al cargar la base de datos. Verifica tu conexión.</div>`;
                }
            });
    }

    function fetchProductOverrides() {
        return fetch('/api/product-overrides')
            .then(res => res.json())
            .catch(err => {
                console.warn('Could not fetch product overrides:', err);
                return {};
            });
    }

    function saveProductOverride(updatedData) {
        // Guardar de forma estrictamente temporal en memoria para la sesión actual, sin alterar la base de datos o planilla
        return Promise.resolve({ status: 'success', message: 'Actualizado en memoria temporalmente' });
    }

    loadCatalog('general', true);


    function parseCurrencyString(str, isClp = false) {
        if (!str) return 0;
        let clean = str.replace(/[^\d.,-]/g, '').trim();
        if (!clean) return 0;
        
        if (isClp) {
            // CLP uses dot as thousands separator and has no decimals in this catalog
            clean = clean.replace(/\./g, '').replace(/,/g, '');
            return parseFloat(clean) || 0;
        }
        
        if (clean.includes('.') && clean.includes(',')) {
            clean = clean.replace(/\./g, '').replace(',', '.');
        } else if (clean.includes(',')) {
            clean = clean.replace(',', '.');
        }
        return parseFloat(clean) || 0;
    }



    function parseCSV(text) {
        const lines = text.trim().split('\n');
        const result = [];
        
        // Find exchange rate from J1 (column J = index 9) of row 0
        sheetExchangeRate = 940;
        if (lines.length > 0) {
            // Parse first row robustly
            const fl = lines[0];
            const fp = [];
            let fc = '', fq = false;
            for (let c = 0; c < fl.length; c++) {
                if (fl[c] === '"') { fq = !fq; }
                else if (fl[c] === ',' && !fq) { fp.push(fc.trim()); fc = ''; }
                else { fc += fl[c]; }
            }
            fp.push(fc.trim());

            // Try column J (index 9) first — user says rate is stored there
            const rateJ = parseFloat((fp[9] || '').replace(/[^\d.]/g, ''));
            const rateE = parseFloat((fp[4] || '').replace(/[^\d.]/g, ''));
            if (!isNaN(rateJ) && rateJ > 100) {
                sheetExchangeRate = rateJ;
            } else if (!isNaN(rateE) && rateE > 100) {
                sheetExchangeRate = rateE;
            }
        }

        // Find the header row index
        let headerIndex = -1;
        const headerKeywords = ['part number', 'pn', 'part_number', 'producto', 'product', 'name', 'marca', 'brand', 'categoria', 'category', 'stock', 'inventario', 'cant'];
        for (let i = 0; i < lines.length; i++) {
            const rowParts = lines[i].split(',');
            let matchCount = 0;
            for (let part of rowParts) {
                const cleanPart = part.trim().toLowerCase().replace(/"/g, '');
                if (headerKeywords.includes(cleanPart) || cleanPart.includes('precio') || cleanPart.includes('costo') || cleanPart.includes('margen') || cleanPart.includes('filtrar')) {
                    matchCount++;
                }
            }
            if (matchCount >= 3) {
                headerIndex = i;
                break;
            }
        }
        if (headerIndex === -1) {
            headerIndex = 0; // Fallback
        }

        // Parse headers dynamically using the robust CSV line parser
        const headerLine = lines[headerIndex];
        const headers = [];
        let curHeader = '';
        let inQuotesHeader = false;
        for (let c = 0; c < headerLine.length; c++) {
            const char = headerLine[c];
            if (char === '"') {
                inQuotesHeader = !inQuotesHeader;
            } else if (char === ',' && !inQuotesHeader) {
                headers.push(curHeader.trim().toLowerCase());
                curHeader = '';
            } else {
                curHeader += char;
            }
        }
        headers.push(curHeader.trim().toLowerCase());

        const getIndex = (synonyms, fallback, preferLast = false) => {
            for (let name of synonyms) {
                const idx = headers.indexOf(name);
                if (idx !== -1) {
                    if (!preferLast) return idx;
                    // Prefer the LAST occurrence (e.g. 'update' vs 'UPDATE' columns)
                    let last = idx;
                    for (let j = idx + 1; j < headers.length; j++) {
                        if (headers[j] === name) last = j;
                    }
                    return last;
                }
            }
            // Check if any header starts with or contains the synonym (partial match)
            for (let name of synonyms) {
                const idx = headers.findIndex(h => h.includes(name));
                if (idx !== -1) return idx;
            }
            return fallback;
        };

        const pnIdx = getIndex(['part number', 'pn', 'part_number'], 1);
        const brandIdx = getIndex(['marca', 'brand'], 2);
        const nameIdx = getIndex(['producto', 'name', 'product', 'item'], 3);
        const catIdx = getIndex(['categoria', 'categoría', 'category'], 4);
        const stockIdx = getIndex(['stock', 'inventario', 'cant'], 6);
        const priceUsdIdx = getIndex(['precio neto venta usd', 'precio venta usd', 'precio_usd', 'price_usd'], 8);
        const priceClpIdx = getIndex(['precio neto venta clp', 'precio venta clp', 'precio_clp', 'price_clp'], 9);
        const imgIdx = getIndex(['imagen', 'image', 'foto'], 10);
        const dateIdx = getIndex(['update', 'actualizado', 'date', 'fecha'], 12, true);
        const costUsdIdx = getIndex(['costo unit. usd', 'costo unit usd', 'costo_usd', 'cost_usd'], 14);
        const costClpIdx = getIndex(['costo unit clp', 'costo unit clp', 'costo_clp', 'cost_clp'], 15);
        const marginIdx = getIndex(['margen', 'margin', 'profit'], 17);

        // Dynamic specifications from sheet
        const spec1Idx = getIndex(['spec 1', 'spec1'], -1);
        const spec2Idx = getIndex(['spec 2', 'spec2'], -1);
        const spec3Idx = getIndex(['spec 3', 'spec3'], -1);
        const spec4Idx = getIndex(['spec 4', 'spec4'], -1);

        for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parser de CSV robusto
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

            if (parts.length > nameIdx && parts[pnIdx] !== undefined && parts[pnIdx].trim() !== '') {
                let productName = parts[nameIdx] ? parts[nameIdx].trim() : '';
                if (productName.startsWith('"') && productName.endsWith('"')) {
                    productName = productName.substring(1, productName.length - 1).replace(/""/g, '"');
                }
                
                const rawPriceUsd = parts.length > priceUsdIdx ? parts[priceUsdIdx].trim() : '';
                const rawPriceClp = parts.length > priceClpIdx ? parts[priceClpIdx].trim() : '';
                const rawCostUsd = parts.length > costUsdIdx ? parts[costUsdIdx].trim() : '';
                const rawCostClp = parts.length > costClpIdx ? parts[costClpIdx].trim() : '';
                const rawMargin = parts.length > marginIdx ? parts[marginIdx].trim() : '';

                let priceVal = 0;
                let priceUsdVal = 0;
                let priceClpVal = 0;

                if (rawPriceUsd !== '') {
                    priceUsdVal = parseCurrencyString(rawPriceUsd);
                }
                if (rawPriceClp !== '') {
                    priceClpVal = parseCurrencyString(rawPriceClp, true);
                }
                // USD is the canonical price for cart calculations
                if (priceUsdVal > 0) {
                    priceVal = priceUsdVal;
                } else if (priceClpVal > 0) {
                    priceVal = priceClpVal / sheetExchangeRate;
                    priceUsdVal = priceVal;
                }

                let costVal = 0;
                let marginVal = 20;

                if (rawCostUsd !== '') {
                    costVal = parseCurrencyString(rawCostUsd);
                    if (rawMargin !== '') {
                        marginVal = parseCurrencyString(rawMargin);
                    } else if (priceVal > 0) {
                        marginVal = 100 * (priceVal - costVal) / priceVal;
                        marginVal = Math.round(marginVal * 10) / 10;
                    }
                } else if (rawCostClp !== '') {
                    costVal = parseCurrencyString(rawCostClp, true) / sheetExchangeRate;
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
                    // Default to 20% margin if neither is provided
                    marginVal = 20;
                    costVal = priceVal * 0.8;
                }

                // Clean stock
                const stockVal = parts.length > stockIdx ? (parseInt(parts[stockIdx].replace(/[^\d]/g, '')) || 0) : 0;
                const brandVal = parts.length > brandIdx ? parts[brandIdx].trim() : '';
                const imgVal = parts.length > imgIdx ? parts[imgIdx].trim() : '';
                const dateVal = parts.length > dateIdx ? parts[dateIdx].trim() : '';
                
                const spec1Val = spec1Idx !== -1 && parts.length > spec1Idx ? parts[spec1Idx].trim() : '';
                const spec2Val = spec2Idx !== -1 && parts.length > spec2Idx ? parts[spec2Idx].trim() : '';
                const spec3Val = spec3Idx !== -1 && parts.length > spec3Idx ? parts[spec3Idx].trim() : '';
                const spec4Val = spec4Idx !== -1 && parts.length > spec4Idx ? parts[spec4Idx].trim() : '';

                result.push({
                    id: i,
                    pn: parts[pnIdx].trim(),
                    name: productName,
                    category: parts[catIdx] ? parts[catIdx].trim() : '',
                    stock: stockVal,
                    price: priceVal,       // always USD, used for cart
                    priceUsd: priceUsdVal,
                    priceClp: priceClpVal,
                    image: imgVal,
                    date: dateVal,
                    cost: costVal,
                    margin: marginVal,
                    brand: brandVal,
                    spec1: spec1Val,
                    spec2: spec2Val,
                    spec3: spec3Val,
                    spec4: spec4Val
                });
            }
        }
        return result;
    }

    function initApp() {
        checkUpdateDate();
        extractAndRenderCategories();
        extractAndRenderBrands();
        // Show exchange rate in header
        const erEl = document.getElementById('exchangeRateDisplay');
        if (erEl) erEl.textContent = Math.round(sheetExchangeRate).toLocaleString('es-CL');
        renderProducts(allProducts);
        loadCartFromStorage();
        setupEventListeners();
        setupCalculatorListeners();
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', (e) => filterProducts(currentCategory, currentBrand, e.target.value));

        // View toggle
        const viewGridBtn = document.getElementById('viewGridBtn');
        const viewListBtn = document.getElementById('viewListBtn');
        if (viewGridBtn) {
            viewGridBtn.addEventListener('click', () => {
                isListView = false;
                viewGridBtn.classList.add('active');
                if (viewListBtn) viewListBtn.classList.remove('active');
                productsGrid.classList.remove('list-view');
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        }
        if (viewListBtn) {
            viewListBtn.addEventListener('click', () => {
                isListView = true;
                viewListBtn.classList.add('active');
                if (viewGridBtn) viewGridBtn.classList.remove('active');
                productsGrid.classList.add('list-view');
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        }

        // Currency toggle USD / CLP
        const currUsdBtn = document.getElementById('currUsdBtn');
        const currClpBtn = document.getElementById('currClpBtn');
        if (currUsdBtn) {
            currUsdBtn.addEventListener('click', () => {
                currentCurrency = 'USD';
                currUsdBtn.classList.add('active');
                if (currClpBtn) currClpBtn.classList.remove('active');
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        }
        if (currClpBtn) {
            currClpBtn.addEventListener('click', () => {
                currentCurrency = 'CLP';
                currClpBtn.classList.add('active');
                if (currUsdBtn) currUsdBtn.classList.remove('active');
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        }

        // Sidebar collapse toggles
        const toggleLeft = document.getElementById('toggleLeftSidebar');
        const toggleRight = document.getElementById('toggleRightSidebar');
        const appContainer = document.querySelector('.app-container');
        const leftIcon = document.getElementById('leftToggleIcon');
        const rightIcon = document.getElementById('rightToggleIcon');

        if (toggleLeft) {
            toggleLeft.addEventListener('click', () => {
                appContainer.classList.toggle('left-collapsed');
                const collapsed = appContainer.classList.contains('left-collapsed');
                // Rotate icon: point right when collapsed (expand), left when open (collapse)
                if (leftIcon) leftIcon.querySelector('polyline').setAttribute('points', collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6');
                toggleLeft.title = collapsed ? 'Expandir panel' : 'Colapsar panel';
            });
        }
        if (toggleRight) {
            toggleRight.addEventListener('click', () => {
                appContainer.classList.toggle('right-collapsed');
                const collapsed = appContainer.classList.contains('right-collapsed');
                if (rightIcon) rightIcon.querySelector('polyline').setAttribute('points', collapsed ? '15 18 9 12 15 6' : '9 18 15 12 9 6');
                toggleRight.title = collapsed ? 'Expandir panel' : 'Colapsar panel';
            });
        }


        const viewModeCalcBtn = document.getElementById('viewModeCalcBtn');
        const viewModeClientBtn = document.getElementById('viewModeClientBtn');

        sideViewFullBtn.addEventListener('click', () => {
            currentViewMode = 'calc';
            if (viewModeCalcBtn) viewModeCalcBtn.classList.add('active');
            if (viewModeClientBtn) viewModeClientBtn.classList.remove('active');
            cartModal.classList.remove('client-mode');
            cartModal.classList.add('active');
            renderCalculator();
        });
        
        if (viewModeCalcBtn) {
            viewModeCalcBtn.addEventListener('click', () => {
                currentViewMode = 'calc';
                viewModeCalcBtn.classList.add('active');
                if (viewModeClientBtn) viewModeClientBtn.classList.remove('active');
                cartModal.classList.remove('client-mode');
                renderCalculator();
            });
        }

        if (viewModeClientBtn) {
            viewModeClientBtn.addEventListener('click', () => {
                currentViewMode = 'client';
                viewModeClientBtn.classList.add('active');
                if (viewModeCalcBtn) viewModeCalcBtn.classList.remove('active');
                cartModal.classList.add('client-mode');
                renderCalculator();
            });
        }

        closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
        
        // Botón guardar y cerrar de la calculadora
        const closeCartCalc = document.getElementById('closeCartCalc');
        if (closeCartCalc) {
            closeCartCalc.addEventListener('click', () => {
                cartModal.classList.remove('active');
            });
        }

        window.addEventListener('click', (e) => { 
            if (e.target === cartModal) cartModal.classList.remove('active'); 
        });
        
        sendOrderBtn.addEventListener('click', generatePDF);
        
        // Listener para tipo de cambio e inputs de la cabecera del modal
        document.getElementById('exchangeRateInput').addEventListener('input', () => {
            recalculateAllStats();
            saveCartToStorage();
        });
        document.getElementById('toggleCostCol').addEventListener('change', applyColumnVisibility);
        document.getElementById('toggleMarginCol').addEventListener('change', applyColumnVisibility);
        
        // Aplicar margen global
        document.getElementById('applyGlobalMarginBtn').addEventListener('click', () => {
            let globalMargin = parseFloat(document.getElementById('globalMarginInput').value);
            if (isNaN(globalMargin)) return;
            if (globalMargin >= 100) globalMargin = 99.9;
            if (globalMargin < 0) globalMargin = 0;

            cart.forEach(item => {
                item.margin = globalMargin;
                // Opción B: Venta = Costo / (1 - Margen / 100)
                item.price = item.cost / (1 - globalMargin / 100);
            });

            renderCalculator();
            updateCartUI();
            saveCartToStorage();
        });

        // Buscador integrado en la calculadora
        const calcSearchInput = document.getElementById('calcSearchInput');
        const calcSearchDropdown = document.getElementById('calcSearchDropdown');

        calcSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                calcSearchDropdown.classList.remove('active');
                calcSearchDropdown.innerHTML = '';
                return;
            }

            const matches = allProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.pn.toLowerCase().includes(query)
            ).slice(0, 10);

            if (matches.length === 0) {
                calcSearchDropdown.innerHTML = '<div style="padding: 10px; color: var(--text-secondary); font-size: 0.8rem;">No se encontraron productos</div>';
            } else {
                calcSearchDropdown.innerHTML = matches.map(p => `
                    <div class="calc-search-item" data-id="${p.id}">
                        <div class="item-details">
                            <span class="item-name">${p.name.substring(0, 50)}...</span>
                            <span class="item-pn">PN: ${p.pn} | Stock: ${p.stock} u.</span>
                        </div>
                        <span class="item-price">${formatUSD(p.price)}</span>
                    </div>
                `).join('');
            }
            calcSearchDropdown.classList.add('active');
        });

        calcSearchDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.calc-search-item');
            if (!item) return;
            
            const productId = item.getAttribute('data-id');
            if (productId) {
                addToCart(productId);
                renderCalculator();
                
                calcSearchInput.value = '';
                calcSearchDropdown.classList.remove('active');
                calcSearchDropdown.innerHTML = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-add-group')) {
                calcSearchDropdown.classList.remove('active');
            }
        });
    }

    function parseSheetDate(str) {
        // Formatos: 'd/m/yyyy', 'd/m/yyyy HH:mm:ss' o 'yyyy-mm-dd'
        const s = String(str || '').trim();
        let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
        m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
        return null;
    }

    function formatDate(d) {
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function checkUpdateDate() {
        if (allProducts.length === 0) return;
        const statusDiv = document.getElementById('updateStatus');

        // Fecha más reciente entre TODOS los productos (no solo el primero)
        let maxDate = null;
        for (const p of allProducts) {
            if (!p.date) continue;
            const d = parseSheetDate(p.date);
            if (d && (!maxDate || d > maxDate)) maxDate = d;
        }
        if (!maxDate) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = maxDate.getTime() === today.getTime();
        const displayDate = formatDate(maxDate);

        if (isToday) {
            statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px; color: var(--success); font-size: 0.75rem;">
                    <span style="font-weight: 700;">● Datos de hoy</span>
                    <span style="opacity: 0.7;">(${displayDate})</span>
                </div>`;
        } else {
            statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px; color: #ef4444; font-size: 0.75rem;">
                    <span style="font-weight: 700;">● Actualización pendiente</span>
                    <span style="opacity: 0.7;">(Carga: ${displayDate})</span>
                </div>`;
        }
    }

    function extractAndRenderCategories() {
        const categories = new Set(allProducts.map(p => p.category));
        
        // Clear dynamic categories
        const dynamicLis = categoryList.querySelectorAll('li:not(:first-child)');
        dynamicLis.forEach(li => li.remove());

        Array.from(categories).sort().forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<button class="cat-btn" data-cat="${cat}">${cat}</button>`;
            categoryList.appendChild(li);
        });

        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.getAttribute('data-cat');
                currentCategoryTitle.textContent = currentCategory === 'Todos' ? 'Todos los Productos' : currentCategory;
                // Reset brand filter on category change
                currentBrand = 'Todos';
                extractAndRenderBrands(currentCategory);
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        });
    }

    function extractAndRenderBrands(forCategory = 'Todos') {
        const brandBar = document.getElementById('brandFilterBar');
        if (!brandBar) return;

        // Get products for current category
        const pool = forCategory === 'Todos' ? allProducts : allProducts.filter(p => p.category === forCategory);
        const brands = Array.from(new Set(pool.map(p => p.brand).filter(Boolean))).sort();

        brandBar.innerHTML = '<button class="brand-pill active" data-brand="Todos">Todas las Marcas</button>';
        brands.forEach(brand => {
            const btn = document.createElement('button');
            btn.className = 'brand-pill';
            btn.dataset.brand = brand;
            btn.textContent = brand;
            brandBar.appendChild(btn);
        });

        brandBar.querySelectorAll('.brand-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                brandBar.querySelectorAll('.brand-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentBrand = btn.dataset.brand;
                filterProducts(currentCategory, currentBrand, searchInput.value);
            });
        });
    }

    function filterProducts(category, brand, searchTerm) {
        let filtered = allProducts;
        if (category !== 'Todos') filtered = filtered.filter(p => p.category === category);
        if (brand && brand !== 'Todos') filtered = filtered.filter(p => p.brand === brand);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.pn.toLowerCase().includes(term));
        }
        renderProducts(filtered);
    }

    function formatCLP(val) {
        if (!val || val === 0) return 'CLP$ -';
        return 'CLP$ ' + Math.round(val).toLocaleString('es-CL');
    }

    function getDisplayPrice(p) {
        if (currentCurrency === 'CLP') {
            if (p.priceClp && p.priceClp > 0) return formatCLP(p.priceClp) + ' +IVA';
            if (p.priceUsd && p.priceUsd > 0) return formatCLP(p.priceUsd * sheetExchangeRate) + ' +IVA';
            return 'CLP$ - +IVA';
        }
        return formatUSD(p.price) + ' +IVA';
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';
        productCount.textContent = `${products.length} resultados`;
        
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const priceFmt = getDisplayPrice(p);

            if (isListView) {
                // List view: imagen | PN | descripcion | precio | stock | acciones
                card.classList.add('list-item');
                card.innerHTML = `
                    <div class="list-img">
                        <img src="${p.image}" alt="${p.pn}" loading="lazy">
                    </div>
                    <div class="list-pn" title="${p.pn}">${p.pn}</div>
                    <div class="list-name">${p.name}</div>
                    <div class="list-price-cell">${priceFmt}</div>
                    <div class="list-stock-cell">${p.stock} u.</div>
                    <div class="list-actions">
                        <button class="edit-product-trigger-btn" data-pn="${p.pn}" title="Editar Producto">✏️</button>
                        <button class="flyer-trigger-btn" data-id="${p.id}" title="Crear Flyer">&#128226;</button>
                        <button class="add-btn" data-id="${p.id}">+ Cotizar</button>
                    </div>
                `;
            } else {
                // Grid view layout (original)
                card.innerHTML = `
                    <div class="img-container" style="position: relative;">
                        <img src="${p.image}" alt="${p.name}">
                        <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; z-index: 10;">
                            <button class="edit-product-trigger-btn" data-pn="${p.pn}" title="Editar Producto" style="width: 28px; height: 28px; border-radius: 6px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">✏️</button>
                            <button class="flyer-trigger-btn" data-id="${p.id}" title="Crear Flyer Promocional" style="position: static; width: 28px; height: 28px; border-radius: 6px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">&#128226;</button>
                        </div>
                    </div>
                    <div class="card-content">
                        <span class="category-tag">${p.category}</span>
                        <h3 class="product-title">${p.name}</h3>
                        <div class="price-row">
                            <span class="price">${priceFmt}</span>
                            <span class="pn-badge">PN: ${p.pn}</span>
                        </div>
                        <p class="stock-text">Stock: ${p.stock} u.</p>
                        <button class="add-btn" data-id="${p.id}">Agregar al Pedido</button>
                    </div>
                `;
            }
            productsGrid.appendChild(card);
        });
 
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.flyer-trigger-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openFlyerModal(btn.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.edit-product-trigger-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProductEditModal(btn.getAttribute('data-pn'));
            });
        });
    }
 
    function addToCart(productId) {
        const product = allProducts.find(p => p.id == productId);
        const existing = cart.find(item => item.id == productId);
        if (existing) { 
            existing.qty++; 
        } else { 
            cart.push({ 
                ...product, 
                cost: product.cost,
                margin: product.margin,
                price: product.price,
                qty: 1,
                um: 'UND',
                brand: product.brand || '',
                dispo: 'INMEDIATA SALVO VENTA PREVIA',
                obs: '',
                comments: ''
            }); 
        }
        updateCartUI();
        saveCartToStorage();
    }
 
    function updateCartUI() {
        const count = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountBadge.textContent = count;
        
        // Flash animation
        cartCountBadge.classList.add('flash-active');
        void cartCountBadge.offsetWidth;
        setTimeout(() => cartCountBadge.classList.remove('flash-active'), 500);
        
        sideCartItems.innerHTML = '';
        
        let total = 0;
        if (cart.length === 0) {
            sideCartItems.innerHTML = '<p class="empty-msg">No hay productos seleccionados</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                const priceFmt = formatUSD(item.price);
                
                const sideDiv = document.createElement('div');
                sideDiv.className = 'side-item';
                sideDiv.innerHTML = `
                    <div class="side-item-info">
                        <h5>${item.name.substring(0, 25)}...</h5>
                        <p>${priceFmt}</p>
                    </div>
                    <div class="qty-controls" style="padding: 2px 4px; gap: 4px;">
                        <button class="qty-btn" style="width: 20px; height: 20px;" onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" style="width: 20px; height: 20px;" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                `;
                sideCartItems.appendChild(sideDiv);
            });
        }
        const totalFmt = formatUSD(total);
        sideCartTotal.textContent = totalFmt + ' +IVA';
    }

    window.updateQty = (id, change) => {
        const item = cart.find(i => i.id == id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) cart = cart.filter(i => i.id != id);
            updateCartUI();
            saveCartToStorage();
            if (cartModal.classList.contains('active')) {
                renderCalculator();
            }
        }
    };

    // --- LÓGICA DE LA CALCULADORA DE MARGENES ---
    function selectRow(id) {
        activeRowId = id;
        
        // Highlight active row in the table
        document.querySelectorAll('#calcTableBody tr').forEach(tr => {
            if (tr.getAttribute('data-row-id') == id) {
                tr.classList.add('active-row');
            } else {
                tr.classList.remove('active-row');
            }
        });
        
        // Update Sidebar Item Details Card
        const item = cart.find(i => i.id == id);
        if (item) {
            document.getElementById('activeItemName').textContent = item.name;
            document.getElementById('activeItemName').title = item.name;
            document.getElementById('activeItemPN').textContent = item.pn || '-';
            document.getElementById('activeItemStock').textContent = `${item.stock} u.`;
            document.getElementById('activeItemDate').textContent = item.date || '-';
        }
    }

    window.updateQtyInCalc = (id, change) => {
        const item = cart.find(i => i.id == id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id != id);
            }
            renderCalculator();
            updateCartUI();
            saveCartToStorage();
        }
    };

    window.removeFromCalc = (id) => {
        cart = cart.filter(i => i.id != id);
        renderCalculator();
        updateCartUI();
        saveCartToStorage();
    };

    function renderCalculator() {
        const tbody = document.getElementById('calcTableBody');
        tbody.innerHTML = '';
        
        if (cart.length === 0) {
            tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: 2rem; color: var(--text-secondary);">El cotizador está vacío. Agrega productos desde el catálogo o usa el buscador superior.</td></tr>';
            updateStats(0, 0, 0);
            
            // Clean active item card
            document.getElementById('activeItemName').textContent = 'Ninguno seleccionado';
            document.getElementById('activeItemPN').textContent = '-';
            document.getElementById('activeItemStock').textContent = '-';
            document.getElementById('activeItemDate').textContent = '-';
            return;
        }

        const isClient = currentViewMode === 'client';

        cart.forEach((item, index) => {
            const costTotal = item.cost * item.qty;
            const subtotal = item.price * item.qty;
            const row = document.createElement('tr');
            row.setAttribute('data-row-id', item.id);
            
            // Highlight active row
            if (activeRowId === item.id) {
                row.classList.add('active-row');
            }
            
            row.addEventListener('click', () => {
                selectRow(item.id);
            });
            
            // Cant. HTML
            const qtyHTML = isClient 
                ? `<span style="font-weight: 500;">${item.qty} u.</span>`
                : `<div class="qty-controls" style="padding: 2px 4px; gap: 4px; display: inline-flex;">
                        <button class="qty-btn" style="width: 20px; height: 20px; font-size: 0.75rem;" onclick="event.stopPropagation(); updateQtyInCalc(${item.id}, -1)">-</button>
                        <span style="font-size: 0.8rem; font-weight: 600; min-width: 16px; text-align: center;">${item.qty}</span>
                        <button class="qty-btn" style="width: 20px; height: 20px; font-size: 0.75rem;" onclick="event.stopPropagation(); updateQtyInCalc(${item.id}, 1)">+</button>
                    </div>`;

            // U/M HTML
            const umHTML = isClient
                ? `<span>${item.um || 'UND'}</span>`
                : `<input type="text" class="calc-um-input" data-id="${item.id}" value="${item.um || 'UND'}" style="text-align: center;">`;

            // P/N HTML
            const pnHTML = isClient
                ? `<strong class="pn-badge">${item.pn}</strong>`
                : `<input type="text" class="calc-pn-input" data-id="${item.id}" value="${item.pn || ''}" style="font-weight: 700; font-family: monospace;">`;

            // Brand HTML
            const brandHTML = isClient
                ? `<span>${item.brand || ''}</span>`
                : `<input type="text" class="calc-brand-input" data-id="${item.id}" value="${item.brand || ''}">`;

            // SKU / Detalle HTML
            const descHTML = isClient
                ? `<div style="font-weight: 500; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.name}">${item.name}</div>`
                : `<input type="text" class="calc-name-input" data-id="${item.id}" value="${item.name || ''}" style="text-align: left;">`;

            // Cost Unit HTML
            const costUnitHTML = isClient
                ? ''
                : `<input type="number" step="0.01" class="calc-cost-input" data-id="${item.id}" value="${item.cost.toFixed(2)}">`;

            // Cost Total HTML
            const costTotalHTML = isClient
                ? ''
                : `<span class="col-cost-total">${formatNumber(costTotal)}</span>`;

            // Margin HTML
            const marginHTML = isClient
                ? ''
                : `<div style="display: flex; align-items: center; gap: 4px; justify-content: center;">
                        <input type="number" step="0.1" class="calc-margin-input" data-id="${item.id}" value="${item.margin.toFixed(1)}" style="text-align: center;">
                        <span>%</span>
                    </div>`;

            // PVP Unit HTML
            const priceHTML = isClient
                ? `<span style="font-weight: 500;">${formatNumber(item.price)}</span>`
                : `<input type="number" step="0.01" class="calc-price-input" data-id="${item.id}" value="${item.price.toFixed(2)}">`;

            // Subtotal HTML
            const subtotalHTML = `<span style="font-weight: 600; color: var(--text-primary);" class="col-subtotal-cell">${formatNumber(subtotal)}</span>`;

            // Obs HTML
            const obsHTML = isClient
                ? ''
                : `<input type="text" class="calc-obs-input" data-id="${item.id}" value="${item.obs || ''}" placeholder="Proveedor...">`;

            // Disponibilidad HTML
            const dispoHTML = isClient
                ? `<span style="font-size: 0.8rem;">${item.dispo || 'INMEDIATA SALVO VENTA PREVIA'}</span>`
                : `<input type="text" class="calc-dispo-input" data-id="${item.id}" value="${item.dispo || 'INMEDIATA SALVO VENTA PREVIA'}" placeholder="Entrega...">`;

            // Comentarios HTML
            const commentsHTML = isClient
                ? `<span style="font-size: 0.8rem; color: var(--text-secondary);">${item.comments || ''}</span>`
                : `<input type="text" class="calc-comments-input" data-id="${item.id}" value="${item.comments || ''}" placeholder="Nota...">`;

            // Delete button HTML
            const deleteHTML = isClient
                ? ''
                : `<button class="delete-item-btn" onclick="event.stopPropagation(); removeFromCalc(${item.id})" title="Eliminar ítem">&times;</button>`;

            row.innerHTML = `
                <td class="col-index">${index + 1}</td>
                <td class="col-qty" style="text-align: center;">${qtyHTML}</td>
                <td class="col-um" style="text-align: center;">${umHTML}</td>
                <td class="col-pn">${pnHTML}</td>
                <td class="col-brand">${brandHTML}</td>
                <td class="col-desc">${descHTML}</td>
                <td class="col-cost-unit col-cost">${costUnitHTML}</td>
                <td class="col-cost-total col-cost">${costTotalHTML}</td>
                <td class="col-margin" style="text-align: center;">${marginHTML}</td>
                <td class="col-price">${priceHTML}</td>
                <td class="col-subtotal">${subtotalHTML}</td>
                <td class="col-obs client-hidden">${obsHTML}</td>
                <td class="col-dispo">${dispoHTML}</td>
                <td class="col-comments">${commentsHTML}</td>
                <td class="col-actions">${deleteHTML}</td>
            `;
            tbody.appendChild(row);
        });

        applyColumnVisibility();
        recalculateAllStats();

        // Highlight active row after render
        if (cart.length > 0) {
            const exists = cart.some(i => i.id === activeRowId);
            if (!exists) {
                activeRowId = cart[0].id;
            }
            selectRow(activeRowId);
        }
    }

    function setupCalculatorListeners() {
        const tbody = document.getElementById('calcTableBody');
        
        tbody.addEventListener('input', (e) => {
            const target = e.target;
            const itemId = target.getAttribute('data-id');
            if (!itemId) return;

            const item = cart.find(i => i.id == itemId);
            if (!item) return;

            const tr = target.closest('tr');
            const costInput = tr.querySelector('.calc-cost-input');
            const marginInput = tr.querySelector('.calc-margin-input');
            const priceInput = tr.querySelector('.calc-price-input');
            const costTotalCell = tr.querySelector('.col-cost-total');
            const subtotalCell = tr.querySelector('.col-subtotal-cell');

            if (target.classList.contains('calc-cost-input')) {
                const cost = parseFloat(target.value) || 0;
                item.cost = cost;
                const margin = item.margin || 0;
                item.price = margin < 100 ? (cost / (1 - margin / 100)) : cost;
                if (priceInput) priceInput.value = item.price.toFixed(2);
            } 
            else if (target.classList.contains('calc-margin-input')) {
                let margin = parseFloat(target.value) || 0;
                if (margin >= 100) margin = 99.9;
                item.margin = margin;
                item.price = item.cost / (1 - margin / 100);
                if (priceInput) priceInput.value = item.price.toFixed(2);
            } 
            else if (target.classList.contains('calc-price-input')) {
                const price = parseFloat(target.value) || 0;
                item.price = price;
                if (price > 0) {
                    let margin = 100 * (price - item.cost) / price;
                    margin = Math.round(margin * 10) / 10;
                    item.margin = margin;
                    if (marginInput) marginInput.value = margin.toFixed(1);
                }
            }
            else if (target.classList.contains('calc-um-input')) {
                item.um = target.value;
            }
            else if (target.classList.contains('calc-pn-input')) {
                item.pn = target.value;
            }
            else if (target.classList.contains('calc-brand-input')) {
                item.brand = target.value;
            }
            else if (target.classList.contains('calc-name-input')) {
                item.name = target.value;
            }
            else if (target.classList.contains('calc-obs-input')) {
                item.obs = target.value;
            }
            else if (target.classList.contains('calc-dispo-input')) {
                item.dispo = target.value;
            }
            else if (target.classList.contains('calc-comments-input')) {
                item.comments = target.value;
            }

            // Update calculated columns in the DOM instantly
            if (costTotalCell) {
                costTotalCell.textContent = formatNumber(item.cost * item.qty);
            }
            if (subtotalCell) {
                subtotalCell.textContent = formatNumber(item.price * item.qty);
            }

            recalculateAllStats();
            updateCartUI();
            saveCartToStorage();
        });
    }

    function recalculateAllStats() {
        let totalCost = 0;
        let totalSales = 0;
        let totalQty = 0;

        cart.forEach(item => {
            totalCost += item.cost * item.qty;
            totalSales += item.price * item.qty;
            totalQty += item.qty;
        });

        updateStats(totalCost, totalSales, totalQty);

        // Update footer totals in the DOM instantly
        let avgMargin = 0;
        if (totalSales > 0) {
            avgMargin = 100 * (totalSales - totalCost) / totalSales;
        }

        const footTotalQty = document.getElementById('footTotalQty');
        const footTotalCost = document.getElementById('footTotalCost');
        const footAvgMargin = document.getElementById('footAvgMargin');
        const footTotalNet = document.getElementById('footTotalNet');
        const footTotalIva = document.getElementById('footTotalIva');
        const footTotalGross = document.getElementById('footTotalGross');

        if (footTotalQty) footTotalQty.textContent = totalQty;
        if (footTotalCost) footTotalCost.textContent = formatNumber(totalCost);
        if (footAvgMargin) footAvgMargin.textContent = avgMargin.toFixed(1) + '%';
        if (footTotalNet) footTotalNet.textContent = formatNumber(totalSales);

        const totalIva = totalSales * 0.19;
        const totalGross = totalSales * 1.19;
        if (footTotalIva) footTotalIva.textContent = formatNumber(totalIva);
        if (footTotalGross) footTotalGross.textContent = formatNumber(totalGross);
    }

    function updateStats(totalCost, totalSales, totalQty) {
        const exchangeRate = parseFloat(document.getElementById('exchangeRateInput').value) || 940;

        const totalProfit = totalSales - totalCost;
        let avgMargin = 0;
        if (totalSales > 0) {
            avgMargin = 100 * totalProfit / totalSales;
        }

        document.getElementById('statTotalCost').textContent = formatUSD(totalCost);
        document.getElementById('statAvgMargin').textContent = avgMargin.toFixed(1) + '%';
        document.getElementById('statTotalProfit').textContent = formatUSD(totalProfit);
        const commission30 = totalProfit * 0.30;
        const statCommission30 = document.getElementById('statCommission30');
        if (statCommission30) {
            statCommission30.textContent = formatUSD(commission30);
        }

        const statNetUSD = document.getElementById('statNetUSD');
        const statIvaUSD = document.getElementById('statIvaUSD');
        const statGrossUSD = document.getElementById('statGrossUSD');

        if (statNetUSD) statNetUSD.textContent = formatUSD(totalSales);
        if (statIvaUSD) statIvaUSD.textContent = formatUSD(totalSales * 0.19);
        if (statGrossUSD) statGrossUSD.textContent = formatUSD(totalSales * 1.19);
    }

    function applyColumnVisibility() {
        const showCost = document.getElementById('toggleCostCol').checked;
        const showMargin = document.getElementById('toggleMarginCol').checked;

        document.querySelectorAll('.col-cost').forEach(el => {
            if (showCost) el.classList.remove('col-hidden'); else el.classList.add('col-hidden');
        });
        document.querySelectorAll('.col-margin').forEach(el => {
            if (showMargin) el.classList.remove('col-hidden'); else el.classList.add('col-hidden');
        });
    }

    window.updateQtyInCalc = (id, change) => {
        const item = cart.find(i => i.id == id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id != id);
            }
            renderCalculator();
            updateCartUI();
            saveCartToStorage();
        }
    };

    window.removeFromCalc = (id) => {
        cart = cart.filter(i => i.id != id);
        renderCalculator();
        updateCartUI();
        saveCartToStorage();
    };

    function saveCartToStorage() {
        localStorage.setItem('tecnovoa_cart', JSON.stringify(cart));
        const exchangeRate = document.getElementById('exchangeRateInput').value;
        const globalMargin = document.getElementById('globalMarginInput').value;
        localStorage.setItem('tecnovoa_exchange_rate', exchangeRate);
        localStorage.setItem('tecnovoa_global_margin', globalMargin);
    }
 
    function loadCartFromStorage() {
        const stored = localStorage.getItem('tecnovoa_cart');
        if (stored) {
            try {
                cart = JSON.parse(stored);
                updateCartUI();
            } catch (e) {
                cart = [];
            }
        }
        const storedRate = localStorage.getItem('tecnovoa_exchange_rate');
        if (storedRate) {
            document.getElementById('exchangeRateInput').value = storedRate;
        } else {
            document.getElementById('exchangeRateInput').value = sheetExchangeRate;
        }
        const storedMargin = localStorage.getItem('tecnovoa_global_margin');
        if (storedMargin) {
            document.getElementById('globalMarginInput').value = storedMargin;
        }
    }

    // --- GENERACIÓN DE PDF Y LOGS ---
    function generatePDF() {
        if (cart.length === 0) return alert('El carrito está vacío');
        
        const clientName = document.getElementById('pdfClientName').value || 'Cliente General';
        const clientContact = document.getElementById('pdfClientContact').value || '';
        const exchangeRate = parseFloat(document.getElementById('exchangeRateInput').value) || 940;

        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const iva = total * 0.19;
        const grossTotal = total * 1.19;

        const netCLP = total * exchangeRate;
        const ivaCLP = netCLP * 0.19;
        const grossCLP = netCLP * 1.19;

        let totalCost = 0;
        cart.forEach(item => totalCost += item.cost * item.qty);
        const totalProfit = total - totalCost;
        let avgMargin = 0;
        if (total > 0) {
            avgMargin = 100 * totalProfit / total;
        }

        const docNo = 'COT-2026-' + new Date().getTime().toString().substring(8);

        // 1. REGISTRO EN LOG LOCAL (POST a server.py)
        const logEntry = {
            document_no: docNo,
            date: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL'),
            client_name: clientName,
            client_contact: clientContact,
            exchange_rate: exchangeRate,
            total_net_usd: total.toFixed(2),
            total_gross_usd: grossTotal.toFixed(2),
            average_margin: avgMargin.toFixed(1),
            total_profit_usd: totalProfit.toFixed(2),
            items: cart.map(item => ({
                pn: item.pn,
                name: item.name,
                qty: item.qty,
                cost: item.cost.toFixed(2),
                margin: item.margin.toFixed(1),
                price: item.price.toFixed(2),
                subtotal: (item.price * item.qty).toFixed(2),
                um: item.um || 'UND',
                brand: item.brand || '',
                dispo: item.dispo || 'INMEDIATA SALVO VENTA PREVIA',
                obs: item.obs || '',
                comments: item.comments || ''
            }))
        };

        fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logEntry)
        })
        .then(res => res.json())
        .then(data => console.log('Log de cotización guardado:', data))
        .catch(err => console.error('Error al guardar log:', err));

        // 2. CREACIÓN DE PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const blue = [0, 82, 162];
        
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('TECNOVOA SPA', 15, 22);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80);
        doc.text('RUT: 77.194.064-1 | Giro: Comercialización Equipos Computacionales', 15, 28);
        doc.text('Dirección: Av. Pedro de Valdivia N° 273, Of. 606, Providencia, Santiago', 15, 33);
        doc.text('Contacto Comercial: Úrsula Zúñiga | ursula@tecnovoa.cl | +56 9 8484 9276', 15, 38);
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('COTIZACIÓN FORMAL', 195, 22, { align: 'right' });
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        doc.text('Fecha: ' + new Date().toLocaleDateString('es-CL'), 195, 28, { align: 'right' });
        doc.text('Documento N°: ' + docNo, 195, 33, { align: 'right' });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(15, 42, 195, 42);

        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('CLIENTE:', 15, 49);
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80);
        doc.text(clientName, 15, 53);
        if (clientContact) {
            doc.text('Atención: ' + clientContact, 15, 57);
        }

        doc.setFont(undefined, 'bold');
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('CONDICIONES COMERCIALES:', 195, 49, { align: 'right' });
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80);
        doc.text('Validez: 15 días corridos', 195, 53, { align: 'right' });
        doc.text('Moneda: USD (y equivalencia en CLP)', 195, 57, { align: 'right' });

        doc.line(15, 62, 195, 62);

        // Ocultamos costos y márgenes en el PDF para el cliente
        let index = 1;
        const tableBody = cart.map(item => [
            index++,
            item.qty,
            item.um || 'UND',
            item.pn,
            item.brand || '',
            item.name,
            formatUSD(item.price),
            formatUSD(item.price * item.qty),
            item.dispo || 'INMEDIATA SALVO VENTA PREVIA'
        ]);

        doc.autoTable({
            startY: 67,
            head: [['#', 'Cant', 'U/M', 'Part Number', 'Marca', 'Descripción', 'Precio unidad', 'Total', 'Disponibilidad']],
            body: tableBody,
            headStyles: { fillColor: [16, 185, 129] }, // Verde (#10b981)
            theme: 'grid',
            margin: { left: 15, right: 15 },
            styles: { fontSize: 8 }
        });

        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80);
        
        // Columna USD
        doc.text('Subtotal Neto USD:', 105, finalY);
        doc.text(formatUSD(total), 145, finalY, { align: 'right' });
        
        doc.text('IVA USD (19%):', 105, finalY + 6);
        doc.text(formatUSD(iva), 145, finalY + 6, { align: 'right' });
        
        // Columna CLP
        doc.text('Equiv. CLP Neto:', 150, finalY);
        doc.text(formatCLP(netCLP), 195, finalY, { align: 'right' });
        
        doc.text('IVA CLP (19%):', 150, finalY + 6);
        doc.text(formatCLP(ivaCLP), 195, finalY + 6, { align: 'right' });
        
        // Fila final de Total en verde destacado
        doc.setFillColor(16, 185, 129); // Verde
        doc.rect(105, finalY + 10, 90, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('TOTAL GENERAL (USD)', 108, finalY + 15.5);
        doc.text(formatUSD(grossTotal), 148, finalY + 15.5, { align: 'right' });
        
        doc.text('TOTAL CLP (IVA Inc.)', 152, finalY + 15.5);
        doc.text(formatCLP(grossCLP), 192, finalY + 15.5, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        
        let legalText = "TÉRMINOS Y CONDICIONES COMERCIALES B2B:\n";
        legalText += "1. PRECIOS: Expresados en USD. Equivalencia en CLP calculada con el tipo de cambio del día de facturación.\n";
        legalText += "2. DESPACHO: Según stock y disponibilidad del fabricante. Confirmar disponibilidad antes de emitir OC.\n";
        legalText += "3. PLAZOS DE ENTREGA: Estimados, varían según disponibilidad de la marca.\n";
        legalText += "4. GARANTÍA: Rige garantía oficial del fabricante. TECNOVOA no otorga garantías adicionales.\n";
        legalText += "5. DEVOLUCIONES: No se aceptan sin autorización previa por escrito.\n";
        legalText += "6. VIGENCIA: 15 días corridos desde su emisión.\n";
        legalText += "7. NATURALEZA: Esta es una cotización/proforma, no una factura ni compromiso de compra.\n";
        legalText += "8. ACEPTACIÓN: La emisión de la Orden de Compra (OC) implica aceptación total de estos términos.";
        
        doc.text(legalText, 15, finalY + 23);

        doc.save(`Cotizacion_TECNOVOA_${new Date().getTime()}.pdf`);
        alert('Cotización PDF generada exitosamente y registrada en el historial.');
    }

    function formatUSD(amount) {
        const rounded = amount.toFixed(2);
        const formatted = rounded.replace('.', ',');
        return `USD$ ${formatted}`;
    }

    function formatUSDNoDecimals(amount) {
        if (isNaN(amount) || amount === null) return 'USD$ 0';
        const rounded = Math.round(amount);
        const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `USD$ ${formatted}`;
    }

    function formatNumber(amount) {
        if (isNaN(amount) || amount === null) return '0,00';
        const parts = amount.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    }

    function formatCLP(amount) {
        const rounded = Math.round(amount);
        const formatted = rounded.toLocaleString('es-CL');
        return `CLP$ ${formatted}`;
    }

    // --- LÓGICA DEL GENERADOR DE FLYERS ---
    window.openFlyerModal = (productId) => {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;
        
        document.getElementById('flyerProductId').value = product.id;
        document.getElementById('flyerBrand').value = product.brand || 'TECNOVOA';
        document.getElementById('flyerId').value = product.pn || '';
        document.getElementById('flyerTitlePrincipal').value = product.category ? product.category.toUpperCase() : 'TECNOLOGÍA';
        document.getElementById('flyerTitleSecundario').value = product.name;
        
        // Formatear precio (sin decimales y sin +IVA)
        document.getElementById('flyerPrice').value = formatUSDNoDecimals(product.price);
        document.getElementById('flyerShowPrice').checked = true;
        
        // Especificaciones dinámicas (priorizar las de la planilla si están presentes)
        let spec1 = product.spec1 || '📦 Stock: Disponible';
        let spec2 = product.spec2 || '🔧 Garantía: Oficial';
        let spec3 = product.spec3 || '⚡ Conexión: Alta velocidad';
        let spec4 = product.spec4 || '✨ Estado: Nuevo Sellado';
        
        const nameLower = product.name.toLowerCase();
        const catLower = product.category.toLowerCase();
        
        if (!product.spec1 && !product.spec2 && !product.spec3 && !product.spec4) {
            if (catLower.includes('laptop') || nameLower.includes('laptop') || nameLower.includes('notebook')) {
                spec1 = '🔋 Batería: 5000 mAh';
                spec2 = '⚡ Procesador: Octa Core 4.70GHz';
                spec3 = '💾 Almacenamiento: 512 GB SSD';
                spec4 = '🧠 Memoria RAM: 16 GB DDR4';
            } else if (catLower.includes('audio') || nameLower.includes('airpods') || nameLower.includes('earpods') || nameLower.includes('headphone')) {
                spec1 = '🔊 Sonido: HIFI Premium';
                spec2 = '🔋 Batería: Hasta 24 horas';
                spec3 = '⚡ Conectividad: Bluetooth 5.0';
                spec4 = '🎙️ Micrófono: Cancelación de ruido';
            } else if (nameLower.includes('cable') || nameLower.includes('usb')) {
                spec1 = '⚡ Carga: Rápida inteligente';
                spec2 = '📏 Longitud: 1 metro';
                spec3 = '🔌 Conector: Reforzado';
                spec4 = '🛡️ Material: Alta durabilidad';
            } else if (nameLower.includes('pencil') || nameLower.includes('lápiz')) {
                spec1 = '✍️ Precisión: Sensibilidad de presión';
                spec2 = '🔋 Carga: Magnética inalámbrica';
                spec3 = '⚡ Latencia: Ultra baja';
                spec4 = '✨ Compatibilidad: iPad Pro / Air';
            }
        }
        
        document.getElementById('flyerSpec1').value = spec1;
        document.getElementById('flyerSpec2').value = spec2;
        document.getElementById('flyerSpec3').value = spec3;
        document.getElementById('flyerSpec4').value = spec4;
        
        document.getElementById('flyerCta').value = 'COMPRAR AHORA';
        document.getElementById('flyerContactPhone').value = '+56 9 4943 8288';
        document.getElementById('flyerContactWeb').value = 'www.tecnovoa.cl';
        
        loadProductImage(product.image);
        loadQrImage(document.getElementById('flyerContactWeb').value);
        loadBrandLogoImage(product.brand || 'TECNOVOA');
        
        const modal = document.getElementById('flyerModal');
        modal.classList.add('active');
        
        // Redibujar una vez cargadas las fuentes y después de un breve delay
        if (document.fonts) {
            document.fonts.ready.then(() => {
                setTimeout(drawFlyer, 100);
            });
        } else {
            setTimeout(drawFlyer, 100);
        }
    };

    function drawBrandLogoScaled(img, ctx, x, y, maxWidth, maxHeight) {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const hRatio = maxWidth / img.naturalWidth;
        const vRatio = maxHeight / img.naturalHeight;
        const ratio = Math.min(hRatio, vRatio);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        const offset_y = (maxHeight - h) / 2;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y + offset_y, w, h);
    }

    function drawFooterIcon(ctx, type, x, y) {
        // Draw blue circular background
        ctx.fillStyle = '#1976D2';
        ctx.beginPath();
        ctx.arc(x, y - 6, 16, 0, 2 * Math.PI);
        ctx.fill();

        // Draw white icon inside
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (type === 'user') {
            // User head
            ctx.beginPath();
            ctx.arc(x, y - 10, 4, 0, 2 * Math.PI);
            ctx.fill();
            // User body
            ctx.beginPath();
            ctx.arc(x, y - 2, 7, Math.PI, 2 * Math.PI);
            ctx.fill();
        } else if (type === 'email') {
            // Envelope body
            ctx.strokeRect(x - 8, y - 11, 16, 10);
            // Envelope flap
            ctx.beginPath();
            ctx.moveTo(x - 8, y - 11);
            ctx.lineTo(x, y - 7);
            ctx.lineTo(x + 8, y - 11);
            ctx.stroke();
        } else if (type === 'phone') {
            // Phone handset (simplified handset shape)
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x - 2, y - 4, 6, 0.2, Math.PI/2 - 0.2);
            ctx.stroke();
            // Ends
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + 3, y - 4, 2, 0, 2*Math.PI);
            ctx.arc(x - 2, y + 1, 2, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    function drawSpecIcon(ctx, type, x, y) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (type === 'battery') {
            // Green Battery
            ctx.strokeStyle = '#16A34A';
            ctx.fillStyle = '#16A34A';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 8, y - 12, 14, 8);
            ctx.fillRect(x - 7, y - 11, 10, 6);
            ctx.fillRect(x + 6, y - 10, 2, 4);
        } else if (type === 'processor') {
            // Orange Processor
            ctx.strokeStyle = '#EA580C';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 7, y - 11, 12, 12);
            ctx.beginPath();
            for(let i = -5; i <= 5; i += 3) {
                ctx.moveTo(x + i, y - 13); ctx.lineTo(x + i, y - 11);
                ctx.moveTo(x + i, y + 1); ctx.lineTo(x + i, y + 3);
                ctx.moveTo(x - 9, y + i - 5); ctx.lineTo(x - 7, y + i - 5);
                ctx.moveTo(x + 5, y + i - 5); ctx.lineTo(x + 7, y + i - 5);
            }
            ctx.stroke();
            ctx.fillStyle = '#EA580C';
            ctx.fillRect(x - 4, y - 8, 6, 6);
        } else if (type === 'storage') {
            // Purple Hard Drive / SSD
            ctx.strokeStyle = '#9333EA';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 7, y - 12, 12, 13);
            ctx.beginPath();
            ctx.arc(x - 1, y - 6, 2, 0, 2*Math.PI);
            ctx.stroke();
        } else if (type === 'memory') {
            // Blue RAM Stick
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 8, y - 9, 15, 6);
            ctx.fillStyle = '#2563EB';
            ctx.fillRect(x - 6, y - 3, 2, 2);
            ctx.fillRect(x - 2, y - 3, 2, 2);
            ctx.fillRect(x + 2, y - 3, 2, 2);
        } else if (type === 'display') {
            // Blue Monitor
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 9, y - 12, 16, 11);
            ctx.beginPath();
            ctx.moveTo(x - 3, y - 1);
            ctx.lineTo(x + 1, y - 1);
            ctx.lineTo(x, y + 1);
            ctx.lineTo(x - 4, y + 1);
            ctx.stroke();
        } else if (type === 'windows') {
            // Windows / OS icon
            ctx.fillStyle = '#2563EB';
            ctx.fillRect(x - 8, y - 11, 6, 5);
            ctx.fillRect(x - 1, y - 11, 6, 5);
            ctx.fillRect(x - 8, y - 5, 6, 5);
            ctx.fillRect(x - 1, y - 5, 6, 5);
        } else {
            // Default cyan bullet
            ctx.fillStyle = '#1976D2';
            ctx.beginPath();
            ctx.arc(x, y - 5, 4, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    function drawFlyer() {
        const canvas = document.getElementById('flyerCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // 1. Limpiar canvas
        ctx.clearRect(0, 0, 1080, 1080);
        
        // 2. Fondo gris muy claro
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(0, 0, 1080, 1080);

        // === HEADER (y=0 a y=130) ===
        // Fondo blanco del header
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1080, 130);
        
        // Logo de TECNOVOA a la izquierda
        const headerX = 60;
        const headerY = 25;
        if (flyerLogoImg.complete && flyerLogoImg.naturalWidth !== 0) {
            drawBrandLogoScaled(flyerLogoImg, ctx, headerX, headerY, 300, 80);
        }
        
        // Logo del fabricante a la derecha (grande, centrado)
        if (currentBrandLogoImage && currentBrandLogoImage.complete && currentBrandLogoImage.naturalWidth !== 0) {
            const brandAreaStart = 540;
            const brandAreaEnd = 1020;
            const brandAreaCenter = brandAreaStart + (brandAreaEnd - brandAreaStart) / 2;
            drawBrandLogoScaled(currentBrandLogoImage, ctx, brandAreaCenter - 190, headerY, 380, 80);
        }

        // === BARRA DE DATOS DEL PRODUCTO (y=130 a y=170) ===
        ctx.fillStyle = '#0B1F4A';
        ctx.fillRect(0, 130, 1080, 40);
        
        const brand = document.getElementById('flyerBrand').value || 'TECNOVOA';
        const prodId = document.getElementById('flyerId').value || '';
        
        ctx.font = 'bold 15px Poppins, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'left';
        ctx.fillText('VENDOR', 60, 155);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(brand.toUpperCase(), 135, 155);
        
        if (prodId) {
            ctx.fillStyle = '#94A3B8';
            ctx.fillText('PN', 420, 155);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(prodId.toUpperCase(), 450, 155);
        }

        // === CONTENIDO PRINCIPAL (y=185) ===
        const mainY = 195;
        
        // Tarjeta contenedor de producto (con sombra suave)
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        drawRoundedRect(ctx, 60, mainY, 400, 420, 16);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Dibujar Imagen del Producto
        if (currentProductImage && currentProductImage.complete && currentProductImage.naturalWidth !== 0) {
            drawImageScaled(currentProductImage, ctx, 80, mainY + 15, 360, 390);
        }

        // === COLUMNA DERECHA: Info del producto ===
        const infoX = 510;
        const titleSecundario = document.getElementById('flyerTitleSecundario').value || '';
        
        // Titular (nombre del producto) - Empieza más arriba al quitar la marca duplicada
        ctx.font = 'bold 28px Poppins, sans-serif';
        ctx.fillStyle = '#0B1F4A';
        let nextY = wrapText(ctx, titleSecundario, infoX, mainY + 30, 500, 34);
        nextY += 25;
        
        // Especificaciones con bullets
        const specs = [
            document.getElementById('flyerSpec1').value,
            document.getElementById('flyerSpec2').value,
            document.getElementById('flyerSpec3').value,
            document.getElementById('flyerSpec4').value
        ];
        
        specs.forEach(spec => {
            if (spec && spec.trim()) {
                let type = 'default';
                let cleanSpec = spec.trim();
                cleanSpec = cleanSpec.replace(/^[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
                
                const lower = spec.toLowerCase();
                if (lower.includes('batería') || lower.includes('battery')) type = 'battery';
                else if (lower.includes('procesador') || lower.includes('cpu') || lower.includes('processor')) type = 'processor';
                else if (lower.includes('almacenamiento') || lower.includes('storage') || lower.includes('ssd') || lower.includes('disco')) type = 'storage';
                else if (lower.includes('memoria') || lower.includes('ram')) type = 'memory';
                else if (lower.includes('pantalla') || lower.includes('display') || lower.includes('screen')) type = 'display';
                else if (lower.includes('sistema') || lower.includes('windows') || lower.includes('os')) type = 'windows';

                // Bullet azul
                ctx.fillStyle = '#1976D2';
                ctx.beginPath();
                ctx.arc(infoX + 6, nextY - 4, 4, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.font = '500 16px Poppins, sans-serif';
                ctx.fillStyle = '#334155';
                ctx.fillText(cleanSpec, infoX + 20, nextY);
                nextY += 28;
            }
        });

        // === SECCIÓN PRECIO (Tarjeta compacta integrada en la columna derecha) ===
        const showPrice = document.getElementById('flyerShowPrice').checked;
        const priceVal = document.getElementById('flyerPrice').value;
        
        const priceCardY = 495;
        ctx.fillStyle = '#FFFFFF';
        drawRoundedRect(ctx, infoX, priceCardY, 510, 120, 16);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Label PRECIO + subtexto
        ctx.font = 'bold 14px Poppins, sans-serif';
        ctx.fillStyle = '#16A34A';
        ctx.textAlign = 'left';
        ctx.fillText('PRECIO', infoX + 25, priceCardY + 45);
        
        ctx.font = '12px Poppins, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Válido para stock disponible', infoX + 25, priceCardY + 68);
        
        // Valor del precio (grande, a la derecha)
        if (showPrice && priceVal && priceVal.trim()) {
            ctx.font = 'bold 46px Poppins, sans-serif';
            ctx.fillStyle = '#0B1F4A';
            ctx.textAlign = 'right';
            ctx.fillText(priceVal, infoX + 485, priceCardY + 70);
        }
        ctx.textAlign = 'left';

        // === TARJETA DE CONTACTO ===
        const contactY = 645;
        ctx.fillStyle = '#FFFFFF';
        drawRoundedRect(ctx, 60, contactY, 960, 80, 16);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Avatar con iniciales "CD"
        const avatarX = 95;
        const avatarCY = contactY + 40;
        ctx.fillStyle = '#1976D2';
        ctx.beginPath();
        ctx.arc(avatarX, avatarCY, 22, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = 'bold 16px Poppins, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('CD', avatarX, avatarCY + 6);
        ctx.textAlign = 'left';
        
        // Nombre y cargo
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.fillStyle = '#0B1F4A';
        ctx.fillText('Cristian Díaz', 130, contactY + 33);
        ctx.font = '13px Poppins, sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.fillText('Ejecutivo Comercial · Tecnovoa', 130, contactY + 52);
        
        // Teléfono y email a la derecha
        const contactPhone = document.getElementById('flyerContactPhone').value || '+569 4943 8288';
        ctx.font = '500 15px Poppins, sans-serif';
        ctx.fillStyle = '#0B1F4A';
        ctx.textAlign = 'right';
        ctx.fillText(contactPhone, 995, contactY + 33);
        ctx.fillText('cristian@tecnovoa.cl', 995, contactY + 55);
        ctx.textAlign = 'left';

        // === FOOTER EMPRESA ===
        const footerY = 755;
        ctx.fillStyle = '#FFFFFF';
        drawRoundedRect(ctx, 60, footerY, 960, 200, 16);
        ctx.fill();
        ctx.strokeStyle = '#1976D2';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.textAlign = 'center';
        
        // Título empresa
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.fillStyle = '#0B1F4A';
        ctx.fillText('TECNOVOA SPA \u2014 Soluciones en Tecnología', 540, footerY + 35);
        
        // Dirección
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('Pedro de Valdivia 273, Oficina 606, Providencia, Santiago', 540, footerY + 60);
        
        // Descripción
        ctx.font = '13px Poppins, sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('Distribución de equipos tecnológicos, infraestructura IT y soluciones empresariales.', 540, footerY + 82);
        
        // CTA verde mayúsculas
        ctx.font = 'bold 15px Poppins, sans-serif';
        ctx.fillStyle = '#16A34A';
        ctx.fillText('CONTÁCTANOS PARA COTIZACIÓN Y SOPORTE PERSONALIZADO', 540, footerY + 120);
        
        // Letra chica
        ctx.font = 'italic 11px Poppins, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Precios netos · Condiciones sujetas a cambio · Consulte con su ejecutivo comercial · Tecnovoa 2026', 540, footerY + 165);
        
        ctx.textAlign = 'left';
    }

    function drawImageScaled(img, ctx, x, y, width, height) {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const hRatio = width / img.naturalWidth;
        const vRatio = height / img.naturalHeight;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (width - img.naturalWidth * ratio) / 2;
        const centerShift_y = (height - img.naturalHeight * ratio) / 2;
        ctx.drawImage(img, 
            0, 0, img.naturalWidth, img.naturalHeight,
            x + centerShift_x, y + centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
        );
    }
    
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        return currentY;
    }
    
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    function downloadFlyer() {
        const canvas = document.getElementById('flyerCanvas');
        const link = document.createElement('a');
        link.download = `Flyer_TECNOVOA_${document.getElementById('flyerId').value || 'Producto'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    function copyFlyerToClipboard() {
        const canvas = document.getElementById('flyerCanvas');
        canvas.toBlob(blob => {
            if (!blob) {
                alert('No se pudo generar la imagen para copiar');
                return;
            }
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ])
            .then(() => {
                alert('¡Flyer copiado al portapapeles! Ya puedes pegarlo directamente en LinkedIn, WhatsApp, etc.');
            })
            .catch(err => {
                console.error('Error al copiar al portapapeles:', err);
                alert('El navegador bloqueó el copiado automático. Por favor descarga la imagen usando el botón.');
            });
        }, 'image/png');
    }
    
    // Asignar listeners para redibujar en tiempo real
    const flyerInputs = [
        'flyerBrand', 'flyerId', 'flyerTitlePrincipal', 'flyerTitleSecundario',
        'flyerSpec1', 'flyerSpec2', 'flyerSpec3', 'flyerSpec4',
        'flyerPrice', 'flyerCta', 'flyerContactPhone'
    ];
    
    flyerInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', drawFlyer);
        }
    });

    const flyerBrandInput = document.getElementById('flyerBrand');
    if (flyerBrandInput) {
        flyerBrandInput.addEventListener('input', (e) => {
            loadBrandLogoImage(e.target.value);
        });
    }

    const contactWebInput = document.getElementById('flyerContactWeb');
    if (contactWebInput) {
        contactWebInput.addEventListener('input', (e) => {
            loadQrImage(e.target.value);
            drawFlyer();
        });
    }
    
    const showPriceCheckbox = document.getElementById('flyerShowPrice');
    if (showPriceCheckbox) {
        showPriceCheckbox.addEventListener('change', drawFlyer);
    }
    
    const downloadFlyerBtn = document.getElementById('downloadFlyerBtn');
    if (downloadFlyerBtn) {
        downloadFlyerBtn.addEventListener('click', downloadFlyer);
    }
    
    const copyFlyerBtn = document.getElementById('copyFlyerBtn');
    if (copyFlyerBtn) {
        copyFlyerBtn.addEventListener('click', copyFlyerToClipboard);
    }

    // --- LÓGICA DE EDICIÓN DE PRODUCTOS ---
    window.openProductEditModal = function(pn) {
        const p = allProducts.find(prod => prod.pn === pn);
        if (!p) return;

        document.getElementById('editPn').value = p.pn;
        document.getElementById('editBrand').value = p.brand || '';
        document.getElementById('editCategory').value = p.category || '';
        document.getElementById('editName').value = p.name || '';
        document.getElementById('editStock').value = p.stock || 0;
        document.getElementById('editCostUsd').value = p.cost || 0;
        document.getElementById('editMargin').value = p.margin || 0;
        document.getElementById('editPriceUsd').value = p.price || 0;
        document.getElementById('editImage').value = p.image || '';

        document.getElementById('productEditModal').classList.add('active');
    };

    function calculateEditPrice() {
        const cost = parseFloat(document.getElementById('editCostUsd').value) || 0;
        const margin = parseFloat(document.getElementById('editMargin').value) || 0;
        const priceInput = document.getElementById('editPriceUsd');
        
        let price = cost;
        if (margin < 100) {
            price = cost / (1 - (margin / 100));
        } else {
            price = cost * (1 + (margin / 100));
        }
        priceInput.value = price.toFixed(2);
    }

    const editCostInput = document.getElementById('editCostUsd');
    const editMarginInput = document.getElementById('editMargin');
    if (editCostInput) editCostInput.addEventListener('input', calculateEditPrice);
    if (editMarginInput) editMarginInput.addEventListener('input', calculateEditPrice);

    const saveProductEditBtn = document.getElementById('saveProductEditBtn');
    if (saveProductEditBtn) {
        saveProductEditBtn.addEventListener('click', () => {
            const pn = document.getElementById('editPn').value;
            const brand = document.getElementById('editBrand').value;
            const category = document.getElementById('editCategory').value;
            const name = document.getElementById('editName').value;
            const stock = parseInt(document.getElementById('editStock').value) || 0;
            const costUsd = parseFloat(document.getElementById('editCostUsd').value) || 0;
            const margin = parseFloat(document.getElementById('editMargin').value) || 0;
            const priceUsd = parseFloat(document.getElementById('editPriceUsd').value) || 0;
            const image = document.getElementById('editImage').value;

            const updatedData = {
                pn, brand, category, name, stock, costUsd, margin, priceUsd, image
            };

            saveProductOverride(updatedData)
            .then(data => {
                if (data.status === 'success') {
                    const p = allProducts.find(prod => prod.pn === pn);
                    if (p) {
                        p.brand = brand;
                        p.category = category;
                        p.name = name;
                        p.stock = stock;
                        p.cost = costUsd;
                        p.costUsd = costUsd;
                        p.costClp = costUsd * sheetExchangeRate;
                        p.margin = margin;
                        p.price = priceUsd;
                        p.priceUsd = priceUsd;
                        p.priceClp = priceUsd * sheetExchangeRate;
                        p.image = image;
                    }
                    
                    const cartItem = cart.find(item => item.pn === pn);
                    if (cartItem) {
                        cartItem.name = name;
                        cartItem.cost = costUsd;
                        cartItem.margin = margin;
                        cartItem.price = priceUsd;
                        cartItem.brand = brand;
                    }

                    filterProducts(currentCategory, currentBrand, searchInput.value);
                    if (typeof updateCartUI === 'function') updateCartUI();
                    
                    document.getElementById('productEditModal').classList.remove('active');
                } else {
                    alert('Error al actualizar el producto: ' + data.message);
                }
            })
            .catch(err => {
                console.error('Error al actualizar producto:', err);
                alert('Error de conexión al actualizar producto');
            });
        });
    }
});
