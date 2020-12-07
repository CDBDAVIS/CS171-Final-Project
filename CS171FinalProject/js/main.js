/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */
//const fs = require('fs');

// init global variables & switches
let RadiusChart;
let ScatterPlot;
let parallelChart;
let stackedBar;
let areaChart;

let filteredData= [];

$(window).on('load',function(){
    $('#start').modal('show');
});



// load data using promises
let promises = [
    d3.json("data/dataFinal.JSON"),
    d3.json("data/dateStrings.json")
];

Promise.all(promises)
    .then( function(data){initMainPage(data)})
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    let data = dataArray[0];
    let data2 = dataArray[1];

    areaChart = new AreaVis('vis-1', data2)
    ScatterPlot = new Scatter('vis-2', data)
    stackedBar = new Bar('vis-3', data)
    RadiusChart = new Radius('vis-4', data)
    parallelChart = new ParallelChart('vis-5', data)
}

let selectedScatterCategory = $('#categorySelectorScatter').val();

// call wrangleData of each class when menu is changed
function categoryChangeScatter() {
    selectedScatterCategory = $('#categorySelectorScatter').val();
    ScatterPlot.wrangleData();
    parallelChart.wrangleData();
    stackedBar.wrangleData();
    RadiusChart.wrangleData();
}

let selectedCuisine = $('#categorySelectorCuisine').val();

// call wrangleData of each class when menu is changed
function categoryChangeCuisine() {
    selectedCuisine = $('#categorySelectorCuisine').val();
    ScatterPlot.wrangleData();
    parallelChart.wrangleData();
    stackedBar.wrangleData();
    RadiusChart.wrangleData();
}

let tooltipSlider = document.getElementById('range');
noUiSlider.create(tooltipSlider, {
    start: [1, 4],
    connect: true,
    step: 1,
    range: {
        'min': [0],
        'max': [4]
    },
    // Show a scale with the slider
    pips: {
        mode: 'steps',
        stepped: true,
        density: 4
    }

});

let priceRange = [1,4];
tooltipSlider.noUiSlider.on('update', function (values, handle) {
    priceRange = tooltipSlider.noUiSlider.get();
    if (parallelChart != undefined) {
        parallelChart.wrangleData();
    }
});

let connect = tooltipSlider.querySelectorAll('.noUi-connect');
let classes = ['c-1-color'];

for (let i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}