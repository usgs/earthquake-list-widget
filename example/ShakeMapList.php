<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'ShakeMap List';
  $HEAD = '<link rel="stylesheet"></script>';
  $FOOT = '<script src="ShakeMapList.js"></script>';
}
include '_example.inc.php';

?>

<div id="example">
  <h2>Other Formats</h2>
  <ul>
    <li><a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a></li>
    <li><a href="DYFIList.php<?php echo $templateLink ?>">DYFI List</a></li>
    <li><a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a></li>
  </ul>

  <section class="list">
    <h2>Matching Results Past 7 Days</h2>
    <div id="list"></div>
  </section>

  <script src="earthquake-list-widget.js"></script>
  <script>
  'use strict';

  var EqList = require('listwidget/EqList'),
      ShakeMapList = require('listwidget/ShakeMapList');

  ShakeMapList({
    container: document.querySelector('#list'),
    feed: EqList.ALL_URL_WEEK
  });

  </script>
</div>
