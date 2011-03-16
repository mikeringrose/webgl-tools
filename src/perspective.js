var transformation;

if (!transformation) 
	transformation = {};
	
transformation.Frustrum = function() {
	
	function Frustrum(left, right, bottom, top, near, far) {
		var X = 2 * near / (right - left),
			Y = 2 * near / (top - bottom),
			A = (right + left) / (right - left),
			B = (top + bottom) / (top - bottom),
			C = -(far + near) / (far - near),
			D = (-2 * far * near) / (far - near);
		
		this.R = $M([	[ X,	0,	A,	0 ],
						[ 0,	Y,	B,	0 ],
						[ 0,	0,	C,	D ],
						[ 0,	0,	-1,	0 ]
					]);
	}
	
	return Frustrum;
	
}();
	
transformation.Perspective = function() {
	
	function Perspective(fovy, aspect, near, far) {
		var top = near * Math.tan(fovy * Math.PI / 360.0);
	    var bottom = -top;
	    var left = bottom * aspect;
	    var right = top * aspect;
	
		this._frustrum = new transformation.Frustrum(left, right, bottom, top, near, far);
	}
	
	Perspective.prototype.flatten = function() {
		var flats = new Array(),
			elements = this._frustrum.R.elements;
			
		if (elements.length == 0)
			return [];


		for (var j = 0; j < elements[0].length; j++) 
			for (var i = 0; i < elements.length; i++)
				flats.push(elements[i][j]);
			
		return flats;		
	};
	
	return Perspective;
	
}();