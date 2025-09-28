const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class FilesFunctions {
	async OverwriteFiles(destFolder, sources) {
		await fs.mkdir(destFolder, { recursive: true });
		for (const src of sources) {
			const fileName = path.basename(src);
			const dest = path.join(destFolder, fileName);
			await fs.copyFile(src, dest);
		}
	}

	async OverwriteFolders(dest, sources, no_success) {
		for (const src of sources) {
			try {
				const srcStat = await fs.stat(src);
				if (srcStat.isDirectory()) {
					const files = await fs.readdir(src);
					for (const file of files) {
						const srcPath = path.join(src, file);
						const destPath = path.join(dest, file);
						await fs.cp(srcPath, destPath, { recursive: true });
					}
				}
			} catch (err) {
				if (err.code !== 'ENOENT') {
					console.error(`Error overwriting folder ${src} to ${dest}:`, err);
				}
			}
		}
	}

	async ApplyMarketplaceMods(dir) {
		console.log('Applying mods...');
		const dest_dirr = path.join(
			os.homedir(),
			'.var/app/org.vinegarhq.Sober/data/sober/asset_overlay/'
		);

		await this.OverwriteFolders(dest_dirr, [path.join(dir)], true);

		// await this.OverwriteFolders(dest_dirr, [path.join(dir, 'ExtraContent/')], true);
		// await this.OverwriteFolders(dest_dirr, [path.join(dir, 'content/')], true);
		// await this.OverwriteFolders(dest_dirr, [path.join(dir, 'ClientSettings')], true);
		// await this.OverwriteFolders(dest_dirr, [path.join(dir, 'PlatformContent')], true);
		// // this.client_settings.CheckClientSettings(f"{dir}/ClientSettings") // a C# class
		console.warn(
			'Restart Sober to apply the mods. If you not opened Sober, you can ignore this message.'
		);
	}
}

module.exports = { FilesFunctions };
