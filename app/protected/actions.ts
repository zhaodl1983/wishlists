'use server'

import { createClient } from '@/lib/supabase/server'
import { Wish } from '@/lib/types'
import { revalidatePath } from 'next/cache'

/**
 * 获取当前登录用户的所有愿望清单项目
 * @returns Promise<Wish[]>
 */
export async function getUserWishes({
  query,
  priority,
  status,
}: {
  query?: string
  priority?: 'High' | 'Medium' | 'Low'
  status?: 'completed' | 'pending'
}): Promise<Wish[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('User is not authenticated.')
    return []
  }

  let supabaseQuery = supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', user.id)

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `item_name.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  if (priority) {
    supabaseQuery = supabaseQuery.eq('priority', priority)
  }

  if (status) {
    supabaseQuery = supabaseQuery.eq('is_completed', status === 'completed')
  }

  const { data, error } = await supabaseQuery.order('created_at', {
    ascending: false,
  })

  if (error) {
    console.error('Error fetching wishes:', error.message)
    throw new Error(`Failed to fetch wishes: ${error.message}`)
  }

  return data || []
}

/**
 * 创建一个新的愿望项目
 * @param formData - 从表单提交的数据
 */
export async function createWish(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create a wish.' }
  }

  const rawData = {
    item_name: formData.get('item_name') as string,
    description: formData.get('description') as string | null,
    priority: formData.get('priority') as 'High' | 'Medium' | 'Low',
    due_date: formData.get('due_date') ? (formData.get('due_date') as string) : null,
    user_id: user.id,
  }

  // 后端验证
  if (!rawData.item_name) {
    return { error: 'Wish name is required.' }
  }
  if (!rawData.priority) {
    rawData.priority = 'Medium' // 默认值
  }

  // 清理数据，如果 due_date 是空字符串，则设为 null
  if (rawData.due_date === '') {
    rawData.due_date = null
  }

  const { error } = await supabase.from('wishlists').insert(rawData)

  if (error) {
    console.error('Error creating wish:', error.message)
    return { error: `Failed to create wish: ${error.message}` }
  }

  // 成功后，重新验证路径以刷新页面上的数据
  revalidatePath('/protected')

  return { success: 'Wish created successfully!' }
}

/**
 * 删除一个愿望项目
 * @param wishId - 要删除的愿望的 ID
 */
export async function deleteWish(wishId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to delete a wish.' }
  }

  // 在删除前，先验证该愿望是否属于当前用户
  const { data: existingWish, error: fetchError } = await supabase
    .from('wishlists')
    .select('id')
    .eq('id', wishId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !existingWish) {
    return { error: 'Wish not found or you do not have permission to delete it.' }
  }

  const { error: deleteError } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishId)

  if (deleteError) {
    console.error('Error deleting wish:', deleteError.message)
    return { error: `Failed to delete wish: ${deleteError.message}` }
  }

  revalidatePath('/protected')

  return { success: 'Wish deleted successfully!' }
}

/**
 * 更新愿望的公开状态
 * @param wishId - 要更新的愿望的 ID
 * @param isPublic - 新的公开状态
 */
export async function updateWishPublicStatus(
  wishId: string,
  isPublic: boolean,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update a wish.' }
  }

  const { error } = await supabase
    .from('wishlists')
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', wishId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating wish status:', error.message)
    return { error: `Failed to update wish status: ${error.message}` }
  }

  revalidatePath('/protected')
  revalidatePath(`/shared/${wishId}`)

  return { success: 'Wish status updated successfully!' }
}

/**
 * 更新一个现有的愿望项目
 * @param wishId - 要更新的愿望的 ID
 * @param formData - 从表单提交的数据
 */
export async function updateWish(wishId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update a wish.' }
  }

  const rawData = {
    item_name: formData.get('item_name') as string,
    description: formData.get('description') as string | null,
    priority: formData.get('priority') as 'High' | 'Medium' | 'Low',
    due_date: formData.get('due_date')
      ? (formData.get('due_date') as string)
      : null,
  }

  if (!rawData.item_name) {
    return { error: 'Wish name is required.' }
  }
  if (rawData.due_date === '') {
    rawData.due_date = null
  }

  const { error } = await supabase
    .from('wishlists')
    .update({ ...rawData, updated_at: new Date().toISOString() })
    .eq('id', wishId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating wish:', error.message)
    return { error: `Failed to update wish: ${error.message}` }
  }

  revalidatePath('/protected')

  return { success: 'Wish updated successfully!' }
}

/**
 * 获取单个公开的愿望
 * @param wishId - 要获取的愿望的 ID
 * @returns Promise<Wish | null>
 */
export async function getPublicWish(
  wishId: string,
): Promise<Wish | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('id', wishId)
    .eq('is_public', true)
    .single()

  if (error) {
    console.error('Error fetching public wish:', error.message)
    return null
  }

  return data
}