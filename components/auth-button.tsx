import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './logout-button'

export async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm text-gray-600 sm:block">
        你好, {user.email}!
      </span>
      <LogoutButton />
    </div>
  ) : null
}
