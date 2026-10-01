import React from 'react'

export default function ErrorMessage({ children }) {
  if (!children) return null
  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm px-3 py-2"
    >
      {children}
    </div>
  )
}
