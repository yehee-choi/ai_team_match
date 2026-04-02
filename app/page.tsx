import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">AI 팀 매치</h1>
        <p className="text-lg text-gray-500">해커톤 팀을 AI가 찾아드립니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link href="/hackathons" className="group flex flex-col items-center gap-3 p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
          <span className="text-4xl">🏆</span>
          <span className="font-semibold text-gray-800 group-hover:text-blue-600">해커톤 보러가기</span>
          <span className="text-sm text-gray-400">진행 중인 대회 탐색</span>
        </Link>

        <Link href="/camp" className="group flex flex-col items-center gap-3 p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
          <span className="text-4xl">🤝</span>
          <span className="font-semibold text-gray-800 group-hover:text-blue-600">팀 찾기</span>
          <span className="text-sm text-gray-400">AI 매칭으로 팀 합류</span>
        </Link>

        <Link href="/rankings" className="group flex flex-col items-center gap-3 p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
          <span className="text-4xl">📊</span>
          <span className="font-semibold text-gray-800 group-hover:text-blue-600">랭킹 보기</span>
          <span className="text-sm text-gray-400">전체 참가자 순위</span>
        </Link>
      </div>
    </div>
  )
}