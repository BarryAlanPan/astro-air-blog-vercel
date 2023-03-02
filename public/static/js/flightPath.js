

// srcList = ["https://cdn.amcharts.com/lib/5/index.js", "https://cdn.amcharts.com/lib/5/map.js", "https://cdn.amcharts.com/lib/5/geodata/worldLow.js","https://cdn.amcharts.com/lib/5/themes/Animated.js"]


// srcList.forEach((src, index) => {
//     var scriptMap = document.createElement("script");
//     scriptMap.src = src
//     if (index ===srcList.length-1) scriptMap.onload = initChart()
//     document.head.appendChild(scriptMap);
//
// })
loadCore()
function loadCore() {
    let script = document.createElement("script");
    script.src = "https://cdn.amcharts.com/lib/5/index.js"
    document.head.appendChild(script);
    script.onload = async function () {
        console.log("core loaded")
        loadMap()
    }
}

function loadMap() {
    let script = document.createElement("script");
    script.src = "https://cdn.amcharts.com/lib/5/map.js"
    document.head.appendChild(script);
    script.onload = function () {
        console.log("map loaded")
        loadWorld()
    }
}

function loadWorld() {
    let script = document.createElement("script");
    script.src = "https://cdn.amcharts.com/lib/5/geodata/worldLow.js"
    document.head.appendChild(script);
    script.onload = async function () {
        console.log("world loaded")
        loadAnimate()
    }
}

function loadAnimate() {
    let script = document.createElement("script");
    script.src = "https://cdn.amcharts.com/lib/5/themes/Animated.js"
    document.head.appendChild(script);
    script.onload = async function () {
        console.log("animate loaded")
        initChart()
    }
}

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
    // import * as am5 from "@amcharts/amcharts5";
    // import * as am5map from "@amcharts/amcharts5/map.js";

    am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chart");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create the map chart
        // https://www.amcharts.com/docs/v5/charts/map-chart/
        var chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            projection: am5map.geoOrthographic(),
            homeGeoPoint: { latitude: 31.1667, longitude: 121.4667 },
            // rotationX: -140,
            // rotationY: -20
        }));

        // var cont = chart.children.push(am5.Container.new(root, {
        //     layout: root.horizontalLayout,
        //     x: 20,
        //     y: 40
        // }));
        //
        // // Add labels and controls
        // cont.children.push(am5.Label.new(root, {
        //     centerY: am5.p50,
        //     text: "Map"
        // }));
        //
        // var switchButton = cont.children.push(am5.Button.new(root, {
        //     themeTags: ["switch"],
        //     centerY: am5.p50,
        //     icon: am5.Circle.new(root, {
        //         themeTags: ["icon"]
        //     })
        // }));
        //
        // switchButton.on("active", function () {
        //     if (switchButton.get("active")) {
        //         chart.set("projection", am5map.geoMercator());
        //         chart.set("panY", "translateY");
        //         chart.set("rotationY", 0);
        //         backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
        //     } else {
        //         chart.set("projection", am5map.geoOrthographic());
        //         chart.set("panY", "rotateY")
        //
        //         backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
        //     }
        // });
        //
        // cont.children.push(
        //     am5.Label.new(root, {
        //         centerY: am5.p50,
        //         text: "Globe"
        //     })
        // );

        // Create series for background fill
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0
        });

        // Add background polygon
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        // Create main polygon series for countries
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow
        }));

        // Create line series for trajectory lines
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
        var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
            stroke: root.interfaceColors.get("alternativeBackground"),
            strokeOpacity: 0.3
        });

        // Create point series for markers
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
        var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        pointSeries.bullets.push(function () {
            var circle = am5.Circle.new(root, {
                radius: 7,
                tooltipText: "{name}",
                cursorOverStyle: "pointer",
                tooltipY: 0,
                fill: am5.color(0xffba00),
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
                // draggable: true
            });

            circle.events.on("click", function (event) {
                let dataItem = event.target.dataItem.name;
                // console.log(event.target.dataItem.get('latitude'))
                rotateToArea(event.target.dataItem.get('longitude'), event.target.dataItem.get('latitude'))
                // window.location.href="https://astro-air-blog-vercel.pages.dev/posts/" + dataItem + "/"
            })

            // circle.events.on("dragged", function (event) {
            //     var dataItem = event.target.dataItem;
            //     var projection = chart.get("projection");
            //     var geoPoint = chart.invert({ x: circle.x(), y: circle.y() });
            //
            //     dataItem.setAll({
            //         longitude: geoPoint.longitude,
            //         latitude: geoPoint.latitude
            //     });
            // });

            return am5.Bullet.new(root, {
                sprite: circle
            });
        });

        // var paris = addCity({ latitude: 48.8567, longitude: 2.351 }, "Paris");
        // var toronto = addCity({ latitude: 43.8163, longitude: -79.4287 }, "Toronto");
        // var la = addCity({ latitude: 34.3, longitude: -118.15 }, "Los Angeles");
        // var havana = addCity({ latitude: 23, longitude: -82 }, "Havana");

        var Shanghai = addCity({ latitude: 31.1667, longitude: 121.4667 }, "Shanghai")
        var Nagoya = addCity({ latitude: 35.1167, longitude: 136.9333 }, "Japan")
        var Honolulu = addCity({ latitude: 21.2975, longitude: -157.7211 }, "Hawaii")
        var Singapore = addCity({ latitude: 1.3, longitude: 103.8 }, "Singapore")
        var Cambodia = addCity({ latitude: 13.3622, longitude: 103.8597 }, "Cambodia")
        var Hongkong = addCity({ latitude: 22.3069, longitude: 114.1831 }, "Hongkong")
        var Malaysia = addCity({ latitude: 3.1478, longitude: 101.6953 }, "Malaysia")

        var lineDataItem = lineSeries.pushDataItem({
            // pointsToConnect: [paris, toronto, la, havana]
            pointsToConnect: [Cambodia, Malaysia, Singapore, Hongkong, Shanghai, Nagoya, Honolulu]
        });

        var planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        var plane = am5.Graphics.new(root, {
            svgPath:
                "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
            scale: 0.06,
            centerY: am5.p50,
            centerX: am5.p50,
            fill: am5.color(0x000000)
        });

        planeSeries.bullets.push(function () {
            var container = am5.Container.new(root, {});
            container.children.push(plane);
            return am5.Bullet.new(root, { sprite: container });
        });

        var planeDataItem = planeSeries.pushDataItem({
            lineDataItem: lineDataItem,
            positionOnLine: 0,
            autoRotate: true
        });

        planeDataItem.animate({
            key: "positionOnLine",
            to: 1,
            duration: 10000,
            loops: Infinity,
            easing: am5.ease.yoyo(am5.ease.linear)
        });

        planeDataItem.on("positionOnLine", function (value) {
            if (value >= 0.99) {
                plane.set("rotation", 180);
            } else if (value <= 0.01) {
                plane.set("rotation", 0);
            }
        });

        function addCity(coords, title) {
            return pointSeries.pushDataItem({
                latitude: coords.latitude,
                longitude: coords.longitude,
                name: title
            });
        }

        function rotateToArea(longitude, latitude) {
            // var centroid = target.geoCentroid();
            // console.log(target.dataItem.longitude)
            chart.animate({
                key: "rotationX",
                to: -longitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic)
            });
            chart.animate({
                key: "rotationY",
                to: -latitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic)
            });

            // var dataItem = polygonSeries.getDataItemById(id);
            // var target = area.dataItem.get("mapPolygon");
            // if (target) {
            //     var centroid = target.geoCentroid();
            //     if (centroid) {
            //         chart.animate({
            //             key: "rotationX",
            //             to: -centroid.longitude,
            //             duration: 1500,
            //             easing: am5.ease.inOut(am5.ease.cubic)
            //         });
            //         chart.animate({
            //             key: "rotationY",
            //             to: -centroid.latitude,
            //             duration: 1500,
            //             easing: am5.ease.inOut(am5.ease.cubic)
            //         });
            //     }
            // }
        }

        // Make stuff animate on load
        chart.appear(1000, 100);

        rotateToArea(121.4667, 31.1667)

        // chart.goHome();

    }); // end am5.ready()



}


