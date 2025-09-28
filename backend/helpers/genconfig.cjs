const fs = require('fs');
const path = require('path');

class Config {
	soberConfigPath;

	constructor() {
		this.soberConfigPath = path.join(
			process.env.HOME || process.env.USERPROFILE || '.',
			'.var/app/org.vinegarhq.Sober/config/sober/config.json'
		);
	}

	readJson(filePath) {
		if (!fs.existsSync(filePath)) return {};
		try {
			return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		} catch {
			return {};
		}
	}

	writeJson(filePath, data) {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	}

	async UpdateFflags(key, value) {
		const config = this.readJson(this.soberConfigPath);
		if (!config.fflags) {
			config.fflags = {};
		}
		config.fflags[key] = value;
		this.writeJson(this.soberConfigPath, config);
	}

	async DeleteFflag(key) {
		const config = this.readJson(this.soberConfigPath);
		if (config.fflags) {
			delete config.fflags[key];
		}
		this.writeJson(this.soberConfigPath, config);
	}

	async ReadFflagsConfig(key) {
		const config = this.readJson(this.soberConfigPath);
		return config.fflags ? config.fflags[key] : undefined;
	}

	async UpdateSoberConfig(key, value) {
		const config = this.readJson(this.soberConfigPath);
		config[key] = value;
		this.writeJson(this.soberConfigPath, config);
	}

	async ReadSoberConfig(key) {
		const config = this.readJson(this.soberConfigPath);
		return config[key] || {};
	}

	async Update(section, key, value) {
		const config = this.readJson(this.soberConfigPath);
		if (!config[section]) config[section] = {};
		config[section][key] = value;
		this.writeJson(this.soberConfigPath, config);
	}

	CombineJson(a, b) {
		return { ...a, ...b };
	}
}

module.exports = { Config };