import fs from "fs";
import path from "path";

export class FilesFunctions {
  async OverwriteFiles(destFolder: string, sources: string[]) {
    fs.mkdirSync(destFolder, { recursive: true });
    for (const src of sources) {
      const fileName = path.basename(src);
      const dest = path.join(destFolder, fileName);
      fs.copyFileSync(src, dest);
    }
  }
}
