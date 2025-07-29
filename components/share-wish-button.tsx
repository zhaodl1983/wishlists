'use client'

import { updateWishPublicStatus } from '@/app/protected/actions'
import { useState, useTransition, useEffect } from 'react'

export function ShareWishButton({
  wishId,
  isPublic,
}: {
  wishId: string
  isPublic: boolean
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [shareUrl, setShareUrl] = useState('')

  // useEffect 只在客户端运行，这是安全访问 `window` 对象的最佳位置
  useEffect(() => {
    // 我们可以提前构建好 URL，因为它不依赖于模态框是否打开
    setShareUrl(`${window.location.origin}/shared/${wishId}`)
  }, [wishId]) // 依赖项数组确保这个 effect 只在 wishId 变化时重新运行

  const handleTogglePublic = () => {
    startTransition(async () => {
      const result = await updateWishPublicStatus(wishId, !isPublic)
      if (result?.error) {
        alert(result.error)
      }
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('链接已复制到剪贴板！')
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-sm font-medium text-gray-500 hover:text-black"
      >
        分享
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">分享愿望</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
                <span className="font-medium text-gray-800">设为公开</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isPublic}
                    onChange={handleTogglePublic}
                    disabled={isPending}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300"></div>
                </label>
              </div>

              {isPublic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分享链接
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full rounded-md border-gray-300 bg-gray-100 py-2 px-3 focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                    >
                      复制
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 