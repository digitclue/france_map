// page init
bindReady(function(){
	initMap();
});

function initMap(){
	// get svg element
	var map = d3.select(".map"),
		group = map.append('g');

	group
		.attr('transform', 'translate(0, 525) scale(0.1,-0.1)')
		.attr('width', 500)
		.attr('height', 500);
	
	//load data from json
	d3.json('inc/map.json', function(error, data){
		if (error){
			throw error;
		} else {
			group.selectAll('path')
				.data(data)
				.enter()
				.append('path')
				.attr('d', function(data){
					return data.path;
				})
				.attr('fill', function(data){
					return data.color;
				});
		}
	});
}

// DOM ready handler
function bindReady(handler){
	var called = false;
	var ready = function() {
		if (called) return;
		called = true;
		handler();
	};
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', ready, false);
	} else if (document.attachEvent) {
		if (document.documentElement.doScroll && window == window.top) {
			var tryScroll = function(){
				if (called) return;
				if (!document.body) return;
				try {
					document.documentElement.doScroll('left');
					ready();
				} catch(e) {
					setTimeout(tryScroll, 0);
				}
			};
			tryScroll();
		}
		document.attachEvent('onreadystatechange', function(){
			if (document.readyState === 'complete') {
				ready();
			}
		});
	}
	if (window.addEventListener) window.addEventListener('load', ready, false);
	else if (window.attachEvent) window.attachEvent('onload', ready);
}