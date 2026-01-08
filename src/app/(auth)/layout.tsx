export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-white p-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
