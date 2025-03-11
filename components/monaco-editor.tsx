"use client"

import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[600px] bg-muted">
      Loading editor...
    </div>
  ),
})

export default MonacoEditor 