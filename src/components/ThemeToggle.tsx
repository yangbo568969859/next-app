"use client"

import * as React from 'react'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/src/components/UIBase/Button'
import { Icons } from '@/src/components/UIBase/Icons'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme || 'light');
  }, [])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}