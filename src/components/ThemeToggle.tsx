"use client"

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/src/components/UIBase/Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Toggle theme
    </Button>
  )
}