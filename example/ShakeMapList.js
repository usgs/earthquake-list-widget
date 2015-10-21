'use strict';

var EqList = require('listwidget/EqList'),
    ShakeMapList = require('listwidget/ShakeMapList');

ShakeMapList({
  container: document.querySelector('#list'),
  feed: EqList.ALL_URL_WEEK
});
