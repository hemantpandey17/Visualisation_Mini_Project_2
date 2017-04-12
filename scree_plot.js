function plot_scree(filename) {
        refresh();

    filename = "./data_sampled/" + filename;
    console.log(filename);
    svg.selectAll("*").remove();
    
    color = ["Red","Blue"];
    var width = 940,
    size = 300,
    padding = 20;
    var left_pad = 100;
    // Load data
    var xScale = d3.scale.linear().range([left_pad, w-pad]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
    var yScale = d3.scale.linear().range([h-pad*2,pad]);
    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    
    d3.csv(filename, function(error, data) {
        data.forEach(function(d) {
            d.type = d.type
            if(d.type==='random')
              d.x = +d.x;
            else
              d.x = +d.x
            d.y = +d.y;
            
        });

        var xValueR = function(d) { return d.x;};
        var yValueR = function(d) { return d.y;};
       
       xScale.domain([d3.min(data, xValueR), d3.max(data, xValueR)]);
        yScale.domain([d3.min(data, yValueR), d3.max(data, yValueR)]);
        
        var valueline = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0, "+(h-pad)+")")
          .call(xAxis)
          .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", left_pad-80)
        .attr("x",h-400)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component A")
          
            ;
 
        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate("+(left_pad-pad)+", 0)")
          .call(yAxis)
          .append("text")
        //.attr("transform", "rotate(-20)")
        .attr("y", left_pad+560)
        .attr("x",h-200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component B");


        var result = {};
        data.forEach(function(elem) {
          if(result[elem.type])
            result[elem.type].push(elem);
          else
            result[elem.type] = [elem];
        });

        for(var prop in result) {
          svg.append('path')
          .datum(result[prop])
          .attr('fill', 'none')
          .attr('stroke', function(d) { return prop === "random" ? color[0] : color[1]; })
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('d', valueline);
        }

        // if($scope.viewData[$scope.currentIndex].valueLine) {
        //   g.append('line')
        //   .style('stroke', '#aaa')
        //   .style('stroke-width', '2.5px')
        //   .style('stroke-dasharray', ('3, 3'))
        //   .attr('x1', 0)
        //   .attr('y1', yScale(1))
        //   .attr('x2', width)
        //   .attr('y2', yScale(1));
        // }

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale(d.x);
            }) 
            .attr("cy", function(d){
                return yScale(d.y);
            }) 
            .attr("fill", function(d) { return d.type === "random" ? color[0] : color[1]; })
            .attr("stroke", "black")
            //.attr("stroke-width", function(d) {return d/2;});
            ;

        console.log("Circles printed for all samples")

        // draw legend
  var legend = svg.selectAll(".legend")
      .data(typeArr)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) { return color[i]; });
      

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
         
    });

}
