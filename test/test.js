
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

