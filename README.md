# CLI Guide jQuery Plugin v0.1.4

[![npm version](http://marti1125.webfactional.com/npm.svg)](https://www.npmjs.com/package/cli-guide.js)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/twitter/cli-guide.js/master/LICENSE)

> A Javascript library for creating interactive command line tutorials that run in your web browser.

Dependencies
-----------------

* [jQuery](https://jquery.com/download/)
* [Prism](http://prismjs.com/download.html)

Demos
-----

* [Apache Aurora](http://twitter.github.io/cli-guide.js/tutorials/aurora.html)


Documentation (progress...)
-------------

#### Example


      $('#stepsdiv').cli_guide({
        nameOfTheProject: 'Apache Aurora',
        stepsFile: 'templates/apache_aurora.json',
        skipsteps: '1,2',
        commandStepsFile: 'templates/apache_aurora_commands.json',
        commandValidation: 'templates/apache_aurora_commands_validations.json',
        preloadfile: 'templates/apache_aurora_files.json'
      });

Build
------

- Install node modules

      $ npm install

- For generate files

      $ npm start

- For development

      $ gulp develop

License
-------

Copyright 2015 Willy Aguirre

Licensed under the MIT License
