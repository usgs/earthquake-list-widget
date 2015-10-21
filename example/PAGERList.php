<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Pager List';
  $HEAD = '<link rel="stylesheet" href="PAGERList.css"/>';
  $FOOT = '<script src="PAGERList.js"></script>';
}
include '_example.inc.php';

?>

<div id="example">
  <h2>Other Formats</h2>
  <ul>
    <li><a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a></li>
    <li><a href="DYFIList.php<?php echo $templateLink ?>">DYFI List</a></li>
    <li><a href="ShakeMapList.php<?php echo $templateLink ?>">ShakeMap List</a></li>
  </ul>

  <section class="list">
    <h2>Matching Results Past 7 Days</h2>
    <div id="list"></div>
  </section>

  <script src="earthquake-list-widget.js"></script>
  <script>
  'use strict';

  var EqList = require('listwidget/EqList'),
      PAGERList = require('listwidget/PAGERList');

  PAGERList({
    container: document.querySelector('#list'),
    feed: EqList.ALL_URL_WEEK
  });

  </script>
</div>
