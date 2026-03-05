/**
 * Google Apps Script to handle NEW USER SIGN UP from the website.
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1cOV3v7I484pjaegJi2LqQ1zZyo5c6kqR55PBIBCZAv0/edit
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this code.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: 'Carbo Vision Auth Handler'.
 * 7. Set 'Execute as': 'Me'.
 * 8. Set 'Who has access': 'Anyone'.
 * 9. Click 'Deploy' and grant permissions (it will ask to authorize).
 * 10. Copy the 'Web app URL' and paste it into src/pages/SignUp.tsx where it says YOUR_WEB_APP_URL.
 */

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Check if headers exist, if not create them in the first row
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Age', 'Password']);
        }

        // Check if user already exists based on Email to prevent duplicates
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var emailExists = false;

        for (var i = 1; i < values.length; i++) {
            if (values[i][2] === data.email) { // Email is technically the 3rd column (index 2)
                emailExists = true;
                break;
            }
        }

        if (emailExists) {
            return ContentService.createTextOutput(JSON.stringify({
                'result': 'error',
                'message': 'User with this email already exists'
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // If new, save the data
        sheet.appendRow([
            new Date(),
            data.name,
            data.email,
            data.phone,
            data.age,
            data.password
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            'result': 'success',
            'message': 'User saved successfully'
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
