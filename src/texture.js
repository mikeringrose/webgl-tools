var texture;

if (!texture)
	texture = {};

texture.Texture = function() {
	
	var _NEAREST = function(texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture.getTextureId());
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getImage());
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);		
	};
	
	var _LINEAR = function(texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture.getTextureId());
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getImage());
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	
	};	
	
	var _MIPMAP = function(texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture.getTextureId());
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getImage());
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);	
	};
	
	/**
	 *  Export our callbacks.
	 */
	texture.NEAREST = _NEAREST;
	texture.LINEAR = _LINEAR;
	texture.MIPMAP = _MIPMAP;	
	
	/**
	 * 
	 */
	function Texture(config) {
		var self = this,
			callback = config.cb || _NEAREST;
		this._gl = config.gl;
		this._image = new Image();
		this._textureId = gl.createTexture();
		
		this._image.onload = function() {
			//- flip our image
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			
			//- configure our image
			callback(self);
		}
		
		this._image.src = config.src;
	}
	
	/**
	 *
	 */
	Texture.prototype.getTextureId = function() {
		return this._textureId;
	};
	
	/**
	 *
	 */
	Texture.prototype.getImage = function() {
		return this._image;
	};
	
	return Texture;
	
}();