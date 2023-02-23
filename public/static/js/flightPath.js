srcList = ["https://cdn.amcharts.com/lib/4/core.js", "https://cdn.amcharts.com/lib/4/maps.js", "https://cdn.amcharts.com/lib/4/themes/animated.js"]


srcList.forEach((src, index) => {
    var scriptMap = document.createElement("script");
    scriptMap.src = src
    if (index ===srcList.length-1) scriptMap.onload = initChart()
    document.head.appendChild(scriptMap);

})

// scriptMap.src = "https://api.map.baidu.com/api?v=3.0&ak=";
// document.head.appendChild(scriptMap);
//
// var scriptMap = document.createElement("script");
// scriptMap.src = "https://api.map.baidu.com/api?v=3.0&ak=";
// document.head.appendChild(scriptMap);
//
// var scriptECharts = document.createElement("script");
// scriptECharts.src = "/static/js/echarts.min.js";
// document.head.appendChild(scriptECharts);

// scriptECharts.onload = function () {
//     console.log("echarts.min.js loaded")
//     initChart()
// }
// initChart()

function initChart() {
    //初始化am4core
    am4core.ready(function() {
        // your code here
        //创建地图对象
        var map = am4core.create("chartdiv", am4maps.MapChart);

// 设置地图的投影和背景颜色
        map.projection = new am4maps.projections.Miller();
        map.background.fill = am4core.color("#ffffff");

//设置缩放和拖动功能
        map.zoomControl = new am4maps.ZoomControl();
        map.seriesContainer.draggable = false;
        map.seriesContainer.resizable = false;

        //创建一个LineSeries对象
        var series = map.series.push(new am4maps.MapLineSeries());

//设置线条颜色和宽度
        series.stroke = am4core.color("#000000");
        series.strokeWidth = 2;

// 添加一个Polyline对象并设置其坐标
        var line = series.mapLines.create();
        line.multiGeoLine = [[{latitude: 40.7128, longitude: -74.0060}, {latitude: 51.5074, longitude: -0.1278}]];

        //创建图例
        var legend = new am4maps.Legend();
        map.chartContainer.addChild(legend);
    });



}


