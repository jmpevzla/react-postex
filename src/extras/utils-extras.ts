export function lengthObj(obj: Record<string, any>) {
  return Object.keys(obj).length
}

export function isEmptyObj(obj: Record<string, any>) {
  return lengthObj(obj) === 0
}