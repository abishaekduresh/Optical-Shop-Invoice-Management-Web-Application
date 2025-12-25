
// Helper to get params
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to handle paper size change
function changePaperSize() {
    const size = document.getElementById('paperSize').value;
    const sheet = document.getElementById('invoice');
    sheet.className = 'sheet ' + size;
}

// function to handle QR visibility
function toggleQrCode() {
    const isChecked = document.getElementById('showQrCheckbox')?.checked ?? true;
    const qrEl = document.getElementById('qrcode');
    const footerInfo = document.getElementById('footer-info');
    
    if (qrEl) {
        qrEl.style.display = isChecked ? 'inline-block' : 'none';
        // Footer is now absolute bottom, so no need to adjust its margin.
    }
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

$(document).ready(function() {
    const invoiceId = getQueryParam('id');
    
    // Set default size if param exists
    const sizeParam = getQueryParam('size');
    if(sizeParam) {
        $('#paperSize').val(sizeParam);
        changePaperSize();
    }

    if (!invoiceId) {
        alert('No invoice ID provided.');
        return;
    }

    // Fetch Invoice Data
    // We use the public shared endpoint to avoid auth complexity in the new window
    // Path: ../backend/public/api/shared/invoices/{id}
    $.ajax({
        url: `../backend/public/api/shared/invoices/${invoiceId}`,
        method: 'GET',
        success: function(response) {
            // response.data.invoices is an array
            const invoice = response.data.invoices && response.data.invoices.length > 0 ? response.data.invoices[0] : null;

            if (invoice) {
                // Populate Fields matches the IDs in HTML
                $('#orderNo').text(invoice.invoiceNumber || invoice.invoiceId);
                $('#date').text(formatDate(invoice.invoiceDate));
                $('#name').text(invoice.name);
                $('#mobile').text(invoice.phone);
                $('#address').text(invoice.place || '');
                $('#frame').text(invoice.frame || '');
                $('#lens').text(invoice.lence || ''); // Note typo in API "lence" -> lens
                const total = parseFloat(invoice.amount) || 0;
                const advance = parseFloat(invoice.claim) || 0; // Assuming 'claim' field stores the advance amount
                const balance = total - advance;

                $('#total').text(total.toFixed(2));
                $('#advance').text(advance > 0 ? advance.toFixed(2) : '');
                $('#balance').text(balance > 0 ? balance.toFixed(2) : '0.00');
                
                $('#balance').text(balance > 0 ? balance.toFixed(2) : '0.00');
                
                // Payment Modes logic
                // Reset checks
                $('#payCash').text('');
                $('#payCard').text('');
                $('#payCardLabel').text('Card'); // Default label

                const mode = (invoice.paymentMode || '').toLowerCase();
                
                if (mode === 'cash') {
                    $('#payCash').text('✔');
                } else if (mode === 'card') {
                    $('#payCardLabel').text('Card');
                    $('#payCard').text('✔');
                } else if (mode === 'upi') {
                    $('#payCardLabel').text('UPI');
                    $('#payCard').text('✔');
                } else if (mode === 'netbanking') {
                    $('#payCardLabel').text('NetBank'); // Shorten for space
                    $('#payCard').text('✔');
                } else if (mode && mode !== 'cash') {
                     // Fallback for other non-cash modes
                    $('#payCardLabel').text(mode.charAt(0).toUpperCase() + mode.slice(1));
                    $('#payCard').text('✔');
                }

                // Populate Brands Footer using Invoice Data
                // As per user request, use 'frame' and 'lence' fields from API result.
                
                // Frames
                if (invoice.frame) {
                    $('#frameBrands').text(invoice.frame);
                } else {
                    $('#frameBrands').text('-'); // or keep empty
                }

                // Lenses (API field is 'lence' per DB schema)
                if (invoice.lence) {
                    $('#lensBrands').text(invoice.lence);
                } else {
                     $('#lensBrands').text('-');
                }

                // Contact Lenses - Try 'contact_lence' if it exists, roughly inferred similar naming
                // If not present in API, we'll leave it empty or default.
                if (invoice.contact_lence) {
                    $('#contactBrands').text(invoice.contact_lence);
                } else {
                    $('#contactBrands').text(''); 
                }

                // Generate QR Code
                $('#qrcode').empty(); // clear if any
                if(invoice.invoiceId) {
                    new QRCode(document.getElementById("qrcode"), {
                        text: invoice.invoiceId,
                        width: 75,
                        height: 75,
                        colorDark : "#000000",
                        colorLight : "#ffffff", // This ensures white background if library supports transparency
                        correctLevel : QRCode.CorrectLevel.H
                    });

                    // Footer Info
                    $('#footerInvoiceId').text(invoice.invoiceId || invoice.invoiceNumber);
                    
                    // Current Timestamp 'dd-mm-YYYY 12:52 PM'
                    const now = new Date();
                    const datePart = formatDate(now); // uses existing dd-mm-yyyy helper
                    // format time manually
                    let hours = now.getHours();
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    const strTime = `${hours}:${minutes} ${ampm}`;
                    
                    $('#printTimestamp').text(`${datePart} ${strTime}`);
                }
                
                // Delivery Date - DB doesn't have it? Recalculate or leave blank?
                // The DB schema in InvoiceModel has `created_at`.
                // `dob` is Date of Birth.
                // No specific delivery date column in schema shown earlier. 
                // Leave blank.
            } else {
                alert('Invoice not found!');
            }
        },
        error: function(err) {
            console.error(err);
            alert('Error fetching invoice data.');
        }
    });
});
