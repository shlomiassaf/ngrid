export function deprecatedWarning(deprecated: string, version: string, alt: string) {
  console.warn(`"${deprecated}" is deprecated and will be removed in version ${version}, use "${alt}" instead.`);
}
