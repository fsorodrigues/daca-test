var width = document.getElementById("svg1").clientWidth;
var height = document.getElementById("svg1").clientHeight;

var marginLeft = 0;
var marginTop = 70;

var svg = d3.select("#svg1")
              .append("g")
              .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

var scaleY = d3.scaleTime().range([0, (height - 2 * marginTop)]);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + width/2 + ", 0)")
    .call(d3.axisLeft(scaleY));

d3.select(".domain").attr("opacity", .5).attr("stroke-dasharray", "1,5");

function positionY(value) {
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
      d.posY = positionY(d.effect);
      d.color = coloring(d.effect);
  });

  var scaleX = d3.scaleLinear()
                  .range([(width/2 - 55),(width/2 + 5)])
                  .domain(d3.extent(dataIn, function(d){ return d.posY; }));

  console.log(dataIn);

  scaleY.domain([d3.min(dataIn.map(function(d){ return d.date })), d3.max(dataIn.map(function(d){ return d.date }))]);

  d3.select(".axis")
    .call(d3.axisLeft(scaleY).ticks(d3.timeYear.every(1)).tickSize(0));

  d3.selectAll(".tick text").attr("dy", -5).attr("dx", 23);

  d3.selectAll(".tick line").attr("stroke-dasharray", "1,2");

    svg.selectAll(".box")
        .data(dataIn)
        .enter()
        .append("rect")
          .attr("class", "box inactive")
          .attr("id", function(d,i) { return "entry-" + (i + 1) })
          .attr("y", function(d) { return scaleY(d.date); })
          .attr("x", function(d) { return scaleX(d.posY); })
          .attr("width", 50)
          .attr("height", 7)
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
                         .style("left", (d3.event.pageX - 320) + "px")
                         .style("top", (d3.event.pageY - 160) + "px");
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



    // svg.selectAll(".label-title")
    //     .data(dataIn)
    //     .enter()
    //     .append("text")
    //       .attr("class", "label-title")
    //       .attr("id", function(d,i) { return "entry-" + (i + 1) })
    //       .attr("x", scaleX(10))
    //       .attr("y", function(d) { return scaleY(d.date); })
    //       .attr("dy", 20)
    //     .text(function(d) { return d.title })
    //       .on("click", function(d) {
    //           var selection = d3.select(this).attr("id");
    //
    //           svg.selectAll("text#" + selection)
    //                 .transition()
    //                 .duration(800)
    //               .attr("opacity", 1);
    //
    //           d3.select("rect#" + selection)
    //                 .transition()
    //                 .duration(500)
    //               .attr("height", 200);
    //       });
    //
    //
    // var textLabel = svg.selectAll(".label-text")
    //                     .data(dataIn)
    //                     .enter()
    //                     .append("g")
    //                     .attr("class", "label-text")
    //                     .attr("transform", function(d) { return "translate(10,25)"; });
    //
    //     textLabel.append("text")
    //               .attr("class", "label-text")
    //               .attr("id", function(d,i) { return "entry-" + (i + 1) })
    //               .attr("opacity", 0)
    //               .attr("x", scaleX(0))
    //               .attr("y", function(d) { return scaleY(d.date); })
    //               .attr("dy", 20)
    //               .attr("class", "label-text")
    //               .text(function(d) { return d.text; });

});
