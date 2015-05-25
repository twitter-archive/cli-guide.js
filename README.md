# cli-guide.js | [Demo](http://marti1125.webfactional.com/cli-guide/)
GSOC 2015 Project

Make a cli interactive for understand how to works any kind of project like Apache Aurora, 
this project is inspired in [https://www.docker.com/tryit/#0](https://www.docker.com/tryit/#0) 
We make a tutorial for explain step by step how to get started with Apache Aurora and you can run commands 
without installing anything.


Documentation
-------------

####Options

    $('#stepsdiv').cliguide({
		welcomeMessage: 'Welcome to the interactive tutorial',
        nameOfTheProject: 'Apache Aurora',
        heightTerminal: window.innerHeight,
        stepsFile: 'src/listofsteps.json'
	});

####Nano Editor (in progress...)

You only have to write `$ nano` in the terminal and ctrl + x for return

![1](https://raw.github.com/twitter/cli-guide.js/master/nano.png)

License
-------

Copyright 2015 Twitter, Inc.

Licensed under the MIT License
