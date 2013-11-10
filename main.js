(function(){
	var canvas = document.getElementsByTagName( "canvas" )[ 0 ];
	Input.init( canvas );
	Display.init( canvas );

	Display.setDisplay( Display.screenWidth(), Display.screenHeight() );

	window.onresize = function(){

		Display.setDisplay( Display.screenWidth(), Display.screenHeight() );
	};

	var bomb = {
		x : 0,
		y : 0,
		bounce :.7,
		friction :.99,
		gravity : {
			x : 0,
			y :.2
		},
		velocity : {
			x : 0,
			y : 0
		},
		last : {
			x : Display.width / 2,
			y : 0
		},
		update : function(){
			bomb.velocity.x += bomb.gravity.x;
			bomb.velocity.y += bomb.gravity.y;
			bomb.last.x += bomb.velocity.x;
			bomb.last.y += bomb.velocity.y;

			if( bomb.last.y > Display.height ){
				bomb.last.y = Display.height;
				bomb.velocity.y *= -bomb.bounce;
				bomb.velocity.x *= bomb.friction;
			}else if( bomb.last.y < 0 ){
				bomb.last.y = 0;
				bomb.velocity.y *= -bomb.bounce;
			}

			if( bomb.last.x > Display.width ){
				bomb.last.x = Display.width;
				bomb.velocity.x *= -bomb.bounce;
			}else if( bomb.last.x < 0 ){
				bomb.last.x = 0;
				bomb.velocity.x *= -bomb.bounce;
			}

		},
		render : function(){

			bomb.x = bomb.last.x;
			bomb.y = bomb.last.y;

			explode( bomb.x, bomb.y );
			for( var i = 0; i < smoke.length; i++ ){
				smoke[ i ].update();
				smoke[ i ].render();
			}

			for( var i = 0; i < emitter.length ; i++ ){
				emitter[ i ].update();
				emitter[ i ].render();
			}
		},
		distanceToPoint : function( x, y ){
			return Math.sqrt( ( x - bomb.x ) * ( x - bomb.x ) + ( y - bomb.y ) * ( y - bomb.y ) );
		},
		angleTo : function( x, y ){
			return Math.atan2( x - bomb.x, y - bomb.y ) + ( 90 * Math.PI / 180 );
		}
	};

	var emitter = [];
	var smoke = [];
	var emIndex = 0;
	var smIndex = 0;
	var pause = false;
	var locked = false;

	for( var i = 0; i < 50; i++ ){
		var p = new Particle();
		p.gravity.y = .2;
		p.loadGraphic( "spark"+parseInt( rnd( 1,3 ) )+".png" );
		emitter[ emitter.length ] = p;

	}

	for( var i = 0; i < 100; i++ ){
		var p = new Particle();
		p.loadGraphic( "smoke.png" );
		smoke[ smoke.length ] = p;

	}

	function explode( x, y ){
		emitter[ emIndex ].start( x , y , { x: rnd(-4, 4), y: rnd(-8,-2),alpha:rnd(0.01,0.05), rotation: rnd(- 5*Math.PI / 180, 5*Math.PI/180)} );
		emIndex++;
		if( emIndex > emitter.length - 1) emIndex = 0;


		smoke[ smIndex ].start( x, y, { x: rnd(-1, 1), y: rnd(-3,-1), scale: rnd(.02,.04), collide: false, alpha:.01, rotation: rnd(- Math.PI / 180, Math.PI/180)});
		smIndex++;
		if( smIndex > smoke.length-1 ){
			smIndex = 0;
		}

	}

	function clickHandler(){

	}

	function downHandler(){
		bomb.velocity.x = bomb.velocity.y = 0;

		var angle = -bomb.angleTo( Input.x, Input.y),
			cx = bomb.last.x + Math.cos( angle ) * bomb.distanceToPoint( Input.x, Input.y ),
			cy = bomb.last.y + Math.sin( angle ) * bomb.distanceToPoint( Input.x, Input.y );

		bomb.velocity.x = Math.cos( angle ) * ( ( bomb.distanceToPoint( Input.x, Input.y ) * 0.1 ) );
		bomb.velocity.y = Math.sin( angle ) * ( ( bomb.distanceToPoint( Input.x, Input.y ) * 0.1 ) );

		Display.setColor( "#ff0000" );
		Display.drawLine( bomb.x, bomb.y, Input.x, Input.y );
		Display.drawCirlce( Input.x, Input.y, 10);

		Display.setColor( "#ffff00" );
		Display.drawLine( bomb.x, bomb.y, cx, cy );


		pause = true;
	}

	function update(){
		updateScreen( update );
		pause = false;
		Display.setAlpha( 1.0 );
		Display.clear( "#000" );
		Input.onDown( downHandler );
		Input.onClick( clickHandler );
		if( !pause ) bomb.update();
		bomb.render();


		Display.postUpdateVirtualDisplay();
	}

	window.onload = update;

})();
