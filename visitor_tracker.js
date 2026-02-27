/**
 * Google Apps Script — Visitor Tracker for Carbo Vision
 *
 * Columns: Timestamp | Latitude | Longitude | City | Country | Device | Occupation
 *
 * HOW TO RE-DEPLOY after editing:
 * 1. Open: https://docs.google.com/spreadsheets/d/1k4c5JenOTrXAxUXHcM_9J-mrsomh0koMu0gbK4ynTXg/edit
 * 2. Extensions > Apps Script > paste this file > Save (Ctrl+S)
 * 3. Deploy > Manage Deployments > ✏️ pencil > Version: "New version" > Deploy
 */

var SHEET_NAME = 'Visitors';
var SPREADSHEET_ID = '1k4c5JenOTrXAxUXHcM_9J-mrsomh0koMu0gbK4ynTXg';

var HEADERS = ['Timestamp', 'City', 'Country', 'Device', 'Occupation'];

// ─── Always enforces correct headers & formatting ─────────────────────────
function getOrCreateSheet() {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
    }

    // Always rewrite row 1 with exact headers (fixes any mismatches)
    var hRange = sheet.getRange(1, 1, 1, HEADERS.length);
    hRange.setValues([HEADERS]);
    hRange.setBackground('#1558d6');
    hRange.setFontColor('#ffffff');
    hRange.setFontWeight('bold');
    hRange.setHorizontalAlignment('center');
    hRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);

    // Set fixed column widths
    sheet.setColumnWidth(1, 165);  // Timestamp
    sheet.setColumnWidth(2, 130);  // City
    sheet.setColumnWidth(3, 120);  // Country
    sheet.setColumnWidth(4, 90);   // Device
    sheet.setColumnWidth(5, 210);  // Occupation

    return sheet;
}

// ─── POST: record a new visitor ───────────────────────────────────────────
function doPost(e) {
    try {
        var raw = e.postData ? e.postData.contents : '{}';
        var data = JSON.parse(raw);
        var sheet = getOrCreateSheet();

        // Append the row
        sheet.appendRow([
            new Date(),
            data.city || '—',
            data.country || '—',
            data.device || '—',
            data.occupation || '—'
        ]);

        // Center-align the new data row
        var newRow = sheet.getLastRow();
        sheet.getRange(newRow, 1, 1, HEADERS.length).setHorizontalAlignment('center');

        var totalVisitors = newRow - 1;

        return ContentService
            .createTextOutput(JSON.stringify({ result: 'success', totalVisitors: totalVisitors }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ─── GET: return current visitor count ────────────────────────────────────
function doGet(e) {
    try {
        var sheet = getOrCreateSheet();
        var totalVisitors = Math.max(sheet.getLastRow() - 1, 0);
        return ContentService
            .createTextOutput(JSON.stringify({ result: 'success', totalVisitors: totalVisitors }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ─── RUN ONCE to fix headers on the existing sheet ────────────────────────
function fixSheetHeaders() {
    var sheet = getOrCreateSheet();
    Logger.log('Done. Data rows: ' + Math.max(sheet.getLastRow() - 1, 0));
}

// ─── TEST: insert a sample row ────────────────────────────────────────────
function testInsert() {
    var sheet = getOrCreateSheet();
    sheet.appendRow([new Date(), 'Bangalore', 'India', 'Desktop', 'Engineer / Developer']);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, HEADERS.length).setHorizontalAlignment('center');
    Logger.log('Test row inserted. Total: ' + (newRow - 1));
}
