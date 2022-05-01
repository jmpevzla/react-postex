export function checkFilesExist(files: FileList | null) {
  return files && files.length > 0
}

export function getSimpleFile(files: FileList) {
  return files[0]
}

export function checkPhotos(file: File) {
  switch(file.type) {
    case 'image/jpeg':
      break
    case 'image/png':          
      break
    case 'image/gif':
      break
    case 'image/svg+xml':
      break
    default:
      return false
  }
  return true
}

export function createURL(file?: File | null) {
  if (file) {
    return URL.createObjectURL(file)
  }
  return null
}

export function revokeURL(url?: string | null) {
  URL.revokeObjectURL(url || '')
}