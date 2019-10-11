'use strict';

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


readTextFile("ucsd_admissions.json", function(text){
    var data_json = JSON.parse(text);
    var years = [];
    var curr_fulltime_men_app = [];
    var curr_fulltime_women_app = [];
    var curr_fulltime_men_admitted = [];
    var curr_fulltime_women_admitted = [];
    var curr_fulltime_men_enrolled = [];
    var curr_fulltime_women_enrolled = [];

    for(var year in data_json){

        years.push(data_json[year]["year"]);
        curr_fulltime_men_app.push(parseInt(data_json[year]["fulltime_men_applied"],10));
        curr_fulltime_women_app.push(parseInt(data_json[year]["fulltime_women_applied"], 10));
        curr_fulltime_men_admitted.push(parseInt(data_json[year]["fulltime_men_admitted"],10));
        curr_fulltime_women_admitted.push(parseInt(data_json[year]["fulltime_women_admitted"],10));
        curr_fulltime_men_enrolled.push(parseInt(data_json[year]["fulltime_men_enrolled"],10));
        curr_fulltime_women_enrolled.push(parseInt(data_json[year]["fulltime_women_enrolled"],10));

    }

    var indx_2018 = years.length-1;


    /*------- PIE CHART ------*/
    // set chart dimesnions
    var width = 500
    var height = 500
    var margin = 60

    // get radius of pie chart
    var radius = Math.min(width, height) / 2 - margin

    // append svg to div object
    var svg = d3.select("#d3PieChartPlaceHolder")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    
    //TODO NEED TITLE

    // Format data
    var data_json = {"men_applied": curr_fulltime_men_app[indx_2018], 
    "women_applied": curr_fulltime_women_app[indx_2018], 
    "men_enrolled":curr_fulltime_men_enrolled[indx_2018], 
    "women_enrolled":curr_fulltime_women_enrolled[indx_2018], 
    "men_admitted":curr_fulltime_men_admitted[indx_2018],
    "women_admitted":curr_fulltime_women_admitted[indx_2018]}

    // set color scale
    var color = d3.scaleOrdinal()
    .domain(data_json)
    .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data_json))

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    // Build the pie chart
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ return "" + d.data.key})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 12)

    svg.append("text")
        .attr("x", (width / 12))             
        .attr("y", -200)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("UCSD Application Records (2018)");


    /*---- END PIE CHART ------*/

    /*---- BAR CHART -----*/
    var margin = {top: 40, right: 20, bottom: 70, left: 75},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg2 = d3.select("#d3BarChartPlaceHolder").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("ucsd_admissions_bar.csv", function(error, data) {

        data.forEach(function(d) {
            d.date = parseInt(d.year.replace(',', ''))
            d.value = parseInt(d.fulltime_men_applied.replace(',', ''));
        });
        
        
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" )
    svg2.append("text")             
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
                .text("Year");

    svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 5)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("UCSD Fulltime Men Applied (2005-2018)");

    svg2.append("g")
        .attr("class", "y axis")
        
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".9em")
        .style("text-anchor", "end")
        
    svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Fulltime Men Applied (thousands)");        

    svg2.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
        
    });


    /*----- END BAR CHART ---*/

    /*---- BEGIN LINE CHART ----*/
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 60, bottom: 50, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#d3LineChartPlaceHolder")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("ucsd_admissions_bar.csv",

    // When reading the csv, I must format variables:
    function(d){
    return { date : parseInt(d.year.replace(',', '')), value : parseInt(d.fulltime_men_applied.replace(',', ''))}
    },


    // Now I can use this dataset:
    function(data) {
    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
    .domain([2005,2018])
    .range([ 0, 500]);
    console.log(x);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    svg.append("text")             
        .attr("transform",
            "translate(" + (width/4) + " ," + 
                (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
        .text("Year");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Fulltime Men Applied (thousands)");      

    // Add the line
    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
        
    svg.append("text")
    .attr("x", (400 / 2))             
    .attr("y", 10 )
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("UCSD Fulltime Men Applied (2005-2018)");
    

    })


});


