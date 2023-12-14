import { html } from 'lit';
import { TDataEntry } from '../../models/types';

export const programInfo = (project: TDataEntry) => html`
	<summary role="button">${project['Project/Program/Initiative Name']}</summary>
	<div>${project['Project/Program/Initiative Description']}</div>
`;
