import { html } from 'lit';
import { chunk } from 'lodash';

export const horizontalChecklist = (
	list: Array<[string, boolean]>,
	maxWidth: number = 5
) => {
	return html`
		${chunk<[string, boolean]>(list, maxWidth).map(
			(list: [string, boolean][]) => {
				return html`
					<table class="checklist">
						<thead>
							<tr>
								${list.map(([heading]) => {
									return html` <th scope="col">${heading}</th> `;
								})}
							</tr>
						</thead>
						<tbody>
							<tr>
								${list.map(([, checked]) => {
									return html`<td>
										${checked
											? html`<span class="checkmark">&check;</span>`
											: ''}
									</td>`;
								})}
							</tr>
						</tbody>
					</table>
				`;
			}
		)}
	`;
};
