<?php
include_once '../header.php';
?>

<link href="../assets/css/report/invoices.css" rel="stylesheet" />

<div class="container-fluid mb-3">

    <!-- Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-primary text-white shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                            <h1 class="h3 mb-1 fw-semibold">
                                <i class="bi bi-file-earmark-bar-graph"></i> Advanced Invoice Report
                            </h1>
                            <p class="text-white-50 mb-0">Build your own custom query</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="card border-0 shadow-sm mb-3">
        <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
            <span><i class="bi bi-funnel"></i> Filter Rules</span>
            <button type="button" id="addFilterBtn" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-plus-lg"></i> Add Condition
            </button>
        </div>
        <div class="card-body bg-light">
            <form id="advInvoiceForm" autocomplete="off">
                <div id="filterContainer">
                    <!-- Dynamic Rows will appear here -->
                </div>
                 <div class="mt-3 text-end border-top pt-3">
                    <button type="button" id="resetBtn" class="btn btn-outline-secondary me-2">
                        <i class="bi bi-arrow-counterclockwise"></i> Reset
                    </button>
                    <button type="button" id="searchBtn" class="btn btn-primary">
                        <i class="bi bi-search"></i> Run Report
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Results Table -->
    <div class="card shadow-sm">
         <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-semibold">
                <i class="bi bi-list-ul me-2"></i> Report Results
            </h5>
            <span class="badge bg-secondary" id="totalCount">0 records</span>
        </div>
        <div class="card-body p-0">
             <div class="table-responsive">
                <div id="advTable" class="table table-hover mb-0 align-middle"></div>
            </div>
            <!-- Empty State -->
            <div id="emptyState" class="text-center py-5 d-none">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2">No results found for the selected criteria.</p>
            </div>
        </div>
    </div>
    
    <nav aria-label="Pagination" class="mt-3">
        <ul class="pagination justify-content-center" id="pagination"></ul>
    </nav>

</div>

<!-- Template for Filter Row -->
<template id="filterRowTemplate">
    <div class="row g-2 mb-2 align-items-center filter-row">
        <div class="col-md-3">
            <select class="form-select filter-col">
                <option value="invoice_date">Invoice Date</option>
                <option value="amount">Amount</option>
                <option value="invoice_status">Status</option>
                <option value="name">Customer Name</option>
                <option value="phone">Phone Number</option>
                <option value="payment_mode">Payment Mode</option>
                <option value="place">Place</option>
                <option value="invoice_type">Type</option>
            </select>
        </div>
        <div class="col-md-2">
             <select class="form-select filter-op">
                <option value="=">Equals (=)</option>
                <option value=">">Greater Than (>)</option>
                <option value="<">Less Than (<)</option>
                <option value=">=">Greater/Equal (>=)</option>
                <option value="<=">Less/Equal (<=)</option>
                <option value="LIKE">Contains (LIKE)</option>
                <option value="!=">Not Equal (!=)</option>
            </select>
        </div>
        <div class="col-md-3">
            <input type="date" class="form-control filter-val">
        </div>
        <div class="col-md-1">
             <button type="button" class="btn btn-outline-danger btn-sm remove-row-btn">
                <i class="bi bi-x-lg"></i>
             </button>
        </div>
    </div>
</template>

<script src="../assets/js/report/advanced_invoices.js"></script>

<?php
include_once '../footer.php';
?>
