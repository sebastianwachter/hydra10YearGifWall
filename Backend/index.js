var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var utils = require('./utils');

// Wall configuration
const peopleRatio = 0.8;
const funnyRatio = 0.2;
const space = 0;
// Take a higher values than you want. Some will be lost during arrangement calculation
const minPicsPerScreen = 11;
const maxPicsPerScreen = 18;

// Config (change it per system)
const baseFolder = '../gifs/';
const baseUriDirectory = '/gifs';
const peopleFolderName = 'people';
const funnyFolderName = 'funny';
const wallFilesFolder = '../Client/public';
const wallFolderName = 'wall';

// Setup
const arrangementAlgos = require('./arrangement');
// Express
const app = express();
const port = process.env.PORT || 4000;
app.listen(port, console.log('Server started on port ' + port));

// Route for gif infos
app.get(baseUriDirectory + '/info', (req, res) => {

  // Calcuations
  var picsPerScreen = _.random(minPicsPerScreen, maxPicsPerScreen, true);
  var peoplesPerScreen = _.round(picsPerScreen * peopleRatio);
  var funnysPerScreen = _.round(picsPerScreen * funnyRatio);

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
    var peopleGifFiles = utils.getGifInformations(peopleGifFilePaths);

    // collect further information for all funny gif files
    var funnyGifFilePaths = _.map(fileNames.funny, (funnyGifFileName) => {
      return path.join(__dirname, baseFolder, funnyFolderName, funnyGifFileName);
    });
    var funnyGifFiles = utils.getGifInformations(funnyGifFilePaths);

    // calculate coordinates and recalcuate dimensions of pics if asked for a wall
    if (req.query.width && req.query.height) {

      // annotate objects to be processed as arrays
      for (var k of _.keys(peopleGifFiles)) {
        peopleGifFiles[k].name = k;
        peopleGifFiles[k].source = 'p';
      }
      for (var k of _.keys(funnyGifFiles)) {
        funnyGifFiles[k].name = k;
        funnyGifFiles[k].source = 'f';
      }

      // randomly chose the right number of pics
      peopleGifFiles = _.take(_.shuffle(peopleGifFiles), peoplesPerScreen);
      funnyGifFiles = _.take(_.shuffle(funnyGifFiles), funnysPerScreen);

      // randomly choose an arrangement algorithm and run it (it manipulates the arrays)
      var algo = _.shuffle(_.keys(arrangementAlgos))[0];
      var arrangedPics = arrangementAlgos[algo](req.query.width, req.query.height, space, peopleGifFiles, funnyGifFiles);

      // cleanup annotations
      var peoples = {};
      for (var pic of _.filter(arrangedPics, { source: 'p' })) {
        delete pic.source;
        peoples[pic.name] = pic;
        delete pic.name;
      }
      peopleGifFiles = peoples; 
      var funnys = {};
      for (var pic of _.filter(arrangedPics, { source: 'f'})) {
        delete pic.source;
        funnys[pic.name] = pic;
        delete pic.name;
      }
      funnyGifFiles = funnys;
    }

    // fallback: return result without x and y coordinates calculation
    return res.jsonp(generateOutput(req, peopleGifFiles, funnyGifFiles));

  });

});

// expose folders of gif files
app.use(baseUriDirectory + '/' + peopleFolderName, express.static(path.join(baseFolder, peopleFolderName)));
app.use(baseUriDirectory + '/' + funnyFolderName, express.static(path.join(baseFolder, funnyFolderName)));

// expose static html files of client
app.use(baseUriDirectory + '/' + wallFolderName, express.static(path.join(__dirname, wallFilesFolder)));

function generateOutput(req, peopleGifFiles, funnyGifFiles) {
  var baseUri = req.protocol + '://' + req.get('host') + baseUriDirectory;
  var result = {};
  for (var key of _.keys(peopleGifFiles)) {
    var pic = peopleGifFiles[key];
    if (_.has(pic, 'x') && _.has(pic, 'y') && _.has(pic, 'width') && _.has(pic, 'height')) {
      result[baseUri + '/' + peopleFolderName + '/' + key] = pic;
    }
  }
  for (var key of _.keys(funnyGifFiles)) {
    var pic = funnyGifFiles[key];
    if (_.has(pic, 'x') && _.has(pic, 'y') && _.has(pic, 'width') && _.has(pic, 'height')) {
      result[baseUri + '/' + funnyFolderName + '/' + key] = pic;
    }
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
      return !_.isEmpty(peopleFileName.match(/^.*\.(gif|jpg)$/i));
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
        return !_.isEmpty(funnyFileName.match(/^.*\.(gif|jpg)$/i));
      });

      return callback(null, {
        people: peopleGifFileNames,
        funny: funnyGifFileNames
      });

    });

  });
}
