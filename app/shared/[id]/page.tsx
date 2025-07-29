import { getPublicWish } from '@/app/protected/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function SharedWishPage({
  params,
}: {
  params: { id: string }
}) {
  const wish = await getPublicWish(params.id)

  if (!wish) {
    notFound()
  }

  const priorityMap = {
    High: '高',
    Medium: '中',
    Low: '低',
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
      <div className="w-full max-w-2xl flex-grow p-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {wish.item_name}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                wish.priority === 'High'
                  ? 'bg-red-100 text-red-800'
                  : wish.priority === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {priorityMap[wish.priority]}
            </span>
          </div>
          {wish.description && (
            <p className="mt-4 text-lg text-gray-600">{wish.description}</p>
          )}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">创建日期</dt>
                <dd className="mt-1 text-gray-900">
                  {new Date(wish.created_at).toLocaleDateString()}
                </dd>
              </div>
              {wish.due_date && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">截止日期</dt>
                  <dd className="mt-1 text-gray-900">{wish.due_date}</dd>
                </div>
              )}
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">状态</dt>
                <dd className="mt-1 text-gray-900">
                  {wish.is_completed ? '已完成' : '进行中'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>
          由 Wishlist App 创建 |{' '}
          <Link href="/" className="underline hover:text-black">
            创建你自己的愿望单
          </Link>
        </p>
      </footer>
    </div>
  )
} 