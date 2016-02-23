define(function (require) {
  var module = require('ui/modules').get('kibana/kbn_circles_vis', ['kibana']);
  var d3 = require('d3');
  var _ = require('lodash');
  var $ = require('jquery');
  //var S = require('d3-plugins-sankey');
  var formatNumber = d3.format(',.0f');
  //var format = function (d) { return formatNumber(d) + ' TWh';  };

  module.controller('KbnCirclesVisController', function ($scope, $element, $rootScope, Private) {
    var circlesAggResponse = Private(require('./lib/agg_response'));

    var svgRoot = $element[0];
    var color = d3.scale.category10();
    var margin = 20;
    var width = 1000;
    var height = 800;
    var div;
    var svg;

    var r = 600;
    var x = d3.scale.linear().range([0,r]);
    var y = d3.scale.linear().range([0,r]);

    var node, root;

    var pack = d3.layout.pack()
	.size([r, r])
	.value(function(d) { return d.size; });

    var _buildVis = function (data) {
    	var energy = data;
      	div = d3.select(svgRoot);
      	if (!energy.children.length) return;

	svg = div.append('svg')
         .attr('width', width)
         .attr('height', height + margin)
         .append('g')
         .attr('transform', 'translate(' + (width - r) / 2 + ',' + (height - r) / 2 + ')');

	  node = root = data;

	  var nodes = pack.nodes(root);

      	svg.selectAll("circle")
		.data(nodes)
		.enter().append("svg:circle")
		.attr("class", function(d) { return d.children ? "parent" : "child"; })
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", function(d) { return d.r; })
		.on("click", function(d) { return zoom(node == d ? root : d); })
		.style("fill", function(d) { return color(d.name); });

	  svg.selectAll("text")
		.data(nodes)
		.enter().append("svg:text")
		.attr("class", function(d) { return d.children ? "parent" : "child"; })
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("dy", function(d) { return (d.children ? ".35em" : "-0.35em"); })
		.attr("text-anchor", "middle")
		.style("opacity", function(d) { return d.r > 20 ? 1 : .5; })
		.text(function(d) { return (d.name == "flare" ? "" : d.name); });

	d3.select(window).on("click", function() { zoom(root); });
    };

   function zoom(d, i) {
	var k = r / d.r / 2;
	x.domain([d.x - d.r, d.x + d.r]);
	y.domain([d.y - d.r, d.y + d.r]);

	var t = svg.transition()
		.duration(d3.event.altKey ? 7500 : 750);

	t.selectAll("circle")
		.attr("cx", function(d) { return x(d.x); })
		.attr("cy", function(d) { return y(d.y); })
		.attr("r", function(d) { return k * d.r; })
		.style("fill", function(d) { return color(d.name); });

	t.selectAll("text")
		.attr("x", function(d) { return x(d.x); })
		.attr("y", function(d) { return y(d.y); })
		.attr("opacity", function(d) { return k * d.r > 20 ? 1 : 0.2; });

	node = d;
	d3.event.stopPropagation();

    }

    var _render = function (data) {
    	d3.select(svgRoot).selectAll('svg').remove();
      	_buildVis(data);
    };

    $scope.$watch('esResponse', function (resp) {
      	if (resp) {
        	var chartData = circlesAggResponse($scope.vis, resp);
        	_render(chartData);
      	}
    });
  });
});
