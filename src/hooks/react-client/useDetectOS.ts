'use client'

import { useState, useEffect } from 'react'
import { UserOS } from '@/types/userOS'
import { detectOS } from '@/src/utils/detectOS'

type UserOSState = {
  os: UserOS,
  bitness: number,
}

const useDetectOS = () => {
  const [userOSState, setUserOSState] = useState<UserOSState>({
    os: 'LOADING',
    bitness: 86
  })

  useEffect(() => {
    Promise.all([]).then(() => {
      // const userAgent: string | undefined = (typeof navigator === 'object' && navigator.userAgent) || ''
      
      setUserOSState({
        os: detectOS(),
        bitness: 86
      })
    })
  }, [])

  return userOSState;
}

export default useDetectOS;