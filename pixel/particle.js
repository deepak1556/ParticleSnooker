/**
 * Particle
 * @constructor
 */
function Particle(){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.angle = 0;
	this.rotation = 0;
	this.bounce = .8;
	this.alpha = 1.0;
	this.friction = .99;
	this.graphic = null;
	this.active = false;
	this.scale = { x : 1 , y : 1 };
	this.gravity = { x : 0 , y : 0 };
	this.velocity = { x : 0 , y : 0 };
	this.last = { x : 0 , y : 0 };
	this.handle = { x : 0 , y : 0 };
	this.alphaSub = 0;
	this.scaleSub = 0;
	this.collide = true;
}

/**
 * Load image from server
 * @param {String} path
 */
Particle.prototype.loadGraphic = function( path ){
	if( this.graphic != null ) return;
	this.graphic = document.createElement( "canvas" );
	var image = new Image();
	var self = this;
	image.onload = function( ){
		self.graphic.width = image.width;
		self.graphic.height = image.height;
		self.width = image.width;
		self.height = image.height;
		var ctx = self.graphic.getContext( "2d" );
		ctx.drawImage( image, 0, 0 );
		self.handle.x = self.width / 2;
		self.handle.y = self.height / 2;
	};

	image.src = path;
};

/**
 * Create Graphic
 * @param {Number} width
 * @param {Number} height
 * @param {String} color
 */
Particle.prototype.makeGraphic = function( width, height, color ){
	if( this.graphic != null ) return;
	this.graphic = document.createElement( "canvas" );
	this.graphic.width = width;
	this.graphic.height = height;
	this.width = width;
	this.height = height;
	var ctx = this.graphic.getContext( "2d" );
	ctx.fillStyle = color || "#fff";
	ctx.fillRect( 0, 0, width, height );
	this.handle.x = this.width / 2;
	this.handle.y = this.height / 2;
};

/**
 * Start particle activity
 * @param {Number} x
 * @param {Number} y
 * @param {Object} v
 */
Particle.prototype.start = function( x, y ,v ){
	if( this.active ) return;
	this.bounce = rnd(.1,.8);
	if(v != null && v.x && v.y ){
		this.velocity.x = v.x;
		this.velocity.y = v.y;
	}else{
		this.velocity.x = rnd(-2,2);
		this.velocity.y = rnd(-2,-1);
	}

	if(v!=null && v.scale ){
		this.scaleSub = v.scale;
	}

	if(v!=null && v.collide != null ){
		this.collide = v.collide;
	}

	if(v!=null && v.alpha ){
		this.alphaSub = v.alpha;
	}

	if(v!=null && v.rotation ){
		this.rotation = v.rotation;
	}

	this.last.x = this.x = x;
	this.last.y = this.y = y;
	this.alpha = 1.0;
	this.scale.x = this.scale.y = 1.0;
	this.active = true;

};

Particle.prototype.update = function(){
	if( !this.active ) return;
	this.velocity.x += this.gravity.x;
	this.velocity.y += this.gravity.y;
	this.last.x += this.velocity.x;
	this.last.y += this.velocity.y;
	this.angle += this.rotation;

	// Bounce Bounce!
	if( !this.collide ){

		if( this.last.x < -this.handle.x || this.last.x - this.handle.x > Display.width || this.last.y < -this.handle.y || this.last.y - this.handle.y > Display.height ) this.active = false;

		return;
	}
	if( this.last.x < this.handle.x ){
		this.last.x = this.handle.x;
		this.velocity.x *= -this.bounce;
	} else if( this.last.x + this.handle.x > Display.width ){
		this.last.x = Display.width - this.handle.x;
		this.velocity.x *= -this.bounce;
	}

	if( this.last.y < this.handle.y ){
		this.last.y = this.handle.y;
		this.velocity.y *= -this.bounce;
	}else if( this.last.y + this.handle.y > Display.height ){
		this.last.y = Display.height - this.handle.y;
		this.velocity.y *= -this.bounce;
		this.velocity.x *= this.friction;
		this.rotation *= this.friction;
	}



};

Particle.prototype.render = function(){
	if( !this.active || this.graphic == null ) return;
	Display.setAlpha( this.alpha );
	Display.drawImage2( this.graphic, this.x, this.y, this.angle, this.scale.x, this.scale.y, this.handle.x, this.handle.y, 0, 0, this.width, this.height );
	this.x = this.last.x;
	this.y = this.last.y;
	this.alpha -= this.alphaSub;
	this.scale.x += this.scaleSub;
	this.scale.y += this.scaleSub;

	if( this.alpha < 0  ){
		this.active = false;
	}
};
