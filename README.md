earthquake-list-widget
======================

A javascript package for displaying recent earthquake information on a webpage.

Getting Started
---------------

To embed an earthquake list widget on your webpage, download and build the
distributable code from this respository. Once you have built the
```dist/earthquake-list-widget.js``` and ```dist/earthquake-list-widget.css```
files, place them on your web server at an HTTP addressable URL. These files
should be placed next to each other (in the same directory) on the web server.

Next, add a container element to your HTML page where you would like to embed
the widget.
```html
...
<div id="list-widget-container"></div>
...
```

Now include the ```earthquake-list-widget.js``` script on your page. Be sure
you correctly reference the path to where you placed the script on your server.
```html
...
<script src="path-to-js/earthquake-list-widget.js"></script>
...
```

Finally, write a tiny bit of Javascript in order to put the widget into your
page:
```html
<script>
var EqList = require('listwidget/EqList');
EqList({
  container: document.querySelector('#list-widget-container'),
  feed: EqList.SIG_URL_MONTH
});
</script>
```

The [examples directory](example) contains additional usage examples.

Custom Lists
------------

A list can be customized in several ways.

First, you can provide a different URL for the ```feed``` parameter to the
constructor. Any URL specified must return data in the
[USGS GeoJSONP feed format](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

If a predefined feed does not provide the exact sub-set of earthquake data, it
is recommended one use the smallest feed that is a superset of the desired
earthquakes, then provide a custom ```includeEvent``` method as an optional
parameter to the constructor.

Sort order is also customizable by providing the ```compareEvents``` method as
an additional optional parameter to the constructor. The ```compareEvents```
function should conform to the
[```Array.sort([compareFunction])```](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
definition.

One may also customize the list output format by extending the EqList class.
The EqList class provides several extension points for customization. At the
highest level, one can override the ```getEventMarkup``` method (see source
code for details).

If only minor changes are desired, one can override a sub-method (again, see
source code for details):

- ```getEventValue```
- ```getEventTitle```
- ```getEventSubtitle```
- ```getEventAside```

Also, when sub-classing the EqList class, one may also create custom
```includeEvent``` and ```compareEvents``` methods if so desired.


License
-------

Unless otherwise noted, This software is in the public domain because it
contains materials that originally came from the United States Geological
Survey, an agency of the United States Department of Interior. For more
information, see the official USGS copyright policy at
http://www.usgs.gov/visual-id/credit_usgs.html#copyright

Dependent libraries found are distributed under the open source (or open
source-like) licenses/agreements. Appropriate license aggrements for each
library can be found with the library content.

### Libraries used at runtime
