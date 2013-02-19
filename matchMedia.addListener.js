/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
	// Monkeypatch unsupported addListener/removeListener with polling
	if( !window.matchMedia( "" ).addListener ){
		var oldMM = window.matchMedia;
		
		window.matchMedia = function( q ){
			var ret = oldMM( q ),
				listeners = [],
				last = false,
				resizeListener,
				reorientListener,
				check = function(){
					var list = oldMM( q ),
						unmatchToMatch = list.matches && !last,
						matchToUnmatch = !list.matches && last;
                                                
					// Fire callbacks only if transitioning to or from matched state
					if( unmatchToMatch || matchToUnmatch ){
						for( var i =0, il = listeners.length; i< il; i++ ){
							listeners[ i ].call( ret, list );
						}
					}
					last = list.matches;
				};
			
			ret.addListener = function( cb ){
				listeners.push( cb );

				// Activate resizer listener if necessary
				if( !resizeListener ){
					if(window.addEventListener) {
						window.addEventListener('resize', check);
					} else {
						window.attachEvent('on' + 'resize', check);
					}
					resizeListener = true;
				}

				// Activate reorientation listener if necessary
				// @TODO This is left commented out until I can verify it doesn't get called super often
				// like accelerometer data might be
				/*
				if( !reorientListener ){
					if(window.addEventListener) {
						window.addEventListener('deviceorientation', check);
					} else {
						window.attachEvent('on' + 'deviceorientation', check);
					}
					reorientListener = true;
				}
				*/
			};

			ret.removeListener = function( cb ){
				for( var i =0, il = listeners.length; i < il; i++ ){
					if( listeners[ i ] === cb ){
						listeners.splice( i, 1 );
					}
				}
				if( !listeners.length ){
					// Remove resizer listener if necessary
					if( resizeListener ){

						if(window.removeEventListener) {
							window.removeEventListener('resize', check);
						} else {
							window.detachEvent('on' + 'resize', check);
						}
						resizeListener = false;
					}

					// Remove reorientation listener if necessary
					if( !reorientListener ){
						if(window.removeEventListener) {
							window.removeEventListener('deviceorientation', check);
						} else {
							window.detachEvent('on' + 'deviceorientation', check);
						}
						reorientListener = false;
					}
				}
			};
			
			return ret;
		};
	}
}());
