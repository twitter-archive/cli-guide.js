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
                { "type": "string" },
                { "type": "string" },
                { "type": "string" },
                { "type": "string"}
              ]
            },
            "tips": { "type": "string" },
            "commands": {
              "type": "array",
              "items": [
                { "command": { "type": "string" } },
                { "command": { "type": "string" } },
                { "command": { "type": "string" } }
              ]
            }
          }
        },
        "laststep": { "type": "boolean" }
      },
      "required": [ "step", "content" ]
    });

    var step = {
      "step": "1",
      "content": {
        "title": "Setup: Install Aurora",
        "content": [
          " You use the Aurora client and web UI to interact with Aurora jobs. ",
          " To install it locally, see ",
          " <a class=\"link-b\" href='http://aurora.apache.org/documentation/latest/vagrant/' target=\"_blank\">vagrant.md</a> ",
          " The remainder of this Tutorial assumes you are running ",
          " Aurora using Vagrant. Unless otherwise stated, ",
          " all commands are to be run from the root ",
          " of the aurora repository clone. "
        ],
        "tips": "let's try with following commands",
        "commands": [
          {"command":"git clone git://git.apache.org/aurora.git"},
          {"command":"cd aurora"},
          {"command":"vagrant up"}
        ]
      },
      "laststep": false
    };

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
        "step": { "type": "string" },
        "count": { "type": "string" },
        "commands": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "order": { "type": "number" },
              "command": { "type": "string" },
              "type": { "type": "string" },
              "depend": { "type": "string" },
              "lastCommand": { "type": "boolean" },
            }
          }
        }
      },
      "required": [ "step", "commands" ]
    });

    var command = {
      "step": "2",
      "count": "1",
      "commands": [
        {
          "order" : 0,
          "command":"ls",
          "type": "native",
          "depend": "",
          "lastCommand": true
        }
      ]
    };

    // validation
    var errors = env.validate('command', command);

    // null = It has not errors
    expect(errors).toBe(null);

  });
});
