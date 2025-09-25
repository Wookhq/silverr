export function downloadAsset(item: string) {
  const path = `https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/main/${item}`;
  window.electronAPI.downloadFileFromUrl(path);
}
