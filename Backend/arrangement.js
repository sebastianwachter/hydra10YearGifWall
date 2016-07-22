var _ = require('lodash');
var utils = require('./utils');

exports.baselinePlus = (width, height, space, peoples, funnys) => {
  var picsCount = peoples.length + funnys.length;
  var spacePx = _.round(space * width);
  var baselineCount = _.ceil(picsCount * 0.4); // number of pics in baseline
  baselineCount = baselineCount % 2 === 0 ? baselineCount - 1 : baselineCount;
  var picsWidth = _.round((width / baselineCount) - (((baselineCount + 1) * spacePx) / baselineCount) - (_.random(0, 0.15 * width, true) / baselineCount)); // width of those pics

  // scale all pics, annotate them and merge the arrays for simpler processing
  for (var pic of peoples) {
    pic.width = picsWidth;
    pic.height = _.round(pic.width / pic.ratio);
  }
  for (var pic of funnys) {
    pic.width = picsWidth;
    pic.height = _.round(pic.width / pic.ratio);
  }
  var pics = _.shuffle(_.concat(peoples, funnys))

  // arrange first pics at baseline
  var basePoint = (width / 2) - (picsWidth / 2);
  var i;
  for (i = 0; i < baselineCount; i++) {
    pics[i].x = _.round(basePoint + ((i % 2 === 1 ? 1 : -1) * _.ceil(i / 2)) * (picsWidth + spacePx));
    pics[i].y = _.round((height / 2) - (pics[i].height / 2));
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

  return pics;
}

exports.tabbedToDeath = (width, height, space, peoples, funnys) => {
  var pics = _.shuffle(_.concat(peoples, funnys));
  var spacePx = _.round(space * width);

  var i = 0;

  // randomly scale pics above the baseline and arrange them vertically
  var countAbove = _.floor(_.random(pics.length * 0.3, pics.length * 0.4, true));
  var completeWidthAbove = spacePx;
  for (i; i < countAbove && i < pics.length; i++) {
    pics[i].width = _.round(_.random((width / countAbove) * 0.8, (width / countAbove) - ((countAbove + 1) / countAbove) * spacePx, true));
    pics[i].height = _.round(pics[i].width / pics[i].ratio);
    if ((height / 2) - (spacePx / 2) - pics[i].height - spacePx < 0) {
      var fillHeight = _.round((height / 2) - (spacePx / 2) - spacePx);
      pics[i].height = _.random(0.8 * fillHeight, fillHeight, true);
      pics[i].width = _.round(pics[i].height * pics[i].ratio);
    }
    pics[i].y = _.round((height / 2) - (spacePx / 2) - pics[i].height);
    completeWidthAbove += pics[i].width + spacePx;
  }

  // randomly scale pics below the baseline and arrange them vertically
  var countBelow = _.floor(_.random(pics.length * 0.3, pics.length * 0.4, true));
  var completeWidthBelow = spacePx;
  for (i; i < countAbove + countBelow && i < pics.length; i++) {
    pics[i].width = _.round(_.random((width / countBelow) * 0.8, (width / countBelow) - ((countBelow + 1) / countBelow) * spacePx, true));
    pics[i].height = _.round(pics[i].width / pics[i].ratio);
    if ((height / 2) + (spacePx / 2) + pics[i].height + spacePx > height) {
      var fillHeight = _.round((height / 2) - (spacePx / 2) - spacePx);
      pics[i].height = _.random(0.8 * fillHeight, fillHeight, true);
      pics[i].width = _.round(pics[i].height * pics[i].ratio);
    }
    pics[i].y = _.round((height / 2) + (spacePx / 2));
    completeWidthBelow += pics[i].width + spacePx;
  }

  // arrange the pics horizontally (cluster in the middle of the screen)
  var leftShift = _.round(((width - completeWidthAbove) / 2) + spacePx);
  for (i = 0; i < countAbove && i < pics.length; i++) {
    pics[i].x = leftShift;
    leftShift += pics[i].width + spacePx;
  }
  leftShift = _.round(((width - completeWidthBelow) / 2) + spacePx);
  for (i; i < countAbove + countBelow && i < pics.length; i++) {
    pics[i].x = leftShift;
    leftShift += pics[i].width + spacePx;
  }

  return pics;
}

exports.dualTabbedToDeathVertical =  (width, height, space, peoples, funnys) => {

  var spacePx = _.round(space * width);

  var tabbedToDeathVertical = (width, height, space, peoples, funnys) => {
    var pics = _.shuffle(_.concat(peoples, funnys));

    var i = 0;

    // randomly scale pics above the baseline and arrange them horizontally
    var countLeft = _.floor(_.random(pics.length * 0.3, pics.length * 0.5, true));
    var completeHeightLeft = spacePx;
    for (i; i < countLeft && i < pics.length; i++) {
      pics[i].height = _.round(_.random((height / countLeft) * 0.8, (height / countLeft) - ((countLeft + 1) / countLeft) * spacePx, true));
      pics[i].width = _.round(pics[i].height * pics[i].ratio);
      if ((width / 2) - (spacePx / 2) - pics[i].width - spacePx < 0) {
        pics[i].width = _.round((width / 2) - (spacePx / 2) - spacePx);
        pics[i].height = _.round(pics[i].width / pics[i].ratio);
      }
      pics[i].x = _.round((width / 2) - (spacePx / 2) - pics[i].width);
      completeHeightLeft += pics[i].height + spacePx;
    }

    // randomly scale pics below the baseline and arrange them horizontally
    var countRight = _.floor(_.random(pics.length * 0.3, pics.length * 0.5, true));
    var completeHeightRight = spacePx;
    for (i; i < countLeft + countRight && i < pics.length; i++) {
      pics[i].height = _.round(_.random((height / countRight) * 0.8, (height / countRight) - ((countRight + 1) / countRight) * spacePx, true));
      pics[i].width = _.round(pics[i].height * pics[i].ratio);
      if ((width / 2) + (spacePx / 2) + pics[i].width + spacePx > width) {
        pics[i].width = _.round((width / 2) - (spacePx / 2) - spacePx);
        pics[i].height = _.round(pics[i].width / pics[i].ratio);
      }
      pics[i].x = _.round((width / 2) + (spacePx / 2));
      completeHeightRight += pics[i].height + spacePx;
    }

    // arrange the pics vertically (cluster in the middle of the screen)
    var topShift = _.round(((height - completeHeightLeft) / 2) + spacePx);
    for (i = 0; i < countLeft && i < pics.length; i++) {
      pics[i].y = topShift;
      topShift += pics[i].height + spacePx;
    }
    topShift = _.round(((height - completeHeightRight) / 2) + spacePx);
    for (i; i < countLeft + countRight && i < pics.length; i++) {
      pics[i].y = topShift;
      topShift += pics[i].height + spacePx;
    }

    // maniupulate input objects
    peoples = _.filter(pics, { source: 'p' });
    funnys = _.filter(pics, { source: 'f' });
  }

  // split arrays up
  var leftPeoples = _.slice(peoples, 0, _.floor(peoples.length / 2));
  var rightPeoples = _.slice(peoples, _.floor(peoples.length / 2));
  var leftFunnys = _.slice(funnys, 0, _.floor(funnys.length / 2));
  var rightFunnys = _.slice(funnys, _.floor(funnys.length / 2));

  // use vertical tabbing algorithm for both
  tabbedToDeathVertical(width / 2, height, space, leftPeoples, leftFunnys);
  tabbedToDeathVertical(width / 2, height, space, rightPeoples, rightFunnys);
  // shift the second half to the right
  for (var pic of rightPeoples) {
    pic.x += _.round(width / 2);
  }
  for (var pic of rightFunnys) {
    pic.x += _.round(width / 2);
  }

  return _.concat(leftPeoples, rightPeoples, leftFunnys, rightFunnys);
}

exports.crazyBDay = (width, height, space, result, empty) => {
  var horizontalSwitch = _.random(0.0, 1.0) > 0.5 ? true : false;
  var verticalSwitch = _.random(0.0, 1.0) > 0.5 ? true : false;

  var bDayFileNames = [
    'Happy_bday_escalation.gif', // main bday file
    'Happy_bday_1.gif', // more bday files (arranged around the first)
    'Happy_bday_2.gif',
    'Happy_bday_headnut.gif',
    'Happy_bday_4.gif',
    'Happy_bday_3.gif'
  ];
  var bDayFilePaths = [];
  for (var i = 0; i < bDayFileNames.length; i++) {
    bDayFilePaths[i] = '../gifs/people/' + bDayFileNames[i];
  }

  var bDayFiles = utils.getGifInformations(bDayFilePaths);
  
  for (var k of _.keys(bDayFiles)) {
    bDayFiles[k].name = k;
    bDayFiles[k].source = 'p';
  }
  bDayFiles = _.values(bDayFiles);

  var mainPic = bDayFiles[0];
  mainPic.width = width / 2 > 1.5 * mainPic.width ? mainPic.width : _.round(width / 2);
  mainPic.height = _.round(mainPic.width / mainPic.ratio);
  mainPic.x = horizontalSwitch ? _.round((0.382 * width) - (mainPic.width / 2)) : _.round((0.618 * width) - (mainPic.width / 2));
  mainPic.y = verticalSwitch ? _.round((0.618 * height) - (mainPic.height/2)) : _.round((0.382 * height) - (mainPic.height / 2));

  for (var i = 1; i < bDayFiles.length; i++) {
    bDayFiles[i].width = _.round(0.2 * width);
    bDayFiles[i].height = _.round(bDayFiles[i].width / bDayFiles[i].ratio);
  }

  bDayFiles[1].x = horizontalSwitch ? bDayFiles[0].x + bDayFiles[0].width : bDayFiles[0].x - bDayFiles[1].width;
  bDayFiles[1].y = verticalSwitch ? bDayFiles[0].y + bDayFiles[0].height - _.round(height * 0.05) - bDayFiles[1].height : bDayFiles[0].y + _.round(height * 0.05);

  bDayFiles[2].x = horizontalSwitch ? bDayFiles[1].x : bDayFiles[0].x - bDayFiles[2].width;
  bDayFiles[2].y = verticalSwitch ? bDayFiles[1].y - bDayFiles[2].height : bDayFiles[1].y + bDayFiles[1].height;

  bDayFiles[3].x = horizontalSwitch ? bDayFiles[2].x : bDayFiles[0].x - bDayFiles[3].width;
  bDayFiles[3].y = verticalSwitch ? bDayFiles[2].y - bDayFiles[3].height : bDayFiles[2].y + bDayFiles[2].height;

  bDayFiles[4].x = horizontalSwitch ? bDayFiles[0].x + bDayFiles[0].width - bDayFiles[4].width : bDayFiles[0].x;
  bDayFiles[4].y = verticalSwitch ? bDayFiles[0].y - bDayFiles[4].height : bDayFiles[0].y + bDayFiles[0].height;

  bDayFiles[5].x = horizontalSwitch ? bDayFiles[4].x - bDayFiles[5].width : bDayFiles[4].x + bDayFiles[4].width;
  bDayFiles[5].y = verticalSwitch ? bDayFiles[4].y :  bDayFiles[4].y;

  return bDayFiles;
}
