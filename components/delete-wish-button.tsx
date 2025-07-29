'use client'

import { deleteWish } from '@/app/protected/actions'
import { useState } from 'react'

export function DeleteWishButton({ wishId }: { wishId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = async () => {
    const result = await deleteWish(wishId)
    if (result?.error) {
      alert(result.error)
    }
    // The page will revalidate automatically, so no need to close modal manually
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-sm font-medium text-gray-500 hover:text-red-600"
      >
        删除
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              删除愿望
            </h3>
            <div className="mt-2 px-4 py-2">
              <p className="text-sm text-gray-500">
                你确定要删除这个愿望吗？此操作无法撤销.
              </p>
            </div>
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 