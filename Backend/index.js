var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var dimensions = require('image-size');

// Config
const baseFolder = '../gifs/';
const baseUriDirectory = '/gifs';
const peopleFolderName = 'people';
const funnyFolderName = 'funny';

// Express Setup
const app = express();
const port = process.env.PORT || 4000;
app.listen(port, console.log('Server started on port ' + port));

// Route for gif infos
app.get(baseUriDirectory + '/info', (req, res) => {

  // get the files names of the gifs
  getFilesFromDisk((err, fileNames) => {

    // return errors
    if (err) {
      return res.jsonp(err);
    }

    // collect further information for all people gif files
    var peopleGifFilePaths = _.map(fileNames.people, (peopleGifFileName) => {
      return path.join(__dirname, baseFolder, peopleFolderName, peopleGifFileName);
    });
    var peopleGifFiles = getGifInformations(peopleGifFilePaths);

    // collect further information for all funny gif files
    var funnyGifFilePaths = _.map(fileNames.funny, (funnyGifFileName) => {
      return path.join(__dirname, baseFolder, funnyFolderName, funnyGifFileName);
    });
    var funnyGifFiles = getGifInformations(funnyGifFilePaths);

    // return result
    return res.jsonp({
      basePath: req.protocol + '://' + req.get('host') + baseUriDirectory,
      people: {
        path: peopleFolderName,
        total: _.keys(peopleGifFiles).length,
        gifs: peopleGifFiles
      },
      funny: {
        path: funnyFolderName,
        total: _.keys(funnyGifFiles).length,
        gifs: funnyGifFiles
      }
    });

  });

});

// expose folders of gif files
app.use(baseUriDirectory + '/' + peopleFolderName, express.static(path.join(baseFolder, peopleFolderName)));
app.use(baseUriDirectory + '/' + funnyFolderName, express.static(path.join(baseFolder, funnyFolderName)));

/**
 * Get information of an array of images
 * @param filePaths array of distinct file paths
 * @returns object of information in the following format:
 * {
 *   "img.gif": {
 *     "height": 200,
 *     "width": 100,
 *     "ratio": 0.5   
 *   },
 *   ...
 * }
 */
function getGifInformations(filePaths) {
  var result = {};
  for (var filePath of filePaths) {
    var imgDimensions = dimensions(filePath);
    result[path.basename(filePath)] = {
      height: imgDimensions.height,
      width: imgDimensions.width,
      ration: imgDimensions.width / imgDimensions.height
    };
  }
  return result;
}

/**
 * Read the files from both directories (people and funny) and filter their names (.gif or .GIF)
 * @param callback Function called with two arguments (err, result) where err is not null if file
 * system error occurrs and result holds two array properties (people, funny) with the gif's file names
 */
function getFilesFromDisk(callback) {

  // read directory for people gifs
  fs.readdir(path.join(__dirname, baseFolder, peopleFolderName), (err, peopleFileNames) => {

    // catch read directory errors
    if (err) {
      return callback({
        error: 'Error searching ' + peopleFolderName + ' gif files',
        innerError: err
      });
    }

    // filter gif files
    var peopleGifFileNames = _.filter(peopleFileNames, (peopleFileName) => {
      return !_.isEmpty(peopleFileName.match(/^.*\.(gif|GIF)$/));
    });

    // read directory for funny gifs
    fs.readdir(path.join(__dirname, baseFolder, funnyFolderName), (err, funnyFileNames) => {

      // catch read directory errors
      if (err) {
        return callback({
          error: 'Error searching ' + funnyFolderName + ' gif files',
          innerError: err
        })
      }

      // filter gif files
      var funnyGifFileNames = _.filter(funnyFileNames, (funnyFileName) => {
        return !_.isEmpty(funnyFileName.match(/^.*\.(gif|GIF)$/));
      });

      return callback(null, {
        people: peopleGifFileNames,
        funny: funnyGifFileNames
      });

    });

  });
}
