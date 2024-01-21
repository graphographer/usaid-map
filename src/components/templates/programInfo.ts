import { TemplateResult, html } from 'lit';
import { TDataEntry } from '../../models/types';

const NO_RESPONSE = '[NO RESPONSE]';
const ACTION_STEPS_NOTE = `Note: Submitters are all at different points in their SEL/SS measurement processes. The information below indicates that a project was able to report specific action steps they are taking at the time of survey response. Lack of information here indicates that the project did not report any relevant information regarding action steps at this time.`;

function filterNoResponse(
	header: string,
	response: TemplateResult | string | undefined
) {
	if (response && response !== NO_RESPONSE) {
		return html`<li><b>${header}</b> ${response}</li>`;
	} else {
		return '';
	}
}

function makeToolURL(tool: string, link: string) {
	try {
		const url = new URL(link);
		return html`<a href=${url.toString()} target="_blank">${tool}</a>`;
	} catch {
		return tool;
	}
}

function hasChallenges(challenges: Record<string, [string, string][]>) {
	return Object.values(challenges).find(([, area]) => {
		if (area?.length === 2) {
			const [, response] = area;
			return response && response !== NO_RESPONSE;
		}
	});
}

export const programInfo = (
	project: TDataEntry,
	challengeAreas: Record<string, [string, string][]>,
	assessmentTypes: string[]
) => {
	return html`
		<summary role="button">
			${project['Project/Program/Initiative Name']}
		</summary>
		<ul class="overview">
			<li>
				<b>Background</b>
				<ul>
					${filterNoResponse('Organization:', project.Organization)}
					${filterNoResponse(
						'Education Level:',
						project['Level of Education'].join(', ')
					)}
					${filterNoResponse(
						'Project Description:',
						project['Project/Program/Initiative Description']
					)}
				</ul>
			</li>

			<li>
				<b>SEL/SS Skills Measurement Information</b>
				<ul>
					${filterNoResponse(
						'Common Skills Measured:',
						project['Common Skills']?.join(', ')
					)}
					${filterNoResponse(
						'Skills measured (as reported by contributor):',
						project.Skills?.join(', ')
					)}
					${filterNoResponse(
						'Tool Used or Adapted:',
						makeToolURL(
							project['Tool Used or Adapted'],
							project['URL Tool Used or Adapted']
						)
					)}
					${filterNoResponse(
						'Purpose of SEL/SS Measurement Tool:',
						project['Purpose of SEL/SS Measurement Tool']
					)}
					${filterNoResponse('Assessment types:', assessmentTypes.join(', '))}
				</ul>
			</li>

			${hasChallenges(challengeAreas)
				? html`<li>
						<caption for="challenges">
							<b
								>Action steps project is taking to address SEL/SS measurement
								challenges</b
							>
							<p>
								<em>${ACTION_STEPS_NOTE}</em>
							</p>
						</caption>
						<ul>
							<li>
								<table class="challenges" id="challenges">
									<thead>
										<tr>
											<th scope="col">Broad Challenge Area</th>
											<th scope="col">Precise Challenge Area</th>
										</tr>
									</thead>
									<tbody>
										${Object.entries(challengeAreas).map(
											([broad, precises]) => {
												if (
													!precises.filter(
														([area, comment]) =>
															comment !== NO_RESPONSE && comment !== ''
													).length
												) {
													return '';
												}

												return html`
													<tr>
														<th scope="row">${broad}</th>
														<td>
															${precises.map(([area, comment]) => {
																return comment === NO_RESPONSE || comment === ''
																	? ''
																	: html`<p><b>${area}</b><br />${comment}</p>`;
															})}
														</td>
													</tr>
												`;
											}
										)}
									</tbody>
								</table>
							</li>
						</ul>
				  </li>`
				: ''}
		</ul>
	`;
};
