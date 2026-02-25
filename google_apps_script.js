/**
 * Google Apps Script to handle form submissions from the website.
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1kr0t3u9IX9nqglO94bLSbp8qSuwmd6gr-d5ZN5V8H6M/edit
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: 'Carbo Vision Form Handler'.
 * 7. Set 'Execute as': 'Me'.
 * 8. Set 'Who has access': 'Anyone'.
 * 9. Click 'Deploy' and grant permissions.
 * 10. Copy the 'Web app URL' and replace the placeholder in Contact.tsx.
 */

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Check if headers exist, if not create them
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message']);
        }

        sheet.appendRow([
            new Date(),
            data.name,
            data.email,
            data.phone,
            data.subject,
            data.message
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            'result': 'success',
            'message': 'Data saved successfully'
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
