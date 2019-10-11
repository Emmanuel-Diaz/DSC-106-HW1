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
    var data = JSON.parse(text);
    var years = [];
    var curr_fulltime_men_app = [];
    var curr_fulltime_women_app = [];
    var curr_fulltime_men_admitted = [];
    var curr_fulltime_women_admitted = [];
    var curr_fulltime_men_enrolled = [];
    var curr_fulltime_women_enrolled = [];

    for(var year in data){

        years.push(data[year]["year"]);
        curr_fulltime_men_app.push(parseInt(data[year]["fulltime_men_applied"],10));
        curr_fulltime_women_app.push(parseInt(data[year]["fulltime_women_applied"], 10));
        curr_fulltime_men_admitted.push(parseInt(data[year]["fulltime_men_admitted"],10));
        curr_fulltime_women_admitted.push(parseInt(data[year]["fulltime_women_admitted"],10));
        curr_fulltime_men_enrolled.push(parseInt(data[year]["fulltime_men_enrolled"],10));
        curr_fulltime_women_enrolled.push(parseInt(data[year]["fulltime_women_enrolled"],10));

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
    var data = {"men_applied": curr_fulltime_men_app[indx_2018], 
    "women_applied": curr_fulltime_women_app[indx_2018], 
    "men_enrolled":curr_fulltime_men_enrolled[indx_2018], 
    "women_enrolled":curr_fulltime_women_enrolled[indx_2018], 
    "men_admitted":curr_fulltime_men_admitted[indx_2018],
    "women_admitted":curr_fulltime_women_admitted[indx_2018]}

    // set color scale
    var color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))

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

    /*---- END PIE CHART ------*/

    /*---- BAR CHART -----*/
    var svg2 = d3.select("#d3BarChartPlaceHolder"),
            margin = 200,
            width = svg2.attr("width") - margin,
            height = svg2.attr("height") - margin


    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
                yScale = d3.scaleLinear().range([height, 0]);

    var g = svg2.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("ucsd_admissions_csv.csv", function(error, data1) {
        if (error) {
            throw error;
        }

        xScale.domain(data1.map(function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.fulltime_men_enrolled; })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return "$" + d;
        }).ticks(10));


        g.selectAll(".bar")
        .data(data1)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.year); })
        .attr("y", function(d) { return yScale(d.fulltime_men_enrolled); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.fulltime_men_enrolled)}); 
    });


    /*----- END BAR CHART ---*/

    /*---- BEGIN LINE CHART ----*/
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#d3LineChartPlaceHolder").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("ucsd_admissions_csv.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

        // Add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // text label for the x axis
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

        // Add the y Axis
        svg.append("g")
        .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");      

    });


});


