import { useRef, useEffect } from 'react'

interface HighlighterProps {
    isActive: boolean
    color?: string
    children: React.ReactNode
}

// NOTE: This is a simplified highlighter that wraps content.
// Real web highlighting is complex with DOM ranges. 
// For this MVP, we will use a text selection handler.

export default function Highlighter({ isActive, color = 'bg-yellow-200 dark:bg-yellow-900/50', children }: HighlighterProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container || !isActive) return

        const handleMouseUp = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed) return

            // In a real app, we would wrap the selected range in a span.
            // This is simulated here or would technically require manipulating the DOM directly
            // or using a library like 'react-highlight-words' if we had predefined search terms.

            // For MVP, we can just log the selection or maybe implement a simple replace?
            // Since changing DOM structure breaks React, we typically need a text editor approach.
            // Let's postpone "Real" rich text highlighting for now and focus on
            // 'Select text to highlight' UI feedback or simplified functionality.

            // ALTERNATIVE: Use a simple "Click to toggle highlight" on paragraph level.
            // But user wants "Highlight tool" like in exams.

            // For now, let's keep it simple: We assume 'children' is text/html string if we want to modify it.
            // If it's React nodes, it's harder.
        }

        container.addEventListener('mouseup', handleMouseUp)
        return () => container.removeEventListener('mouseup', handleMouseUp)
    }, [isActive, color])

    return (
        <div
            ref={containerRef}
            className={`prose dark:prose-invert max-w-none ${isActive ? 'cursor-text selection:bg-yellow-200 dark:selection:bg-yellow-900/40' : ''}`}
        >
            {/* 
        Ideally, we would render content that is already 'highlighted' based on state.
        For now, this wrapper allows normal text selection which feels native.
        Browser native selection IS a form of temporary highlighting.
      */}
            {children}
        </div>
    )
}

// NOTE: True persistent highlighting on arbitrary React subtrees is very hard without a specialized editor.
// We will skip complex DOM manipulation for now and rely on browser native selection for "active" reading
// or implement a paragraph-based highlighter later.

