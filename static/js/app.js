//Read in JSON file and establish dropdown menu of options
var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;
d3.json(jsonPath).then(function (data) {
    console.log("data", data);

    var cities = [];
    var zip = [];
    var type = [];
    for (i = 0; i < data.length; i++) {
        cities.push(data[i]['City']);
        zip.push(data[i]['Zip Code']);
        type.push(data[i]['fuel_type_code'])
    };
    console.log(cities);
    console.log(zip);
    console.log(type);

    var cityUnique = cities.filter((item, i, ar) => ar.indexOf(item) === i);
    var zipUnique = zip.filter((item, i, ar) => ar.indexOf(item) === i);
    var typeUnique = type.filter((item, i, ar) => ar.indexOf(item) === i);

    console.log(cityUnique);
    console.log(zipUnique);
    console.log(typeUnique);

    var dropDownCity = d3.select('#selCity');
    var dropDownZip = d3.select('#selZip');
    var dropDownType = d3.select('#selType');

    console.log(dropDownCity);
    console.log(dropDownZip);
    console.log(dropDownType);

    dropDownCity.html("");
    dropDownZip.html("");
    dropDownType.html("");

    for (i = 0; i < cityUnique.length; i++) {

        dropDownCity.append('option').text(`${cityUnique[i]}`);

    };

    for (i = 0; i < zipUnique.length; i++) {

        dropDownZip.append('option').text(`${zipUnique[i]}`);

    };

    for (i = 0; i < typeUnique.length; i++) {

        dropDownType.append('option').text(`${typeUnique[i]}`);

    };

});

// // Initialize Dashboard with an ID
function init() {
    var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;

    d3.json(jsonPath).then(function (data) {

        buildPlot('Denver', '80202', 'ELEC'); // need to pick values for initializing dashboard
    })
};

init();

// Connect html dropdown menu to plot constructor function
function optionChanged() {

    var jsonPath = `http://localhost:5000/api/v1.0/Charging_Stations`;
    d3.json(jsonPath).then(function (data) {
        console.log(data);

        // Prevent the page from refreshing
        // d3.event.preventDefault();

        // Clear table body
        // d3.select('option').html('');

        // Select inputs and get values
        dropDownCity = d3.select('#selCity');
        var inputCity = dropDownCity.property('value');
        dropDownZip = d3.select('#selZip');
        var inputZip = dropDownZip.property('value');
        dropDownType = d3.select('#selType');
        var inputType = dropDownType.property('value');

        // Console log check
        console.log(inputCity);
        console.log(inputZip);
        console.log(inputType);

        var data = data;

        if (inputCity) {
            var cityData = data.filter(item => item.City == inputCity)
            console.log("data", Data);
        }

        buildPlot(cityData) //example from adrienne




        // //Construct input array
        // var inputArray = [{ key: 'city', value: inputCity },
        // { key: 'zip', value: inputZip },
        // { key: 'type', value: inputType }]

        // console.log(inputArray);

        // var filteredData = [];

        // for (var i = 0; i < data.length; i++) {
        //     var cityFilter = data[i]['City']
        //     var zipFilter = (data[i]['Zip Code']).toString()
        //     var typeFilter = data[i]['fuel_type_code']

        //     // console.log(cityFilter);
        //     // console.log(zipFilter);
        //     // console.log(typeFilter);


        //     if (cityFilter.includes(inputCity) && zipFilter.includes(inputZip) && typeFilter.includes(inputType)) {
        //         filteredData.push(data[i])
        //     };

        // };

        // Console log filtered data to ensure the filter worked
        // console.log(filteredData);

        // var city = [];
        // var zip = [];
        // var type = [];

        // // Push filtered results to html table
        // filteredData.forEach((station) => {

        //     city.push(station['City']);
        //     zip.push(station['Zip Code']);
        //     type.push(station['fuel_type_code'])

        // });

        // buildPlot(data);

    });
};

optionChanged();

// // Build the plots
function buildPlot(inputData) {




//     // Horizontal Bar Chart
//     var baroptions = {
//         series: [{
//             data: [typeCounts]
//         }],
//         chart: {
//             type: 'bar',
//             height: 380
//         },
//         plotOptions: {
//             bar: {
//                 barHeight: '100%',
//                 distributed: true,
//                 horizontal: true,
//                 dataLabels: {
//                     position: 'bottom'
//                 },
//             }
//         },
//         colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B'],
//         dataLabels: {
//             enabled: true,
//             textAnchor: 'start',
//             style: {
//                 colors: ['#fff']
//             },
//             formatter: function (val, opt) {
//                 return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
//             },
//             offsetX: 0,
//             dropShadow: {
//                 enabled: true
//             }
//         },
//         stroke: {
//             width: 1,
//             colors: ['#fff']
//         },
//         xaxis: {
//             categories: [type],
//         },
//         yaxis: {
//             labels: {
//                 show: false
//             }
//         },
//         title: {
//             text: 'Count of Alternative Station',
//             align: 'center',
//             floating: true
//         },
//         subtitle: {
//             text: 'subtitle text',
//             align: 'center',
//         },
//         tooltip: {
//             theme: 'dark',
//             x: {
//                 show: false
//             },
//             y: {
//                 title: {
//                     formatter: function () {
//                         return ''
//                     }
//                 }
//             }
//         }
//     };

//     var chart = new ApexCharts(document.querySelector("#bar"), baroptions);
//     chart.render();
// };

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