var path = require('path');
var dimensions = require('image-size');

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
exports.getGifInformations = (filePaths) => {
  var result = {};
  for (var filePath of filePaths) {
    var imgDimensions = dimensions(filePath);
    result[path.basename(filePath)] = {
      height: imgDimensions.height,
      width: imgDimensions.width,
      ratio: imgDimensions.width / imgDimensions.height
    };
  }
  return result;
}