Blog GAE
========

A simple Blog. This example demonstrates how to create real world applications
using Nitro and AppEngine.

WARNING: this example is under construction!!

Homepage: http://nitrojs.org/

Source & Download: http://github.com/gmosx/blog-gae/

Mailing list: http://groups.google.com/group/nitro-devel

Issue tracking: http://github.com/gmosx/nitro/issues

IRC: #nitro on irc.freenode.net    


Getting Started
---------------

This example depends on several Narwhal (www.narwhaljs.org) packages:

* narwhal
* jack
* nitro
* appengine
* template

At the moment, customized versions of Narwhal and Jack are required. Please get patched versions from:
    
	http://github.com/gmosx/jack
	http://github.com/gmosx/narwhal

Until we have an automated setup script you have to manually setup the packages dir as follows:

	war/WEB-INF/packages/appengine/lib -> symbolic link
	war/WEB-INF/packages/appengine/package.json -> symbolic link
	war/WEB-INF/packages/jack/lib -> symbolic link
	war/WEB-INF/packages/jack/package.json -> symbolic link
	war/WEB-INF/packages/narwhal/lib -> symbolic link
	war/WEB-INF/packages/narwhal/package.json -> symbolic link
	war/WEB-INF/packages/narwhal/local.json -> symbolic link
	war/WEB-INF/packages/narwhal/narwhal.conf -> symbolic link
	war/WEB-INF/packages/narwhal/narwhal.js -> symbolic link
	war/WEB-INF/packages/narwhal/engines/default -> symbolic link
	war/WEB-INF/packages/narwhal/engines/rhino -> symbolic link
	war/WEB-INF/packages/narwhal/engines/secure -> symbolic link
	war/WEB-INF/packages/nitro/lib -> symbolic link
	war/WEB-INF/packages/nitro/package.json -> symbolic link
	war/WEB-INF/packages/template/lib -> symbolic link
	war/WEB-INF/packages/template/package.json -> symbolic link

You may wish to edit build.xml (for example to point sdk.dir to the directory where the
appengine-java-sdk resides)

    $ ant runserver

The application will start listening at localhost:8080, so use your favourite browser to verify that everything works correctly. 

WARNING: Do *not* use narwhal/bin/sea before runnin ant runserver!

Don't forget to click the link 'Reset db' in the right-hand sidebar to initialize the database!


Running on AppEngine
--------------------

To prepare the application for deployment to Google App Engine, edit the web.xml file:

    <init-param>
        <param-name>environment</param-name>
        <param-value>hosted</param-value>
    </init-param>
    <init-param>
        <param-name>optimizationLevel</param-name>
        <param-value>9</param-value>
    </init-param>	

This change enables the 'hosted' jack environment (instead of the default 'local' environment). It also sets the Rhino optimization level to the max setting.


Credits
-------

* George Moschovitis <george.moschovitis@gmail.com>


License
-------

Copyright (c) 2009 George Moschovitis, http://gmosx.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
