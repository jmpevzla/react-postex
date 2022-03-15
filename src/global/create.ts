// export function createPropIfNotEmpty(obj: Record<string, any>) {
//   const name = Object.keys(obj).shift()
//   const value = Object.values(obj).shift()

//   return {
//     ...(name && value !== '' && { [name]: value })
//   } 
// }

export function createPropsIfNotEmpty(obj: Record<string, any>) {
  const ret = {} as Record<string, any>
  for(let name in obj) {
    const value = obj[name]
    
    if (value !== '') {
      ret[name] = value
    }
  }

  return ret
}

export function createApiQueryObject(...queries: Record<string, String | number>[]) {
  let objQueries = {}
  for(const query of queries) {
    objQueries = Object.assign(objQueries, query)
  }
  
  return objQueries
}