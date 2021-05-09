//Read in JSON file and establish dropdown menu of options
var jsonPath = `/api/v1.0/Charging_Stations`;
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
    var jsonPath = `/api/v1.0/Charging_Stations`;

    d3.json(jsonPath).then(function (data) {

        inputData = data.filter(item => (item.City == 'Denver'))

        buildPlot(inputData); // need to pick values for initializing dashboard

        buildMap(data); // initialize map
    })
};

init();

var jsonPath = `/api/v1.0/Charging_Stations`;


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

    var zipMap = zip.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

    var uniqueZip = Array.from(zipMap.keys())

    console.log('uniquezips', uniqueZip);

    var newArray = plotData.map(d => d["Zip Code"])
    console.log("newArray", newArray);

    var uniques = [];
    for (i = 0; i < newArray.length; i++) {
        if (newArray[i] in uniques !== true) {
            uniques.push(newArray[i])
        }
    };
    console.log("uniques", uniques);
    console.log('')

    var typeList = ["CNG", "ELEC", "E85", "LPG", "BD"];

    var series = [];

    for (i = 0; i < uniqueZip.length; i++) {

        var filter1 = plotData.filter(d => d['Zip Code'] == uniqueZip[i])

        for (j = 0; j < typeList.length; j++) {
            var filter2 = filter1.filter(d => d['fuel_type_code'] == typeList[j])
            var treeDict = { name: uniqueZip[i].toString(), data: [{ x: typeList[j], y: filter2.length }] }
            series.push(treeDict)
        }
    };

    console.log('series', series);

    var cleanSeries = [];

    for (i = 0; i < series.length; i++) {
        if (series[i]['data'][0]['y'] > 0) {
            cleanSeries.push(series[i])
        }
    };

    console.log('cleanSeries', cleanSeries);


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
            height: 350,
            width: "100%"
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

    // Tree Map Constructor
    var treeoptions = {
        series: cleanSeries,
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap',
            width: "100%"
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            },
            // y: {
            //     title: {
            //         formatter: function () {
            //             names = []
            //             for (i = 0; i < cleanSeries.length; i++) {
            //                 names.push(`Zip ${cleanSeries[i]['name']}`)
            //             }
            //             return names
            //         }
            //     }
            // }
        },
        title: {
            text: "Multi-Dimensional Treemap"
        }
    };

    var chart2 = new ApexCharts(document.querySelector("#tree"), treeoptions);
    chart2.render();

    //Construct Plot 3
    var bubbleoptions = {
        series: xyzArray,
        chart: {
            height: 350,
            type: 'bubble',
            width: "100%"
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
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            },
            y: {
                show: false
            },
            z: {
                show: false
            }
        }
    };

    var chart3 = new ApexCharts(document.querySelector("#bubble"), bubbleoptions);
    chart3.render();
}; // Close Buildplot Function