var width = document.getElementById("svg1").clientWidth;
var height = document.getElementById("svg1").clientHeight;

// console.log(width);
// console.log(height);

var svgHeight = [ 500, 500, 6500 ];

var factorHeight = 300;

var marginLeft = 0;
var marginTop = 70;

var svg = d3.select("#svg1")
              .attr("height", svgHeight[1])
              .append("g")
              .attr("class", "timeline-group")
              .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

var scaleY = d3.scaleTime().range([0, (svgHeight[1] - 2 * marginTop)]);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + width/2 + ", 0)")
    .call(d3.axisLeft(scaleY));

d3.select(".domain").attr("opacity", .5).attr("stroke-dasharray", "1,5");

function positionX(value) {
  if (value == "positive") {
    return 1;
  } else if (value == "negative") {
    return -1;
  }
};

function coloring(value) {
  if (value == "positive") {
    return "#044389";
  } else if (value == "negative") {
    return "#ED1C24";
  }
};

var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .attr("opacity", 0)
                .html("")
                .on("click", function(d) {
                  tooltip.transition()
                         .duration(200)
                         .style("opacity", 0);

                  tooltip.html("");

                  d3.selectAll(".box").attr("class", "box inactive");
                });

//import the data from the .csv file
d3.csv("./daca_timeline.csv", function(dataIn){

  var parser = d3.timeParse("%m/%d/%Y");

  dataIn.forEach(function(d){
      d.date = parser(d.start_date);
      d.posX = positionX(d.effect);
      d.color = coloring(d.effect);
  });

  var scaleX = d3.scaleLinear()
                  .range([(width/2 - (width/4 + 5)),(width/2 + 5)])
                  .domain(d3.extent(dataIn, function(d){ return d.posX; }));

  // console.log(dataIn);

  scaleY.domain([d3.max(dataIn.map(function(d){ return d.date })), d3.min(dataIn.map(function(d){ return d.date }))]);

  d3.select(".axis")
    .call(d3.axisLeft(scaleY).ticks(d3.timeYear.every(2)).tickSize(0));

  d3.selectAll(".tick text").attr("dy", -5).attr("dx", 23);

  d3.selectAll(".tick line").attr("stroke-dasharray", "1,2");

    svg.selectAll(".box")
        .data(dataIn)
        .enter()
        .append("rect")
          .attr("class", "box inactive")
          .attr("id", function(d,i) { return "entry-" + (i + 1) })
          .attr("y", function(d) { return scaleY(d.date); })
          .attr("x", function(d) { return scaleX(d.posX); })
          .attr("width", width/4)
          .attr("height", svgHeight[1]/factorHeight)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", function(d) { return d.color; })
          .on("click", function(d) {
              var selection = d3.select(this).attr("class");

              if (selection == "box active") {
                  d3.select(this).attr("class", "box inactive");

                  tooltip.transition()
                         .duration(500)
                         .style("opacity", 0);

                  tooltip.html("");

              } else {
                  d3.selectAll(".box").attr("class", "box inactive");

                  d3.select(this).attr("class", "box active");

                  tooltip.transition()
                         .duration(350)
                         .style("opacity", 1)
                         .style("background", d.color);

                  tooltip.html("<p>" + d.start_date +"</p><p><b>" + d.title + "</b></p> <p>" + d.text + "</p>")
                         .style("left", (d3.event.pageX - 300) + "px")
                         .style("top", (d3.event.pageY - 10) + "px");
              }
          });

    svg.selectAll(".circles")
        .data([d3.min(dataIn.map(function(d){ return d.date })), d3.max(dataIn.map(function(d){ return d.date }))])
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", 3)
        .attr("cx", width/2)
        .attr("cy", function(d,i) { return scaleY(d); });

});

function update(index) {

    function indexer(index) {
      if (index == 0) { return 1; }
      else { return index; }
    };

    function inverter(index) {
      if (index == 0) { return 2 }
      else { return 3 - index }
    };

    scaleY.range([0, (svgHeight[indexer(index)] - 2 * marginTop)]);

    d3.select(".axis").transition()
                      .duration(1000)
                      .call(d3.axisLeft(scaleY)
                              .ticks(d3.timeYear.every(inverter(index)))
                              .tickSize(0) )

    svg.attr("height", svgHeight[indexer(index)]);

    // update selection
    svg.selectAll(".box")
        .transition()
        .duration(1000)
        .attr("y", function(d) { return scaleY(d.date); })
        .attr("height", svgHeight[indexer(index)]/(indexer(index)*factorHeight));

    d3.select("#svg1")
      .transition()
      .duration(1000)
      .attr("height", svgHeight[indexer(index)]);

    svg.selectAll(".circles")
       .transition()
       .duration(1000)
       .attr("cy", function(d,i) { return scaleY(d); });

};

var offset = - (2.8 * svgHeight[1]);

d3.graphScroll()
  .sections(d3.selectAll(".trigger"))
  .graph(d3.select(".svg-container"))
  .offset(offset)
  .on("active", function(i) { update(i);
                              glow(i);
                            });
function glow(i) {
  d3.select("#entry-15").attr("class", "box glow-" + i);
}
