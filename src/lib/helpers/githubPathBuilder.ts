export function buildGithubMediaUrl(
	owner: string,
	repo: string,
	type: string,
	content: string,
	branch = 'main'
): string {
	return `https://media.githubusercontent.com/media/${owner}/${repo}/${branch}/Assets/${type}/Content/${encodeURIComponent(
		content
	)}.zip`;
}
