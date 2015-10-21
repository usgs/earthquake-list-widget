'use strict';

var EqList = require('listwidget/EqList'),
    PAGERList = require('listwidget/PAGERList');

PAGERList({
  container: document.querySelector('#list'),
  feed: EqList.ALL_URL_WEEK
});
