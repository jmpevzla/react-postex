import { partialRight } from "lodash"
import { useState } from "react"
import { setObjInCompState } from "@/code/state"
import { TSort, TSortOpts } from "@/code/lists/sort"

type TSetSort = React.Dispatch<React.SetStateAction<TSort>>
type TSetSortCompStateParams = { setSort: TSetSort }
type TSortState = [TSort, TSetSort]
type TUseSetSort = (sort: TSortOpts) => void 
type TUseSort = [TSort, TUseSetSort]

function setSortInCompState(sort: TSortOpts, 
  params: TSetSortCompStateParams) {
    setObjInCompState(sort, { setState: params.setSort })
}

export function useSort(): TUseSort {
  const [sort, setSort] = useState({
    sort: '',
    order: ''
  }) as TSortState

  const setSortState = partialRight(setSortInCompState, 
    { setSort } as TSetSortCompStateParams)

  return [
    sort,
    setSortState
  ]
}