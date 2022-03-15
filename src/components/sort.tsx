import Icon from "@mdi/react";

export function ShowSortDir({ fieldState = '', field = '', sortDir = '' } = {}) {
  return (
    <>
      { fieldState !== '' && fieldState === field && sortDir !== '' &&
        <Icon path={sortDir} size="1rem" />
      }
    </>
  )
}