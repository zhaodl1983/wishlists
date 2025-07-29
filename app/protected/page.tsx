import { AuthButton } from '@/components/auth-button'
import { getUserWishes } from './actions'
import { WishCard } from '@/components/wish-card'
import { CreateWishButton } from '@/components/create-wish-button'
import { SearchAndFilter } from '@/components/search-and-filter'

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    priority?: 'High' | 'Medium' | 'Low'
    status?: 'completed' | 'pending'
  }
}) {
  const wishes = await getUserWishes({
    query: searchParams.q,
    priority: searchParams.priority,
    status: searchParams.status,
  })

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            我的愿望
          </h1>
          <p className="text-gray-500 mt-1">
            在这里管理你的所有愿望.
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          <CreateWishButton />
        </div>
      </header>

      <SearchAndFilter />

      <div className="w-full">
        {wishes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                你的愿望清单是空的
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                点击下面的按钮来创建你的第一个愿望吧！
              </p>
              <div className="mt-6">
                <CreateWishButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
