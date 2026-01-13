document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  let tableInstance = null;

  // -- Init --
  const container = document.getElementById("filterContainer");
  const template = document.getElementById("filterRowTemplate");

  // Add one default row
  addFilterRow();

  // -- Events --
  document.getElementById("addFilterBtn").addEventListener("click", () => {
    addFilterRow();
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    currentPage = 1;
    fetchAdvancedInvoices();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    container.innerHTML = "";
    addFilterRow(); // add back one default
    currentPage = 1;
    fetchAdvancedInvoices(); 
    showToast("success", "Filters reset");
  });

  // -- Functions --

  function addFilterRow() {
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector(".filter-row");
    
    // Bind remove button
    row.querySelector(".remove-row-btn").addEventListener("click", function() {
        if(container.children.length > 1) {
            row.remove();
        } else {
            showToast("warning", "At least one filter row is required");
        }
    });

    // Bind column change to update input type
    const colSelect = row.querySelector(".filter-col");
    const valInput = row.querySelector(".filter-val");
    
    colSelect.addEventListener("change", function() {
        updateInputType(this.value, valInput);
    });

    // Initial type set (default is invoice_date -> date)
    updateInputType(colSelect.value, valInput);

    container.appendChild(row);
  }

  function updateInputType(col, inputEl) {
      inputEl.value = ""; // clear old value
      if (col === "invoice_date") {
          inputEl.type = "date";
          inputEl.placeholder = "";
      } else if (col === "amount" || col === "phone") {
          inputEl.type = "number";
          inputEl.placeholder = "0";
      } else {
          inputEl.type = "text";
          inputEl.placeholder = "Value...";
      }
  }

  function fetchAdvancedInvoices() {
    // 1. Gather filters
    const rows = container.querySelectorAll(".filter-row");
    const filters = [];

    rows.forEach(row => {
        const col = row.querySelector(".filter-col").value;
        const op = row.querySelector(".filter-op").value;
        const val = row.querySelector(".filter-val").value;

        if(val !== "") {
            filters.push({ col, op, val });
        }
    });

    /* 
    // Sending complex arrays via GET is tricky with PHP parsing standard query strings.
    // We will JSON encode the filters array and send it as a single string param.
    */
    const params = {
      page: currentPage,
      limit: 25,
      filters: JSON.stringify(filters) 
    };

    const loader = document.getElementById("searchBtn");
    const originalText = loader.innerHTML;
    loader.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    loader.disabled = true;

    apiRequest(
      "GET",
      "/api/advanced-invoices",
      params,
      false,
      (res) => {
        loader.innerHTML = originalText;
        loader.disabled = false;
        
        const data = res.data?.invoices || [];
        const total = res.pagination?.totalRecords || 0;
        
        document.getElementById("totalCount").innerText = `${total} records`;
        renderTable(data);
      },
      (xhr) => {
        loader.innerHTML = originalText;
        loader.disabled = false;
        
        let msg = "Error fetching report.";
        try {
            const r = JSON.parse(xhr.responseText);
            if(r.message) msg = r.message;
        } catch(e){}
        showToast("error", msg);
      }
    );
  }

  function renderTable(data) {
    const emptyState = document.getElementById("emptyState");

    if (!data || data.length === 0) {
        if(tableInstance) {
            tableInstance.destroy();
            tableInstance = null;
        }
        emptyState.classList.remove("d-none");
        return;
    }
    emptyState.classList.add("d-none");

    if (tableInstance) {
        tableInstance.replaceData(data);
        return;
    }

    tableInstance = new Tabulator("#advTable", {
      data: data,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 25,
      columns: [
        { title: "Date", field: "invoiceDate", width: 110, formatter: (cell) => formatTimestamp(cell.getValue(), "DD-MM-YYYY") },
        { title: "Inv #", field: "invoiceNumber", width: 100 },
        { title: "Customer", field: "name", width: 180 },
        { title: "Phone", field: "phone", width: 120 },
        { title: "Place", field: "place", width: 150 },
        { title: "Amount", field: "amount", width: 110, formatter:"money", formatterParams:{symbol:"₹"} },
        { title: "Status", field: "invoiceStatus", width: 100, formatter: (cell) => {
             const st = cell.getValue();
             return `<span class="badge ${st==='active'?'bg-success':'bg-secondary'}">${st}</span>`;
        }, htmlOutput:true },
      ],
    });
  }
});
