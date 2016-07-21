var _ = require('lodash');

exports.baselinePlus = (width, height, space, peoples, funnys) => {
  var picsCount = peoples.length + funnys.length;
  var spacePx = Math.floor(space * width);
  var baselineCount = Math.ceil(picsCount * 0.4); // number of pics in baseline
  baselineCount = baselineCount % 2 === 0 ? baselineCount - 1 : baselineCount;
  var picsWidth = Math.floor((width / baselineCount) - (((baselineCount + 1) * spacePx) / baselineCount) - rand(0, 0.05 * width)); // width of those pics

  // scale all pics, annotate them and merge the arrays for simpler processing
  for (var pic of peoples) {
    pic.width = picsWidth;
    pic.height = Math.floor(pic.width / pic.ratio);
  }
  for (var pic of funnys) {
    pic.width = picsWidth;
    pic.height = Math.floor(pic.width / pic.ratio);
  }
  var pics = _.shuffle(_.concat(peoples, funnys))

  // arrange first pics at baseline
  var basePoint = (width / 2) - (picsWidth / 2);
  var i;
  for (i = 0; i < baselineCount; i++) {
    pics[i].x = Math.floor(basePoint + ((i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2)) * (picsWidth + spacePx));
    pics[i].y = Math.floor((height / 2) - (pics[i].height / 2));
  }
  // next iterations (above baseline)
  for (i; i < (2 * (baselineCount -1)) && i < pics.length; i ++) {
    var referenceIdx = i - baselineCount;
    if (pics[referenceIdx].y - pics[i].height - 2 * spacePx >= 0) {
      pics[i].x = pics[referenceIdx].x;
      pics[i].y = pics[referenceIdx].y - spacePx - pics[i].height;
    }
  }
  // next iterations (below baseline)
  for (i; i < (3 * (baselineCount - 1)) && i < pics.length; i ++) {
    var referenceIdx = i - (2* (baselineCount - 1));
    if (pics[referenceIdx].y + pics[referenceIdx].height + spacePx + pics[i].height + spacePx <= height) {
      pics[i].x = pics[referenceIdx].x;
      pics[i].y = pics[referenceIdx].y + pics[referenceIdx].height + spacePx;
    }
  }

  // maniupulate input objects
  peoples = _.filter(pics, { source: 'p' });
  funnys = _.filter(pics, { source: 'f' });
}
