import {
	Control,
	DomUtil,
	FeatureGroup,
	Map as LeafletMap,
	geoJSON,
	map,
	tileLayer
} from 'leaflet';
import { css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { reaction } from 'mobx';
import leafletCss from '../../node_modules/leaflet/dist/leaflet.css';
import { Provider } from './Provider.mjs';

@customElement('sel-map')
export class SelMap extends Provider {
	private leafletMap: LeafletMap;
	private mapEl = document.createElement('div');

	static usaidRed = '#ba0c2f';
	static usaidLightBlue = '#a7c6ed';

	static styles = [
		unsafeCSS(leafletCss.toString()),
		css`
			:host {
				display: block;
				height: 500px;
				width: auto;
				margin-bottom: 20px;
			}
			.leaflet-container {
				height: 100%;
			}
			path.map-countries {
				outline: none;
			}
			.legend2 i {
				width: 18px;
				height: 18px;
				float: left;
				margin: 0 8px 0 0;
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

	//style when selected
	static selectStyle = {
		color: SelMap.usaidRed,
		// className: 'select-test',
		weight: 1.5
	};

	protected async firstUpdated() {
		const geodata = await import('../data/geodata.json');

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
			},
			style: SelMap.detailedBaseStyle,
			filter: feature =>
				this.state.allCountries.includes(feature.properties.name)
		}).addTo(this.leafletMap);

		// disable tabbing through every single country
		this.shadowRoot.querySelectorAll('path.map-countries').forEach(el => {
			el.setAttribute('tabindex', '-1');
		});

		const featuresByCountry = new Map<string, any>(
			geojson
				.getLayers()
				// @ts-ignore
				.map(layer => [layer.feature.properties.name, layer])
		);

		let previouslySelected: FeatureGroup;
		geojson.on({
			mouseover(e) {
				e.propagatedFrom.setStyle({ fillOpacity: 0.5 });
			},
			mouseout(e) {
				geojson.setStyle({ fillOpacity: 1 });
			},
			click: e => {
				previouslySelected?.setStyle(SelMap.solidStyle);
				previouslySelected = e.propagatedFrom;

				e.propagatedFrom.setStyle(SelMap.selectStyle);
				e.propagatedFrom.bringToFront();

				this.state.setSelectedCountry(e.propagatedFrom.feature.properties.name);
			}
		});

		const legend = new Control({ position: 'bottomleft' });

		legend.onAdd = map => {
			const legendDiv = DomUtil.create('div', 'legend2');

			legendDiv.innerHTML += `<i style="background:${SelMap.usaidLightBlue}"></i><span>Highlighted country contains the metrics you selected below.</span><br>`;

			return legendDiv;
		};

		legend.addTo(this.leafletMap);

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
							layer.setStyle({ fillColor: SelMap.usaidLightBlue });
						}

						if (this.state.selectedCountry) {
							const feature = featuresByCountry.get(this.state.selectedCountry);
							this.outlineFeature(feature);
						}
					});
				}
			),
			reaction(
				() => this.state.selectedCountry,
				selectedCountry => {
					previouslySelected?.setStyle(SelMap.solidStyle);
					const feature = featuresByCountry.get(selectedCountry);
					previouslySelected = feature;
					this.outlineFeature(feature);
				}
			)
		);
	}

	private outlineFeature(feature) {
		if (!feature) return;
		feature.setStyle(SelMap.selectStyle);
		feature.bringToFront();
	}

	render() {
		return this.mapEl;
	}
}
