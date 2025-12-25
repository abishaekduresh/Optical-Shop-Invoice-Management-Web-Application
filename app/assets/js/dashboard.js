$(document).ready(function () {
  const DASHBOARD_KEY = "dashboardStats";
  // Default isHidden to true (hide by default)
  let isHidden = true;

  // ================== RENDERERS ==================
  function renderRecentInvoices(invoices = []) {
    const container = $("#recentInvoicesContainer");
    $(".recentInvoicesCount").text(invoices.length);

    container.empty();

    if (!invoices.length) {
      container.html(
        `<div class="col-12 text-center text-muted py-3">No recent invoices found.</div>`
      );
      return;
    }

    invoices.forEach((inv) => {
      const card = `
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card border-0 shadow-sm h-100 rounded-4">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span class="badge text-white fw-semibold px-3 py-2 rounded-pill shadow-sm" 
                    style="background: linear-gradient(90deg, #007bff, #0056b3); font-size: 0.85rem;">
                #${inv.invoiceNumber}
              </span>
            </div>
            <div class="text-end small text-secondary lh-sm">
              <div>
                <i class="fa fa-calendar me-1"></i>${inv.invoiceDate}
              </div>
              <div class="mt-1">
                <i class="fa fa-map-marker-alt me-1 text-danger"></i>${(
                  inv.place || "—"
                ).toUpperCase()}
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <h6 class="fw-bold text-dark mb-0">
              <i class="fa fa-user me-2 text-secondary"></i>${inv.name}
            </h6>
            <h5 class="fw-bold text-success mb-0">
              ₹${isHidden ? "****" : parseFloat(inv.amount).toLocaleString()}
            </h5>
          </div>
        </div>
      </div>
    </div>`;
      container.append(card);
    });
  }

  function renderDashboard(summary, invoices) {
    if (!summary) return;

    const mask = (val) => (isHidden ? "******" : val);

    $("#totalInvoices").text(summary.totalInvoices ?? 0);
    $("#todayInvoices").text(summary.todayInvoices ?? 0);
    $("#totalBusiness").text(summary.totalBusiness ?? 0);
    $("#totalLogs").text(summary.totalLogs ?? 0);
    
    // Mask sensitive sales data
    $("#totalSales").text(mask(summary.totalSales ?? "0.00"));
    $("#todaySales").text(mask(summary.todaySales ?? "0.00"));
    $("#yesterdaySales").text(mask(summary.yesterdaySales ?? "0.00"));
    $("#yesterdayInvoices").text(summary.yesterdayInvoices ?? 0);

    // Update charts visibility
    updateChartVisibility();

    renderRecentInvoices(invoices || []);
  }



  function renderCharts(chart) {
    if (!chart || !chart.labels) return;

    const { labels, sales, invoices, period, fromDate, toDate } = chart;

    $("#chartPeriodLabel").text(
      `Showing ${period?.toUpperCase() || ""} data${
        fromDate && toDate ? ` (${fromDate} → ${toDate})` : ""
      }`
    );

    if (window.salesChartInstance) window.salesChartInstance.destroy();
    if (window.invoiceChartInstance) window.invoiceChartInstance.destroy();

    const salesCtx = document.getElementById("salesChart");
    const invoiceCtx = document.getElementById("invoiceChart");

    // Sales chart
    window.salesChartInstance = new Chart(salesCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Sales (₹)",
            data: sales,
            backgroundColor: "rgba(13, 110, 253, 0.7)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    // Invoice chart
    window.invoiceChartInstance = new Chart(invoiceCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Invoices",
            data: invoices,
            borderColor: "#198754",
            fill: true,
            backgroundColor: "rgba(25,135,84,0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    updateChartVisibility();
  }

  function updateChartVisibility() {
    const filter = isHidden ? "blur(6px)" : "none";
    if (window.salesChartInstance) {
      window.salesChartInstance.canvas.style.filter = filter;
      window.salesChartInstance.canvas.style.transition = "filter 0.3s ease";
    }
  }

  // ================== FETCH DASHBOARD DATA ==================
  function fetchDashboardData(showToast = true) {
    const period = $("#periodSelect").val() || "today";
    const fromDate = $("#fromDate").val();
    const toDate = $("#toDate").val();

    const params = { period, limit: 6 };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    apiRequest(
      "GET",
      "/api/business/stats",
      params,
      false,
      function (res) {
        if (res.status && res.data) {
          const summary = res.data.summary || {};
          const chart = res.data.chart || {};
          const invoices = res.data.recentInvoices || [];

          // Save to session
          sessionStorage.setItem(DASHBOARD_KEY, JSON.stringify(res.data));

          renderDashboard(summary, invoices);
          renderCharts(chart);
        } else {
          Swal.fire({
            toast: true,
            icon: "error",
            text: res.message || "No dashboard data found",
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        }
      },
      function () {
        Swal.fire({
          toast: true,
          icon: "error",
          text: "Failed to load dashboard data",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    );
  }

  // ================== EVENT HANDLERS ==================
  $("#refreshDashboardBtn").click(function () {
    const $btn = $(this);
    $btn.prop("disabled", true).html('<i class="fa fa-spinner fa-spin"></i>'); //  Refreshing...

    fetchDashboardData();

    // Use unique timeout key
    setUniqueTimeout(
      "refreshDashboard",
      () => {
        $btn.prop("disabled", false).html('<i class="fa fa-refresh me-1"></i>'); // Refresh
      },
      1500
    );
  });

  $("#applyFilterBtn").click(function () {
    const $btn = $(this);
    $btn.prop("disabled", true).html('<i class="fa fa-spinner fa-spin"></i>'); // Applying...

    fetchDashboardData();

    // Use unique timeout key
    setUniqueTimeout(
      "applyFilter",
      () => {
        $btn.prop("disabled", false).html('<i class="fa fa-filter me-1"></i>'); //  Apply
      },
      2500
    );
  });

  // Toggle Visibility
  $("#toggleDataBtn").click(function() {
    isHidden = !isHidden;
    const btn = $(this);
    if(isHidden) {
      btn.html('<i class="fa fa-eye-slash"></i>');
    } else {
      btn.html('<i class="fa fa-eye"></i>');
    }

    updateChartVisibility();

    // Re-render UI with current data in memory

    // Re-render UI with current data in memory
    const cached = sessionStorage.getItem(DASHBOARD_KEY);
    if (cached) {
        const data = JSON.parse(cached);
        renderDashboard(data.summary, data.recentInvoices);
    }
  });

  // ================== INITIAL LOAD ==================
  const cached = sessionStorage.getItem(DASHBOARD_KEY);
  if (cached) {
    const data = JSON.parse(cached);
    renderDashboard(data.summary, data.recentInvoices);
    renderCharts(data.chart);
  } else {
    fetchDashboardData(false);
  }
});
