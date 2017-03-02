import uiModules from 'ui/modules';

const module = uiModules.get('kibana/kbn_circles_vis', ['kibana']);

import d3 from 'd3';
import _ from 'lodash';
import $ from 'jquery';

let formatNumber = d3.format(',.0f');
import AggResponseTabifyTabifyProvider from './lib/agg_response';

module.controller('KbnCirclesVisController', function ($scope, $element, $rootScope, Private) {

  const circlesAggResponse = Private(AggResponseTabifyTabifyProvider); // Private(require('./lib/agg_response'));

  let svgRoot = $element[0];
  let color = d3.scale.category10();
  let margin = 20;
  let width = innerWidth / 2;
  let height = 600;
  let div;
  let svg;

  let r = width / 2;
  let x = d3.scale.linear().range([0, r]);
  let y = d3.scale.linear().range([0, r]);

  let node;
  let root;

  let pack = d3.layout.pack()
    .size([r, r])
    .value(function (d) {
      return d.size;
    });

  let _buildVis = function (data) {

    if (!data.children.length) return;

    div = d3.select(svgRoot);

    svg = div.append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width - r) / 2 + ',' + (height - r) / 2 + ')')
      .call(d3.behavior.zoom().scaleExtent([-18, 18])
        .on('zoom', zoom))
      .append('g');

    node = root = data;

    var nodes = pack.nodes(data);

    svg.selectAll('circle').data(nodes).enter().append('svg:circle')
      .attr('class', function (d) {
        return d.children ? 'parent' : 'child';
      }).attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', function (d) {
        return d.r;
      })/*
      .attr('transform', function (d) {
        return 'translate(' + d + ')';
      })*/
      .style('fill', function (d) {
        return color(d.name);
      });

    if ($scope.vis.params.showLabels) {
      svg.selectAll('text').data(nodes).enter()
        .append('svg:text').attr('class', function (d) {
          return d.children ? 'parent' : 'child';
        }).attr('x', function (d) {
          return d.x;
        }).attr('y', function (d) {
          return d.y;
        }).attr('dy', function (d) {
          return d.children ? '.35em' : '-0.35em';
        }).attr('text-anchor', 'middle').style('opacity', function (d) {
          return d.r > 20 ? 1 : 0.5;
        }).text(function (d) {
          return d.name === 'flare' ? '' : d.name;
        });
    }

    if ($scope.vis.params.showValues) {
      svg.selectAll('text.value').data(nodes).enter().append('svg:text').attr('class', function (d) {
        return 'value';
      }).attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return (d.y + 15);
      }).attr('dy', function (d) {
        return d.children ? '.35em' : '-0.35em';
      }).attr('text-anchor', 'middle').style('opacity', function (d) {
        return d.r > 20 ? 1 : 0.5;
      }).text(function (d) {
        return d.name === 'flare' ? '' : d.value;
      });
    }

    if ($scope.vis.params.enableZoom) {
      d3.select(window).on('click', function () {
        zoom(root);
      });
    }

  };

  function zoom() {
    if ($scope.vis.params.enableZoom) {
      if (d3.event !== null) {
        if (d3.event.translate !== undefined && d3.event.scale !== undefined) {
          svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }
      }
    }
  }

  $scope.$watch('esResponse', function (resp) {
    if (resp) {
      var chartData = circlesAggResponse($scope.vis, resp);
      d3.select(svgRoot).selectAll('svg').remove();
      if (chartData !== null && chartData.children !== null) {
        _buildVis(chartData.children);
      }
    }
  });
});
