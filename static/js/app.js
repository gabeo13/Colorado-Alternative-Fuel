//Read in JSON file and establish dropdown menu of options
var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;
d3.json(jsonPath).then(function (data) {
    console.log("Original data from api call", data);

    var cities = [];
    var zip = [];
    var type = [];
    for (i = 0; i < data.length; i++) {
        cities.push(data[i]['City']);
        zip.push(data[i]['Zip Code']);
        type.push(data[i]['fuel_type_code'])
    };

    var cityUnique = cities.filter((item, i, ar) => ar.indexOf(item) === i);
    var zipUnique = zip.filter((item, i, ar) => ar.indexOf(item) === i);
    var typeUnique = type.filter((item, i, ar) => ar.indexOf(item) === i);

    console.log(cityUnique);
    console.log(zipUnique);
    console.log(typeUnique);

    var dropDownCity = d3.select('#City');
    // var dropDownZip = d3.select('#selZip');
    var dropDownType = d3.select('#fuel_type_code');

    console.log(dropDownCity);
    // console.log(dropDownZip);
    console.log(dropDownType);

    dropDownCity.html("");
    // dropDownZip.html("");
    dropDownType.html("");

    for (i = 0; i < cityUnique.length; i++) {

        var city_option = dropDownCity.append('option')
        city_option.text(`${cityUnique[i]}`)
            .attr("value", cityUnique[i])
            .attr("id", "City");

    };

    // for (i = 0; i < zipUnique.length; i++) {

    //     dropDownZip.append('option').text(`${zipUnique[i]}`);

    // };

    for (i = 0; i < typeUnique.length; i++) {

        var type_option = dropDownType.append('option')
        type_option.text(`${typeUnique[i]}`)
            .attr('value', typeUnique[i])
            .attr("id", "fuel_type_code");

    };

});

// // Initialize Dashboard with an ID
function init() {
    var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;

    d3.json(jsonPath).then(function (data) {

        // inputData = data.filter(item => (item.City == 'Denver'))

        buildPlot(data); // need to pick values for initializing dashboard

        buildMap(data); // initialize map
    })
};

init();

var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;


var filters = {};

function updateFilters() {

    // Save the element, value, and id of the filter that was changed
    var changedElement = d3.select(this)//.properties('value')//.select('option');
    console.log(changedElement)
    var elementValue = changedElement.property('value');
    console.log("elValue", elementValue);

    var filterId = changedElement.attr('id')

    // If a filter value was entered then add that filterId and value
    // to the filters list. Otherwise, clear that filter from the filters object

    if (elementValue) {
        filters[filterId] = elementValue
    }
    else {
        delete filters[filterId];
    };

    /* delete method */
    // myMap.eachLayer(function (layer) {
    //     if (layer instanceof L.layerGroup) {
    //         myMap.removeLayer(layer)
    //     }
    // })
    myMap.eachLayer(function (layer) {
        if (myMap.hasLayer(layer)) {
            myMap.removeLayer(layer)
        }
    })

    console.log("filters", filters)

    // Call function to apply all filters and rebuild chart
    filterData()

}


function filterData() {
    d3.json(jsonPath).then(function (data) {
        // Set the filteredData to the tableData
        let filteredData = data;
        // Loop through all of the filters and keep any data that
        // matches the filter values
        Object.entries(filters).forEach(([key, value]) => {
            filteredData = filteredData.filter(row => row[key] === value);
        });
        // Finally, rebuild the chart using the filtered Data
        console.log(filteredData);
        buildPlot(filteredData);
        buildMap(filteredData);
    });
}// end filterdata function

d3.selectAll(".filter").on("change", updateFilters);

// Build the plots
function buildPlot(plotData) {

    // Setup Variables for plotting
    var cities = [];
    var zip = [];
    var type = [];
    var pop = [];
    var inc = [];
    var zipType = [];

    // Loop through receieved filtered data to fill containers
    for (i = 0; i < plotData.length; i++) {
        cities.push(plotData[i]['City']);
        zip.push(plotData[i]['Zip Code']);
        type.push(plotData[i]['fuel_type_code']);
        pop.push(plotData[i]['Population']);
        inc.push(plotData[i]['Average Household Income']);
        zipType.push([plotData[i]['Zip Code'], plotData[i]['fuel_type_code']])
    };

    console.log("zipAndType", zipType)

    //Map Reduce received fuel station type to unique station and freq of unique station
    var typeMap = type.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    console.log("Type Frequency:", typeMap);

    //Convert object to array for additional manipulation
    var typeMaparray = Array.from(typeMap.entries())
    console.log(typeMaparray);

    //Ufunc to construct XY Formatted pairs for plotting
    function storeXY(xVal, yVal, array) {
        array.push({ x: xVal, y: yVal });
    };

    //Initialize container and loop through recieved type array for xy formatted array (required format for treemap)
    var xyArray = []
    for (i = 0; i < typeMaparray.length; i++) {
        storeXY(typeMaparray[i][0], typeMaparray[i][1], xyArray)
    };
    console.log('basic tree map array', xyArray);

    //Construct "x" and "y" variables for bar chart from map reduce function on fuel station type
    var typeKeys = Array.from(typeMap.keys());
    console.log("Type Keys:", typeKeys)
    var typeValues = Array.from(typeMap.values());
    console.log("Type Values:", typeValues)

    //Engineer data for bubble plot starting with unique value arrays
    var zipUnique = zip.filter((item, i, ar) => ar.indexOf(item) === i);
    var popUnique = pop.filter((item, i, ar) => ar.indexOf(item) === i);
    var incUnique = inc.filter((item, i, ar) => ar.indexOf(item) === i);

    //Construct array for multidimensional treemap
    // Format [{ name: e['Zip Code'].toString(), data: [{ x: fuelType[i], y: countOfType[i] }] }

    var counter = {};

    zipType.forEach(function (obj) {
        var key = JSON.stringify(obj)
        counter[key] = (counter[key] || 0) + 1
    });

    console.log('counter', counter);

    var parsedCounter = JSON.parse(counter);

    console.log('parsedCounter', parsedCounter);


    // var treeArray = counter.map(function (e, i) {
    //     return { name: e[i][0][0].toString(), data: [{ x: e[i][0][1], y: e[i][1] }] }
    // });

    // console.log("advanced tree array", treeArray)

    //Bring unique value arrays together into required format for bubble chart
    var xyzArray = zipUnique.map(function (e, i) {
        return { name: e.toString(), data: [[popUnique[i], incUnique[i], 10]] }
    });

    console.log('bubble array', xyzArray);


    // Horizontal Bar Chart
    var baroptions = {
        series: [{
            data: typeValues
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: 'bottom'
                },
            }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#fff']
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: typeKeys,
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        title: {
            text: 'Number of Stations',
            align: 'center',
            floating: true
        },
        subtitle: {
            text: 'by Fuel Type',
            align: 'center',
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function () {
                        return ''
                    }
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#bar"), baroptions);
    chart.render();

    // // Tree Map Constructor
    // var treeoptions = {
    //     series: treeArray,
    //     legend: {
    //         show: false
    //     },
    //     chart: {
    //         height: 350,
    //         type: 'treemap'
    //     },
    //     title: {
    //         text: "Adrienne's Treemap"
    //     }
    // };

    // var chart2 = new ApexCharts(document.querySelector("#tree"), treeoptions);
    // chart2.render();

    //Construct Plot 3
    var bubbleoptions = {
        series: xyzArray,
        chart: {
            height: 350,
            type: 'bubble',
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 0.8
        },
        title: {
            text: 'Station Equity'
        },
        xaxis: {
            type: 'numeric',
            title: {
                text: 'POPULATION'
            }
            // categories: popUnique
        },
        yaxis: {
            type: 'numeric',
            title: {
                text: 'AVG INCOME'
            }
        }
    };

    var chart3 = new ApexCharts(document.querySelector("#bubble"), bubbleoptions);
    chart3.render();
}; // Close Buildplot Function


// // Horizontal Bar Chart
// var baroptions = {
//     series: [{
//         data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
//     }],
//     chart: {
//         type: 'bar',
//         height: 380
//     },
//     plotOptions: {
//         bar: {
//             barHeight: '100%',
//             distributed: true,
//             horizontal: true,
//             dataLabels: {
//                 position: 'bottom'
//             },
//         }
//     },
//     colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
//         '#f48024', '#69d2e7'
//     ],
//     dataLabels: {
//         enabled: true,
//         textAnchor: 'start',
//         style: {
//             colors: ['#fff']
//         },
//         formatter: function (val, opt) {
//             return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
//         },
//         offsetX: 0,
//         dropShadow: {
//             enabled: true
//         }
//     },
//     stroke: {
//         width: 1,
//         colors: ['#fff']
//     },
//     xaxis: {
//         categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
//             'United States', 'China', 'India'
//         ],
//     },
//     yaxis: {
//         labels: {
//             show: false
//         }
//     },
//     title: {
//         text: 'Custom DataLabels',
//         align: 'center',
//         floating: true
//     },
//     subtitle: {
//         text: 'Category Names as DataLabels inside bars',
//         align: 'center',
//     },
//     tooltip: {
//         theme: 'dark',
//         x: {
//             show: false
//         },
//         y: {
//             title: {
//                 formatter: function () {
//                     return ''
//                 }
//             }
//         }
//     }
// };

// var chart = new ApexCharts(document.querySelector("#bar"), baroptions);
// chart.render();


// var treeoptions = {
//     series: [
//         {
//             data: [
//                 {
//                     x: 'New Delhi',
//                     y: 218
//                 },
//                 {
//                     x: 'Kolkata',
//                     y: 149
//                 },
//                 {
//                     x: 'Mumbai',
//                     y: 184
//                 },
//                 {
//                     x: 'Ahmedabad',
//                     y: 55
//                 },
//                 {
//                     x: 'Bangaluru',
//                     y: 84
//                 },
//                 {
//                     x: 'Pune',
//                     y: 31
//                 },
//                 {
//                     x: 'Chennai',
//                     y: 70
//                 },
//                 {
//                     x: 'Jaipur',
//                     y: 30
//                 },
//                 {
//                     x: 'Surat',
//                     y: 44
//                 },
//                 {
//                     x: 'Hyderabad',
//                     y: 68
//                 },
//                 {
//                     x: 'Lucknow',
//                     y: 28
//                 },
//                 {
//                     x: 'Indore',
//                     y: 19
//                 },
//                 {
//                     x: 'Kanpur',
//                     y: 29
//                 }
//             ]
//         }
//     ],
//     legend: {
//         show: false
//     },
//     chart: {
//         height: 350,
//         type: 'treemap'
//     },
//     title: {
//         text: 'Basic Treemap'
//     }
// };

// var chart2 = new ApexCharts(document.querySelector("#tree"), treeoptions);
// chart2.render();

// var radaroptions = {
//     series: [{
//         name: 'Series 1',
//         data: [80, 50, 30, 40, 100, 20],
//     }, {
//         name: 'Series 2',
//         data: [20, 30, 40, 80, 20, 80],
//     }, {
//         name: 'Series 3',
//         data: [44, 76, 78, 13, 43, 10],
//     }],
//     chart: {
//         height: 350,
//         type: 'radar',
//         dropShadow: {
//             enabled: true,
//             blur: 1,
//             left: 1,
//             top: 1
//         }
//     },
//     title: {
//         text: 'Radar Chart - Multi Series'
//     },
//     stroke: {
//         width: 2
//     },
//     fill: {
//         opacity: 0.1
//     },
//     markers: {
//         size: 0
//     },
//     xaxis: {
//         categories: ['2011', '2012', '2013', '2014', '2015', '2016']
//     }
// };

// var chart3 = new ApexCharts(document.querySelector("#radar"), radaroptions);
// chart3.render();