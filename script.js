mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuMTJoYWlkZXIxMyIsImEiOiJja3U2cWgzeGswMTBsMnduenUxNTU3ODYwIn0.40OiXNhJP2nudlQTl_VL9w'; // Replace with your Mapbox access token
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/salman12haider13/clt63s49g001701pghsz4e4vn', // Replace with your style URL
            center: [0, 0], // starting position
            zoom: 2, // starting zoom
			minZoom: 1
        });
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
        map.setRenderWorldCopies(false);
		const projection = map.getProjection();
		console.log(projection);

        var monthLayers = {
            "Jan": { tilesetId: "salman12haider13.4d6xnod4", layerName: "January_temp-au60mp" },
            "Feb": { tilesetId: "salman12haider13.9xcnmdr6", layerName: "February_temp-aqen2k" },
			"Mar": { tilesetId: "salman12haider13.74er0ezi", layerName: "March_temp-1kuhe4" },
			"Apr": { tilesetId: "salman12haider13.9xvhn3oh", layerName: "April_temp-6kz58f" },
			"May": { tilesetId: "salman12haider13.43l7qhc9", layerName: "May_temp-09izf2" },
			"Jun": { tilesetId: "salman12haider13.1klm8udh", layerName: "June_temp-0fh6jr" },
			"Jul": { tilesetId: "salman12haider13.4t0ixhwu", layerName: "July_temp-2hwc0r" },
			"Aug": { tilesetId: "salman12haider13.cjypkat5", layerName: "Aug_temp-09c7ya" },
			"Sep": { tilesetId: "salman12haider13.14uujyr4", layerName: "Sep_temp-cfsjru" },
			"Oct": { tilesetId: "salman12haider13.361nkkl2", layerName: "Oct_temp-1q6s16" },
			"Nov": { tilesetId: "salman12haider13.12p44zd6", layerName: "Nov_temp-8fzwoc" },
			"Dec": { tilesetId: "salman12haider13.bjutmc2l", layerName: "Dec_temp-drds4j" }
        };

        var customTicks;

        map.on('load', function() {
            customTicks = new ej.inputs.Slider({
                min: 0,
                max: 11,
                value: 0,
                step: 1,
                type: 'MinRange',
                ticks: { placement: 'Before', largeStep: 1, smallStep: 1 },
                change: (args) => {
                    let selectedMonth = getValue(args.value);
                    if ($("#temperature-btn").hasClass("active")) {
                        updateMapLayer(selectedMonth);
                    }
                },
                renderedTicks: (args) => {
                    let li = args.tickElements;
                    for (let i = 0; i < li.length; ++i) {
                        (li[i].querySelectorAll('.e-tick-value')[0]).innerText = getValue(i);
                    }
                }
            });

            customTicks.appendTo('#slider');

            
        });

        $("#temperature-btn").click(function() {
            $(this).toggleClass("active");
            if ($(this).hasClass("active")) {
                let selectedMonth = getValue(customTicks.value);
                updateMapLayer(selectedMonth);
            } else {
                if (map.getSource('tileset')) {
                    map.removeLayer('my-layer');
                    map.removeSource('tileset');
                }
            }
        });

        function updateMapLayer(selectedMonth) {
            const layers = map.getStyle().layers;
            let firstSymbolId;
            for (const layer of layers) {
                if (layer.type === 'symbol') {
                    firstSymbolId = layer.id;
                    break;
                }
            }

            if (map.getSource('tileset')) {
                map.removeLayer('my-layer');
                map.removeSource('tileset');
            }

            map.addSource('tileset', {
                type: 'raster',
                url: 'mapbox://' + monthLayers[selectedMonth].tilesetId
            });

            map.addLayer({
                'id': 'my-layer',
                'type': 'raster',
                'source': 'tileset',
                'source-layer': monthLayers[selectedMonth].layerName,
                "paint": {
                    "raster-opacity": 0.9
                }
            }, "world-boundaries", firstSymbolId);
        }

        function getValue(i = 0) {
            let mindate = new Date("1/1/2020");
            let todayTime = new Date(mindate.setMonth(mindate.getMonth() + i));
            let month = todayTime.getMonth();
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let year = todayTime.getFullYear();
            return months[month];
        }