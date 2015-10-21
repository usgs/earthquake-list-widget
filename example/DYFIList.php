<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'DYFI List';
  $HEAD = '<link rel="stylesheet" href="DYFIList.css"/>';
  $FOOT = '<script src="DYTIList.js"></script>';
}
include '_example.inc.php';

?>

<div id="example">

<h2>Other Formats</h2>
<ul>
  <li><a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a></li>
  <li><a href="ShakeMapList.php<?php echo $templateLink ?>">ShakeMap List</a></li>
  <li><a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a></li>
</ul>

<section class="pastday list">
  <h2>Matching Results Past 24 Hours</h2>
  <div id="pastday-list"></div>
</section>
<section class="pastweek list">
  <h2>Felt Events Past 7 Days</h2>
  <div id="pastweek-list"></div>
</section>

<script src="earthquake-list-widget.js"></script>
<script>
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
</script>

</div>
