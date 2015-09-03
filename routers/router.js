var express = require('express');
var fs = require('fs');
var router = express.Router();

var fileIDs = [

];

/** POST request to create a new file object with the properties:
 *  - name
 *  - extension
 ** Responds with a new file ID
 */

router.post('/files', function (req, res) {
    // create random number to be used as the fileID
    var fileID = Math.floor(Math.random() * 100) + 1;

    var fileName = req.body.fileName;
    var fileExtension = req.body.fileExtension;

    // create an empty file

    fs.writeFile(fileName + fileExtension, null, function (err) {
        if (err) throw err;
        console.log("File " + fileName + fileExtension + " created successfully!");
    });

    fileIDs.push({
        fileID: fileID,
        desc: fileName + fileExtension,
        fileName: fileName,
        extension: fileExtension
    });

    res.write("This file ID is: " + fileID.toString() + " ..it will persist as long as the server is running.");
    res.end();
});

/** GET request to return the name and extension properties associated with the file with the specified fileID
 */

router.get('/files/:fileID', function (req, res) {
    var fileID = req.params.fileID;
    var indexOfFileID = -1;
    for (var i = 0; i < fileIDs.length; i++) {
        if (fileIDs[i].fileID == fileID) {
            indexOfFileID = i;
        }
    }
    if (indexOfFileID != -1) {
        fs.readFile(fileIDs[indexOfFileID].desc, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                res.end();
            }
            var fileName = fileIDs[indexOfFileID].fileName;
            var fileExtension = fileIDs[indexOfFileID].extension;
            console.log("FILE NAME: " + fileName + "\nFILE EXTENSION: " + fileExtension);
            res.write("FILE NAME: " + fileName + "\nFILE EXTENSION: " + fileExtension);
            res.end();
        });
    }
    else {
        console.log("The provided FileID: " + fileID + " does not match any file.");
        res.write("The provided FileID: " + fileID + " does not match any file.");
        res.end();
    }
});

/** PUT request to upload the file data for the file created with the POST request above
 *  - should set the Content-Type appropriately
 */

router.put('/files/:fileID/data', function (req, res) {
    var indexOfFileID = -1;

    for(var i = 0; i < fileIDs.length; i++) {
        if(fileIDs[i].fileID == req.params.fileID) {
            indexOfFileID = i;
        }
    }
    var fileName = fileIDs[indexOfFileID].fileName;
    var fileExtension = fileIDs[indexOfFileID].extension;
    var file = fs.readFileSync(fileName + fileExtension);
    var json = JSON.parse(file);

    if (json == null) {
        json = "";
    }

    json += JSON.stringify(req.body);
    console.log(json);
    fs.writeFileSync(fileName + fileExtension, JSON.stringify(json));
    res.write("Data written to file successfully!");
    res.end();
});

/** GET request to return the data in the file provided by the fileID
 */

router.get('/files/:fileID/data', function (req, res) {
    var indexOfFileID = -1;
    var fileID = req.params.fileID;

    for (var i = 0; i < fileIDs.length; i++) {
        if (fileIDs[i].fileID == fileID) {
            indexOfFileID = i;
        }
    }
    if (indexOfFileID != -1) {
        var fileName = fileIDs[indexOfFileID].fileName;
        var fileExtension = fileIDs[indexOfFileID].extension;
        var file = fs.readFileSync(fileName + fileExtension);
        var json = JSON.stringify(JSON.parse(file));
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
        res.end();
    }
    else {
        console.log("The provided FileID: " + fileID + " does not match any file.");
        res.write("The provided FileID: " + fileID + " does not match any file.");
        res.end();
    }
});

router.get('/', function (req, res) {
    res.render('index', {
        title: 'RESTful API Project',
        items: fileIDs
    });
});

module.exports = router;