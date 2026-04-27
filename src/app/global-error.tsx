'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        padding: 'var(--sp-8)',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--fs-3xl)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--sp-4)',
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontSize: 'var(--fs-md)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--sp-6)',
          maxWidth: '480px',
        }}
      >
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: 'var(--sp-3) var(--sp-6)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 'var(--fw-medium)',
          background: 'var(--blue-600)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--blue-700)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'var(--blue-600)')}
      >
        Try again
      </button>
    </div>
  )
}
