import { Map, map, tileLayer, geoJSON } from 'leaflet';
import { css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import leafletCss from '../../node_modules/leaflet/dist/leaflet.css';
import { Provider } from './Provider.mjs';
import geodata from '../data/geodata.json';

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
		`
	];

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

		geoJSON(geodata as any, {
			onEachFeature: this.onEachFeature.bind(this)
		}).addTo(this.leafletMap);
	}

	render() {
		return html`${this.mapEl}`;
	}

	private resetHighlight(e) {
		let layer = e.target;
		layer.setStyle({ fillOpacity: 1 });
	}

	private highlightFeature(e) {
		console.log(e);
		let layer = e.target;

		layer.setStyle({ fillOpacity: 0.5 });
	}

	private onEachFeature(feature, layer) {
		layer.on({
			mouseover: this.highlightFeature.bind(this),
			mouseout: this.resetHighlight.bind(this)
		});
	}
}
