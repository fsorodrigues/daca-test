var width = document.getElementById("svg1").clientWidth;
var height = document.getElementById("svg1").clientHeight;

var marginLeft = 60;
var marginTop = 200;

var svg = d3.select("#svg1")
              .append("g")
              .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

var scaleX = d3.scaleLinear().range([0,(width - 2 * marginLeft)]).domain([0,200]);
var scaleY = d3.scaleTime().range([0, (height - 2 * marginTop)]);


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(scaleY));

//import the data from the .csv file
d3.csv("./daca_timeline.csv", function(dataIn){

  var parser = d3.timeParse("%m/%d/%Y")

  dataIn.forEach(function(d){
      d.date = parser(d.start_date);
  });

  console.log(dataIn);

  scaleY.domain([d3.min(dataIn.map(function(d){ return d.date })), d3.max(dataIn.map(function(d){ return d.date }))]);

  d3.select(".axis")
    .call(d3.axisLeft(scaleY).ticks(d3.timeYear.every(1)));

    svg.selectAll(".box")
        .data(dataIn)
        .enter()
        .append("rect")
          .attr("class", "box")
          .attr("id", function(d,i) { return "entry-" + (i + 1) })
          .attr("y", function(d) { return scaleY(d.date); })
          .attr("x", scaleX(2))
          .attr("width", 200)
          .attr("height", 30)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", "red");

    svg.selectAll(".label-title")
        .data(dataIn)
        .enter()
        .append("text")
          .attr("class", "label-title")
          .attr("id", function(d,i) { return "entry-" + (i + 1) })
          .attr("x", scaleX(10))
          .attr("y", function(d) { return scaleY(d.date); })
          .attr("dy", 20)
        .text(function(d) { return d.title })
          .on("click", function(d) {
              var selection = d3.select(this).attr("id");

              svg.selectAll("text#" + selection)
                    .transition()
                    .duration(800)
                  .attr("opacity", 1);

              d3.select("rect#" + selection)
                    .transition()
                    .duration(500)
                  .attr("height", 200);
          });


    var textLabel = svg.selectAll(".label-text")
                        .data(dataIn)
                        .enter()
                        .append("g")
                        .attr("class", "label-text")
                        .attr("transform", function(d) { return "translate(10,25)"; });

        textLabel.append("text")
                  .attr("class", "label-text")
                  .attr("id", function(d,i) { return "entry-" + (i + 1) })
                  .attr("opacity", 0)
                  .attr("x", scaleX(0))
                  .attr("y", function(d) { return scaleY(d.date); })
                  .attr("dy", 20)
                  .attr("class", "label-text")
                  .text(function(d) { return d.text; });

});
