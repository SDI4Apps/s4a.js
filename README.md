# s4a

SDI4Apps Client Side Javascript Library

## Getting Started
### On the server
Install the module with: `npm install s4a`

```javascript
var s4a = require('s4a');
s4a.awesome(); // "awesome"
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/SDI4Apps/s4a.js/master/dist/s4a.min.js
[max]: https://raw.github.com/SDI4Apps/s4a.js/master/dist/s4a.js

In your web page:

```html
<script src="dist/s4a.min.js"></script>
<script>
awesome(); // "awesome"
</script>
```

In your code, you can attach s4a's methods to any object.

```html
<script>
var exports = Bocoup.utils;
</script>
<script src="dist/s4a.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 SDI4Apps Partnership  
Licensed under the MIT license.
