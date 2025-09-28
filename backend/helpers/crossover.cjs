const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { Config } = require('./genconfig.cjs');
const { FilesFunctions } = require('./filesfun.cjs');
const archiver = require('archiver');
const extract = require('extract-zip');

const cg = new Config();
const ff = new FilesFunctions();

class Crossover {
	getLogger() {
		return {
			info: (message) => console.log(message),
			error: (message) => console.error(message)
		};
	}

	async crossover(folder) {
		const lg = this.getLogger();
		const folderPath = path.resolve(folder);

		try {
			await fs.access(folderPath);
		} catch {
			lg.error(`CROSSOVER: Folder not found at ${folderPath}`);
			return;
		}

		const config_file = path.join(folderPath, 'crossover.json');
		try {
			await fs.access(config_file);
		} catch {
			lg.error(`CROSSOVER: crossover.json not found in ${folderPath}`);
			return;
		}

		try {
			const content = JSON.parse(await fs.readFile(config_file, 'utf-8'));

			lg.info(`Using crossover version ${content['metadata']['crossoverVerison']}`);
			lg.info(`CROSSOVER: Platform ${content['metadata']['roblox']}`);

			const fastflagpath = content.crossover?.fastflag || 'none';
			let fastflag_file = null;
			if (fastflagpath === 'none') {
				lg.info('CROSSOVER: Did not find fastflag');
			} else {
				lg.info(`CROSSOVER: Found fastflag path: ${fastflagpath}`);
				fastflag_file = path.join(folderPath, fastflagpath);
			}

			const mod = content.crossover?.mod || 'none';
			let mod_path = null;
			if (mod === 'none') {
				lg.info('CROSSOVER: Did not find mod');
			} else {
				lg.info(`CROSSOVER: Found mod path: ${mod}`);
				mod_path = path.join(folderPath, mod);
			}

			lg.info('CROSSOVER: Crossing over!');

			if (fastflag_file) {
				try {
					await fs.access(fastflag_file);
					lg.info('CROSSOVER: Trying overwrite Fast Flag...');
					try {
						const fastflagcontent = JSON.parse(await fs.readFile(fastflag_file, 'utf-8'));
						await cg.UpdateSoberConfig('fflags', fastflagcontent);
					} catch (e) {
						if (e.code === 'ENOENT') {
							lg.error(`CROSSOVER: Fastflag file not found at ${fastflag_file}`);
						} else {
							lg.error(`CROSSOVER: Fastflag file is not valid JSON -> ${e.message}`);
						}
					}
				} catch (e) {
					lg.error(`Unknown error: ${e.message}`);
				}
			}

			if (mod_path) {
				try {
					lg.info('CROSSOVER: Applying mods ...');
					await ff.ApplyMarketplaceMods(mod_path);
				} catch (e) {
					lg.error(`Unknown error: ${e.message}`);
				}
			}
		} catch (e) {
			if (e instanceof SyntaxError) {
				lg.error(`CROSSOVER: crossover.json is not valid JSON -> ${e.message}`);
			} else {
				lg.error(`Missing key: ${e.message}`);
			}
			return `Missing ${e.message}`;
		}
	}

	async create(folder, roblox_platform = 'android', crossover_version = 1) {
		const lg = this.getLogger();
		const folderPath = path.resolve(folder);
		await fs.mkdir(folderPath, { recursive: true });

		lg.info(`CROSSOVER CREATE: Creating new crossover folder at ${folderPath}`);

		const crossover_json = {
			metadata: {
				crossoverVerison: crossover_version,
				from: 'linux',
				roblox: roblox_platform,
				date: 'unknown'
			},
			crossover: {
				fastflag: './roblox/clientsettings/ClientSettings.json',
				mod: './roblox/mod/'
			}
		};

		const crossover_file = path.join(folderPath, 'crossover.json');
		await fs.writeFile(crossover_file, JSON.stringify(crossover_json, null, 4), 'utf-8');
		lg.info(`CROSSOVER CREATE: Wrote crossover.json at ${crossover_file}`);

		const clientsettings_folder = path.join(folderPath, 'roblox', 'clientsettings');
		await fs.mkdir(clientsettings_folder, { recursive: true });

		const mod_folder = path.join(folderPath, 'roblox', 'mod');
		await fs.mkdir(mod_folder, { recursive: true });

		const source_mods = path.join(
			process.env.HOME || '',
			'.var/app/org.vinegarhq.Sober/data/sober/asset_overlay/'
		);
		try {
			await fs.access(source_mods);
			lg.info(`CROSSOVER CREATE: Copying mods from ${source_mods} to ${mod_folder}`);
			const items = await fs.readdir(source_mods);
			for (const item of items) {
				const src = path.join(source_mods, item);
				const dest = path.join(mod_folder, item);
				const stat = await fs.lstat(src);
				if (stat.isDirectory()) {
					await fs.cp(src, dest, { recursive: true });
				} else {
					await fs.copyFile(src, dest);
				}
			}
		} catch {
			lg.info(`CROSSOVER CREATE: No mods found in ${source_mods}`);
		}

		const clientsettings = await cg.ReadSoberConfig('fflags');
		const dump = JSON.stringify(clientsettings, null, 4);
		await fs.writeFile(path.join(clientsettings_folder, 'ClientSettings.json'), dump, 'utf-8');
		lg.info('CROSSOVER CREATE: Created placeholder ClientSettings.json');

		lg.info(`CROSSOVER CREATE: Created mod folder at ${mod_folder}`);

		return folderPath;
	}

	async pack(folder, dest_file) {
		const lg = this.getLogger();
		const folderPath = path.resolve(folder);
		try {
			await fs.access(folderPath);
		} catch {
			lg.error(`CROSSOVER PACK: Folder not found at ${folderPath}`);
			return;
		}

		const crossover_file = dest_file || `${folderPath}.crossover`;
		lg.info(`CROSSOVER PACK: Creating ${crossover_file}`);

		const output = require('fs').createWriteStream(crossover_file);
		const archive = archiver('zip', {
			zlib: { level: 9 }
		});

		return new Promise((resolve, reject) => {
			output.on('close', () => {
				lg.info(`CROSSOVER PACK: Finished packing ${crossover_file}`);
				resolve(crossover_file);
			});

			archive.on('error', (err) => {
				lg.error(`CROSSOVER PACK: ${err.message}`);
				reject(err);
			});

			archive.pipe(output);
			archive.directory(folderPath, false);
			archive.finalize();
		});
	}

	async unpack(crossover_file, dest_folder) {
		const lg = this.getLogger();
		const crossover_filePath = path.resolve(crossover_file);

		try {
			await fs.access(crossover_filePath);
			if (path.extname(crossover_filePath) !== '.crossover') {
				throw new Error('Invalid extension');
			}
		} catch {
			lg.error(`CROSSOVER UNPACK: File not found or invalid extension ${crossover_filePath}`);
			return;
		}

		let destPath;
		if (dest_folder) {
			destPath = path.resolve(dest_folder);
		} else {
			destPath = crossover_filePath.substring(0, crossover_filePath.length - '.crossover'.length);
		}

		await fs.mkdir(destPath, { recursive: true });
		lg.info(`CROSSOVER UNPACK: Extracting ${crossover_filePath} to ${destPath}`);

		try {
			await extract(crossover_filePath, { dir: destPath });
			lg.info(`CROSSOVER UNPACK: Finished extracting to ${destPath}`);
			return destPath;
		} catch (err) {
			lg.error(`CROSSOVER UNPACK: ${err.message}`);
		}
	}
}

module.exports = { Crossover };
