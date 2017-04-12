function drawBarChart(filename, sampling) {
    refresh();

    filename = "./data_sampled/" + filename;
    console.log(filename);
    svg.selectAll("*").remove();



svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1),
    y = d3.scale.linear().range([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   d3.csv(filename, function(error, data) {
    data.forEach(function(d) {
        d.type = d.type;
        d.x = d.x;
        d.y = +d.y;
   });

  data = data.filter(function(obj) {
    return obj.type === sampling;
  }).sort(function(obj1, obj2) {
    return obj1.y - obj2.y;
  }); 

  x.domain(data.map(function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.svg.axis().scale(y).orient("left"));

  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.y); });
});
}