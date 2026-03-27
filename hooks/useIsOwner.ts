import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useIsOwner = () => {
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkOwner = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsOwner(user?.email === 'james@prushlogistics.com')
      setLoading(false)
    }
    checkOwner()
  }, [])

  return { isOwner, loading }
}
