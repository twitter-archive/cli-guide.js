describe("Test plugin", function() {
  it("valid if div load template from plugin", function() {
    var contentDivTest = false;
	  $('#test').cliguide()
	  if( $.trim($('#test').html()).length > 0 ){
	  	contentDivTest = true
	  }
    expect(contentDivTest).toBe(true," $('#test') is empty because plugin doesn't load ");
  });
});

describe("Validating JSON Schema", function() {
  it("Validating List of Steps", function() {

    // create new JJV environment
    var env = jjv();

    env.addSchema('step', {
      "type": "object",
      "properties": {
        "step": { "type": "string" },
        "content": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "content": {
              "type": "array",
              "items": [
                { "type": "string" },
                { "type": "string" },
                { "type": "string" },
                { "type": "string"}
              ]
            },
            "tips": { "type": "string" }
          }
        }
      },
      "required": [ "step", "content" ]
    });

    var step = {
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

    // validation
    var errors = env.validate('step', step);

    // null = It has not errors
    expect(errors).toBe(null);

  });
  it("Validating List of Commands", function() {

    // create new JJV environment
    var env = jjv();

    env.addSchema('command', {
      "type": "object",
      "properties": {
        "command": { "type": "string" },
        "result": { "type": "string" },
      },
      "required": [ "command", "result" ]
    });

    var command = {
      "command":"cordova platform add android",
      "result": "Creating Cordova project for the Android platform"
    }

    // validation
    var errors = env.validate('command', command);

    // null = It has not errors
    expect(errors).toBe(null);

  });
});
