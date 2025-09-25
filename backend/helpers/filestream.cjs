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

    const fileContent = await res.text();

    if (fileContent.startsWith('version https://git-lfs.github.com/spec/v1')) {
        const lines = fileContent.split('\n');
        const oidLine = lines.find(line => line.startsWith('oid sha256:'));
        const sizeLine = lines.find(line => line.startsWith('size '));

        if (oidLine && sizeLine) {
            const oid = oidLine.split(':')[1].trim();
            const size = parseInt(sizeLine.split(' ')[1]);

            const repoUrl = url.replace('raw.githubusercontent.com', 'github.com').substring(0, url.indexOf('/main'));
            const lfsUrl = `${repoUrl}.git/info/lfs/objects/batch`;

            const lfsRes = await fetch(lfsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/vnd.git-lfs+json',
                    'Accept': 'application/vnd.git-lfs+json'
                },
                body: JSON.stringify({
                    'operation': 'download',
                    'transfers': ['basic'],
                    'objects': [{
                        'oid': oid,
                        'size': size
                    }]
                })
            });

            if (!lfsRes.ok) throw new Error(`failed to fetch LFS file: ${lfsRes.statusText}`);

            const lfsData = await lfsRes.json();
            const downloadUrl = lfsData.objects[0].actions.download.href;

            const downloadRes = await fetch(downloadUrl);
            if (!downloadRes.ok) throw new Error(`failed to download LFS file: ${downloadRes.statusText}`);

            const fileStream = fs.createWriteStream(outPath);
            await new Promise((resolve, reject) => {
                downloadRes.body.pipe(fileStream);
                downloadRes.body.on('error', reject);
                fileStream.on('finish', resolve);
            });

            return outPath;
        }
    }

    // If it's not an LFS pointer, write the content directly
    fs.writeFileSync(outPath, fileContent);
    return outPath;
}

module.exports = { downloadFileFromUrl };
