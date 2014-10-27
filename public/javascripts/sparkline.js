(function(){
  "use strict";
  var root = this,
      $ = root.jQuery;

  if(typeof root.matrix === 'undefined'){ root.matrix = {}; }

  var makeScales = function(data, trend, width, height) {
    var maxY = d3.max([ d3.max(data), d3.max(trend)] ),
        minY = 0; //d3.min(data); force the graph to start at zero.

    maxY = maxY + (maxY * 0.01);
    minY = minY - (minY * 0.01);

    var x = d3.scale.linear().domain([0, data.length-1]).range([0, width]),
        y = d3.scale.linear().domain([minY, maxY]).range([height, 0]);

    return {x: x, y: y};
  };

  var sparkline = function(container, options){
    var width = options.width || 200,
        height = options.height || 20,
        data = options.data || [],
        trend = options.trend || [],
        scale = makeScales(data, trend, width, height),
        area = d3.svg.area()
          .interpolate('basis')
          .x(function(d, i) { return scale.x(i); })
          .y0(height)
          .y1(function(d, i) { return scale.y(d); }),
        path = container.append('svg:path')
          .attr('class', 'data area')
          .data([data])
          .attr('d', area),
        trendLine = d3.svg.line()
          .interpolate('basis')
          .x(function(d, i) { return scale.x(i); })
          .y(function(d, i) { return scale.y(d); }),
        trendPath = container.append('svg:path')
          .attr('class', 'trend area')
          .data([trend])
          .attr('d', trendLine);

    return {
      update: function(newData, trend){
        scale = makeScales(newData, trend, width, height);
        container.selectAll('path.data')
          .data([newData]).attr('d', area);
        container.selectAll('path.trend')
          .data([trend]).attr('d', trendLine);
      }
    };
  };

  var sparklineGraph = function(el, options){
    var width = options.width || 600,
        height = options.height || 120,
        padding = options.padding || 20,
        data = options.data || [],
        trend = options.trend || [],
        sparklineOptions = {
          width: width - padding,
          height: height - padding,
          data: data,
          trend: trend
        },
        svg = d3.select(el).append('svg:svg')
          .attr('width', width)
          .attr('height', height),
        sparklineGroup = svg.append('g')
          .attr('transform', 'translate('+(padding+1)+', -1)')
          .attr('clip-path', 'url(#clip)')
          .attr('class', 'sparkline'),
        slObj = sparkline(sparklineGroup, sparklineOptions);

    svg.append('svg:clipPath')
      .attr('id', 'clip')
    .append('svg:rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', width - padding)
      .attr('height', height - padding);

    var scale = makeScales(data, trend, width - padding, height - padding);

    var xAxis = d3.svg.axis().scale(scale.x).ticks(0).tickSize(0),
        yAxis = d3.svg.axis().scale(scale.y).ticks(0).tickSize(0).orient('left');

    svg.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + padding + ',' + (height - padding) + ')')
      .call(xAxis);

    svg.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);

    var xLab = svg.append('text')
          .attr('class', 'x label')
          .attr('text-anchor', 'end')
          .attr('x', width)
          .attr('y', height - 3),
        yLab = svg.append('text')
          .attr('class', 'y label')
          .attr('x', 0)
          .attr('y', -3)
          .attr('transform', 'rotate(90)')
          .text(d3.format(',')(d3.max(data)));

    return {
      update: function(newData, trend, xLabel){
        slObj.update(newData, trend);
        yLab.text(d3.format(',')(d3.max(newData)));
        xLab.text(xLabel);
      }
    };
  };

  root.matrix.sparkline = sparkline;
  root.matrix.sparklineGraph = sparklineGraph;
}).call(this);
