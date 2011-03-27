// 
//  modelview.js
//  webgl
//  
//  Created by Mike Ringrose on 2011-03-20.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
// 

// ================================
// = The transformation namespace =
// ================================
var transformation = transformation || {};

/**
 *  ModelView class that emulates a lot of the behavior found in OpenGL 1.1 and earlier.
 */
transformation.ModelView = function() {
    /**
     *  Simple constructor that initializes the model view matrix to the identity matrix.
     */
    function ModelView() {
        this._matrixStack = new Array();
        this._modelViewMatrix = Matrix.I(4);
    }

    /**
     *  translates the current model view matrix by adding it to the current state of the matrix
     *  @param  vec takes a Vector or an array of 3 elements
     */
    ModelView.prototype.translate = function(vec) {
        var elements = (vec instanceof Vector) ? vec.elements : vec;
        this._modelViewMatrix.elements[0][3] += elements[0];
        this._modelViewMatrix.elements[1][3] += elements[1];
        this._modelViewMatrix.elements[2][3] += elements[2];
            
        return this;
    };
    
    /**
     * creates a rotation matrix around theta degrees around the supplied vector
     * @param theta degrees to rotate
     * @vector around which to rotate the vertex
     */
    ModelView.prototype.rotate = function(theta, vector) {
        var t = theta * Math.PI / 180,
            u = vector.elements[0],
            u2 = Math.pow(u, 2),
            v = vector.elements[1],
            v2 = Math.pow(v, 2),
            w = vector.elements[2],
            w2 = Math.pow(w, 2),
            c = Math.cos(t),
            s = Math.sin(t),
            elements = this._modelViewMatrix.elements;
            
        var rm = $M([ [ u2+(1-u2)*c,    u*v*(1-c)-w*s,   u*w*(1-c)+v*s, 0 ],
                	  [ u*v*(1-c)+w*s,  v2+(1-v2)*c,    v*w*(1-c)-u*s,  0 ],
                	  [ u*w*(1-c)-v*s,  v*w*(1-c)+u*s,  w2+(1-w2)*c,  0 ],
                	  [ 0, 0,  0, 1] ]);     
        
        this._modelViewMatrix = this._modelViewMatrix.x(rm);

        return this;
    };  
    
    /**
     * simple rotation around the x-axis.
     * @theta degrees to rotate
     */
    ModelView.prototype.rotateX = function(theta) {
        //- rotate X
        var rads = theta * Math.PI / 180;
        var m = $M([
                [1,     0,                      0,                      0],
                [0,     Math.cos(rads),         -Math.sin(rads),        0],
                [0,     Math.sin(rads),         Math.cos(rads),         0],
                [0,     0,                      0,                      1]
            ]);  
        this._modelViewMatrix = this._modelViewMatrix.x(m);                   
        return this;
    };
    
    /**
     * simple rotation around the y-axis.
     * @theta degrees to rotate
     */
    ModelView.prototype.rotateY = function(theta) {
        //- rotate Y
        var rads = theta * Math.PI / 180;
        var m = $M([
                [Math.cos(rads),    0,      Math.sin(rads),         0],
                [0,                 1,      0,                      0],
                [-Math.sin(rads),   0,      Math.cos(rads),         0],
                [0,                 0,      0,                      1]
            ]);                
        this._modelViewMatrix = this._modelViewMatrix.x(m);             
        return this;
    };  
    
    /**
     * simple rotation around the z-axis.
     * @theta degrees to rotate
     */ 
    ModelView.prototype.rotateZ = function(theta) {
        //- rotate Z
        var rads = theta * Math.PI / 180;
        var m = $M([
                [Math.cos(rads), -Math.sin(rads), 0, 0],
                [Math.sin(rads), Math.cos(rads), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        this._modelViewMatrix = this._modelViewMatrix.x(m);        
        return this;
    };  
    
    /**
     * Scales
     * @vector containing the scale values
     */
    ModelView.prototype.scale = function(vector) {
        var m = $M([
                [vector.elements[0], 0, 0, 0],
                [0, vector.elements[1], 0, 0],
                [0, 0, vector.elements[2], 0],
                [0, 0, 0, 1]
            ]);
        this._modelViewMatrix = this._modelViewMatrix.x(m);
        return this;
    };
    
    /**
     * Set the current model view matrix to the identity matrix.
     */
    ModelView.prototype.identity = function() {
        this._modelViewMatrix = Matrix.I(4);
        
        return this;
    };
    
    /**
     * Saves the current state of the model-view matrix so that it can be restored
     * by a call to pop. Should this be called mark or save?
     */
    ModelView.prototype.push = function() {
        this._matrixStack.push(this._modelViewMatrix.dup());
    };
    
    /**
     * Restores the last saved state.
     */
    ModelView.prototype.pop = function() {
        this._modelViewMatrix = this._matrixStack.pop();
    };
    
    /**
     * Returns the a transformation matrix for the normal matrix. Takes inverse and then transpose of the model-view matrix.
     */
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
    
    /**
     * Returns the underlying matrix.
     */
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