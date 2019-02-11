<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Default Earthquake List';
  $HEAD = '<link rel="stylesheet" href="earthquake-list-widget.css"/>';
  $FOOT = '<script src="earthquake-list-widget.js"></script>' .
      '<script src="EqList.js"></script>';
}

include '_example.inc.php';

?>

<h2>Other Formats</h2>
<ul>
  <li>
    <a href="DYFIList.php<?php echo $templateLink ?>">DYFI List</a>
  </li>
  <li>
    <a href="ShakeMapList.php<?php echo $templateLink ?>">ShakeMap List</a>
  </li>
  <li>
    <a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a>
  </li>
</ul>

<section class="list">
  <h2>M2.5+ Earthquakes Worldwide, Past Day</h2>
  <div id="list"></div>
</section>
