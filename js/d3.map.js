// page init
bindReady(function(){
	initMap();
});

function initMap(){
	// get svg element
	d3.selectAll('.map').each(function(d, index){
		var map = d3.select(this),
			width = parseInt(map.style('width')),
			height = parseInt(map.style('height')),
			projection = d3.geo.mercator(),
			path = d3.geo.path().projection(projection),
			mapBounds,
			timer;


		//load data from json
		d3.json('inc/regions.geojson', function(error, data){
			if (error){
				throw error;
			} else {
				drawMap(data);
				attachEvents();
			}
		});

		function drawMap(data){
			mapBounds = getMapBounds(data);

			var groups = map.selectAll('.group')
				.data(data.features)
				.enter()
				.append('g')
				.classed('group', true);

			groups.append('path').classed('area', true);

			resizeMap();
		}

		function getMapBounds(data){
			projection.scale(1).translate([0, 0]);
			return path.bounds(data);
		}

		function resizeMap(){
			var scale, translate;

			width = parseInt(map.style('width'));
			height = parseInt(map.style('height'));

			scale = 1 / Math.max((mapBounds[1][0] - mapBounds[0][0]) / width, (mapBounds[1][1] - mapBounds[0][1]) / height);
			translate = [(width - scale * (mapBounds[1][0] + mapBounds[0][0])) / 2, (height - scale * (mapBounds[1][1] + mapBounds[0][1])) / 2];

			projection
				.scale(scale)
				.translate(translate);

			map.selectAll('.area').attr('d', path);
		}

		function resizeHandler(){
			if (timer) clearTimeout(timer);
			timer = setTimeout(function(){
				resizeMap();
			}, 100);
		}

		function attachEvents(){
			var initColor = map.select('.area').style('fill');

			d3.select(window).on('resize.' + index, resizeHandler);

			map.selectAll('.area')
				.on('mouseenter', function(data){
					d3.select(this)
						.transition()
						.duration(400)
						.style('fill', '#10e0e0');
				})
				.on('mouseleave', function(data){
					d3.select(this)
						.transition()
						.duration(400)
						.style('fill', initColor);
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