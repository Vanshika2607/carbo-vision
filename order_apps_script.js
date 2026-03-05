/**
 * Google Apps Script to handle NEW ORDERS from the website after Razorpay Payment
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/106jKrIPxj_5PLFS1mU7-c1rpozcpULV6tgyJ5vZ9tEM/edit
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: 'Carbo Vision Order Tracker'.
 * 7. Set 'Execute as': 'Me'.
 * 8. Set 'Who has access': 'Anyone'.
 * 9. Click 'Deploy' and grant permissions (it will ask to authorize).
 * 10. Copy the 'Web app URL' and paste it into src/pages/Payment.tsx where it says YOUR_ORDER_WEB_APP_URL.
 */

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Check if headers exist, if not create them
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp',
                'Order ID',
                'Payment ID (Razorpay)',
                'Customer Name',
                'Email',
                'Phone',
                'Address',
                'City',
                'State',
                'Pincode',
                'Total Amount (₹)',
                'Items Purchased'
            ]);
        }

        // Convert items array to a readable string
        var itemsString = "";
        if (data.items && Array.isArray(data.items)) {
            itemsString = data.items.map(function (item) {
                return item.quantity + "x " + item.name + " (₹" + item.price + ")";
            }).join(", ");
        }

        sheet.appendRow([
            new Date(),
            data.order_id || "N/A",
            data.payment_id || "N/A",
            data.user_name || "N/A",
            data.user_email || "N/A",
            data.user_phone || "N/A",
            data.shipping_address || "N/A",
            data.city || "N/A",
            data.state || "N/A",
            data.pincode || "N/A",
            data.total_amount || 0,
            itemsString
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            'result': 'success',
            'message': 'Order saved successfully'
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            'result': 'error',
            'message': error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    return ContentService.createTextOutput("Method Not Allowed").setMimeType(ContentService.MimeType.TEXT);
}
