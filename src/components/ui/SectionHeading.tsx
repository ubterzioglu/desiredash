interface SectionHeadingProps {
  id?: string
  title: string
  description?: string
}

export default function SectionHeading({
  id,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-1 border-b border-canvas-border pb-3 pl-3" style={{ borderLeft: '3px solid #F5A500' }}>
      <h2 id={id} className="text-lg font-semibold text-ink-primary">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-sm text-ink-muted">
          {description}
        </p>
      )}
    </div>
  )
}
