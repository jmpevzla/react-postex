type TSetCompStateParams<T> = { setState: React.Dispatch<React.SetStateAction<T>> }

export function setObjInCompState<T>(xState: Partial<T>, 
  params: TSetCompStateParams<T>) {
    params.setState((prevState) => {
      return {
        ...prevState,
        ...xState
      }
    })
}