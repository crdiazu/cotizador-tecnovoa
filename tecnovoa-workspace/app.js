const config = {
  csvPath: document.body.dataset.csvPath,
  logoPath: document.body.dataset.logoPath,
  imageBase: document.body.dataset.imageBase || "",
};

const state = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: "Todas",
  query: "",
  quote: new Map(),
  settings: {
    globalMargin: 22,
    exchangeRate: 945,
    mode: "internal",
  },
  client: {
    name: "",
    proposal: "Propuesta comercial TECNOVOA",
    contact: "",
    email: "",
    quoteNumber: "",
    validity: "5 días hábiles",
    notes: "Valores sujetos a validación comercial, disponibilidad y confirmación final de stock.",
  },
};

const refs = {};
const atmosphere = {
  seed: 2806,
  particles: [],
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  dpr: 1,
  frameId: null,
  time: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  initializeClientDefaults();
  bindEvents();
  initAtmosphere();
  loadCatalog();
});

function cacheDom() {
  refs.ambientCanvas = document.getElementById("ambientCanvas");
  refs.searchInput = document.getElementById("searchInput");
  refs.categoryChips = document.getElementById("categoryChips");
  refs.productGrid = document.getElementById("productGrid");
  refs.catalogCount = document.getElementById("catalogCount");
  refs.visibleCount = document.getElementById("visibleCount");
  refs.categoryCount = document.getElementById("categoryCount");
  refs.stockCount = document.getElementById("stockCount");
  refs.lastUpdate = document.getElementById("lastUpdate");
  refs.freshnessLabel = document.getElementById("freshnessLabel");
  refs.insightText = document.getElementById("insightText");
  refs.toolbarSummary = document.getElementById("toolbarSummary");
  refs.activeCategoryLabel = document.getElementById("activeCategoryLabel");
  refs.heroMarginLabel = document.getElementById("heroMarginLabel");
  refs.heroFxLabel = document.getElementById("heroFxLabel");
  refs.quoteItems = document.getElementById("quoteItems");
  refs.selectedCount = document.getElementById("selectedCount");
  refs.summaryModeLabel = document.getElementById("summaryModeLabel");
  refs.costTotal = document.getElementById("costTotal");
  refs.salesTotal = document.getElementById("salesTotal");
  refs.profitTotal = document.getElementById("profitTotal");
  refs.clpTotal = document.getElementById("clpTotal");
  refs.globalMarginInput = document.getElementById("globalMarginInput");
  refs.exchangeRateInput = document.getElementById("exchangeRateInput");
  refs.clientNameInput = document.getElementById("clientNameInput");
  refs.proposalNameInput = document.getElementById("proposalNameInput");
  refs.clientContactInput = document.getElementById("clientContactInput");
  refs.clientEmailInput = document.getElementById("clientEmailInput");
  refs.quoteNumberInput = document.getElementById("quoteNumberInput");
  refs.validityInput = document.getElementById("validityInput");
  refs.clientNotesInput = document.getElementById("clientNotesInput");
  refs.calculatorOverlay = document.getElementById("calculatorOverlay");
  refs.calculatorTableBody = document.getElementById("calculatorTableBody");
  refs.calculatorItemCount = document.getElementById("calculatorItemCount");
  refs.calculatorSalesTotal = document.getElementById("calculatorSalesTotal");
  refs.calculatorProfitTotal = document.getElementById("calculatorProfitTotal");
  refs.modalCostTotal = document.getElementById("modalCostTotal");
  refs.modalSalesTotal = document.getElementById("modalSalesTotal");
  refs.modalProfitTotal = document.getElementById("modalProfitTotal");
  refs.modalClpTotal = document.getElementById("modalClpTotal");
  refs.previewOverlay = document.getElementById("previewOverlay");
  refs.previewSheet = document.getElementById("previewSheet");
  refs.flyerOverlay = document.getElementById("flyerOverlay");
  refs.flyerPoints = document.getElementById("flyerPoints");
  refs.toast = document.getElementById("toast");
}

function initializeClientDefaults() {
  state.client.quoteNumber = buildQuoteNumber();
  refs.proposalNameInput.value = state.client.proposal;
  refs.quoteNumberInput.value = state.client.quoteNumber;
  refs.validityInput.value = state.client.validity;
  refs.clientNotesInput.value = state.client.notes;
  refs.globalMarginInput.value = String(state.settings.globalMargin);
  refs.exchangeRateInput.value = String(state.settings.exchangeRate);
  refs.heroMarginLabel.textContent = `${state.settings.globalMargin}%`;
  refs.heroFxLabel.textContent = formatCurrency(state.settings.exchangeRate, "CLP", 0);
}

function bindEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    filterProducts();
  });

  refs.productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-code]");
    if (!button) return;
    addToQuote(button.dataset.addCode);
  });

  refs.quoteItems.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;
    handleCartAction(actionButton.dataset.cartAction, actionButton.dataset.code);
  });

  refs.calculatorTableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-table-action]");
    if (!actionButton) return;
    handleTableAction(actionButton.dataset.tableAction, actionButton.dataset.code);
  });

  refs.calculatorTableBody.addEventListener("change", handleTableFieldChange);

  refs.globalMarginInput.addEventListener("input", (event) => {
    const nextValue = Math.max(0, sanitizeNumber(event.target.value, state.settings.globalMargin));
    state.settings.globalMargin = nextValue;
    refs.heroMarginLabel.textContent = `${nextValue}%`;
    applyGlobalMarginToQuote();
    renderProducts();
    renderQuote();
  });

  refs.exchangeRateInput.addEventListener("input", (event) => {
    const nextValue = Math.max(1, sanitizeNumber(event.target.value, state.settings.exchangeRate));
    state.settings.exchangeRate = nextValue;
    refs.heroFxLabel.textContent = formatCurrency(nextValue, "CLP", 0);
    renderQuote();
  });

  bindClientInput(refs.clientNameInput, "name");
  bindClientInput(refs.proposalNameInput, "proposal");
  bindClientInput(refs.clientContactInput, "contact");
  bindClientInput(refs.clientEmailInput, "email");
  bindClientInput(refs.quoteNumberInput, "quoteNumber");
  bindClientInput(refs.validityInput, "validity");
  bindClientInput(refs.clientNotesInput, "notes");

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
  document.getElementById("loadSuggestedBtn").addEventListener("click", loadSuggestedSelection);
  document.getElementById("reseedAtmosphereBtn").addEventListener("click", reseedAtmosphere);
  document.getElementById("quickOpenPreviewBtn").addEventListener("click", () => openQuotePreview(false));
  document.getElementById("openCalculatorBtn").addEventListener("click", openCalculator);
  document.getElementById("closeCalculatorBtn").addEventListener("click", closeCalculator);
  document.getElementById("previewFromModalBtn").addEventListener("click", () => openQuotePreview(false));
  document.getElementById("exportPdfBtn").addEventListener("click", () => openQuotePreview(true));
  document.getElementById("closePreviewBtn").addEventListener("click", closePreview);
  document.getElementById("printPreviewBtn").addEventListener("click", () => window.print());
  document.getElementById("flyerBtn").addEventListener("click", openFlyerOverlay);
  document.getElementById("flyerFromModalBtn").addEventListener("click", openFlyerOverlay);
  document.getElementById("closeFlyerBtn").addEventListener("click", closeFlyerOverlay);
  document.getElementById("flyerConfirmBtn").addEventListener("click", () => {
    closeFlyerOverlay();
    showToast("Brief de flyer marcado como listo.");
  });
  document.getElementById("crmBtn").addEventListener("click", registerCRM);

  document.querySelectorAll("[data-close-calculator='true']").forEach((node) => {
    node.addEventListener("click", closeCalculator);
  });
  document.querySelectorAll("[data-close-preview='true']").forEach((node) => {
    node.addEventListener("click", closePreview);
  });
  document.querySelectorAll("[data-close-flyer='true']").forEach((node) => {
    node.addEventListener("click", closeFlyerOverlay);
  });

  document.querySelectorAll(".mode-btn[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closePreview();
    closeFlyerOverlay();
    closeCalculator();
  });
}

function bindClientInput(node, field) {
  node.addEventListener("input", (event) => {
    state.client[field] = event.target.value.trim();
    if (!refs.previewOverlay.classList.contains("hidden")) {
      fillPreviewSheet();
    }
  });
}

async function loadCatalog() {
  try {
    refs.toolbarSummary.textContent = "Cargando catálogo desde CSV...";
    const response = await fetch(config.csvPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`No fue posible cargar el CSV (${response.status})`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    state.products = rows.map(mapProduct).filter(Boolean);
    state.categories = Array.from(new Set(state.products.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "es"));
    updateCatalogMeta();
    filterProducts();
    showToast("Catálogo listo para cotizar.");
  } catch (error) {
    console.error(error);
    refs.productGrid.innerHTML = `
      <article class="empty-state">
        <h3>No se pudo cargar el catálogo</h3>
        <p>Este prototipo requiere acceso al archivo <strong>${escapeHtml(config.csvPath)}</strong> desde un entorno servido por navegador.</p>
      </article>
    `;
    refs.toolbarSummary.textContent = "Error al leer productos.csv";
    refs.freshnessLabel.textContent = "Sin conexión";
    refs.insightText.textContent = "No fue posible analizar el catálogo. Verifica la ruta del CSV.";
  }
}

function parseCSV(text) {
  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  const [header = [], ...body] = rows;
  return body.map((cells) => {
    const entry = {};
    header.forEach((key, index) => {
      entry[key.trim()] = (cells[index] || "").trim();
    });
    return entry;
  });
}

function mapProduct(row) {
  const code = row.PN || "";
  const name = row.Producto || "";
  if (!code && !name) return null;

  const price = Number.parseFloat(row.Precio || "0");
  const stock = Number.parseInt(row.Stock || "0", 10);
  const safeStock = Number.isFinite(stock) ? stock : 0;

  return {
    code,
    name,
    description: name,
    brand: inferBrand(name),
    unit: "UN",
    category: row.Categoria || "Sin categoría",
    stock: safeStock,
    cost: Number.isFinite(price) ? price : 0,
    image: resolveImagePath(row.Imagen || ""),
    updatedAt: row.FechaActualizacion || "",
    availability: availabilityFromStock(safeStock),
    comments: "",
  };
}

function resolveImagePath(imagePath) {
  if (!imagePath) return `${config.imageBase}img/mockup_monitor.png`;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith("../")) return imagePath;
  if (imagePath.startsWith("img/")) return `${config.imageBase}${imagePath}`;
  return imagePath;
}

function inferBrand(name) {
  const cleanName = String(name || "").trim();
  if (!cleanName) return "N/D";
  return cleanName.split(/\s+/)[0];
}

function availabilityFromStock(stock) {
  if (stock > 20) return "Disponible";
  if (stock > 0) return `Stock limitado (${stock})`;
  return "Por confirmar";
}

function updateCatalogMeta() {
  const sortedDates = state.products
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a));

  const lastDate = sortedDates[0];
  refs.catalogCount.textContent = `${state.products.length} productos`;
  refs.categoryCount.textContent = String(state.categories.length);
  refs.lastUpdate.textContent = lastDate ? formatDate(lastDate) : "Sin fecha";
  refs.freshnessLabel.textContent = lastDate ? "Al día" : "Sin fecha";
  updateInsight();
}

function renderCategories() {
  const categories = ["Todas", ...state.categories];
  refs.categoryChips.innerHTML = categories
    .map((category) => {
      const activeClass = category === state.selectedCategory ? "active" : "";
      return `<button class="chip ${activeClass}" type="button" data-category="${escapeAttribute(category)}">${escapeHtml(category)}</button>`;
    })
    .join("");

  refs.categoryChips.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.dataset.category;
      filterProducts();
    });
  });
}

function filterProducts() {
  const query = normalizeText(state.query);
  state.filteredProducts = state.products.filter((product) => {
    const matchesCategory = state.selectedCategory === "Todas" || product.category === state.selectedCategory;
    const haystack = normalizeText(`${product.code} ${product.name} ${product.category} ${product.brand}`);
    const matchesQuery = !query || haystack.includes(query);
    return matchesCategory && matchesQuery;
  });

  refs.activeCategoryLabel.textContent = state.selectedCategory;
  refs.visibleCount.textContent = String(state.filteredProducts.length);
  refs.stockCount.textContent = String(state.filteredProducts.reduce((acc, item) => acc + item.stock, 0));
  refs.toolbarSummary.textContent = `${state.filteredProducts.length} visibles de ${state.products.length} productos cargados`;
  renderCategories();
  renderProducts();
}

function renderProducts() {
  if (!state.filteredProducts.length) {
    refs.productGrid.innerHTML = `
      <article class="empty-state">
        <h3>Sin coincidencias</h3>
        <p>Ajusta la búsqueda o cambia de categoría para volver a poblar el catálogo.</p>
      </article>
    `;
    return;
  }

  refs.productGrid.innerHTML = state.filteredProducts
    .map((product) => {
      const defaultPrice = computeSalePrice(product.cost, state.settings.globalMargin);
      return `
        <article class="product-card">
          <div class="product-card-top">
            <div class="product-image-wrap">
              <img class="product-image" src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}">
            </div>
            <div>
              <div class="product-header">
                <span class="product-category">${escapeHtml(product.category)}</span>
                <span class="product-code">${escapeHtml(product.code)}</span>
              </div>
              <h3 class="product-title">${escapeHtml(product.name)}</h3>
              <div class="product-meta">
                <span>${escapeHtml(product.brand)}</span>
                <span>Stock ${product.stock}</span>
                <span>${formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
          <div class="product-footer">
            <div class="price-stack">
              <strong>${formatCurrency(defaultPrice, "USD")}</strong>
              <span>Costo ${formatCurrency(product.cost, "USD")} · margen base aplicado</span>
            </div>
            <button class="primary-btn" type="button" data-add-code="${escapeAttribute(product.code)}">Agregar</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function addToQuote(code) {
  const product = state.products.find((item) => item.code === code);
  if (!product) return;

  const existing = state.quote.get(code);
  if (existing) {
    existing.qty += 1;
  } else {
    state.quote.set(code, {
      ...product,
      qty: 1,
      margin: state.settings.globalMargin,
    });
  }

  renderQuote();
  updateInsight();
  showToast(`${product.name} agregado al pedido.`);
}

function renderQuote() {
  const items = getQuoteItems();
  const totalQty = items.reduce((acc, item) => acc + item.qty, 0);

  refs.selectedCount.textContent = `${totalQty} ítems`;
  refs.summaryModeLabel.textContent = state.settings.mode === "client" ? "Vista cliente" : "Vista interna";

  renderMiniCart(items);
  renderCalculatorTable(items);
  updateSummary(items);

  if (!refs.previewOverlay.classList.contains("hidden")) {
    fillPreviewSheet();
  }
}

function renderMiniCart(items) {
  if (!items.length) {
    refs.quoteItems.innerHTML = `
      <div class="quote-empty">
        <h3>Sin selección</h3>
        <p>Agrega productos desde el catálogo para abrir el cotizador detallado.</p>
      </div>
    `;
    return;
  }

  refs.quoteItems.innerHTML = items
    .map((item) => {
      const totals = calculateLine(item);
      return `
        <article class="mini-cart-item">
          <div class="mini-cart-top">
            <div>
              <h3>${escapeHtml(item.name)}</h3>
              <div class="mini-cart-meta">
                <span class="code-text">${escapeHtml(item.code)}</span>
                <span>${escapeHtml(item.brand)}</span>
                <span>${escapeHtml(item.availability)}</span>
              </div>
            </div>
            <button class="icon-btn" type="button" title="Abrir calculadora" data-cart-action="open" data-code="${escapeAttribute(item.code)}">+</button>
          </div>
          <div class="mini-cart-controls">
            <div class="qty-control">
              <button class="qty-btn" type="button" data-cart-action="decrease" data-code="${escapeAttribute(item.code)}">−</button>
              <strong>${item.qty}</strong>
              <button class="qty-btn" type="button" data-cart-action="increase" data-code="${escapeAttribute(item.code)}">+</button>
            </div>
            <div class="mini-cart-total">
              <small>Subtotal</small>
              <strong>${formatCurrency(totals.subtotal, "USD")}</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCalculatorTable(items) {
  refs.calculatorItemCount.textContent = String(items.reduce((acc, item) => acc + item.qty, 0));

  if (!items.length) {
    refs.calculatorTableBody.innerHTML = `
      <tr>
        <td colspan="13">
          <div class="table-empty">Agrega productos desde el catálogo para editar la cotización.</div>
        </td>
      </tr>
    `;
    return;
  }

  refs.calculatorTableBody.innerHTML = items
    .map((item) => {
      const totals = calculateLine(item);
      return `
        <tr>
          <td>
            <input class="table-input short" type="number" min="1" step="1" value="${item.qty}" data-field="qty" data-code="${escapeAttribute(item.code)}">
          </td>
          <td>
            <input class="table-input short" type="text" value="${escapeAttribute(item.unit)}" data-field="unit" data-code="${escapeAttribute(item.code)}">
          </td>
          <td>
            <div class="code-text">${escapeHtml(item.code)}</div>
          </td>
          <td>
            <input class="table-input medium" type="text" value="${escapeAttribute(item.brand)}" data-field="brand" data-code="${escapeAttribute(item.code)}">
          </td>
          <td>
            <textarea class="table-textarea" rows="2" data-field="description" data-code="${escapeAttribute(item.code)}">${escapeHtml(item.description)}</textarea>
          </td>
          <td class="numeric internal-only">
            <div class="table-value">${formatCurrency(item.cost, "USD")}</div>
          </td>
          <td class="numeric internal-only">
            <div class="table-value">${formatCurrency(totals.costTotal, "USD")}</div>
          </td>
          <td class="numeric internal-only">
            <input class="table-input short" type="number" min="0" step="1" value="${item.margin}" data-field="margin" data-code="${escapeAttribute(item.code)}">
          </td>
          <td class="numeric">
            <div class="table-value">${formatCurrency(totals.salePrice, "USD")}</div>
          </td>
          <td class="numeric">
            <div class="table-value">${formatCurrency(totals.subtotal, "USD")}</div>
          </td>
          <td>
            <input class="table-input" type="text" value="${escapeAttribute(item.availability)}" data-field="availability" data-code="${escapeAttribute(item.code)}">
          </td>
          <td>
            <textarea class="table-textarea" rows="2" data-field="comments" data-code="${escapeAttribute(item.code)}">${escapeHtml(item.comments)}</textarea>
          </td>
          <td>
            <button class="remove-row-btn" type="button" data-table-action="remove" data-code="${escapeAttribute(item.code)}">×</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function handleCartAction(action, code) {
  if (action === "open") {
    openCalculator();
    return;
  }

  const item = state.quote.get(code);
  if (!item) return;

  if (action === "increase") {
    item.qty += 1;
  }

  if (action === "decrease") {
    item.qty -= 1;
    if (item.qty <= 0) {
      state.quote.delete(code);
    }
  }

  renderQuote();
  updateInsight();
}

function handleTableAction(action, code) {
  if (action !== "remove") return;
  state.quote.delete(code);
  renderQuote();
  updateInsight();
}

function handleTableFieldChange(event) {
  const field = event.target.dataset.field;
  const code = event.target.dataset.code;
  if (!field || !code) return;

  const item = state.quote.get(code);
  if (!item) return;

  if (field === "qty") {
    item.qty = Math.max(1, sanitizeNumber(event.target.value, item.qty));
  } else if (field === "margin") {
    item.margin = Math.max(0, sanitizeNumber(event.target.value, item.margin));
  } else {
    item[field] = event.target.value.trim();
  }

  renderQuote();
}

function updateSummary(items) {
  const totals = items.reduce(
    (acc, item) => {
      const line = calculateLine(item);
      acc.cost += line.costTotal;
      acc.sales += line.subtotal;
      return acc;
    },
    { cost: 0, sales: 0 }
  );

  const profit = totals.sales - totals.cost;
  const totalClp = totals.sales * state.settings.exchangeRate;

  refs.costTotal.textContent = formatCurrency(totals.cost, "USD");
  refs.salesTotal.textContent = formatCurrency(totals.sales, "USD");
  refs.profitTotal.textContent = formatCurrency(profit, "USD");
  refs.clpTotal.textContent = formatCurrency(totalClp, "CLP", 0);

  refs.calculatorSalesTotal.textContent = formatCurrency(totals.sales, "USD");
  refs.calculatorProfitTotal.textContent = formatCurrency(profit, "USD");
  refs.modalCostTotal.textContent = formatCurrency(totals.cost, "USD");
  refs.modalSalesTotal.textContent = formatCurrency(totals.sales, "USD");
  refs.modalProfitTotal.textContent = formatCurrency(profit, "USD");
  refs.modalClpTotal.textContent = formatCurrency(totalClp, "CLP", 0);
}

function setMode(mode) {
  state.settings.mode = mode === "client" ? "client" : "internal";
  document.body.classList.toggle("client-view", state.settings.mode === "client");
  document.querySelectorAll(".mode-btn[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.settings.mode);
  });
  refs.summaryModeLabel.textContent = state.settings.mode === "client" ? "Vista cliente" : "Vista interna";
  renderQuote();
}

function applyGlobalMarginToQuote() {
  state.quote.forEach((item) => {
    item.margin = state.settings.globalMargin;
  });
}

function openCalculator() {
  if (!state.quote.size) {
    showToast("Agrega al menos un producto para abrir el cotizador.");
    return;
  }
  refs.calculatorOverlay.classList.remove("hidden");
  refs.calculatorOverlay.setAttribute("aria-hidden", "false");
}

function closeCalculator() {
  refs.calculatorOverlay.classList.add("hidden");
  refs.calculatorOverlay.setAttribute("aria-hidden", "true");
}

function openQuotePreview(autoPrint) {
  if (!state.quote.size) {
    showToast("Agrega al menos un producto para generar la cotización.");
    return;
  }

  fillPreviewSheet();
  refs.previewOverlay.classList.remove("hidden");
  refs.previewOverlay.setAttribute("aria-hidden", "false");

  if (autoPrint) {
    showToast("Preparando hoja para exportación PDF.");
    window.setTimeout(() => {
      window.print();
    }, 180);
  }
}

function closePreview() {
  refs.previewOverlay.classList.add("hidden");
  refs.previewOverlay.setAttribute("aria-hidden", "true");
}

function fillPreviewSheet() {
  const items = getQuoteItems();
  const totals = items.reduce(
    (acc, item) => {
      const line = calculateLine(item);
      acc.cost += line.costTotal;
      acc.sales += line.subtotal;
      return acc;
    },
    { cost: 0, sales: 0 }
  );

  const totalClp = totals.sales * state.settings.exchangeRate;
  const profit = totals.sales - totals.cost;
  const issueDate = formatDate(new Date().toISOString());
  const clientName = state.client.name || "Cliente por confirmar";
  const proposal = state.client.proposal || "Propuesta comercial TECNOVOA";
  const quoteNumber = state.client.quoteNumber || buildQuoteNumber();

  refs.previewSheet.innerHTML = `
    <section class="preview-topbar">
      <div class="preview-topbar-grid">
        <div class="preview-brand-block">
          <img src="${escapeAttribute(config.logoPath)}" alt="TECNOVOA">
          <h3>${escapeHtml(proposal)}</h3>
          <p>Cotización estructurada para revisión comercial y entrega a cliente.</p>
        </div>
        <div class="preview-meta-box">
          <div class="preview-meta-row">
            <span class="preview-meta-label">N° cotización</span>
            <strong>${escapeHtml(quoteNumber)}</strong>
          </div>
          <div class="preview-meta-row">
            <span class="preview-meta-label">Fecha</span>
            <strong>${escapeHtml(issueDate)}</strong>
          </div>
          <div class="preview-meta-row">
            <span class="preview-meta-label">Modo</span>
            <strong>${state.settings.mode === "client" ? "Cliente" : "Interno"}</strong>
          </div>
          <div class="preview-meta-row">
            <span class="preview-meta-label">Tipo cambio</span>
            <strong>${formatCurrency(state.settings.exchangeRate, "CLP", 0)}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="preview-body">
      <div class="preview-client-grid">
        <div class="preview-card">
          <span class="preview-meta-label">Cliente</span>
          <strong>${escapeHtml(clientName)}</strong>
        </div>
        <div class="preview-card">
          <span class="preview-meta-label">Contacto</span>
          <strong>${escapeHtml(state.client.contact || "Por confirmar")}</strong>
        </div>
        <div class="preview-card">
          <span class="preview-meta-label">Correo</span>
          <strong>${escapeHtml(state.client.email || "Por confirmar")}</strong>
        </div>
        <div class="preview-card">
          <span class="preview-meta-label">Validez</span>
          <strong>${escapeHtml(state.client.validity || "Por confirmar")}</strong>
        </div>
      </div>

      <table class="preview-table">
        <thead>
          <tr>
            <th>Cant.</th>
            <th>U/M</th>
            <th>P/N</th>
            <th>Marca</th>
            <th>Descripción</th>
            ${state.settings.mode === "internal" ? '<th class="numeric">Costo unit.</th><th class="numeric">Costo total</th><th class="numeric">Margen %</th>' : ""}
            <th class="numeric">PVP unit.</th>
            <th class="numeric">Subtotal</th>
            <th>Disponibilidad</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map((item) => {
              const line = calculateLine(item);
              return `
                <tr>
                  <td class="numeric">${item.qty}</td>
                  <td>${escapeHtml(item.unit)}</td>
                  <td class="preview-code">${escapeHtml(item.code)}</td>
                  <td>${escapeHtml(item.brand)}</td>
                  <td class="preview-description">
                    <strong>${escapeHtml(item.description)}</strong>
                    ${item.comments ? `<div class="preview-mini">${escapeHtml(item.comments)}</div>` : ""}
                  </td>
                  ${state.settings.mode === "internal" ? `<td class="numeric">${formatCurrency(item.cost, "USD")}</td><td class="numeric">${formatCurrency(line.costTotal, "USD")}</td><td class="numeric">${item.margin}%</td>` : ""}
                  <td class="numeric">${formatCurrency(line.salePrice, "USD")}</td>
                  <td class="numeric">${formatCurrency(line.subtotal, "USD")}</td>
                  <td>${escapeHtml(item.availability)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>

      <div class="preview-summary">
        ${state.settings.mode === "internal" ? `<div class="preview-summary-row"><span>Costo base</span><strong>${formatCurrency(totals.cost, "USD")}</strong></div>` : ""}
        <div class="preview-summary-row"><span>Total venta USD</span><strong>${formatCurrency(totals.sales, "USD")}</strong></div>
        <div class="preview-summary-row"><span>Total referencial CLP</span><strong>${formatCurrency(totalClp, "CLP", 0)}</strong></div>
        ${state.settings.mode === "internal" ? `<div class="preview-summary-row"><span>Utilidad estimada</span><strong>${formatCurrency(profit, "USD")}</strong></div>` : ""}
        <div class="preview-summary-row total"><span>Total propuesta</span><strong>${formatCurrency(totals.sales, "USD")}</strong></div>
      </div>

      <div class="preview-footer">
        <strong>Observaciones:</strong> ${escapeHtml(state.client.notes || "Valores sujetos a validación comercial, disponibilidad y confirmación final de stock.")}
      </div>
    </section>
  `;
}

function openFlyerOverlay() {
  const items = getQuoteItems();
  refs.flyerPoints.innerHTML = items.length
    ? items
        .slice(0, 5)
        .map((item) => `<li>${escapeHtml(item.name)} · ${escapeHtml(item.code)} · ${formatCurrency(calculateLine(item).salePrice, "USD")}</li>`)
        .join("")
    : "<li>Selecciona productos para generar una sugerencia de campaña.</li>";

  refs.flyerOverlay.classList.remove("hidden");
  refs.flyerOverlay.setAttribute("aria-hidden", "false");
}

function closeFlyerOverlay() {
  refs.flyerOverlay.classList.add("hidden");
  refs.flyerOverlay.setAttribute("aria-hidden", "true");
}

function registerCRM() {
  const items = getQuoteItems();
  if (!items.length) {
    showToast("No hay ítems para registrar.");
    return;
  }

  const payload = {
    createdAt: new Date().toISOString(),
    client: { ...state.client },
    settings: { ...state.settings },
    items: items.map((item) => ({
      code: item.code,
      description: item.description,
      qty: item.qty,
      margin: item.margin,
      salePrice: calculateLine(item).salePrice,
      subtotal: calculateLine(item).subtotal,
    })),
  };

  localStorage.setItem("tecnovoa.crmDraft", JSON.stringify(payload));
  showToast("Borrador registrado en CRM local.");
}

function loadSuggestedSelection() {
  if (!state.products.length) return;

  suggestBundle().forEach((product) => {
    if (!product) return;
    state.quote.set(product.code, {
      ...product,
      qty: 1,
      margin: state.settings.globalMargin,
    });
  });

  renderQuote();
  updateInsight();
  showToast("Selección sugerida cargada.");
}

function suggestBundle() {
  const preferredCategories = ["Monitores", "Periféricos", "Audio", "Docks & Adaptadores", "Cables & Red"];
  return preferredCategories
    .map((category) => state.products.find((product) => product.category === category))
    .filter(Boolean);
}

function clearFilters() {
  state.query = "";
  state.selectedCategory = "Todas";
  refs.searchInput.value = "";
  filterProducts();
}

function getQuoteItems() {
  return Array.from(state.quote.values());
}

function calculateLine(item) {
  const salePrice = computeSalePrice(item.cost, item.margin);
  const costTotal = item.cost * item.qty;
  const subtotal = salePrice * item.qty;
  return {
    salePrice,
    costTotal,
    subtotal,
  };
}

function updateInsight() {
  const items = getQuoteItems();
  if (!items.length) {
    const leadCategory = state.categories[0] || "catálogo";
    refs.insightText.textContent = `La categoría ${leadCategory} puede iniciar una propuesta rápida con accesorios de cierre.`;
    return;
  }

  const categories = Array.from(new Set(items.map((item) => item.category)));
  if (!categories.includes("Cables & Red")) {
    refs.insightText.textContent = "Sugerencia: agrega conectividad o accesorios para cerrar la propuesta.";
    return;
  }

  refs.insightText.textContent = `La selección actual cubre ${categories.length} categorías y ya está lista para cotización detallada.`;
}

function computeSalePrice(cost, margin) {
  return cost * (1 + margin / 100);
}

function buildQuoteNumber() {
  const today = new Date();
  const stamp = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  return `TEC-${stamp}-01`;
}

function sanitizeNumber(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatCurrency(value, currency, decimals = 2) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function initAtmosphere() {
  atmosphere.canvas = refs.ambientCanvas;
  if (!atmosphere.canvas) return;

  atmosphere.ctx = atmosphere.canvas.getContext("2d");
  resizeAtmosphere();
  buildAtmosphereParticles();
  drawAtmosphere();

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeAtmosphere();
      buildAtmosphereParticles();
    }, 100);
  });
}

function resizeAtmosphere() {
  atmosphere.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  atmosphere.width = window.innerWidth;
  atmosphere.height = window.innerHeight;
  atmosphere.canvas.width = Math.floor(atmosphere.width * atmosphere.dpr);
  atmosphere.canvas.height = Math.floor(atmosphere.height * atmosphere.dpr);
  atmosphere.canvas.style.width = `${atmosphere.width}px`;
  atmosphere.canvas.style.height = `${atmosphere.height}px`;
  atmosphere.ctx.setTransform(atmosphere.dpr, 0, 0, atmosphere.dpr, 0, 0);
}

function buildAtmosphereParticles() {
  const random = createSeededRandom(atmosphere.seed);
  const particleCount = Math.max(16, Math.round((atmosphere.width * atmosphere.height) / 90000));
  atmosphere.particles = Array.from({ length: particleCount }, () => ({
    x: random() * atmosphere.width,
    y: random() * atmosphere.height,
    prevX: 0,
    prevY: 0,
    speed: 0.15 + random() * 0.45,
    width: 0.35 + random() * 0.65,
    life: 100 + Math.floor(random() * 220),
  }));
}

function drawAtmosphere() {
  if (!atmosphere.ctx) return;

  const ctx = atmosphere.ctx;
  ctx.clearRect(0, 0, atmosphere.width, atmosphere.height);
  atmosphere.time += 1;

  atmosphere.particles.forEach((particle, index) => {
    particle.prevX = particle.x;
    particle.prevY = particle.y;

    const angle = sampleField(particle.x, particle.y, atmosphere.time, atmosphere.seed, index);
    particle.x += Math.cos(angle) * particle.speed;
    particle.y += Math.sin(angle) * particle.speed;
    particle.life -= 1;

    if (particle.x < -30 || particle.x > atmosphere.width + 30 || particle.y < -30 || particle.y > atmosphere.height + 30 || particle.life <= 0) {
      respawnParticle(particle, index);
    }

    ctx.beginPath();
    ctx.moveTo(particle.prevX, particle.prevY);
    ctx.lineTo(particle.x, particle.y);
    ctx.strokeStyle = "rgba(15, 92, 168, 0.12)";
    ctx.lineWidth = particle.width;
    ctx.stroke();
  });

  atmosphere.frameId = window.requestAnimationFrame(drawAtmosphere);
}

function sampleField(x, y, time, seed, index) {
  const scaleA = 0.0014;
  const scaleB = 0.002;
  const drift = time * 0.0012;
  return Math.sin(x * scaleA + seed * 0.0002 + drift) + Math.cos(y * scaleB + index * 0.13);
}

function respawnParticle(particle, index) {
  const random = createSeededRandom(atmosphere.seed + index * 17 + atmosphere.time);
  particle.x = random() * atmosphere.width;
  particle.y = random() * atmosphere.height;
  particle.prevX = particle.x;
  particle.prevY = particle.y;
  particle.speed = 0.15 + random() * 0.45;
  particle.width = 0.35 + random() * 0.65;
  particle.life = 100 + Math.floor(random() * 220);
}

function reseedAtmosphere() {
  atmosphere.seed = Math.floor(Math.random() * 100000);
  atmosphere.time = 0;
  buildAtmosphereParticles();
  showToast("Fondo ambiental reajustado.");
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

let toastTimer;
function showToast(message) {
  refs.toast.textContent = message;
  refs.toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    refs.toast.classList.remove("visible");
  }, 2200);
}
