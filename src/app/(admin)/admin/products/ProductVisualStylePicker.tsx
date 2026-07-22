import { FACTORY_VISUAL_STYLES } from '@/lib/factory-catalog-options'

const fallbackStyle = {
  id: 'blue',
  label: 'Blue',
  iconBg: 'var(--blue-50)',
  iconColor: 'var(--blue-600)',
  swatch: '#2563eb',
}

export default function ProductVisualStylePicker({
  iconBg,
  iconColor,
  onChange,
}: {
  iconBg: string
  iconColor: string
  onChange: (style: { iconBg: string; iconColor: string }) => void
}) {
  const activeStyle =
    FACTORY_VISUAL_STYLES.find(
      (style) => style.iconBg === iconBg && style.iconColor === iconColor,
    ) ?? fallbackStyle

  return (
    <div>
      <div className="form-label">Visual Style</div>
      <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
        {FACTORY_VISUAL_STYLES.map((style) => (
          <button
            key={style.id}
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => onChange({ iconBg: style.iconBg, iconColor: style.iconColor })}
            style={{
              borderColor:
                activeStyle.id === style.id ? 'var(--blue-500)' : 'var(--border-default)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: style.swatch,
                display: 'inline-block',
              }}
            />
            {style.label}
          </button>
        ))}
      </div>
    </div>
  )
}
