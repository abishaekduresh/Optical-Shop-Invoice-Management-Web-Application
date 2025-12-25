<?php
require_once __DIR__ . '/common.php';
$APP_NAME = AppConfig::APP_NAME ?? 'Eyelight Opticals';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Print - <?= htmlspecialchars($APP_NAME) ?></title>
    
    <!-- Favicon -->
    <link rel="icon" href="./assets/img/favicon.png" type="image/png">
    <link rel="shortcut icon" href="./assets/img/favicon.png" type="image/png">

    <!-- Use standard font or load one -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
    <link href="./assets/css/print-invoice.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>

    <!-- No-Print Controls -->
    <div class="no-print control-bar">
        <select id="paperSize" onchange="changePaperSize()">
            <option value="A5">A5</option>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
        </select>
        <label style="margin-left: 10px; cursor: pointer;">
            <input type="checkbox" id="showQrCheckbox" onchange="toggleQrCode()" checked> Show QR
        </label>
        <button onclick="window.print()">🖨️ Print / Save PDF</button>
    </div>

    <!-- Invoice Container -->
    <div id="invoice" class="sheet A5">
        
        <!-- Design replicating the image -->
        <div class="invoice-header">
            <div class="logo-area">
                <!-- Placeholder for logo -->
                <img src="./assets/images/logo-placeholder.png" alt="Logo" id="brandLogo" onerror="this.style.display='none'">
            </div>
            <div class="brand-text">
                <h1 class="rainbow-text">EYE LIGHT <span class="opticals">Opticals</span></h1>
                <p class="subtitle">Computerized Eye Testing &amp; Contact Lens Centre</p>
            </div>
        </div>

        <div class="header-details">
            <div class="detail-row">
                <span class="label">Order No.</span>
                <div class="input-box big" id="orderNo"></div>
                <span class="label title-label">ORDER FROM</span>
                <span class="label">Date :</span>
                <div class="input-box" id="date"></div>
            </div>
            <div class="address-line text-center">
                V.S.R. Grand Mall, 198- B Highway Road,<br>
                Tisayanvillai - 627657. 04637 273008, 8883366077.
            </div>
        </div>

        <div class="customer-section">
            <div class="form-row">
                <span class="label">Name</span>
                <div class="input-box" id="name"></div>
            </div>
            <div class="form-row">
                <span class="label">Doctor's Ref.</span>
                <div class="input-box" id="docRef"></div>
            </div>
            <div class="form-row">
                <span class="label">Mobile No</span>
                <div class="input-box" id="mobile"></div>
            </div>
            <div class="form-row">
                <span class="label">Address</span>
                <div class="input-box" id="address"></div>
            </div>
            <div class="form-row">
                <span class="label"></span> <!-- Empty for spacing if lines needed -->
                <div class="input-box" id="address2"></div>
            </div>
        </div>

        <div class="mid-section">
            <div class="left-col">
                <div class="form-row">
                    <span class="label">Frame</span>
                    <div class="input-box" id="frame"></div>
                </div>
                <div class="form-row">
                    <span class="label">Lens</span>
                    <div class="input-box" id="lens"></div>
                </div>
                <div class="form-row">
                    <span class="label">Total</span>
                    <div class="input-box" id="total"></div>
                </div>
                <div class="form-row">
                    <span class="label">Advance</span>
                    <div class="input-box" id="advance"></div>
                </div>
                <div class="form-row">
                    <span class="label">Balance</span>
                    <div class="input-box" id="balance"></div>
                </div>
                <div class="form-row">
                    <span class="label">Delivery Date</span>
                    <div class="input-box" id="deliveryDate"></div>
                </div>
            </div>
            <div class="right-col">
                <div class="payments-title">Payments</div>
                <div class="payment-row">
                    <span class="label">Cash</span>
                    <div class="input-box small" id="payCash"></div>
                </div>
                <div class="payment-row">
                    <span class="label" id="payCardLabel">Card</span>
                    <div class="input-box small" id="payCard"></div>
                </div>
                <div class="payment-row">
                    <span class="label">Time</span>
                    <div class="input-box small" id="payTime"></div>
                </div>
            </div>
        </div>
        
        <!-- Power Table (Not in image but crucial for optical invoice) - Adding conditionally? 
             The user image doesn't show it, but standard invoices usually have it. 
             I will stick to the image for now, or add it if data exists in a clean way?
             The image seems to be a "wrapper" or "order form". 
             I'll add it at the bottom distinctively if needed, or hide it. 
             For now, sticking to image fields.
        -->

        <div class="brands-footer">
            <div class="brand-row">
                <span>Frames &amp; Sunglasses</span>
                <div class="brand-logos">
                    <!-- Text or placeholders for brands -->
                    RAYBAN, VOGUE, POLICE, CARRERA, BOSS...
                </div>
            </div>
            <div class="brand-row">
                <span>Lenses</span>
                <div class="brand-logos">
                    ESSILOR, ZEISS, HOYA, KODAK...
                </div>
            </div>
            <div class="brand-row">
                <span>Contact Lenses</span>
                <div class="brand-logos">
                    BAUSCH+LOMB, ACUVUE, ALCON...
                </div>
            </div>
        </div>

        <div class="signatures">
            <div class="sig-block">
                <span>Received the Spectacles</span>
                <div class="sig-box"></div>
            </div>
            
            <!-- Center QR Code -->
            <div id="qrcode-wrapper">
                 <div id="qrcode" style="padding: 5px; background: white; border-radius: 4px; display: inline-block;"></div>
            </div>

            <div class="sig-block right">
                <span>For <span class="rainbow-text-small">EYE LIGHT</span> Opticals</span>
                <div class="sig-box"></div>
            </div>
        </div>

        <!-- Footer Info -->
        <div id="footer-info" style="position: absolute; bottom: 20px; left: 0; width: 100%; text-align: center; font-size: 0.7rem; color: #666; padding-bottom: 5px;">
            Generated: <span id="printTimestamp"></span> | Invoice ID: <span id="footerInvoiceId"></span>
        </div>

    </div>

    <script src="./assets/js/print-invoice.js?v=<?= time() ?>"></script>
</body>
</html>
