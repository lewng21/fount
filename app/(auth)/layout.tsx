export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fount-bg)' }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fount-text)' }}>
            fount
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
            Your AI newsletter agent
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
