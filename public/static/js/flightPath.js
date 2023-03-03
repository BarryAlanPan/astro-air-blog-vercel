Promise.all(syncLoader()).then(initChart)
function syncLoader() {
    let PromiseList = []
    const srcList = ["https://cdn.amcharts.com/lib/5/index.js", "https://cdn.amcharts.com/lib/5/map.js", "https://cdn.amcharts.com/lib/5/geodata/worldLow.js","https://cdn.amcharts.com/lib/5/themes/Animated.js", "https://cdn.amcharts.com/lib/5/geodata/data/countries2.js"]
    srcList.forEach(url => {
        PromiseList.push(new Promise((resolve, reject) => {
            let script = document.createElement("script");
            script.src = url
            document.head.appendChild(script);
            script.onload = async function () {
                console.log(url + " loaded")
                resolve();
            }
        }))
    })

    return PromiseList
}

function initChart() {
    am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chart");
        var colors = am5.ColorSet.new(root, {});
        var continents = {
            "AF": 0,
            "AN": 1,
            "AS": 2,
            "EU": 3,
            "NA": 4,
            "OC": 5,
            "SA": 6
        }

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        root._logo.dispose();

        // Create the map chart
        // https://www.amcharts.com/docs/v5/charts/map-chart/
        var chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            // wheelX: "rotateX",
            // wheelY: "rotateY",
            // x: 0,
            // y: 0,
            projection: am5map.geoOrthographic(),
            // homeGeoPoint: { latitude: 0, longitude: 0 },
            maxPanOut: 0
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
        var worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            // visible: false
        }));

        worldSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
            fill: am5.color(0xaaaaaa),
            templateField: "polygonSettings"
        });

        worldSeries.mapPolygons.template.states.create("hover", {
            fill: root.interfaceColors.get("primaryButtonActive")
        });

        worldSeries.mapPolygons.template.events.on("click", (ev) => {
            var dataItem = ev.target.dataItem;
            var data = dataItem.dataContext;
            selectCountry(dataItem.get("id"))
            // console.log("https://cdn.amcharts.com/lib/5/geodata/json/" + data.map + ".json")
            // worldSeries.zoomToDataItem(dataItem)

            Promise.all([
                // zoomAnimation[0].waitForStop(),
                // zoomAnimation[1].waitForStop(),
                am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/" + data.map + ".json", chart)
            ]).then((results) => {
                var geodata = am5.JSONParser.parse(results[0].response);
                countrySeries.setAll({
                    geoJSON: geodata,
                    fill: data.polygonSettings.fill
                });

                countrySeries.show();
                stateSeries.hide()
                // worldSeries.hide(100);
                // homeButton.show();
            });
        });

// Create polygon series for the country map
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var countrySeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            visible: false
        }));

        countrySeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
            fill: am5.color(0xaaaaaa)
        });

        countrySeries.mapPolygons.template.states.create("hover", {
            fill: colors.getIndex(9)
        });

        countrySeries.mapPolygons.template.events.on("click", (ev) => {
            var dataItem = ev.target.dataItem;
            var data = dataItem.dataContext;
            var id = dataItem.get("id").toLowerCase().split("-");
            selectRegion(dataItem.get("id"))
            // console.log(id)
            if (id[0] ==='ca' || id[0] ==='us' || id[0] ==='mx') {
                var url = ''
                if (id[0] ==='ca') {
                    url = "https://cdn.amcharts.com/lib/5/geodata/json/region/canada/" + id[1] + "Low.json"
                } else if (id[0] ==='us') {
                    url = "https://cdn.amcharts.com/lib/5/geodata/json/region/usa/" + id[1] + "Low.json"
                } else {
                    url = "https://cdn.amcharts.com/lib/5/geodata/json/region/mexico/" + id[1] + "Low.json"
                }

                Promise.all([
                    am5.net.load(url, chart)
                ]).then(function(results) {
                    var geodata = am5.JSONParser.parse(results[0].response);
                    stateSeries.setAll({
                        geoJSON: geodata
                    });
                    stateSeries.set("name", "{CDNAME}");
                    stateSeries.show();
                    // usaSeries.hide(100);
                    // homeButton.show();
                    // title.set("text", name);
                });
            }
        })

        // Create polygon series for the country map
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var stateSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            visible: false
        }));

        stateSeries.mapPolygons.template.setAll({
            tooltipText: "{name}{COUNTY}{CDNAME}",
            interactive: true,
            fill: am5.color(0xaaaaaa)
        });

        // stateSeries.mapPolygons.template.adapters.add("tooltipText", function (value, target, key) {
        //     console.log(target.dataItem.get("name"))
        //     if (target.dataItem.dataContext.get("name")) {
        //         return value
        //     } else if (target.dataItem.get("CDNAME")) {
        //         return target.dataItem.get("CDNAME")
        //     } else {
        //         return target.dataItem.get("COUNTY")
        //     }
        // })

        stateSeries.mapPolygons.template.states.create("hover", {
            fill: colors.getIndex(9)
        });

        // usaSeries.mapPolygons.template.events.on("click", (ev) => {
        //     var dataItem = ev.target.dataItem;
        //     var id = dataItem.get("id").toLowerCase().split("-").pop();
        //     var name = dataItem.dataContext.name;
        //     var zoomAnimation = usaSeries.zoomToDataItem(dataItem);
        //
        //     Promise.all([
        //         zoomAnimation.waitForStop(),
        //         am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/region/usa/congressional2022/" + id + "Low.json", chart)
        //     ]).then(function(results) {
        //         var geodata = am5.JSONParser.parse(results[1].response);
        //         stateSeries.setAll({
        //             geoJSON: geodata
        //         });
        //
        //         stateSeries.show();
        //         usaSeries.hide(100);
        //         backContainer.show();
        //         title.set("text", name);
        //     });
        // });



// Set up data for countries
        var data = [];
        for(var id in am5geodata_data_countries2) {
            if (am5geodata_data_countries2.hasOwnProperty(id)) {
                var country = am5geodata_data_countries2[id];
                if (country.maps.length) {
                    data.push({
                        id: id,
                        map: country.maps[0],
                        // map: country.maps[country.maps.length-1],
                        polygonSettings: {
                            fill: colors.getIndex(continents[country.continent_code]),
                        }
                    });
                }
            }
        }
        worldSeries.data.setAll(data);



        // var homeButton = chart.children.push(am5.Button.new(root, {
        //     paddingTop: 10,
        //     paddingBottom: 10,
        //     x: am5.percent(100),
        //     centerX: am5.percent(100),
        //     opacity: 0,
        //     interactiveChildren: false,
        //     icon: am5.Graphics.new(root, {
        //         svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
        //         fill: am5.color(0xffffff)
        //     })
        // }));
        //
        // homeButton.events.on("click", function() {
        //     chart.goHome();
        //     rotateToArea(121.4667, 31.1667)
        //     // chart.set("x", 0)
        //     // chart.set("y", 0)
        //     // chart.zoomOut()
        //     worldSeries.show();
        //     countrySeries.hide();
        //     stateSeries.hide();
        //     homeButton.hide();
        // });

        chart.chartContainer.get("background").events.on("click", function () {
            chart.goHome();
            rotateToArea(121.4667, 31.1667)
            // chart.set("x", 0)
            // chart.set("y", 0)
            // chart.zoomOut()
            worldSeries.show();
            countrySeries.hide();
            stateSeries.hide();
        })



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
        }

        function selectCountry(id) {
            var dataItem = worldSeries.getDataItemById(id);
            var target = dataItem.get("mapPolygon");
            if (target) {
                var centroid = target.geoCentroid();
                if (centroid) {
                    return [
                        chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) }),
                        chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) })
                    ]
                }
            }
        }

        function selectRegion(id) {
            var dataItem = countrySeries.getDataItemById(id);
            var target = dataItem.get("mapPolygon");
            if (target) {
                var centroid = target.geoCentroid();
                if (centroid) {
                    return [
                        chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) }),
                        chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) })
                    ]
                }
            }
        }

        function selectContinent(id) {
            var dataItem = continentSeries.getDataItemById(id);
            var target = dataItem.get("mapPolygon");
            if (target) {
                var centroid = target.geoCentroid();
                if (centroid) {
                    chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                    chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                }
            }
        }

        // let Logo = document.querySelectorAll("[aria-labelledby$=-title]");
        // Logo.forEach((ele)=>{
        //     ele.style.visibility="hidden";
        // })


        // Make stuff animate on load
        chart.appear(1000, 100);

        rotateToArea(121.4667, 31.1667)

        // chart.goHome();

    }); // end am5.ready()


}


