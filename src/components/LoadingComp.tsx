import styles from "@/styles/Loading.module.css"

export default LoadingComp

function LoadingComp() {
  return (
    <div className="flex flex-col text-center select-none justify-center">
      <p className="text-4xl font-extrabold">Loading</p>
      <div className="mx-auto">
        <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  )
}