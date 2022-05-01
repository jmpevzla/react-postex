export function getInputEventValue(ev: React.FormEvent<HTMLInputElement>) {
  return ev.currentTarget.value 
}

export function getInputEventFile(ev: React.ChangeEvent<HTMLInputElement>) {
  return ev.currentTarget.files
}
