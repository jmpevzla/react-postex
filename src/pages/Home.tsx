import { mdiPencil, mdiTrashCan, mdiPlus } from '@mdi/js'
import { Icon } from '@mdi/react'
import MainLayout from "./layout/MainLayout"

export default Home

function Home() {
  const posts: number[] = []
  for(let i = 0; i < 10; i++) posts.push(i)
  
  return (
    <MainLayout>
      <div className="lg:mx-28">
        <div className="mb-3">
          <div className="lg:mx-36">
            <input type="search" placeholder="Search..." 
              className="
                form-control input-primary mr-2 
                p-2 rounded-xl flex-1
                outline-2 outline-double outline-gray-500
                w-full
              " 
            />
          </div>
        </div>

        <div className={`h-[calc(100vh_-_8.15rem)] pr-5 overflow-y-scroll`}>
        {posts.map(value => (
          <div className="mb-2" key={value}>
            <div className="card card-side bg-base-100 shadow-xl">
              <figure><img src="https://api.lorem.space/image/movie?w=150&h=210" alt="Movie" /></figure>
              <div className="card-body">
                <h2 className="card-title">New post!</h2>
                <p>Author</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">
                    <Icon path={mdiPencil} size={1} />
                  </button>
                  <button className="btn btn-error">
                    <Icon path={mdiTrashCan} size={1} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>

        <div className="fixed bottom-4 right-8">
          <div className="flex flex-row">
            <button className="btn btn-primary btn-circle mr-1">
              <Icon path={mdiPlus} size={1} />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}