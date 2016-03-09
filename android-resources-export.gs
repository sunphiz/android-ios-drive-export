
var appName = "App Name";

// Export resources function
function exportResources() {
  
  // Folders
  var appFolder = createOrGetFolder(appName);
  var androidFolder = createOrGetFolder("Android", appFolder);
  var iOSFolder = createOrGetFolder("iOS", appFolder);
  
  // Data
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var i = 2;
  while (data[1][i] != null && data[1][i].length > 0) {
  
    var results = data[1][i].match(/\((\w\w)\)/g);
    if (results.length > 0) {
      var language = results[0].replace(/\(/g, "").replace(/\)/g, "");
      createAndroidResources(language, data, androidFolder, i);
      createIOSResources(language, data, iOSFolder, i);
    }
    
    i++;
  }
  
}

// Create an XML file for Android
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createAndroidResources(language, data, folder, column) {
  
  var folderName = "values-" + language;
  var languageFolder = createOrGetFolder(folderName, folder);
  
  var content = "<resources>";
  content += "\n\n";
  content += "\t<!-- App name -->";
  content += '\n\t<string name="app_name">' + appName + '</string>';
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n\t<!-- " + data[i][0] + " -->";
    }
    
    var formatted = "";
    var value = data[i][column]
    if (value.indexOf("%@") > -1) {
      value = value.replace(/%@/g, "%s");
    }
    if (value.indexOf("...") > -1) {
      value = value.replace(/\.\.\./g, "&#8230;");
    }
    if (data[i][column].indexOf("%s") > -1) {
      formatted = ' formatted="false"';
    }
    
    var escapedContent = value.replace(/\'/g, "\\'");
    content += '\n\t<string name="' + data[i][1] + '"' + formatted + '>' + escapedContent + '</string>';
  }
  
  content += "\n\n</resources>";
  
  var file = createOrGetFile("strings.xml", languageFolder);
  file.setContent(content);
}

// Create a localizable file for iOS
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createIOSResources(language, data, folder, column) {
    
  var content = "// App";
  content += "\n";
  content += '"app_name" = "' + appName + '";';
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n// " + data[i][0] + "";
    }
    
    var value = data[i][column]
    if (value.indexOf("%s") > -1) {
      value = value.replace(/%s/g, "%@");
    }
    
    content += '\n"' + data[i][1] + '" = "' + value + '";';
  }
  
  var fileName = "Localizable_" + language.toUpperCase() + ".strings";
  var file = createOrGetFile(fileName, folder);
  file.setContent(content);
}



////////////
// HELPER //
////////////

// Check folder
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


// Check file
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
