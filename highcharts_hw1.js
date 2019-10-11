/* SOURCES USED
Reading JSON file - https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript

Pie Chart - https://www.highcharts.com/demo/pie-basic
Bar Chart - https://www.highcharts.com/demo/bar-basic
Line Chart - https://www.highcharts.com/demo/line-basic

*/

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

    var barChart = document.getElementById("barChartPlaceHolder");
    Highcharts.chart(barChart, {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'UCSD Admissions Status (2005-2018)'
    },
    xAxis: {
        categories: years,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Students (thousands)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' thousands'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'fulltime_men_app',
        data: curr_fulltime_men_app
    }, {
        name: 'fulltime_women_app',
        data: curr_fulltime_women_app
    }, {
        name: 'fulltime_men_enrolled',
        data: curr_fulltime_men_enrolled
    }, {
        name: 'fulltime_women_enrolled',
        data: curr_fulltime_women_enrolled
    }]
});

var lineChart = document.getElementById("lineChartPlaceHolder");
    Highcharts.chart(lineChart, {
    chart: {
        type: 'line'
    },
    title: {
        text: 'UCSD Admissions Status (2005-2018)'
    },
    xAxis: {
        categories: years,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Students (thousands)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' thousands'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'fulltime_men_app',
        data: curr_fulltime_men_app
    }, {
        name: 'fulltime_women_app',
        data: curr_fulltime_women_app
    }, {
        name: 'fulltime_men_enrolled',
        data: curr_fulltime_men_enrolled
    }, {
        name: 'fulltime_women_enrolled',
        data: curr_fulltime_women_enrolled
    }]
});

var indx_2018 = years.length - 1;
var total_for_2018 = curr_fulltime_men_app[indx_2018] + curr_fulltime_women_app[indx_2018] + curr_fulltime_men_admitted[indx_2018] + curr_fulltime_women_admitted[indx_2018] + curr_fulltime_men_enrolled[indx_2018] + curr_fulltime_women_enrolled[indx_2018]

var pieChart = document.getElementById("pieChartPlaceHolder");
    Highcharts.chart(pieChart, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'UCSD Admissions (2018)'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Students',
            colorByPoint: true,
            data: [{
                name: 'Fulltime_men_enrolled',
                y: curr_fulltime_men_enrolled[indx_2018]/total_for_2018,
                sliced: true,
                selected: true
            }, {
                name: 'Fulltime_women_enrolled',
                y: curr_fulltime_women_enrolled[indx_2018]/total_for_2018
            }, {
                name: 'Fulltime_men_admitted',
                y: curr_fulltime_men_admitted[indx_2018]/total_for_2018
            }, {
                name: 'Fulltime_women_admitted',
                y: curr_fulltime_women_admitted[indx_2018]/total_for_2018
            }, {
                name: 'Fulltime_women_applied',
                y: curr_fulltime_women_app[indx_2018]/total_for_2018
            }, {
                name: 'Fulltime_men_applied',
                y: curr_fulltime_men_app[indx_2018]/total_for_2018
            }]
        }]
});
});
