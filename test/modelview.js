describe("ModelView", function() {
  	var modelView;

  	beforeEach(function() {
		modelView = new transformation.ModelView();
  	});

  	it("new modelview set to identity matrix", function() {
  		expect(modelView.flatten()).toEqual([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  	});

  	it("test one translate", function() {
		modelView.translate($V([-2.0, 0.0, -5.0]));
		expect(modelView.flatten()).toEqual([1,		0,	0,		0,
											 0,		1,	0,		0,
											 0,		0,	1,		0,
											 -2.0,	0,	-5.0,	1]);
	});
	
  	it("test two translations", function() {
		modelView.translate($V([-2.0, 0.0, -5.0]));
		expect(modelView.flatten()).toEqual([1,		0,	0,		0,
											 0,		1,	0,		0,
											 0,		0,	1,		0,
											 -2.0,	0,	-5.0,	1]);
											
		modelView.translate($V([-3.0, 1.0, 5.0]));
		expect(modelView.flatten()).toEqual([1,		0,	0,		0,
											 0,		1,	0,		0,
											 0,		0,	1,		0,
											-5.0,	1,	0,		1]);											
	});	
	
	it("test rotateX", function() {
		modelView.rotateX(90);
		expect(modelView.getMatrix().elements[2][1]).toEqual(1);
		expect(modelView.getMatrix().elements[1][2]).toEqual(-1);		
	});
	
	it("test rotateY", function() {
		modelView.rotateY(90);
	});
	
	it("test rotateZ", function() {
		modelView.rotateZ(90);
	});		
});
