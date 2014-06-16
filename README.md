earthquake-list
==============

A javascript package for displaying recent earthquake information on a webpage.

Getting Started
---------------

TODO

Custom Lists
------------

A list can be customized in several ways.

First, specifying URLs for different source sets of data can change which events
appear in the list. The EqList class specifies several available feeds to choose
from. See the source code for the EqList class for details.

If a predefined feed does not provide the exact sub-set of earthquake data, it
is recommended one selects the smallest feed that is a superset of the desired
earthquakes, then provide a custom ```includeEvent``` method as an optional
parameter to the constructor.

Sort order is also customizable by providing the ```compareEvents``` method as
an additional optional parameter to the constructor.

One may also customize the list output format by extending the EqList class.
The EqList class provides several extension points for customization. At the
highest level, one can override the ```_getEventMarkup``` method (see source
code for details).

If only minor changes are desired, one can override a sub-method (again, see
source code for details):

- ```_getEventValue```
- ```_getEventTitle```
- ```_getEventSubtitle```
- ```_getEventAside```


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
