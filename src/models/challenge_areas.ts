export const CHALLENGE_AREAS: Record<string, string[]> = {
	'Local Engagement of Stakeholders': [
		'Identifying a clear process for contextualization of tools',
		'Developing local capacity',
		'Balancing local and regional differences'
	],
	'Identifying Purpose of Measurement and Linking to Assessment': [
		'SEL/SS measurement tools that match the purpose'
	],
	'General Issues Related to Measurement': [
		'Developing and/or validating measures for high-stakes assessments',
		'Identifying valid and reliable tools for local context',
		'Finding tools to establish evidence of impact',
		'Navigating a narrow definition of validity'
	],
	'Role of the Environment in SEL/SS Assessment': [
		'Developing tools that assess competencies and environment',
		'Limited guidance on assessing environment to aid in interpretation'
	],
	'Socialization and Buy-In Around SEL/SS Measurement': [
		'Achieving a system-wide adoption and community-based advocacy',
		'Getting country and MOE to prioritize SEL/SS'
	],
	Other: [
		'Limited coordination efforts to address SEL/SS measurement',
		'Lack of a concrete/common language',
		'Finding donors',
		'Other'
	]
};

export const PRECISE_CHALLENGE_AREAS = Object.entries(CHALLENGE_AREAS)
	.map(([broad, precise]) => precise)
	.flat();
