function loadData(year, month, day, d)
{
            num_of_hours = 24;
            var hours = {};
            for (var i = 1; i <= num_of_hours; i++) {
              hours[i.toString()] = {};
              for (var j =1; j <= 5; j++) {
                hours[i.toString()]["sentiment"+j.toString()] = 0;
              };
            };
            var b = d.filterRange(year,year+1, "year").filterRange(month,month+1, "month").filterRange(day,day+1, "day").getData();
            console.log(b);
            for(var i = 0; i < b.length; i++) {
                var emailObj = b[i];
                hour = emailObj.hour.toString();
                sentiment = "sentiment"+emailObj.sentiment.toString();
                hours[hour][sentiment] += 1;
            }

            var matrix = new Array(5);
            for (var i = 0; i < num_of_hours; i++) {
                matrix[i] = new Array(6);
                for (var j = 0; j < 6; j++){
                  matrix[i][j] = 0;
                }
              }

            for(var hour=1; hour <= num_of_hours; hour++){
              matrix[hour-1][0] = hour;
              for(var sentiment=1; sentiment <= 5; sentiment++){
                matrix[hour-1][sentiment] += hours[hour.toString()]["sentiment"+sentiment.toString()];
              }
            }

            return matrix;
}

function renderDayView(year, month, day,sentiment)
{
            var w = 960,
            h = 500,
            p = [20, 50, 30, 20]

            var svg = d3.select("#viz").append("svg:svg")
                        .attr("width", w)
                        .attr("height", h)
                        .append("svg:g")
                        .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");
 
             x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
             y = d3.scale.linear().range([0, h - p[0] - p[2]]),
             z = d3.scale.ordinal().range(["#005DFF", "#0098E8", "#00F1FF", "#10E8B1", "#03FF6F"])

            var parse = d3.time.format("%H").parse,
            format = d3.time.format("%I%p");
            var formatTime = d3.time.format("%e %B");;
            matrix = loadData(year, month, day,sentiment);
            var remapped =["c1","c2","c3","c4","c5"].map(function(dat,i){
                return matrix.map(function(d,ii){
                    return {x: parse((ii+1).toString()), y: d[i+1] };
                })
            });

            var stacked = d3.layout.stack()(remapped)
 
            x.domain(stacked[0].map(function(d) { return (d.x); }));
            y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);
 
            // Add a group for each column.
            var valgroup = svg.selectAll("g.valgroup")
            .data(stacked)
            .enter().append("svg:g")
            .attr("class", "valgroup")
            .style("fill", function(d, i) { return z(i); })
            .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });
 
            // Add a rect for each date.
            var rect = valgroup.selectAll("rect")
            .data(function(d){return d;})
            .enter().append("svg:rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return -y(d.y0) - y(d.y); })
            .attr("height", function(d) { return y(d.y); })
            .attr("width", x.rangeBand())
            .on("mouseover", function(d) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                div .html("Hello")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });

            var div = d3.select("body").append("div")   
                  .attr("class", "tooltip")               
                  .style("opacity", 0);

            var label = svg.selectAll("text")
                          .data(x.domain())
                        .enter().append("svg:text")
                          .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
                          .attr("y", 6)
                          .attr("text-anchor", "middle")
                          .attr("dy", ".71em")
                          .text(format);
            var rule = svg.selectAll("g.rule")
                          .data(y.ticks(5))
                        .enter().append("svg:g")
                          .attr("class", "rule")
                          .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });
            /*rule.append("svg:line")
                  .attr("x2", w - p[1] - p[3])
                  .style("stroke", function(d) { return d ? "#fff" : "#000"; })
                  .style("stroke-opacity", function(d) { return d ? .7 : null; });*/

            rule.append("svg:text")
                  .attr("x", w - p[1] - p[3] + 6)
                  .attr("dy", ".35em")
                  .text(d3.format(",d"));
}

$('#button1').on('click', function (e) {
  $("#viz").html("");
  d = jsonFilter.filterRange(1,1,"sentiment");
  renderDayView(2013,11,3,d);
})
$('#button2').on('click', function (e) {
  $("#viz").html("");
  d = jsonFilter.filterRange(2,2,"sentiment");
  renderDayView(2013,11,3,d);
})
$('#button3').on('click', function (e) {
  $("#viz").html("");
  d = jsonFilter.filterRange(3,3,"sentiment");
  renderDayView(2013,11,3,d);
})
$('#button4').on('click', function (e) {
  $("#viz").html("");
  d = jsonFilter.filterRange(4,4,"sentiment");
  renderDayView(2013,11,3,d);
})
$('#button5').on('click', function (e) {
  $("#viz").html("");
  d = jsonFilter.filterRange(5,5,"sentiment");
  renderDayView(2013,11,3,d);
})
$('#button6').on('click', function (e) {
  $("#viz").html("");
  renderDayView(2013,11,3,jsonFilter);
})
$('.tosubmit').click(function() {
    var email = $('#toEmail').val();
    $("#viz").html("");
    d = jsonFilter.filterSingle(email,"to");
    renderDayView(2013,11,3,d);
})
$('.fromsubmit').click(function() {
    var email = $('#fromEmail').val();
    $("#viz").html("");
    d = jsonFilter.filterSingle(email,"from");
    renderDayView(2013,11,3,d);
})


renderDayView(2013,11,3,jsonFilter);