<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'ShakeMap List';
  $HEAD = '<link rel="stylesheet"href="earthquake-list-widget.css"/>';
  $FOOT = '<script src="earthquake-list-widget.js"></script>' .
      '<script src="ShakeMapList.js"></script>';
}
include '_example.inc.php';

?>

<h2>Other Formats</h2>
<ul>
  <li>
    <a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a>
  </li>
  <li>
    <a href="DYFIList.php<?php echo $templateLink ?>">DYFI List</a>
  </li>
  <li>
    <a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a>
  </li>
</ul>

<section class="list">
  <h2>Matching Results Past 7 Days</h2>
  <div id="list"></div>
</section>
