import { AxiosResponseHeaders } from "axios"

export function getTotalCount(headers: AxiosResponseHeaders) {
  let total = Number(headers['x-total-count'])
  if (isNaN(total)) {
    total = 0
  }

  return total
}