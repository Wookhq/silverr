import fs from "fs";
import path from "path";

export class Config {
  private soberConfigPath: string;
  private fflagsPath: string;

  constructor() {
    const base = path.join(
      process.env.HOME || process.env.USERPROFILE || ".",
      ".var/app/org.vinegarhq.Sober/data/sober/"
    );
    this.soberConfigPath = path.join(base, "sober.json");
    this.fflagsPath = path.join(base, "fflags.json");
  }

  private readJson(filePath: string): any {
    if (!fs.existsSync(filePath)) return {};
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      return {};
    }
  }

  private writeJson(filePath: string, data: any) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  async UpdateFflags(key: string, value: any) {
    const fflags = this.readJson(this.fflagsPath);
    fflags[key] = value;
    this.writeJson(this.fflagsPath, fflags);
  }

  async DeleteFflag(key: string) {
    const fflags = this.readJson(this.fflagsPath);
    delete fflags[key];
    this.writeJson(this.fflagsPath, fflags);
  }

  async ReadFflagsConfig(key: string): Promise<any> {
    const fflags = this.readJson(this.fflagsPath);
    return fflags[key];
  }

  async UpdateSoberConfig(key: string, value: any) {
    const config = this.readJson(this.soberConfigPath);
    config[key] = value;
    this.writeJson(this.soberConfigPath, config);
  }

  async ReadSoberConfig(key: string): Promise<any> {
    const config = this.readJson(this.soberConfigPath);
    return config[key];
  }

  async Update(section: string, key: string, value: any) {
    const config = this.readJson(this.soberConfigPath);
    if (!config[section]) config[section] = {};
    config[section][key] = value;
    this.writeJson(this.soberConfigPath, config);
  }

  CombineJson(a: Record<string, any>, b: Record<string, any>): Record<string, any> {
    return { ...a, ...b };
  }
}
