setTimeout(function() {
  var brenda = document.getElementById("brenda");
  var canvas = document.getElementById("line");

  var posB = brenda.getBoundingClientRect();
  // console.log(posB);
  // console.log(posB.top, posB.left);

  var posL = canvas.getBoundingClientRect();
  // console.log(posL);
  // console.log(posL.top, posL.left);

  var brendaCard = [{ age: 19, country: "Mexico", name: "Brenda", quote: "It is not just the Latinos and Mexicans who are undocumented. There are others and they need our support and representation, too.", status: "Harvard Sophomore", surname: "Esqueda" }];

  var positions = {top: (posL.top + window.scrollY) , left: (posL.left + window.scrollX)};

  console.log(positions.top, positions.left);

  var lineData = [{x: ((posB.left - posL.left) + 5), y: ((posB.top - posL.top) + 30) },
                  {x: ((posB.left - posL.left) - 150), y: ((posB.top - posL.top) + 30 ) },
                  {x: ((posB.left - posL.left) - 150), y: ((posL.top - posB.top) + 300) },
                  {x: ((posB.left - posL.left) - 250), y: ((posL.top - posB.top) + 300)}]

  // console.log(lineData);

  var makeLine = d3.line()
                   .curve(d3.curveCardinal.tension(.98))
                   .x(function(d) { return d.x })
                   .y(function(d) { return d.y });

  function drawBrenda() {

    var path = d3.select("#line")
                 .append("path")
                 .datum(lineData)
                 .attr("class","line")
                 .attr("fill", "none")
                 .attr("stroke", "#fbd1d3")
                 .attr("stroke-width", 3)
                 .attr("stroke-linecap", "round")
                 .attr("stroke-linejoin", "round")
                 .attr("d", makeLine);

    var totalLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1200)
            .attr("stroke-dashoffset", 0);

    var card_clicker = false;

    window.setTimeout(drawCard, 1200);

    function drawCard() {
      var card = d3.selectAll(".card-container")
                   .data(brendaCard)
                   .enter()
                   .append("div")
                   .attr("class", "card-container")
                   .attr("id", "brendaCard")
                   .on("click", function(d) {
                      if (card_clicker == false) {
                        d3.select(".front-animation")
                          .style("transform", "rotateY(180deg)")
                          .style("z-index", 0);

                        d3.select(".back-animation")
                          .style("transform", "rotateY(0deg)")
                          .style("z-index", 1);

                          card_clicker = true;

                      } else {
                        d3.select(".front-animation")
                          .style("transform", "rotateY(0deg)")
                          .style("z-index", 1);

                        d3.select(".back-animation")
                          .style("transform", "rotateY(-180deg)")
                          .style("z-index", 0);

                          card_clicker = false;
                      }
                    });

          card.style("left", (positions.left) + "px")
              .style("top", (positions.top + 180) + "px")
              .style("opacity", 0)
              .transition()
              .duration(200)
              .style("opacity", 1);

      var front = card.append("div")
                      .attr("class", "front-animation card-animation")
                      .style("background-image", function(d,i) { return "url('./img/" + d.name + ".jpg')"})
                      .style("transform", "rotateY(0deg)")
                      .style("z-index", 0);

      var back = card.append("div")
                     .attr("class", "back-animation card-animation")
                     .style("transform", "rotateY(-180deg)")
                     .style("z-index", 1);

      var quote = back.append("p")
                        .html(function(d,i){ return "\"" + d.quote + "\"" })
                        .attr("class", "quote");

      var name = back.append("p")
                        .html(function(d,i){ return d.name + " " + d.surname })
                        .attr("class", "name");

          card.append("p")
              .attr("class", "card-explainer")
              .html("<b>The Margins</b> spoke to Dreamers like Brenda (above) and american citizen alike about how the end of DACA affects their lives. If you want to see more of what they had to say, click the names appearing in the story.");
    }

  }

  var offset = - (1.5 * svgHeight[1]);

  d3.graphScroll()
    .sections(d3.selectAll(".card-trigger"))
    .offset(offset)
    .on("active", function(i) { if (i == 1) {
          drawBrenda()
          setTimeout(function() { d3.select("#brendaCard").on("click")(); }, 3000);
    }; });

}, 500)

$(document).ready(function() {
   $("body").localScroll({ duration: 800 });
});
