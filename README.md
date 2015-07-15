# CLI Guide JQuery Plugin

GSOC 2015 Project

A javascript library for creating interactive command line tutorials that run in your web browser

Demos
-----

* [Apache Aurora](http://twitter.github.io/cli-guide.js/demo/aurora.html)
* [Chef](http://twitter.github.io/cli-guide.js/demo/chef.html)


Documentation
-------------

####Example

    $('#stepsdiv').cliguide(
    {
      nameOfTheProject: 'Apache Aurora',
      stepsFile:        'templates/apache_aurora.json'
    }).cli(
    {
      commandStepsFile: 'templates/apache_aurora_commands.json'},
      function(){
    });

####Options

| Property | Description |
|---|---|
| welcomeMessage   | Message of welcome to the tutorial |
| nameOfTheProject | name of the project  |
| heightTerminal   | by default is the height of the window |
| stepsFile        | a .json file |
| commandStepsFile | a .json file |

####The structure of .json files

####stepsFile

    [
      {
        "step": "0",
        "content": {
            "title": "Setup: Install Aurora 0",
            "content": [
                " You use the Aurora client and web UI to interact with Aurora jobs. ",
                " To install it locally, see vagrant.md. The remainder of this Tutorial ",
                " assumes you are running Aurora using Vagrant. Unless otherwise stated, ",
                " all commands are to be run from the root of the aurora repository clone."
            ],
            "tips": "You can run $ <i>aurora</i> for see all commands"
        }
      }
    ]

####commandStepsFile

    [
      {
    	  "command":"hello world!",
    	  "result": "test...."
      }
    ]


Components
-------------

####Termianl

![terminal](https://raw.github.com/twitter/cli-guide.js/master/terminal.gif)

####Nano Editor

![nano editor](https://raw.github.com/twitter/cli-guide.js/master/nano.gif)

Build
-------------
    $ npm install
    $ gulp


License
-------

Copyright 2015 Twitter, Inc.

Licensed under the MIT License
