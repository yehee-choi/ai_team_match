'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { storageGet } from '@/lib/storage'
import { Hackathon } from '@/lib/types'
import { LoadingUI, EmptyUI, ErrorUI } from '@/components/ui/StatusUI'

const STATUS_LABEL: Record<string, string> = {
  ongoing: '진행 중',
  upcoming: '예정',
  ended: '종료',
}

const STATUS_COLOR: Record<string, string> = {
  ongoing: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  ended: 'bg-gray-100 text-gray-500',
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const data = storageGet<Hackathon[]>('hackathons')
      if (data) setHackathons(data)
      else setError(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const allTags = Array.from(new Set(hackathons.flatMap((h) => h.tags)))

  const filtered = hackathons.filter((h) => {
    const matchStatus = statusFilter === 'all' || h.status === statusFilter
    const matchTag = tagFilter === 'all' || h.tags.includes(tagFilter)
    return matchStatus && matchTag
  })

  if (loading) return <LoadingUI />
  if (error) return <ErrorUI />

  return (

    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">해커톤 목록</h1>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="flex gap-2">
          {['all', 'ongoing', 'upcoming', 'ended'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${statusFilter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
            >
              {s === 'all' ? '전체' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${tagFilter === tag
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
            >
              {tag === 'all' ? '전체 태그' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <EmptyUI message="해당하는 해커톤이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h) => (
            <Link
              key={h.slug}
              href={`/hackathons/${h.slug}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[h.status]}`}>
                  {STATUS_LABEL[h.status]}
                </span>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs text-gray-400">
                    ~ {h.period.endAt.slice(0, 10)}
                  </span>
                  {h.period.submissionDeadlineAt && (
                    <span className="text-xs text-orange-400">
                      제출 {h.period.submissionDeadlineAt.slice(0, 10)}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="font-semibold text-gray-900 leading-snug">{h.title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {h.tags.map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}