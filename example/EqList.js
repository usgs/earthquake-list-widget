'use strict';

var EqList = require('listwidget/EqList');

EqList({
  container: document.querySelector('#list'),
  feed: EqList.M25_URL_DAY
});
