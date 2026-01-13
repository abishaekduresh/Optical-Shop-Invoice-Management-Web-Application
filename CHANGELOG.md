# 🧾 Changelog

All notable changes to this project will be documented in this file.

This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and adheres to [Semantic Versioning](https://semver.org/).

---

## [v2.3] - 2026-01-13

### 🚀 Added
- **Advanced Invoice Report**: New dynamic reporting module with "Row Filter System".
- **Dynamic Queries**: Build custom filters using Column, Operator, and Value rows.
- **Enhanced Searching**: Support for `LIKE`, `>`, `<`, etc. on multiple fields (Amount, Date, Status, etc.).
- **Backend**: Implemented dynamic SQL query builder in `InvoiceModel`.

### 💅 UI Updates
- **Filter Interface**: New clean UI for adding/removing filter conditions dynamically.

---

### 🚀 Added
- **JWT Auto-Refresh**: Implemented 7-day refresh token system to prevent frequent logouts. Frontend automatically renews session on 401 errors.
- **Dynamic Invoice Footer**: Footer brand sections now auto-populate with specific invoice data (`frame`, `lence`) instead of static text.

### 🛠 Fixed
- **Authentication**: Fixed session expiry causing forced logouts every hour.
- **Print Layout**: Reverted print toolbar to classic design and locked paper size to A5 as preferred.

---

## [v2.1] - 2025-12-26

### 🚀 Added

#### 🖨️ Invoice Print System
- **QR Code Support**: Added dynamic QR code generation to invoice footer.
- **Smart Footer**: Implemented grid-based signature layout that remains stable regardless of QR visibility.
- **Paper Formats**: Optimized CSS for A5, A4, and Letter sizes with overflow protection.
- **Timestamp**: Added generation timestamp and Invoice ID footer.

#### 📊 Dashboard Features
- **Privacy Mode**: Added toggle to mask sales numbers and blur charts.
- **Dynamic Payment Logic**: Invoice print view now correctly reflects UPI/NetBanking status.

### 💅 UI Updates
- **Print Button**: Redesigned print button on invoices list (Yellow/White).
- **Layout**: Tighter print margins for A5 optimization.

---

## [v2.0] - 2025-10-28

### 🚀 Added

#### 🧩 Dashboard Enhancements

- Introduced **dynamic business dashboard** powered by Chart.js and Bootstrap.
- Added **real-time metrics API** for invoices, sales, business, and logs.
- Integrated **bar and line charts** for last 7-day invoice and sales tracking.
- Dashboard now caches data in **sessionStorage** for faster loading and offline view.
- Added **manual refresh** option to fetch live updates from the API.
- Added **responsive recent invoices cards** with count indicator and hover effects.
- Introduced **pagination** support for dashboard data (recent invoices).

#### 🧾 Activity Log Module

- Added new endpoint for **activity log fetching with pagination** and search.
- Integrated **Bootstrap table** UI for viewing logs with:
  - Search
  - Sort order (ASC/DESC)
  - Pagination controls
  - Record count display
- Added **JSON export** feature for logs.
- Implemented **debounced search** for improved UX.
- Created `fetchActivityLogs()` model method with proper pagination response.

#### ⚙️ Backend Improvements

- Enhanced **`fetchDashboardStats()`** method:
  - Real pagination support for recent invoices
  - Added `last7Days` analytics dataset for Chart.js
  - Unified data response with `data[]` and `pagination` block
- Improved `ActivityLoggerMiddleware` to log user actions, endpoints, and IP addresses.
- Added **error handling and standard JSON responses** for consistency.

#### 💅 UI/UX Enhancements

- Fully Bootstrap 5-based dashboard & settings pages.
- Added responsive **settings card** layout with logo upload preview.
- Implemented **SweetAlert2 toasts** for all success/error actions.
- Enhanced typography, spacing, and iconography consistency.
- Added refresh and export buttons with loading animations.

---

## 📘 API Reference

### 🔹 Dashboard Endpoint

```http
GET /api/business/stats
```

**Description:** Returns aggregated business statistics, recent invoices, and last 7-day chart data.

#### Response Format

```json
{
  "status": true,
  "message": "Dashboard stats fetched successfully.",
  "data": [
    {
      "totalInvoices": 2027,
      "todayInvoices": 1,
      "yesterdayInvoices": 1,
      "totalBusiness": 1,
      "totalSales": "6,204,884.50",
      "todaySales": "10.00",
      "yesterdaySales": "10.00",
      "totalLogs": 636,
      "recentInvoices": [...],
      "last7Days": {
        "labels": ["Wed","Thu","Fri","Sat","Sun","Mon","Tue"],
        "invoices": [0,0,0,0,0,1,1],
        "sales": [0,0,0,0,0,10,10]
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 6,
    "totalPages": 338,
    "totalRecords": 2027
  }
}
```

---

### 🔹 Activity Logs Endpoint

```http
GET /api/business/activity/log
```

| Parameter | Type    | Description                                          |
| --------- | ------- | ---------------------------------------------------- |
| `q`       | string  | Search query across action, endpoint, user ID, or IP |
| `id`      | string  | Filter logs by business ID                           |
| `ord`     | string  | Order direction (`ASC` or `DESC`)                    |
| `page`    | integer | Pagination page number                               |
| `limit`   | integer | Number of records per page                           |

#### Example Response

```json
{
  "status": true,
  "message": "Activity logs fetched successfully.",
  "data": {
    "records": [
      {
        "userId": "95ABF2FD67AE",
        "businessId": "B3E531BB14BC",
        "action": "Activity logs fetched successfully.",
        "ipAddress": "::1",
        "createdAtText": "2025-10-28 12:29:49"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "limit": 25,
    "totalPages": 660,
    "totalRecords": 660
  }
}
```

---

### 🐞 Fixed

- Fixed redirect issues on SiteGround hosting.

📄 [View full version details →](documents/v2.0.md)

---

> **Last updated:** 2025-10-28  
> **Maintainer:** Abishaek Duresh B  
> 📧 abishaekduresh@gmail.com  
> 🌐 https://abishaek.com

---

## [v1.1] - 2025-10-27

### ✨ Updates

- Enhanced **Manage Invoice** table with **Tabular.js** integration for improved sorting and search functionality.
- Added **Settings → Business Information** update form with logo upload support.
- Integrated **SweetAlert** notifications for all CRUD actions.
- Added **Activity Logger Middleware**, `LoggerHelper`, and `ActionMapperHelper` for activity tracking in `activity_logs` table.
- Introduced a new **API endpoint** for real-time dashboard updates.
- Implemented `/uploads/{path:.*}` route to access uploaded files.
- Added **Business Controller** and **Business Model** with full CRUD API support.

📄 [View full version details →](documents/v1.1.md)

---

> 🧠 Tip: For future releases, create a new file under `documents/vX.X.md` for full details and link it here.
