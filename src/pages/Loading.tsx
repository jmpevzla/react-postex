import styles from "@/styles/Loading.module.css"
import MainLayout from "./layout/MainLayout"

export default Loading

function Loading() {
  return (
    <MainLayout>
      <div className="flex flex-col text-center select-none h-[calc(100vh_-_4rem)] justify-center">
        <p className="text-7xl font-extrabold mb-4">Loading</p>
        <div className="mx-auto">
          <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    </MainLayout>
  )
}