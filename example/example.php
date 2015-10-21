<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'Example Index';
}
include '_example.inc.php';

?>
<h1>Earthquake List Widget Examples</h1>
<ul>
  <li><a href="EqList.php<?php echo $templateLink ?>">Default Eathquake List</a></li>
  <li><a href="DYFIList.php<?php echo $templateLink ?>">DYFI List</a></li>
  <li><a href="ShakeMapList.php<?php echo $templateLink ?>">ShakeMap List</a></li>
  <li><a href="PAGERList.php<?php echo $templateLink ?>">PAGER List</a></li>
</ul>
