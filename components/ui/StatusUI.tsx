export function LoadingUI() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  )
}

export function EmptyUI({ message = '데이터가 없습니다' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <span className="text-4xl">📭</span>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}

export function ErrorUI({ message = '오류가 발생했습니다' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="text-red-400 text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-xs text-blue-600 hover:underline"
      >
        새로고침
      </button>
    </div>
  )
}