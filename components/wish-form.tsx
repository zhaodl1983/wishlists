'use client'

import { createWish, updateWish } from '@/app/protected/actions'
import { Wish } from '@/lib/types'
import { useRef } from 'react'

export function WishForm({
  wish,
  closeModal,
}: {
  wish?: Wish
  closeModal: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = !!wish

  // 使用 Server Action 来处理表单提交
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const result = isEditing
      ? await updateWish(wish.id, formData)
      : await createWish(formData)

    if (result?.error) {
      // 在这里可以添加更友好的错误提示，比如 toast 通知
      alert(result.error)
    } else {
      // 成功后清空表单并关闭模态框
      if (!isEditing) {
        formRef.current?.reset()
      }
      closeModal()
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div>
        <label
          htmlFor="item_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          愿望名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="item_name"
          name="item_name"
          defaultValue={wish?.item_name}
          className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          描述
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={wish?.description || ''}
          className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            优先级
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={wish?.priority || 'Medium'}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            截止日期
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            defaultValue={wish?.due_date || ''}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-x-3">
        <button
          type="button"
          onClick={closeModal}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          {isEditing ? '更新' : '保存'}
        </button>
      </div>
    </form>
  )
}