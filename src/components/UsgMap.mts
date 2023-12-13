import {
	Map,
	map,
	tileLayer,
	geoJSON,
	Browser,
	Layer,
	FeatureGroup
} from 'leaflet';
import { css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import leafletCss from '../../node_modules/leaflet/dist/leaflet.css';
import { Provider } from './Provider.mjs';
import geodata from '../data/geodata.json';
import { reaction } from 'mobx';

@customElement('usg-map')
export class UsgMap extends Provider {
	private leafletMap: Map;
	private mapEl = document.createElement('div');

	static styles = [
		unsafeCSS(leafletCss.toString()),
		css`
			:host {
				display: block;
				height: 500px;
				width: auto;
			}
			.leaflet-container {
				height: 100%;
			}
			path.map-countries {
				outline: none;
			}
		`
	];

	static solidStyle = {
		color: '#fff',
		fillOpacity: 1,
		opacity: 0.5,
		weight: 2,
		className: 'map-countries'
	};

	static detailedBaseStyle = {
		color: '#fff',
		fillColor: 'gray',
		fillOpacity: 1,
		opacity: 0.5,
		weight: 1,
		className: 'map-countries'
	};

	static usaidRed = '#BA0C2F';
	static usaidLightBlue = '#A7C6ED';

	//style when selected
	static selectStyle = {
		color: UsgMap.usaidRed,
		// className: 'select-test',
		weight: 1.5
	};

	protected firstUpdated() {
		this.leafletMap = map(this.mapEl).setView([0, 0], 2);

		tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
			{
				attribution: '©OpenStreetMap, ©CartoDB',
				maxZoom: 17,
				minZoom: 1
			}
		).addTo(this.leafletMap);

		const geojson = geoJSON(geodata as any, {
			onEachFeature: (feature, layer) => {
				const { name: country } = feature.properties;

				layer.bindTooltip(
					`<strong>${country}</strong><br>Number of Reported Projects: ${
						this.state.projectsByCountry.get(country)?.length
					}`
				);

				// if (!Browser.ie && !Browser.opera && !Browser.edge) {
				// 	layer.bringToFront();
				// }
			},
			style: UsgMap.detailedBaseStyle,
			filter: feature =>
				this.state.allCountries.includes(feature.properties.name)
		}).addTo(this.leafletMap);

		let previouslySelected: FeatureGroup;
		geojson.on({
			mouseover(e) {
				e.propagatedFrom.setStyle({ fillOpacity: 0.5 });
			},
			mouseout(e) {
				geojson.setStyle({ fillOpacity: 1 });
			},
			click(e) {
				console.log('CLICK', e);
				previouslySelected?.setStyle(UsgMap.solidStyle);
				previouslySelected = e.propagatedFrom;

				e.propagatedFrom.setStyle(UsgMap.selectStyle);
			}
		});

		this.disposers.push(
			reaction(
				() => this.state.filteredCountries,
				filteredCountries => {
					geojson.eachLayer(layer => {
						geojson.resetStyle(layer);

						// @ts-ignore
						const country = layer.feature.properties.name;

						if (filteredCountries.has(country)) {
							// @ts-ignore
							layer.setStyle({ fillColor: UsgMap.usaidLightBlue });
						}
					});
				}
			)
		);
	}

	render() {
		return html`${this.mapEl}`;
	}
}
