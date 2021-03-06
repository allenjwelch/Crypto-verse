function createCompareChart(data){ 
  console.log(data);
  console.log('type of ' + typeof(data))
  data[0][1] = Number(data[0][1]);
  console.log(data[0][0] + ' type of ' + typeof(data[0][0]));
  console.log(data[0][1] + ' type of ' + typeof(data[0][1]));
  // data = [["BTC-7d",3.85], ["LTC-7d",4.03], ["BTC-1d",2.02], ["LTC-1d",3.26], ["BTC-1h",0.26], ["LTC-1h",0.06]];
  // console.log('type of ' + typeof(data))
  // console.log(data[0][0] + ' type of ' + typeof(data[0][0]));
  // console.log(data[0][1] + ' type of ' + typeof(data[0][1]));
  
    $('#compChart').empty();
    d3.selectAll(" svg > *").remove();

  d3.select("#compChart")
  
        .datum(data)
          .call(columnChart()
            .width(720)
            .height(600)
            .x(function(d, i) { return d[0]; })
            .y(function(d, i) { return d[1]; }));

            function columnChart() {
              var margin = {top: 30, right: 5, bottom: 30, left: 30},
                  width = 300,
                  height = 300,
                  xRoundBands = 0.1,
                  xValue = function(d) { return d[0]; },
                  yValue = function(d) { return d[1]; },
                  xScale = d3.scale.ordinal(),
                  yScale = d3.scale.linear(),
                  yAxis = d3.svg.axis().scale(yScale).orient("left"),
                  xAxis = d3.svg.axis().scale(xScale);
                  
            
              function chart(selection) {
                selection.each(function(data) {
            
                  // Convert data to standard representation greedily;
                  // this is needed for nondeterministic accessors.
                  data = data.map(function(d, i) {
                    return [xValue.call(data, d, Number(i)), yValue.call(data, d, Number(i))];
                  });
                
                  // Update the x-scale.
                  xScale
                      .domain(data.map(function(d) { return d[0];} ))
                      .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);
                     
            
                  // Update the y-scale.
                  yScale
                      .domain(d3.extent(data.map(function(d) { return d[1];} )))
                      .range([height - margin.top - margin.bottom, 0])
                      .nice();
                      
            
                  // Select the svg element, if it exists.
                  var svg = d3.select(this).selectAll("svg").data([data]);
            
                  // Otherwise, create the skeletal chart.
                  var gEnter = svg.enter().append("svg").append("g");
                  gEnter.append("g").attr("class", "bars");
                  gEnter.append("g").attr("class", "y axis");
                  gEnter.append("g").attr("class", "x axis");
                  gEnter.append("g").attr("class", "x axis zero");
            
                  // Update the outer dimensions.
                  svg .attr("width", width)
                      .attr("height", height);
            
                  // Update the inner dimensions.
                  var g = svg.select("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
                 // Update the bars.
                  var bar = svg.select(".bars").selectAll(".bar").data(data);
                  bar.enter().append("rect");
                  bar.exit().remove();
                  bar.attr("class", function(d, i) { return d[1] < 0 ? "bar negative" : "bar positive"; })
                      .attr("x", function(d) { return X(d); })
                      .attr("y", function(d, i) { return d[1] < 0 ? Y0() : Y(d); })
                      .attr("width", xScale.rangeBand())
                      .attr("height", function(d, i) { return Math.abs( Y(d) - Y0() ); });
            
                // x axis at the bottom of the chart
                 g.select(".x.axis")
                    .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
                    .call(xAxis.orient("bottom"));
                
                // zero line
                 g.select(".x.axis.zero")
                    .attr("transform", "translate(0," + Y0() + ")")
                    .call(xAxis.tickFormat("").tickSize(0));
                
                
                  // Update the y-axis.
                  g.select(".y.axis")
                    .call(yAxis);
                  
                  bar.append("text")
                    .attr("class", "label")
                            .attr("y", height / 2)
                            .attr("dy", ".35em") //vertical align middle
                            .text(function(d){
                                return d.label;
                            }).each(function() {
                        labelWidth = Math.ceil(Math.max(width, this.getBBox().width));
                  });
                  
                });
                
              }
            
            
            // The x-accessor for the path generator; xScale ∘ xValue.
              function X(d) {
                return xScale(d[0]);
              }
            
              function Y0() {
                return yScale(0);
              }
            
              // The x-accessor for the path generator; yScale ∘ yValue.
              function Y(d) {
                return yScale(d[1]);
              }
            
              chart.margin = function(_) {
                if (!arguments.length) return margin;
                margin = _;
                return chart;
              };
            
              chart.width = function(_) {
                if (!arguments.length) return width;
                width = _;
                return chart;
              };
            
              chart.height = function(_) {
                if (!arguments.length) return height;
                height = _;
                return chart;
              };
            
              chart.x = function(_) {
                if (!arguments.length) return xValue;
                xValue = _;
                return chart;
              };
            
              chart.y = function(_) {
                if (!arguments.length) return yValue;
                yValue = _;
                return chart;
              };
            
              return chart;
            }
          };