export function isPrefersColorSchemeDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

