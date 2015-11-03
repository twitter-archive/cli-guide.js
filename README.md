# CLI Guide jQuery Plugin v0.1.4

[![npm version](http://marti1125.webfactional.com/npm.svg)](https://www.npmjs.com/package/cli-guide.js)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/twitter/cli-guide.js/master/LICENSE)

> A Javascript library for creating interactive command line tutorials that run in your web browser.

Necessary Files
-----------------

### Libs

* [jQuery](https://jquery.com/download/)
* [Prism](http://prismjs.com/download.html)

Demos
-----

* [Apache Aurora](http://twitter.github.io/cli-guide.js/demo/aurora.html)


Documentation
-------------

#### Example

    $('#stepsdiv').cliguide({
        nameOfTheProject: 'Apache Aurora'
    }).cli({
      stepsFile: 'templates/apache_aurora.json',
      skipsteps: '1,2',
      commandStepsFile: 'templates/apache_aurora_commands.json',
      commandValidation: 'templates/apache_aurora_commands_validations.json',
      preloadfile: 'templates/apache_aurora_files.json'
    }, function(){
        //Codes in here will be runned after CLI functions run
    });

#### Options

| Property | Description | Required |
|---|---|---|
| nameOfTheProject | name of the project | X |
| stepsFile        | a .json file | X |
| skipsteps | number of the step separated by comma | optional |
| commandStepsFile | a .json file | X |
| preloadfile | a .json file | optional |

#### The structure of .json files

#### stepsFile

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

#### commandStepsFile

    [
      {
    	  "command":"hello world!",
    	  "result": "test...."
      }
    ]

#### preloadfile

    [
     {
       "name":"test.txt",
       "content": "Hello World!"
     },
     {
       "name":"hello.py",
       "content": "print(\"Hello World!\")"
     }
    ]

Build
-------------
    $ npm install
    $ gulp


License
-------

Copyright 2015 Twitter, Inc.

Licensed under the MIT License
