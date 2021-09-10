/**
 * @see {https://github.com/aurelhubert/android-ios-drive-export}
 */

// =================================================================================================
// 상수 선언
// -------------------------------------------------------------------------------------------------
var APP_NAME = "AppName";
var ROW_INDEX_TITLE = 0;

// 주석의 위치
var COLUMN_INDEX_COMMENT = 1;

// 데이터 위치
var COLUMN_INDEX_KEY = 4;
var COLUMN_INDEX_VALUE_START = 5;
var COLUMN_INDEX_VALUE_END = 7;
// =================================================================================================

// Export resources function
function exportResources() {
    // =============================================================================================
    // 폴더 만들기
    // - 저장위치 : My Drive/Export/$appName/...
    // ---------------------------------------------------------------------------------------------
    var parentFolder = DriveApp.getFolderById(DriveApp.getRootFolder().getId());
    var exportFolder = createOrGetFolder("Export", parentFolder);
    var appExportFolder = createOrGetFolder(APP_NAME, exportFolder);
    var androidFolder = createOrGetFolder("Android", appExportFolder);
    var iOSFolder = createOrGetFolder("iOS", appExportFolder);
    // =============================================================================================

    // =============================================================================================
    // 언어셋 추출
    // ---------------------------------------------------------------------------------------------
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();

    for (i = COLUMN_INDEX_VALUE_START; data[ROW_INDEX_TITLE][i] != null && data[ROW_INDEX_TITLE][i].length > 0 && i < COLUMN_INDEX_VALUE_END; i++) {

        var results = data[ROW_INDEX_TITLE][i].match(/\((\w\w)\)/g);
        if (results.length > 0) {
            var language = results[0].replace("(", "").replace(")", "");
            createAndroidResources(language, data, androidFolder, i);
            createIOSResources(language, data, iOSFolder, i);
        }
    }
    // =============================================================================================
}

// =================================================================================================
// 플랫폼 별 추출
// =================================================================================================
/**
 * Create an XML file for Android
 * 
 * @param {string} language 
 * @param {array[][]} data 
 * @param {string} folder 
 * @param {int} column 
 */
function createAndroidResources(language, data, folder, column) {

    var folderName = "values-" + language;
    var languageFolder = createOrGetFolder(folderName, folder);

    var content = "<resources>";

    for (var i = 3; i < data.length; i++) {

        if (data[i][COLUMN_INDEX_KEY].length == 0) {
            continue;
        }

        if (data[i][COLUMN_INDEX_COMMENT].length > 0) {
            content += "\n\n\t<!-- " + data[i][COLUMN_INDEX_COMMENT] + " -->";
        }

        var formatted = "";
        if (data[i][2].indexOf("%s") > -1 || data[i][2].indexOf("%d") > -1) {
            formatted = ' formatted="false"';
        }

        var escapedContent = data[i][column]
            .replace("&", "&amp;")
            .replace(new RegExp("\'", 'g'), "\\'")
            .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;");

        content += '\n\t<string name="' + data[i][COLUMN_INDEX_KEY] + '"' + formatted + '>' + escapedContent + '</string>';
    }

    content += "\n\n</resources>";

    var file = createOrGetFile("strings.xml", languageFolder);
    file.setContent(content);
}

/**
 * Create a localizable file for iOS
 * 
 * @param {string} language 
 * @param {array[][]} data 
 * @param {string} folder 
 * @param {int} column 
 */
function createIOSResources(language, data, folder, column) {

    var content = "// App";

    for (var i = 3; i < data.length; i++) {

        if (data[i][COLUMN_INDEX_KEY].length == 0) {
            continue;
        }

        if (data[i][COLUMN_INDEX_COMMENT].length > 0) {
            content += "\n\n// " + data[i][COLUMN_INDEX_COMMENT] + "";
        }

        var value = data[i][column];
        value = value.replace(/%s/g, "%@");
        value = value.replace(/"/g, '\\"');
        value = value.replace(/(?:\r\n|\r|\n)/g, '\\n');

        content += '\n"' + data[i][COLUMN_INDEX_KEY] + '" = "' + value + '";';
    }

    var fileName = "Localizable_" + language.toUpperCase() + ".strings";
    var file = createOrGetFile(fileName, folder);
    file.setContent(content);
}

// =================================================================================================
// 유틸
// =================================================================================================
function createOrGetFolder(name, folder) {
    var folders;
    if (folder == undefined) {
        folders = DriveApp.getFoldersByName(name)
    } else {
        folders = folder.getFoldersByName(name)
    }

    var mainFolder;
    if (folders.hasNext()) {
        mainFolder = folders.next();
    } else {
        if (folder == undefined) {
            mainFolder = DriveApp.createFolder(name);
        } else {
            mainFolder = folder.createFolder(name);
        }
    }

    return mainFolder;
}

function createOrGetFile(name, folder) {
    var files;
    if (folder == undefined) {
        files = DriveApp.getFilesByName(name)
    } else {
        files = folder.getFilesByName(name)
    }

    var file;
    if (files.hasNext()) {
        file = files.next();
    } else {
        if (folder == undefined) {
            file = DriveApp.createFile(name, "");
        } else {
            file = folder.createFile(name, "");
        }
    }

    return file;
}
