var transformation;

if (!transformation) 
	transformation = {};

/**
 *  ModelView class that emulates a lot of the behavior found in OpenGL 1.1 and earlier.
 */
transformation.ModelView = function() {
	function _ensure4x4(m) {
		
	}
	
	/**
	 *  Simple constructor that initializes the model view matrix to the identity matrix.
	 */
	function ModelView() {
		this._matrixStack = new Array();
		this._modelViewMatrix = Matrix.I(4);
	}

	/**
	 *	translates the current model view matrix by adding it to the current state of the matrix
	 *  @param	vec	takes a Vector or an array of 3 elements
	 */
	ModelView.prototype.translate = function(vec) {
		var elements = (vec instanceof Vector) ? vec.elements : vec;
		this._modelViewMatrix.elements[0][3] += elements[0];
		this._modelViewMatrix.elements[1][3] += elements[1];
		this._modelViewMatrix.elements[2][3] += elements[2];
			
		return this;
	};
	
	ModelView.prototype.rotate = function(theta, vector) {
		var rads = theta * Math.PI / 180,
			rotationMatrix = Matrix.Rotation(rads, vector).ensure4x4();
			
		this._modelViewMatrix = this._modelViewMatrix.x(rotationMatrix);
		
		return this;
	};
	
	ModelView.prototype.rotateX = function(theta) {
		//- rotate X
		var rads = theta * Math.PI / 180;
		this._modelViewMatrix.elements[1][1] = Math.cos(rads);
		this._modelViewMatrix.elements[1][2] = -Math.sin(rads);
		this._modelViewMatrix.elements[2][1] = Math.sin(rads);
		this._modelViewMatrix.elements[2][2] = Math.cos(rads);
		
		return this;
	};
	
	ModelView.prototype.rotateY = function(theta) {
		//- rotate Y
		var rads = theta * Math.PI / 180;
		this._modelViewMatrix.elements[0][0] = Math.cos(rads);
		this._modelViewMatrix.elements[0][2] = Math.sin(rads);
		this._modelViewMatrix.elements[2][0] = -Math.sin(rads);
		this._modelViewMatrix.elements[2][2] = Math.cos(rads);
				
		return this;
	};	
	
	ModelView.prototype.rotateZ = function(theta) {
		//- rotate Z
		var rads = theta * Math.PI / 180;
		this._modelViewMatrix.elements[0][0] = Math.cos(rads);
		this._modelViewMatrix.elements[0][1] = -Math.sin(rads);
		this._modelViewMatrix.elements[1][0] = Math.sin(rads);
		this._modelViewMatrix.elements[1][1] = Math.cos(rads);
		
		return this;
	};	
	
	/**
	 *
	 */
	ModelView.prototype.scale = function(vec) {
		this._modelViewMatrix.elements[0][0] = vec[0];
		this._modelViewMatrix.elements[1][1] = vec[1];		
		this._modelViewMatrix.elements[2][2] = vec[2];
		
		return this;
	};
	
	ModelView.prototype.identity = function() {
		this._modelViewMatrix = Matrix.I(4);
		
		return this;
	};
	
	ModelView.prototype.push = function() {
		this._matrixStack.push(this._modelViewMatrix.dup());
	};
	
	ModelView.prototype.pop = function() {
		this._modelViewMatrix = this._matrixStack.pop();
	};
	
	ModelView.prototype.getNormalMatrix = function() {
		var normalMatrix = this._modelViewMatrix.inverse();
		normalMatrix = normalMatrix.transpose();
		
		return normalMatrix;
	};
	
	/**
	 * Remove this method as we return the matrix, so flatten should be a method off the matrix.
	 */
	ModelView.prototype.flatten = function() {
		var flats = new Array(),
			elements = this._modelViewMatrix.elements;
			
		if (elements.length == 0)
			return [];


		for (var j = 0; j < elements[0].length; j++) 
			for (var i = 0; i < elements.length; i++)
				flats.push(elements[i][j]);
			
		return flats;
	};
	
	ModelView.prototype.getMatrix = function() {
		return this._modelViewMatrix;
	}
	
	return ModelView;
}();

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};