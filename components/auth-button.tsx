import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { Button } from './ui/button'

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
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/auth/sign-up">Sign Up</Link>
      </Button>
    </div>
  )
}
