var _ = require('lodash');
var utils = require('./utils');

exports.baselinePlus = (width, height, space, peoples, funnys) => {
  var picsCount = peoples.length + funnys.length;
  var spacePx = Math.floor(space * width);
  var baselineCount = Math.ceil(picsCount * 0.4); // number of pics in baseline
  baselineCount = baselineCount % 2 === 0 ? baselineCount - 1 : baselineCount;
  var picsWidth = Math.floor((width / baselineCount) - (((baselineCount + 1) * spacePx) / baselineCount) - (rand(0, 0.15 * width) / baselineCount)); // width of those pics

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

exports.tabbedToDeath = (width, height, space, peoples, funnys) => {
  var pics = _.shuffle(_.concat(peoples, funnys));
  var spacePx = Math.floor(space * width);

  var i = 0;

  // randomly scale pics above the baseline and arrange them vertically
  var countAbove = Math.floor(rand(pics.length * 0.3, pics.length * 0.4));
  var completeWidthAbove = spacePx;
  for (i; i < countAbove && i < pics.length; i++) {
    pics[i].width = Math.floor(rand((width / countAbove) * 0.8, (width / countAbove) - ((countAbove + 1) / countAbove) * spacePx));
    pics[i].height = Math.floor(pics[i].width / pics[i].ratio);
    if ((height / 2) - (spacePx / 2) - pics[i].height - spacePx < 0) {
      pics[i].height = Math.floor((height / 2) - (spacePx / 2) - spacePx);
      pics[i].width = Math.floor(pics[i].height * pics[i].ratio);
    }
    pics[i].y = Math.floor((height / 2) - (spacePx / 2) - pics[i].height);
    completeWidthAbove += pics[i].width + spacePx;
  }

  // randomly scale pics below the baseline and arrange them vertically
  var countBelow = Math.floor(rand(pics.length * 0.3, pics.length * 0.5));
  var completeWidthBelow = spacePx;
  for (i; i < countAbove + countBelow && i < pics.length; i++) {
    pics[i].width = Math.floor(rand((width / countBelow) * 0.5, (width / countBelow) - ((countBelow + 1) / countBelow) * spacePx));
    pics[i].height = Math.floor(pics[i].width / pics[i].ratio);
    if ((height / 2) + (spacePx / 2) + pics[i].height + spacePx > height) {
      pics[i].height = Math.floor((height / 2) - (spacePx / 2) - spacePx);
      pics[i].width = Math.floor(pics[i].height * pics[i].ratio);
    }
    pics[i].y = Math.floor((height / 2) + (spacePx / 2));
    completeWidthBelow += pics[i].width + spacePx;
  }

  // arrange the pics horizontally (cluster in the middle of the screen)
  var leftShift = Math.floor(((width - completeWidthAbove) / 2) + spacePx);
  for (i = 0; i < countAbove && i < pics.length; i++) {
    pics[i].x = leftShift;
    leftShift += pics[i].width + spacePx;
  }
  leftShift = Math.floor(((width - completeWidthBelow) / 2) + spacePx);
  for (i; i < countAbove + countBelow && i < pics.length; i++) {
    pics[i].x = leftShift;
    leftShift += pics[i].width + spacePx;
  }

  // maniupulate input objects
  peoples = _.filter(pics, { source: 'p' });
  funnys = _.filter(pics, { source: 'f' });
}

exports.dualTabbedToDeathVertical =  (width, height, space, peoples, funnys) => {

  var spacePx = Math.floor(space * width);

  var tabbedToDeathVertical = (width, height, space, peoples, funnys) => {
    var pics = _.shuffle(_.concat(peoples, funnys));

    var i = 0;

    // randomly scale pics above the baseline and arrange them horizontally
    var countLeft = Math.floor(rand(pics.length * 0.3, pics.length * 0.5));
    var completeHeightLeft = spacePx;
    for (i; i < countLeft && i < pics.length; i++) {
      pics[i].height = Math.floor(rand((height / countLeft) * 0.8, (height / countLeft) - ((countLeft + 1) / countLeft) * spacePx));
      pics[i].width = Math.floor(pics[i].height * pics[i].ratio);
      if ((width / 2) - (spacePx / 2) - pics[i].width - spacePx < 0) {
        pics[i].width = Math.floor((width / 2) - (spacePx / 2) - spacePx);
        pics[i].height = Math.floor(pics[i].width / pics[i].ratio);
      }
      pics[i].x = Math.floor((width / 2) - (spacePx / 2) - pics[i].width);
      completeHeightLeft += pics[i].height + spacePx;
    }

    // randomly scale pics below the baseline and arrange them horizontally
    var countRight = Math.floor(rand(pics.length * 0.3, pics.length * 0.5));
    var completeHeightRight = spacePx;
    for (i; i < countLeft + countRight && i < pics.length; i++) {
      pics[i].height = Math.floor(rand((height / countRight) * 0.5, (height / countRight) - ((countRight + 1) / countRight) * spacePx));
      pics[i].width = Math.floor(pics[i].height * pics[i].ratio);
      if ((width / 2) + (spacePx / 2) + pics[i].width + spacePx > width) {
        pics[i].width = Math.floor((width / 2) - (spacePx / 2) - spacePx);
        pics[i].height = Math.floor(pics[i].width / pics[i].ratio);
      }
      pics[i].x = Math.floor((width / 2) + (spacePx / 2));
      completeHeightRight += pics[i].height + spacePx;
    }

    // arrange the pics vertically (cluster in the middle of the screen)
    var topShift = Math.floor(((height - completeHeightLeft) / 2) + spacePx);
    for (i = 0; i < countLeft && i < pics.length; i++) {
      pics[i].y = topShift;
      topShift += pics[i].height + spacePx;
    }
    topShift = Math.floor(((height - completeHeightRight) / 2) + spacePx);
    for (i; i < countLeft + countRight && i < pics.length; i++) {
      pics[i].y = topShift;
      topShift += pics[i].height + spacePx;
    }

    // maniupulate input objects
    peoples = _.filter(pics, { source: 'p' });
    funnys = _.filter(pics, { source: 'f' });
  }

  // split arrays up
  var leftPeoples = _.slice(peoples, 0, Math.floor(peoples.length / 2));
  var rightPeoples = _.slice(peoples, Math.floor(peoples.length / 2));
  var leftFunnys = _.slice(funnys, 0, Math.floor(funnys.length / 2));
  var rightFunnys = _.slice(funnys, Math.floor(funnys.length / 2));

  // use vertical tabbing algorithm for both
  tabbedToDeathVertical(width / 2, height, space, leftPeoples, leftFunnys);
  tabbedToDeathVertical(width / 2, height, space, rightPeoples, rightFunnys);
  // shift the second half to the right
  for (var pic of rightPeoples) {
    pic.x += Math.floor(width / 2);
  }
  for (var pic of rightFunnys) {
    pic.x += Math.floor(width / 2);
  }

  // manipulate input objects
  peoples = _.concat(leftPeoples, rightPeoples);
  funnys = _.concat(leftFunnys, rightFunnys);
}

var rand = (lowerbound, upperbound) => Math.floor(Math.random() * (upperbound - lowerbound)) + lowerbound;
