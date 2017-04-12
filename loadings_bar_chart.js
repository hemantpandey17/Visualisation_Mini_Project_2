function drawBarChartLoadings(filename, sampling) {
	var categories = ['']
	var values = []
    var colors = d3.scale.category10();
    filename = "./data_sampled/" + filename;
    console.log(filename);
    svg.selectAll("*").remove();
	d3.csv(filename, function(error, data) {


	  data.forEach(function(d) {
	  	if (sampling === 'random' && d.type === 'random') {
	  		categories.push(d.x);
	    	values.push(Number(d.y));
	  	}
	  	if (sampling === 'stratified' && d.type === 'stratified') {
	  		categories.push(d.x);
	    	values.push(Number(d.y));
	  	}
	 });

	  var grid = d3.range(25).map(function(i){
			return {'x1':0,'y1':25,'x2':0,'y2':480};
		});

		var xscale = d3.scale.linear()
						.domain([0, 0.7])
						.range([0,722]);

		var yscale = d3.scale.linear()
						.domain([0, categories.length])
						.range([35,480]);

		var grids = svg.append('g')
						  .attr('id','grid')
						  .attr('transform','translate(150,10)')
						  .selectAll('line')
						  .data(grid)
						  .enter()
						  .append('line')
						  .attr({'x1':function(d,i){ return i*30; },
								 'y1':function(d){ return d.y1; },
								 'x2':function(d,i){ return i*30; },
								 'y2':function(d){ return d.y2; },
							})
						  .style({'stroke':'#adadad','stroke-width':'1px'});

		var	xAxis = d3.svg.axis();
			xAxis
				.orient('bottom')
				.scale(xscale)
				.tickValues([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);

		var	yAxis = d3.svg.axis();
			yAxis
				.orient('left')
				.scale(yscale)
				.tickSize(2)
				.tickFormat(function(d,i){ return categories[i]; })
				.tickValues(d3.range(17));

		var y_xis = svg.append('g')
						  .attr("transform", "translate(150,0)")
						  .attr('id','yaxis')
						  .call(yAxis)
						  .append("text")
					      .attr("class", "label")
					      .attr("transform", "rotate(-90)")
					      .attr("y", 6)
					      .attr("x", -33)
					      .attr("dy", ".71em")
					      .style("text-anchor", "end")
					      .style("font-size", 12)
					      .text('Variables');


		var x_xis = svg.append('g')
						  .attr("transform", "translate(150,480)")
						  .attr('id','xaxis')
						  .call(xAxis);
						  x_xis.append("text")
					      .attr("class", "label")
					      .attr("x", 720)
					      .attr("y", -6)
					      .style("text-anchor", "end")
					      .style("font-size", 12)
					      .text('PCA sum of squared loadings');
					      x_xis.append("text")
					      .attr("class", "label")
					      .attr("x", 717)
					      .attr("y", 50)
					      .style("text-anchor", "end")
					      .style("font-size", 18)
					      .text('|-- Variables considered significant --|');

		var chart = svg.append('g')
							.attr("transform", "translate(150,0)")
							.attr('id','bars')
							.selectAll('rect')
							.data(values)
							.enter()
							.append('rect')
							.attr('height',30)
							.attr({'x':0,'y':function(d,i){ return yscale(i)+50; }})
							.style('fill',function(d,i){ return colors(i); })
							.attr('width',function(d){ return 0; });


		var transit = d3.select("svg").selectAll("rect")
						    .data(values)
						    .transition()
						    .duration(1000) 
						    .attr("width", function(d) {return xscale(d); });

		var transitext = d3.select('#bars')
							.selectAll('text')
							.data(values)
							.enter()
							.append('text')
							.attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+70; }})
							.text(function(d){ return d; }).style({'fill':'#fff','font-size':'14px'});

		svg.append("text")
        .attr("x", (550))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text('Scree Plot showing PCA loadings for all the variables');

        svg.append("svg:line")
      	.attr("class", 'd3-dp-line')
                    .attr("x1", 570)
                    .attr("y1", 35)
                    .attr("x2", 570)
                    .attr("y2", 600)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("stroke-opacity", 0.9)
                    .style("stroke", 'red')
                    .style('stroke-width', 1.5);
	});
}