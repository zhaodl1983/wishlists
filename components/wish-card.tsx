import { Wish } from '@/lib/types'
import { DeleteWishButton } from './delete-wish-button'
import { ShareWishButton } from './share-wish-button'
import { EditWishButton } from './edit-wish-button'

export function WishCard({ wish }: { wish: Wish }) {
  const priorityMap = {
    High: '高',
    Medium: '中',
    Low: '低',
  }

  const priorityColorMap = {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-gray-500',
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
      <div className="flex-grow p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={wish.is_completed}
              className={`h-5 w-5 cursor-pointer rounded border-gray-300 ${
                wish.is_completed ? 'text-gray-500' : 'text-black'
              } focus:ring-black`}
            />
            <h2
              className={`text-lg font-semibold ${
                wish.is_completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
              }`}
            >
              {wish.item_name}
            </h2>
          </div>
          <span
            className={`text-sm font-medium ${priorityColorMap[wish.priority]}`}
          >
            {priorityMap[wish.priority]}
          </span>
        </div>
        {wish.description && (
          <p
            className={`mt-2 text-sm ${
              wish.is_completed ? 'text-gray-500 line-through' : 'text-gray-600'
            }`}
          >
            {wish.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{wish.due_date ? `截止: ${wish.due_date}` : ''}</span>
          {wish.is_public && (
            <div className="flex items-center space-x-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              <span className="text-xs font-semibold">公开</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50/70 p-3">
        <EditWishButton wish={wish} />
        <DeleteWishButton wishId={wish.id} />
        <ShareWishButton wishId={wish.id} isPublic={wish.is_public} />
      </div>
    </div>
  )
} 