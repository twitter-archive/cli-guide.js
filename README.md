# cli-guide.js | [Demo](http://marti1125.webfactional.com/cli-guide/)
GSOC 2015 Project

Make a cli interactive for understand how to works any kind of project like Apache Aurora,
this project is inspired in [https://www.docker.com/tryit/#0](https://www.docker.com/tryit/#0)
We make a tutorial for explain step by step how to get started with Apache Aurora and you can run commands
without installing anything.


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

####Nano Editor (in progress...)

You only have to write `$ nano` in the terminal and ctrl + x for return

![1](https://raw.github.com/twitter/cli-guide.js/master/nano.png)

License
-------

Copyright 2015 Twitter, Inc.

Licensed under the MIT License
