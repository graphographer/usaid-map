import { html } from 'lit';
import { TDataEntry } from '../../models/types';

export const programInfo = (
	project: TDataEntry,
	challengeAreas: Record<string, string[][]>
) => html`
	<summary role="button">${project['Project/Program/Initiative Name']}</summary>
	<ul class="overview">
		<li>
			<b>Background</b>
			<ul>
				<li>
					<b>Project Description:</b> ${project[
						'Project/Program/Initiative Description'
					]}
				</li>
				<li><b>Organization:</b> ${project.Organization}</li>
				<li>
					<b>Education Level:</b> ${project['Level of Education'].join(', ')}
				</li>
				<li><b>Setting:</b> ${project.Setting.join(', ')}</li>
			</ul>
		</li>

		<li>
			<b>SEL/SS Skills Measure Information</b>
			<ul>
				<li>
					<b>Common Skills measured:</b> ${project['Common Skills']?.join(', ')}
				</li>
				<li>
					<b>Skills measured (as reported by contributor):</b>
					${project.Skills?.join(', ')}
				</li>
				<li><b>Tool Used or Adapted:</b> ${project['Tool Used or Adapted']}</li>
				<li>
					<b>Purpose of SEL/SS Measurement Tool:</b> ${project[
						'Purpose of SEL/SS Measurement Tool'
					]}
				</li>
				<li><b>Assessment type:</b></li>
			</ul>
		</li>

		<li>
			<b>
				Action steps project is taking to address SEL/SS measurement challenges
			</b>
			<table class="challenges">
				<thead>
					<tr>
						<th scope="col">Broad Challenge Area</th>
						<th scope="col">Precise Challenge Area</th>
					</tr>
				</thead>
				<tbody>
					${Object.entries(challengeAreas).map(([broad, precises]) => {
						return html`
							<tr>
								<th scope="row">${broad}</th>
								<td>
									${precises.map(([area, comment]) => {
										return html`<p><b>${area}:</b> ${comment}</p>`;
									})}
								</td>
							</tr>
						`;
					})}
				</tbody>
			</table>
		</li>
	</ul>
`;
