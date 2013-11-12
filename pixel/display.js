window.Display = {
	parent  :   null,
	context :   null,
	width   :   0,
	height  :   0,
	v_width :   0,
	v_height:   0,
	PORTRAIT:   1898456115,
	LANDSCAPE:  8974569845,
	/**
	 * Call this function before using a any other Gfx function.
	 * @param {Object} parent
	 */
	init        :   function( parent ){
		this.parent = parent;
		if( !this.parent.getContext ) throw( "The parent must be a canvas element." );
		this.context = this.parent.getContext("2d");
		this.width = this.parent.width;
		this.height = this.parent.height;
	},
	/**
	 * Set the dimensions of the canvas.
	 * @param {Number} width
	 * @param {Number} height
	 */
	setDisplay  :   function( width, height ){
		this.parent.width = width || this.parent.width;
		this.parent.height = height || this.parent.height;
		this.width = this.parent.width;
		this.height = this.parent.height;
	},
	/**
	 * Clear screen. If no color is given the bg color is Transparent.
	 * @param {String} color
	 */
	clear       :   function( color ){
		if( !color ) this.context.clearRect(0,0,this.width,this.height);
		else{
			var oc = this.context.fillStyle;
			this.context.fillStyle = color;
			this.context.fillRect(0,0,this.width,this.height);
			this.context.fillStyle = oc;
		}
	},
	/**
	 * Set context fill color.
	 * @param {String} color
	 */
	setColor    :   function( color ){
		this.context.fillStyle = this.context.strokeStyle = color || "#fff";
	},
	/**
	 * Draw a rectangle on the canvas
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	drawRect    :   function( x, y, width, height ){
		this.context.fillRect(x,y,width,height);
	},
	/**
	 * Set the alpha of the context.
	 * @param {Number} alpha
	 */
	setAlpha    :   function( alpha ){
		alpha = alpha || 1.0;
		this.context.globalAlpha =  alpha ;
	},
	/**
	 * Draw an Image to the canvas.
	 * @param {Image} image
	 * @param {Number} x
	 * @param {Number} y
	 */
	drawImage   :   function( image, x ,y ){
		this.context.drawImage(image,x,y);
	},
	// Matrix Transformation stuff.
	push        :   function(){
		this.context.save();
	},
	pop         :   function(){
		this.context.restore();
	},
	scale       :   function( x, y ){
		this.context.scale(x,y);
	},
	translate   :   function( x, y ){
		this.context.translate(x,y);
	},
	rotate      :   function( angle ){
		this.context.rotate(angle);
	},
	/**
	 * More advanced DrawImage function.
	 * @param {Image} image The Image that will be drawn to the canvas.
	 * @param {Number} x Horizontal Coordinate on where to draw the image in the canvas.
	 * @param {Number} y Vertical Coordinate on where to draw the image in the canvas.
	 * @param {Number} angle Angle in radians for the rotation of the image.
	 * @param {Number} scalex Horizontal scale value.
	 * @param {Number} scaley Vertical scale value.
	 * @param {Number} handlex From where should Scale & Rotation should be handle on X axis
	 * @param {Number} handley From where should Scale & Rotation should be handle on Yaxis
	 * @param {Number} clipx Position on the X axis where the clipping of the image should start.
	 * @param {Number} clipy Position on the Y axis where the clipping of the image should start.
	 * @param {Number} clipWidth Width of the clipping rectangle.
	 * @param {Number} clipHeight Height of the clipping rectangle.
	 */
	drawImage2  :   function( image, x, y, angle, scalex, scaley, handlex, handley, clipx, clipy, clipWidth, clipHeight ){
		if(clipWidth == 0 || clipHeight == 0) return;
		this.push();
		this.translate( x, y );
		this.rotate( angle );
		this.scale( scalex, scaley );
		this.translate( -x-handlex, -y-handley );
		this.context.drawImage( image, clipx, clipy, clipWidth, clipHeight, x, y, clipWidth, clipHeight );
		this.pop();
	},
	/**
	 * Draw a filled circle.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 */
	drawCirlce  :   function( x, y, radius ){
		this.context.beginPath();
		this.context.arc(x,y,radius,0,2*Math.PI);
		this.context.fill();
		this.context.closePath();
	},
	/**
	 * Draw a polygonal shape.
	 * The array's length should be at least 3.
	 * @param {Array} verts
	 */
	drawPolygon :   function(verts){
		if(verts.length>=3){
			this.context.beginPath();
			this.context.moveTo(verts[0].x,verts[0].y);
			for(var i=1;i<verts.length;i++){
				this.context.lineTo(verts[i].x, verts[i].y);
			}
			this.context.fill();
			this.context.closePath();
		}
	},
	/**
	 * Draw Line
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 */
	drawLine : function( x1, y1, x2, y2 ){
		this.context.beginPath();
		this.context.moveTo( x1, y1 );
		this.context.lineTo( x2, y2 );
		this.context.stroke();
		this.context.closePath();
	},
	/**
	 * If you want to set a Virtual Display
	 * @param {Number} width
	 * @param {Number} height
	 */
	setVirtualDisplay       :   function( width, height ){
		this.v_width = width;
		this.v_height = height;
		this.width = width;
		this.height = height;
	},

	/**
	 * Run this before any render.
	 */
	updateVirtualDisplay    :   function(){
		var sx = this.parent.width / this.v_width,
			sy = this.parent.height / this.v_height;
		this.push();
		this.scale( sx, sy);
	},

	/**
	 * Call this after rendering everything to the screen.
	 */
	postUpdateVirtualDisplay:   function(){
		this.pop();
	},

	/**
	 * Return the screen width.
	 * @return {Number}
	 */
	screenWidth             :   function(){
		return window.innerWidth;
	},

	/**
	 * Return the screen height.
	 * @return {Number}
	 */
	screenHeight            :   function(){
		return window.innerHeight;
	},

	/**
	 * Returns the current orientation.
	 * @return {Number}
	 */
	currentOrientation      :   function(){
		if( window.innerWidth > window.innerHeight ) return Display.LANDSCAPE;
		else return Display.PORTRAIT;
	},

	/**
	 * Returns the Virtual Input X Coord
	 * based on the virtual size.
	 */
	VInputX                 :   function(){
		var sx = this.parent.width / this.v_width;
		return Input.x / sx;
	},

	/**
	 * Returns the Virtual Input Y Coord
	 * based on the virtual size.
	 */
	VInputY                 :   function(){
		var sy = this.parent.height / this.v_height;
		return Input.y / sy;
	}
};
/**
 * For game loop.
 */
var updateScreen = (function(){
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame     ||
		window.oRequestAnimationFrame   ||
		window.msRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 17);
		};
})();

//  Helper for simple timers.
function millisecs(){
	return new Date().getTime();
}

/**
 * Returns a random number between 2 values.
 * @param {Number} l
 * @param {Number} m
 */
function rnd(l,m){
	return Math.random() * (m - l) + l;
}
