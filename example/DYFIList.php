<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'DYFI List';
  $HEAD = '<link rel="stylesheet" href="earthquake-list-widget.css"/>';
  $FOOT = '<script src="earthquake-list-widget.js"></script>' .
      '<script src="DYFIList.js"></script>';
}
include '_example.inc.php';

?>

<h2>Other Formats</h2>
<ul>
  <li>
    <a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a>
  </li>
  <li>
    <a href="ShakeMapList.php<?php echo $templateLink ?>">ShakeMap List</a>
  </li>
  <li>
    <a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a>
  </li>
</ul>

<section class="pastday list">
  <h2>Matching Results Past 24 Hours</h2>
  <div id="pastday-list"></div>
</section>
<section class="pastweek list">
  <h2>Felt Events Past 7 Days</h2>
  <div id="pastweek-list"></div>
</section>
