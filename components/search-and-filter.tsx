'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function SearchAndFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterName: string,
  ) => {
    const params = new URLSearchParams(searchParams)
    const value = e.target.value
    if (value) {
      params.set(filterName, value)
    } else {
      params.delete(filterName)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="搜索愿望..."
          defaultValue={searchParams.get('q')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <select
        defaultValue={searchParams.get('priority')?.toString()}
        onChange={(e) => handleFilterChange(e, 'priority')}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 sm:w-40"
      >
        <option value="">所有优先级</option>
        <option value="High">高</option>
        <option value="Medium">中</option>
        <option value="Low">低</option>
      </select>
      <select
        defaultValue={searchParams.get('status')?.toString()}
        onChange={(e) => handleFilterChange(e, 'status')}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 sm:w-40"
      >
        <option value="">所有状态</option>
        <option value="completed">已完成</option>
        <option value="pending">未完成</option>
      </select>
    </div>
  )
} 