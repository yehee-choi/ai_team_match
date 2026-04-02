'use client'

import { useEffect, useState } from 'react'
import { storageGet } from '@/lib/storage'
import { LoadingUI, EmptyUI, ErrorUI } from '@/components/ui/StatusUI'

const PERIOD_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '최근 30일', value: '30' },
  { label: '최근 7일', value: '7' },
]

export default function RankingsPage() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [entries, setEntries] = useState<any[]>([])
  const [period, setPeriod] = useState('all')

  const [hackathonFilter, setHackathonFilter] = useState('all')
  const [hackathonSlugs, setHackathonSlugs] = useState<string[]>([])
  useEffect(() => {
    try {
      const leaderboard = storageGet<any>('leaderboard')
      if (!leaderboard) {
        setError(true)
        return
      }
      const all = [
        ...leaderboard.entries.map((e: any) => ({ ...e, hackathonSlug: leaderboard.hackathonSlug })),
        ...(leaderboard.extraLeaderboards?.flatMap((lb: any) =>
          lb.entries.map((e: any) => ({ ...e, hackathonSlug: lb.hackathonSlug }))
        ) ?? []),
      ]
      const slugs = Array.from(new Set([
        leaderboard.hackathonSlug,
        ...(leaderboard.extraLeaderboards?.map((lb: any) => lb.hackathonSlug) ?? [])
      ]))
      setHackathonSlugs(slugs)

      const now = new Date()
      const filtered = all.filter((e) => {
        const matchPeriod = period === 'all' ||
          ((now.getTime() - new Date(e.submittedAt).getTime()) / (1000 * 60 * 60 * 24)) <= parseInt(period)
        const matchHackathon = hackathonFilter === 'all' || e.hackathonSlug === hackathonFilter
        return matchPeriod && matchHackathon
      })
      //x


      const sorted = filtered.sort((a, b) => b.score - a.score)
      const ranked = sorted.map((e, i) => ({ ...e, rank: i + 1 }))
      setEntries(ranked)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [period, hackathonFilter])

  if (loading) return <LoadingUI />
  if (error) return <ErrorUI />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">랭킹</h1>

      <div className="flex gap-2 mb-8">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${period === opt.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', ...hackathonSlugs].map((slug) => (
          <button
            key={slug}
            onClick={() => setHackathonFilter(slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${hackathonFilter === slug
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
          >
            {slug === 'all' ? '전체 해커톤' : slug}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyUI message="랭킹 데이터가 없습니다" />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium w-16">순위</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">팀명</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">해커톤</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">점수</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {e.rank <= 3 ? (
                      <span className="text-lg">{e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : '🥉'}</span>
                    ) : (
                      <span className="font-medium text-gray-500">#{e.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{e.teamName}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{e.hackathonSlug}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{e.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}