
export function resourceUrl(path: string): string {
  if (window.location.host.includes("alchemyplatform.github.io")) {
    return `/nft-demo${path}`;
  }
  return path;
}