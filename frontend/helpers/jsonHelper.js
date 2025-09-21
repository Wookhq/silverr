import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * @template T
 */
export class JsonHelper {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.filePath = filePath;
  }

  /** @returns {Promise<T|null>} */
  async read() {
    try {
      let fp = this.filePath;
      if (fp.startsWith("~")) {
        fp = path.join(os.homedir(), fp.slice(1));
      }
      const data = await fs.readFile(fp, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("error reading json:", err);
      return null;
    }
  }

  /**
   * @param {T} content
   * @returns {Promise<void>}
   */
  async write(content) {
    try {
      let fp = this.filePath;
      if (fp.startsWith("~")) {
        fp = path.join(os.homedir(), fp.slice(1));
      }
      await fs.writeFile(fp, JSON.stringify(content, null, 2), "utf-8");
    } catch (err) {
      console.error("error writing json:", err);
    }
  }
}
