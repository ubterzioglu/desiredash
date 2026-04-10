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
    <div className="space-y-1">
      <h2 id={id} className="text-lg font-semibold text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-sm text-gray-500">
          {description}
        </p>
      )}
    </div>
  )
}
