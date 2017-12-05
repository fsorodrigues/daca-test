var margin = { top: 100,
               right: 100,
               bottom: 100,
               left: 100,
             };

var drawingCanvas = d3.select("#grid");

var length;

queue()
  .defer(d3.csv, "./quotes.csv") // import the data from the .csv file

  .await(function(err, dataIn) { // executing appends and functions after data loads

    var sizer = drawingCanvas.append("div")
                        .attr("class", "grid-sizer");

    var cards = drawingCanvas.selectAll("g")
                        .data(dataIn)
                        .enter()
                        .append("div")
                          .attr("class", "card")
                          .attr("id", function(d,i) { return "card-" + (i + 1) });

    var front = cards.append("div")
                      .attr("class", "grid-item front")
                      .attr("id", function(d,i){ return d.name + " " + d.surname })
                      .style("background-image", function(d,i) { return "url('./img/" + d.name + ".jpg')"});

    var back = cards.append("div")
                        .attr("class", "grid-item back")

    var quote = back.append("p")
                      .html(function(d,i){ return "\"" + d.quote + "\"" })
                      .attr("class", "quote");

    var name = back.append("p")
                      .html(function(d,i){ return d.name + " " + d.surname })
                      .attr("class", "name");

        length = dataIn.length;

        // console.log(length);

        $(function(){ $(".card").flip(); });

        setInterval(function() {

          var randomizer = Math.ceil(Math.random() * length);

          var select = "#card-" + randomizer;

          $(function(){

              $(select).flip({
                  trigger: "manual"
              });

              setTimeout(function(){
                  $(select).flip(true);
              },0);

              setTimeout(function(){
                  $(select).flip(false);
              }, 2000);

          });

        }, 4000);
  });
