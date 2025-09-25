const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function downloadFileFromUrl(url, fileName) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`failed to fetch file: ${res.statusText}`);

	const downloadsDir = path.join(app.getPath('userData'), 'marketplace_assets');
	if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

	const outName = fileName || path.basename(url);
	const outPath = path.join(downloadsDir, outName);

	const fileStream = fs.createWriteStream(outPath);
	await new Promise((resolve, reject) => {
		res.body.pipe(fileStream);
		res.body.on('error', reject);
		fileStream.on('finish', resolve);
	});

	return outPath;
}

module.exports = { downloadFileFromUrl };
