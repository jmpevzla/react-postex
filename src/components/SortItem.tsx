import { changeSort, TSort } from "@/code/lists/sort"
import { mdiSortAscending, mdiSortDescending } from "@mdi/js"
import { Icon } from "@mdi/react"
import React from "react"

export default SortItem

function SortItem({ sort, caption, field, onChangeSort }: 
  { sort: TSort, caption: string, field: string
    , onChangeSort: (newSort: TSort) => void }) {

  function onClickItem(ev: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>) {
    ev.preventDefault()
    const newSort = changeSort(field, sort)
    onChangeSort(newSort)
  }

  if (sort.sort === field) {
    switch(sort.order) {
      case 'asc':
        return (
          <a onClick={onClickItem}>
            <Icon path={mdiSortAscending} size={1} />
              { caption }
          </a>
        )
      case 'desc':
        return (
          <a onClick={onClickItem}>
            <Icon path={mdiSortDescending} size={1} />
            { caption }
          </a>
        )
      default:
        return (
          <a onClick={onClickItem}>
            { caption }
          </a>
        )
    }  
  } else {
    return (
      <a onClick={onClickItem}>
        { caption }
      </a>
    )
  }
}