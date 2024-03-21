// Error handling function
function handleError(error) {
	console.error('An error occurred:', error);
	// You can add additional error handling logic here, such as displaying an error message to the user
}

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuMTJoYWlkZXIxMyIsImEiOiJja3U2cWgzeGswMTBsMnduenUxNTU3ODYwIn0.40OiXNhJP2nudlQTl_VL9w';

// Initialize map
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/salman12haider13/clt63s49g001701pghsz4e4vn',
	center: [0, 0],
	zoom: 2,
	minZoom: 1
});

// Add navigation control
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
map.setRenderWorldCopies(true);

let customTicks;

// Load SVG patterns for precipitation layers
const svgPromises = [
	fetch('https://raw.githubusercontent.com/salman12haider13/SVGs/main/Dark%20Grey%20Diagonal%20lines.svg').then(response => response.text()).catch(handleError),
	fetch('https://raw.githubusercontent.com/salman12haider13/SVGs/main/Light%20Grey%20Diagonal%20lines.svg').then(response => response.text()).catch(handleError)
];

map.on('load', () => {
	customTicks = new ej.inputs.Slider({
		min: 0,
		max: 11,
		value: 0,
		step: 1,
		type: 'MinRange',
		ticks: { placement: 'Before', largeStep: 1, smallStep: 1 },
		change: (args) => {
			const selectedMonth = getValue(args.value);
			if ($("#temperature-btn").hasClass("active")) {
				updateTempMapLayer(selectedMonth);
			}
			if ($("#dry-wet-btn").hasClass("active")) {
				updatePrecipMapLayer(selectedMonth);
			}
		},
		renderedTicks: (args) => {
			const li = args.tickElements;
			for (let i = 0; i < li.length; ++i) {
				li[i].querySelectorAll('.e-tick-value')[0].innerText = getValue(i);
			}
		}
	});

	customTicks.appendTo('#slider');

	map.addSource('World_counties', {
		type: 'vector',
		url: 'mapbox://salman12haider13.9w9vpocz'
	});

	map.addLayer({
		'id': 'Countires',
		'type': 'fill',
		'source': 'World_counties',
		'source-layer': 'Countries-6rijjv',
		'layout': {},
		'paint': {
			'fill-opacity': 0
		}
	});

	Promise.all(svgPromises)
		.then(([svg1, svg2]) => {
			const img1 = new Image();
			img1.onload = () => {
				map.addImage('pattern-fill1', img1);
			};
			img1.src = 'data:image/svg+xml;base64,' + btoa(svg1);

			const img2 = new Image();
			img2.onload = () => {
				map.addImage('pattern-fill2', img2);
			};
			img2.src = 'data:image/svg+xml;base64,' + btoa(svg2);
		})
		.catch(handleError);
});

// Temperature layers
const temp_monthLayers = {
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

$("#temperature-btn").click(function() {
	$(this).toggleClass("active");
	if ($(this).hasClass("active")) {
		const selectedMonth = getValue(customTicks.value);
		updateTempMapLayer(selectedMonth);
		if (map.getLayer('precip-layer')) {
			updatePrecipMapLayer(getValue(customTicks.value));
		}
	} else {
		if (map.getSource('temp_tileset')) {
			map.removeLayer('temp-layer');
			map.removeSource('temp_tileset');
		}
	}
});

function updateTempMapLayer(selectedMonth) {
	const layers = map.getStyle().layers;
	let firstSymbolId;
	for (const layer of layers) {
		if (layer.type === 'symbol') {
			firstSymbolId = layer.id;
			break;
		}
	}

	if (map.getSource('temp_tileset')) {
		map.removeLayer('temp-layer');
		map.removeSource('temp_tileset');
	}

	map.addSource('temp_tileset', {
		type: 'raster',
		url: 'mapbox://' + temp_monthLayers[selectedMonth].tilesetId
	});

	if (!map.getLayer('temp-layer')) {
		map.addLayer({
			'id': 'temp-layer',
			'type': 'raster',
			'source': 'temp_tileset',
			'source-layer': temp_monthLayers[selectedMonth].layerName,
			"paint": {
				"raster-opacity": 0.9
			}
		}, "world-boundaries", firstSymbolId);
	}
}

// Precipitation layers
const precip_monthLayers = {
	"Jan": { tilesetId: "salman12haider13.9n7xg34l", layerName: "Jan" },
	"Feb": { tilesetId: "salman12haider13.1z9h8zii", layerName: "Feb" },
	"Mar": { tilesetId: "salman12haider13.63zxyedg", layerName: "Mar" },
	"Apr": { tilesetId: "salman12haider13.941tb365", layerName: "Apr" },
	"May": { tilesetId: "salman12haider13.b1qri68q", layerName: "May" },
	"Jun": { tilesetId: "salman12haider13.1zomdncf", layerName: "Jun" },
	"Jul": { tilesetId: "salman12haider13.7hmyx9s4", layerName: "Jul" },
	"Aug": { tilesetId: "salman12haider13.1tluzf72", layerName: "Aug" },
	"Sep": { tilesetId: "salman12haider13.3lug42c9", layerName: "Sep" },
	"Oct": { tilesetId: "salman12haider13.6n33vl1j", layerName: "Oct" },
	"Nov": { tilesetId: "salman12haider13.c7cqlzf5", layerName: "Nov" },
	"Dec": { tilesetId: "salman12haider13.c16kfobb", layerName: "Dec" }
};

$("#dry-wet-btn").click(function() {
	$(this).toggleClass("active");
	if ($(this).hasClass("active")) {
		const selectedMonth = getValue(customTicks.value);
		updatePrecipMapLayer(selectedMonth);
	} else {
		if (map.getSource('precip_tileset')) {
			map.removeLayer('precip-layer');
			map.removeLayer('precip-layer-boundary');
			map.removeSource('precip_tileset');
		}
	}
});

function updatePrecipMapLayer(selectedMonth) {
	function getFillPattern(catValue) {
		return catValue === 1 ? 'pattern-fill1' : 'pattern-fill2';
	}

	const layers = map.getStyle().layers;
	let firstSymbolId;
	for (const layer of layers) {
		if (layer.type === 'symbol') {
			firstSymbolId = layer.id;
			break;
		}
	}

	if (map.getSource('precip_tileset')) {
		map.removeLayer('precip-layer');
		map.removeLayer('precip-layer-boundary');
		map.removeSource('precip_tileset');
	}

	map.addSource('precip_tileset', {
		type: 'vector',
		url: 'mapbox://' + precip_monthLayers[selectedMonth].tilesetId
	});

	map.addLayer({
		'id': 'precip-layer',
		'type': 'fill',
		'source': 'precip_tileset',
		'source-layer': precip_monthLayers[selectedMonth].layerName,
		'layout': {},
		'paint': {
			'fill-pattern': [
				"match",
				["get", "Cat"],
				[1],
				"pattern-fill1",
				[2],
				"pattern-fill2",
				""
			],
			"fill-opacity": 0.7
		}
	}, "world-boundaries", firstSymbolId);

	map.addLayer({
		'id': 'precip-layer-boundary',
		'type': 'line',
		'source': 'precip_tileset',
		'source-layer': precip_monthLayers[selectedMonth].layerName,
		'layout': {},
		'paint': {
			'line-color': '#dedee0',
			'line-width': 2,
			'line-opacity': 0.2
		}
	});
}

map.on('click', 'Countires', (e) => {
	const features = map.queryRenderedFeatures(e.point, { layers: ['Countires'] });

	if (!features.length) {
		return;
	}

	const countryName = features[0].properties.name;
	const countryCode = features[0].properties.Abbrivatio; // Replace with the actual country code
	const currency = features[0].properties.Currency; // Replace with the actual currency
	const vaccines = features[0].properties.Vaccine; // Replace with the actual value
	const vaccines_url = features[0].properties.Link; // Replace with the actual value
	const visaOnEntry = ''; // Replace with the actual value
	const capitalCity = ''; // Replace with the actual capital city
	const totalTourism = features[0].properties.Tour_2016; // Replace with the actual total tourism value

	const popupContent = `
		<h2>${countryName} (${countryCode})</h2>
		<table>
			<tr>
				<th>Currency</th>
				<td>${currency}</td>
			</tr>
			<tr>
				<th>Recommended Vaccines</th>
				<td>${vaccines} <a href="${vaccines_url}" target="_blank"><span class="icon">&#128279;</span></a></td>
			</tr>
			<tr>
				<th>Visa on Entry</th>
				<td>${visaOnEntry} <span class="icon">&#128279;</span></td>
			</tr>
			<tr>
				<th>Capital City</th>
				<td>${capitalCity}</td>
			</tr>
			<tr>
				<th>Total Tourism (2016)</th>
				<td>${totalTourism}</td>
			</tr>
		</table>
	`;

	const popup = new mapboxgl.Popup()
		.setLngLat(e.lngLat)
		.setHTML(popupContent)
		.addTo(map);
});

function getValue(i = 0) {
	const mindate = new Date("1/1/2020");
	const todayTime = new Date(mindate.setMonth(mindate.getMonth() + i));
	const month = todayTime.getMonth();
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const year = todayTime.getFullYear();
	return months[month];
}