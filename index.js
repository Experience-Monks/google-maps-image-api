/** @module google-maps-image-api */

var https = require( 'https' ),
	merge = require( 'merge' ),
	querystring = require( 'querystring' ),
	promise = require( 'promise' );

var baseOpts = {

	host: 'maps.googleapis.com',
	path: '/maps/api/timezone/json?',
	port: 443,
	withCredentials: false
};

/**
 * Allows you to easily consume the Google Maps Image API.
 *
 * Google Maps Image API allows you to get static images of a 2d map or streetview.
 *
 * This module will return a promise or you can call it via a callback.
 *
 * The callback will return an error (if an error occured) and and HTMLImageElement.
 *
 * Options passed in correlate to properties you can pass to Google Maps Image API.
 *
 * Here are parameter's you can pass through opts:
 *
 * ```javascript
 * {
 * 	//// REQUIRED ////
 * 	center: '40.714728,-73.998672', // This will be the center of your image. 
 * 									// It can also be a street address
 *  
 *
 * 	
 *	//// OPTIONAL ////
 * 	key: 'your api key', // Your Google API Key
 * 
 * 	zoom: 14, // This will be how zoomed in the map will be. 0 is where you 
 *  		  // can see the entire world, 21 is where you see streets. 14 is default
 *  		  
 * 	size: '320x240', // This is the pixel size of your map. Default 320x240
 * 	
 * 	scale: 1, // This property is meant for rendering maps with high pixel 
 * 			  // resolutions eg. iphone 4+ is retina this value should be set to 2
 *
 *	format: 'JPEG', // Possible valuse 'PNG', 'GIF', 'JPEG',
 *
 * 	maptype: 'roadmap', // What type of map you want to render 
 * 						// 'roadmap', 'satellite', 'hybrid', and 'terrain'
 *
 * 	language: 'en', // Language in which you want the map to be rendered
 *
 *  region: 'us', // Country code in: ccTLD. defines the appropriate borders to display, 
 *  			  // based on geo-political sensitivities
 *
 *	markers: 'color:blue|label:S|11211|11206|11222',
 *	// Add markers to the map. For docs:
 * 	// https://developers.google.com/maps/documentation/staticmaps/index#Markers
 *
 * 	path: 'color:0x0000ff|weight:5|40.737102,-73.990318|40.749825,-73.987963',
 * 	// Add a path to the map. A path can be filled or just a line. For docs:
 * 	// https://developers.google.com/maps/documentation/staticmaps/index#Paths
 *
 * 	visible: 'Toronto', // you can specify locations that should be visible on the 
 * 				 		// rendered map. This can be either long,lat or a location name
 *
 * 	style: 'feature:administrative|element:labels|weight:3.9|visibility:on|inverse_lightness:true', 
 * 	// this property will change how features are rendered eg. roads, parks, etc.
 * 	// For docs:
 * 	// https://developers.google.com/maps/documentation/staticmaps/index#StyledMaps
 * }
 * ```
 * 
 * @param  {Object} opts These are options that will be used to query the 
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

var BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?';

module.exports = function( opts, callback ) {

	opts.zoom = opts.zoom === undefined ? 14 : opts.zoom;
	opts.size = opts.size || '320x240';

	return new promise( function( onOK, onErr ) {

		var pathStr = BASE_URL + querystring.stringify( opts );

		try {

			var img = new Image();

			img.onload = function() {

				onOK( img );

				if( callback )
					callback( undefined, img );
			};

			img.onerror = function() {

				var err = new Error( 'Cannot load image' );

				onErr( err );

				if( callback )
					callback( err );
			};

			img.src = pathStr;
		} catch( e ) {

			onErr( e );
		}
	});
};

function addToPath( opts, path, varName, optional, onErr, callback ) {

	if( opts[ varName ] === undefined ) {

		if( !optional ) {

			doErr( varName + ' is required', onErr, callback );

			return false;
		} else {

			return true;
		}
	} else {

		path[ varName ] = opts[ varName ];

		return true;
	}
}

function doErr( msg, onErr, callback ) {

	var err = new Error( msg );

	onErr( err );

	if( callback )
		callback( err );
}