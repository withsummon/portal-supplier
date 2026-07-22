import type { Dispatch, SetStateAction } from 'react'
import type { ProductFormState } from '@/hooks/use-admin-products'

export default function ProductMediaFields({
  formData,
  replacePitchDeck,
  setFormData,
  setImageFiles,
  setPitchDeckFile,
  setReplacePitchDeck,
}: {
  formData: ProductFormState
  replacePitchDeck: boolean
  setFormData: Dispatch<SetStateAction<ProductFormState>>
  setImageFiles: Dispatch<SetStateAction<File[]>>
  setPitchDeckFile: Dispatch<SetStateAction<File | null>>
  setReplacePitchDeck: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <div style={{ marginTop: 'var(--sp-5)' }}>
        <div className="form-label">Banner Images</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {formData.images.map((image) => (
            <button
              key={image}
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() =>
                setFormData((current) => ({
                  ...current,
                  images: current.images.filter((item) => item !== image),
                }))
              }
            >
              Remove image
            </button>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ marginTop: 'var(--sp-3)' }}
          onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
        />
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        <div className="form-label">Pitch Deck PDF</div>
        {formData.id && (
          <label style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
            <input
              type="checkbox"
              checked={replacePitchDeck}
              onChange={(event) => setReplacePitchDeck(event.target.checked)}
            />
            Replace pitch deck PDF
          </label>
        )}
        {(!formData.id || replacePitchDeck) && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPitchDeckFile(event.target.files?.[0] ?? null)}
          />
        )}
      </div>
    </>
  )
}
