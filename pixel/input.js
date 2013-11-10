"use strict";

/*
 * Check if borwser supports touch screen.
 * 
 * @return Boolean
 */
function isTouchDevice(){
	return "ontouchstart" in window;
}

/*
 *  Simple Input helper. If the browser supports Touch Events
 *  the object will collect touch coords and events from the first
 *  thing to touch the screen, else will collect mouse data.
 */
window.Input = {
	x       :   0,
	y       :   0,
	_isDown :   false,
	_click  :   false,
	parent  :   null,
	/**
	 * Call this function before using any other Input function or property.
	 * @param {Object} parent
	 */
	init    :   function (parent) {
		if( isTouchDevice() ){

			parent.addEventListener("touchstart",function( event ){
				event.preventDefault();
				Input._isDown = true;
				Input._click = true;
				var touch = event.targetTouches[0];
				if(!touch) return;
				Input.x = touch.pageX - parent.offsetLeft;
				Input.y = touch.pageY - parent.offsetTop;
			});

			parent.addEventListener("touchmove",function( event ){
				event.preventDefault();
				var touch = event.targetTouches[0];
				if(!touch) return;
				Input.x = touch.pageX - parent.offsetLeft;
				Input.y = touch.pageY - parent.offsetTop;
			});

			parent.addEventListener("touchend",function( event ){
				event.preventDefault();
				Input._isDown = false;
				Input._click = false;
				var touch = event.targetTouches[0];
				if(!touch) return;
				Input.x = touch.pageX - parent.offsetLeft;
				Input.y = touch.pageY - parent.offsetTop;
			});

		}else{

			parent.addEventListener("mousedown",function(event){
				Input._isDown = true;
				Input._click = true;
				Input.x = event.clientX - parent.offsetLeft;
				Input.y = event.clientY - parent.offsetTop;
			});

			parent.addEventListener("mousemove",function(event){
				Input.x = event.clientX - parent.offsetLeft;
				Input.y = event.clientY - parent.offsetTop;
			});

			parent.addEventListener("mouseup",function(event){
				Input._isDown = false;
				Input._click = false;
				Input.x = event.clientX - parent.offsetLeft;
				Input.y = event.clientY - parent.offsetTop;
			});

		}
	},
	/**
	 * Set a callback for Mouse / Touch Down.
	 * @param {Function} callback
	 */
	onDown  :   function(callback){
		if( Input._isDown ){
			if( typeof(callback) == "function" ){
				callback();
			}
		}
	},
	/**
	 * Set a callback for Mouse / Touch Click.
	 * @param {Function} callback
	 */
	onClick :   function(callback){
		if( Input._click ){
			Input._click = false;
			if( typeof( callback ) == "function" ){
				callback();
			}
		}
	}
};
