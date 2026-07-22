function updateArrayItem(items: string[], index: number, value: string) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item))
}

export default function ProductTextListEditor({
  items,
  label,
  onChange,
}: {
  items: string[]
  label: string
  onChange: (items: string[]) => void
}) {
  return (
    <div>
      <div className="form-label">{label}</div>
      {items.map((item, index) => (
        <input
          key={`${label}-${index}`}
          className="input"
          style={{ marginBottom: 'var(--sp-2)' }}
          value={item}
          onChange={(event) => onChange(updateArrayItem(items, index, event.target.value))}
        />
      ))}
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        onClick={() => onChange([...items, ''])}
      >
        Add {label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  )
}
