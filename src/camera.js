var transformation;

if (!transformation) 
	transformation = {};
	
transformation.Camera = function() {
	
	function Camera() {
		this._cameraMatrix = Matrix.I(4);
	}

	// =========================================
	// = Imitates the OpenGL lookat function.  =
	// =========================================
	Camera.prototype.lookAt = function(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz) {
		var eye = $V([eyex, eyey, eyez]),
	    	center = $V([centerx, centery, centerz]),
	    	up = $V([upx, upy, upz]),
			a = eye.subtract(center).toUnitVector(), 	
			r = up.cross(a).toUnitVector(),				//- calculate the x vector
			u = a.cross(r).toUnitVector(); 				//- calculate the up vector
	
		var r = $M([
					[ r.e(1),	u.e(1), 	a.e(1), 0 ],
					[ r.e(2), 	u.e(2), 	a.e(2), 0 ],
					[ r.e(3), 	u.e(3),		a.e(3), 0 ],
					[ 0, 		0, 			0, 		1 ]
					]);
	
		var t = $M([
					[ 1, 0, 0, -eyex ],
					[ 0, 1, 0, -eyey ],
					[ 0, 0, 1, -eyez ],
					[ 0, 0, 0, 1     ]
					]);
		
		this._cameraMatrix = r.x(t);
	};
	
	Camera.prototype.flatten = function() {
		var flats = new Array(),
			elements = this._cameraMatrix.elements;
			
		if (elements.length == 0)
			return [];


		for (var j = 0; j < elements[0].length; j++) 
			for (var i = 0; i < elements.length; i++)
				flats.push(elements[i][j]);
			
		return flats;	
	};
	
	return Camera;
}();