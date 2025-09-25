const fs = require('fs');
const path = require('path');

/**
 * Replaces the content of each file in a target folder with the content of a source file.
 * The original filenames in the target folder are preserved.
 *
 * @param {string} sourceFilePath The full path to the source file (e.g., your "font.ttf").
 * @param {string} targetFolderPath The full path to the target folder (e.g., the folder with "font_a.ttf").
 */
function replaceFileContents(sourceFilePath, targetFolderPath) {
	if (!fs.existsSync(sourceFilePath) || !fs.lstatSync(sourceFilePath).isFile()) {
		console.error(`Error: Source file '${sourceFilePath}' not found or is not a file.`);
		return;
	}

	if (!fs.existsSync(targetFolderPath)) {
		try {
			fs.mkdirSync(targetFolderPath, { recursive: true });
			console.log(`Created target folder: ${targetFolderPath}`);
		} catch (e) {
			console.error(`Error creating target folder '${targetFolderPath}': ${e.message}`);
			return;
		}
	} else if (!fs.lstatSync(targetFolderPath).isDirectory()) {
		console.error(`Error: Target path '${targetFolderPath}' exists but is not a directory.`);
		return;
	}

	let replacedCount = 0;
	let errorCount = 0;

	try {
		const filesInTargetFolder = fs.readdirSync(targetFolderPath);

		for (const filename of filesInTargetFolder) {
			const targetFilePath = path.join(targetFolderPath, filename);

			if (fs.lstatSync(targetFilePath).isFile()) {
				try {
					fs.copyFileSync(sourceFilePath, targetFilePath);
					console.log(
						`Successfully replaced content of: ${targetFilePath} with content from ${sourceFilePath}`
					);
					replacedCount += 1;
				} catch (e) {
					console.error(`Error replacing content of '${targetFilePath}': ${e.message}`);
					errorCount += 1;
				}
			} else {
				console.log(`Skipping (not a file): ${targetFilePath}`);
			}
		}
		console.log(`
Replacement summary:
  Files replaced: ${replacedCount}
  Errors: ${errorCount}
`);
	} catch (e) {
		console.error(`Error accessing target folder '${targetFolderPath}': ${e.message}`);
	}
}

module.exports = {
	replaceFileContents
};
