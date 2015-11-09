// Create the defaults once
var pluginName = "cli_guide",
    defaults = {
      welcomeMessage: 'Welcome to the interactive tutorial',
      nameOfTheProject: 'CLI-Guide.JS',
      heightTerminal: window.innerHeight,
      commandStepsFile: "",
      commandValidation: "",
      preloadfile: "",
      stepsFile : "",
      skipsteps: "",
      labels : {
        next: "Next",
        skip: "Skip"
      }
    };

// The actual plugin constructor
function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
}
