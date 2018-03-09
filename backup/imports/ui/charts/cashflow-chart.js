cashFlowChart = function(canvasId, cashInVector, cashOutVector) {
  //chart unit is kARS per week
  let diffVector = [];
  let canvas = d3.select(canvasId);
  let dynamicColor;
  for (i=0; i<cashInVector.length; i++) {
    diffVector[i] = cashInVector[i] - cashOutVector[i];
  };
  var margin = {top: 30, right: 10, bottom: 30, left: 50};
  var div = d3.select(canvasId).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var height = 400 - margin.top - margin.bottom,
      width = 720 - margin.left - margin.right,
      barWidth = 70,
      barOffset = 30;
  var yScale = d3.scale.linear()
      .domain([0, 500])
      // .domain([0, d3.max(cashInVector)])
      .range([0, height]);
  var xScale = d3.scale.ordinal()
      .domain(d3.range(0, cashInVector.length))
      .rangeBands([0, width]);
  // let line = d3.svg.line().
      // .x(function(d,i){return xScale(i)});
// let line = canvas.append('svg').append('line')
//                   .attr('x1', 5)
//                   .attr('y1', 5)
//                   .attr('x2', 5)
//                   .attr('y2', 5)
//                   .attr('stroke-width', 8)
//                   .attr('stroke', 'red');
  var colors = d3.scale.linear()
      .domain([0, cashInVector.length * .33, cashInVector.length * .66, cashInVector.length])
      .range(['#eaedee', '#b8c2c6', '#9dacb1', '#748287']);
  // let line = d3.svg.line()
  //     .x(function(data,i) { return xScale(data);})
  //     .y(function(data,i) { return yScale(i);});
  //
  // let lineSvg = d3.select(canvasId).append('path')
  //     .attr('class', 'line')
  //     .attr('d', line);
  // let lineObj = d3.select(canvasId).append('svg:path').attr('d', line(diffVector));
  var cashIn = d3.select(canvasId).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'none')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .selectAll('rect').data(cashInVector)
      .enter().append('rect')
      .style({
          'fill': function (data, i) {
              return colors(i);
          },
          // 'stroke': '#31708f', 'stroke-width': '1'
      })
      .attr('width', xScale.rangeBand())
      .attr('x', function (data, i) {
          return xScale(i);
      })
       .attr('height', 0)
      .attr('y', height)
      .on('click', function (data, i) {
        console.log('data',data);
        console.log('i',i);
      })
      .on('mouseover', function (data,i) {
          div.transition()
            .duration(1)
            .style("opacity", 1);
          div.html("<h6>$ " + numeral(data*1000).format('0,0') +" </h6><h6>" + moment().add(i,'weeks').format('DD MMM') + "</h6>")
              .style('left', xScale(i) + 'px')
              .style('top','300px');
          dynamicColor = this.style.fill;
          d3.select(this)
              .style('fill', '#47faea')
      })
      .on('mouseout', function (data) {
        div.transition()
              .duration(1)
              .style("opacity", 0);
          d3.select(this)
              .style('fill', dynamicColor);
      });
  var cashOut = d3.select(canvasId).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'none')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .selectAll('rect').data(cashOutVector)
      .enter().append('rect')
      .style({
          'fill': function (data, i) {
              return colors(i);
          },
          //  'stroke': '#31708f', 'stroke-width': '1'
      })
      .attr('width', xScale.rangeBand())
      .attr('x', function (data, i) {
          return xScale(i);
      })
       .attr('height', 0)
      .attr('y', height)
      .on('click', function (data, i) {
        console.log('data',data);
        console.log('i',i);
      })
      .on('mouseover', function (data,i) {
          div.transition()
            .duration(10)
            .style("opacity", 1);
          div.html("<h6>$ " + numeral(data*1000).format('0,0') +" </h6>")
              .style('left', xScale(i) + 'px')
              .style('top','300px');
          dynamicColor = this.style.fill;
          d3.select(this)
              .style('fill', '#47faea')
      })
      .on('mouseout', function (data) {
        div.transition()
              .duration(5)
              .style("opacity", 0);
          d3.select(this)
              .style('fill', dynamicColor);
      });
  // var diff = d3.select(canvasId).append('svg')
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .style('background', 'none')
  //     .append('g')
  //     .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  //     .selectAll('rect').data(diffVector)
  //     .enter().append('rect')
  //     .style({
  //         'fill': function (data, i) {
  //             return colors(i);
  //         },
  //         // 'stroke': '#31708f', 'stroke-width': '1'
  //     })
  //     .attr('width', xScale.rangeBand())
  //     .attr('x', function (data, i) {
  //         return xScale(i);
  //     })
  //      .attr('height', 0)
  //     .attr('y', height)
  //     .on('click', function (data, i) {
  //       console.log('data',data);
  //       console.log('i',i);
  //     })
  //     .on('mouseover', function (data,i) {
  //         div.transition()
  //           .duration(10)
  //           .style("opacity", 1);
  //         div.html("<h6>$ " + numeral(data*1000).format('0,0') +" </h6>")
  //             .style('left', xScale(i) + 'px')
  //             .style('top','300px');
  //         dynamicColor = this.style.fill;
  //         d3.select(this)
  //             .style('fill', '#47faea')
  //     })
  //     .on('mouseout', function (data) {
  //       div.transition()
  //             .duration(5)
  //             .style("opacity", 0);
  //         d3.select(this)
  //             .style('fill', dynamicColor);
  //     });
  cashIn.transition()
      .attr('height', function (data) {
          return yScale(data);
      })
      .attr('y', function (data) {
          return height - yScale(data);
      })
      .delay(function (data, i) {
          return i * 20;
      })
      .duration(1000)
      .ease('elastic');
  // diff.transition()
  //     .attr('height', function (data) {
  //         return yScale(data);
  //     })
  //     .attr('y', function (data) {
  //         return height - yScale(data);
  //     })
  //     .delay(function (data, i) {
  //         return i * 20;
  //     })
  //     .duration(500)
  //     .ease('elastic');
  cashOut.transition()
      .attr('height', function (data) {
          return yScale(data);
      })
      .attr('y', function (data) {
          return -30;
      })
      .delay(function (data, i) {
          return i * 20;
      })
      .duration(1000)
      .ease('elastic');

  var verticalGuideScale = d3.scale.linear()
      .domain([0, 500])
      // .domain([0, d3.max(cashInVector)])
      .range([height, 0]);

  var vAxis = d3.svg.axis()
      .scale(verticalGuideScale)
      .orient('left')
      .ticks(5);
  var verticalGuide = d3.select('svg').append('g');
  vAxis(verticalGuide);
  verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  verticalGuide.selectAll('text')
    .style({fill:'#f6faf6'});
  verticalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#f6faf6"});
  verticalGuide.selectAll('line')
      .style({stroke: "#f6faf6"});
  var hAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(cashInVector.size);
  var horizontalGuide = d3.select('svg').append('g');
  hAxis(horizontalGuide);
  horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
  horizontalGuide.selectAll('path')
      .style({fill: 'none', stroke: "#f6faf6"});
  horizontalGuide.selectAll('line')
      .style({stroke: "#f6faf6"});
  horizontalGuide.selectAll('text')
        .style({fill:'#f6faf6'});
};
