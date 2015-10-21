'use strict';

var DYFIList = require('listwidget/DYFIList'),
    EqList = require('listwidget/EqList');

// All events in past day
DYFIList({
  container: document.querySelector('#pastday-list'),
  feed: EqList.ALL_URL_DAY
});

// All events in past week, filtered to only those with > 5 felt reports
DYFIList({
  container: document.querySelector('#pastweek-list'),
  feed: EqList.ALL_URL_WEEK,
  includeEvent: function (e) {
    var p = e.properties;
    return (p.types.indexOf('dyfi') !== -1 && p.felt !== null && p.felt > 5);
  }
});
