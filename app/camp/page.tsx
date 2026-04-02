'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { storageGet, storageSet } from '@/lib/storage'
import { Team } from '@/lib/types'
import { LoadingUI, EmptyUI, ErrorUI } from '@/components/ui/StatusUI'

interface AIRecommendation {
  teamCode: string
  teamName: string
  reason: string
}

function CampContent() {
  const searchParams = useSearchParams()
  const hackathonFilter = searchParams.get('hackathon') ?? 'all'

  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)
  const [joinTarget, setJoinTarget] = useState<Team | null>(null)
  const [joinIntro, setJoinIntro] = useState('')
  const [joinRequests, setJoinRequests] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [form, setForm] = useState({
    name: '', intro: '', lookingFor: '', contactUrl: '', isOpen: true
  })

  const [aiSkills, setAiSkills] = useState('')
  const [aiTags, setAiTags] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState<AIRecommendation[]>([])
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    try {
      const data = storageGet<Team[]>('teams')
      if (data) setTeams(data)
      else setError(true)
      const requests = storageGet<Record<string, string>>('join_requests') ?? {}
      setJoinRequests(requests)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const filtered = hackathonFilter === 'all'
    ? teams
    : teams.filter((t) => t.hackathonSlug === hackathonFilter)

  function handleCreateTeam() {
    if (!form.name || !form.intro) return
    const newTeam: Team = {
      teamCode: `T-${Date.now()}`,
      hackathonSlug: hackathonFilter === 'all' ? 'unknown' : hackathonFilter,
      name: form.name,
      isOpen: form.isOpen,
      memberCount: 1,
      lookingFor: form.lookingFor.split(',').map((s) => s.trim()).filter(Boolean),
      intro: form.intro,
      contact: { type: 'link', url: form.contactUrl },
      createdAt: new Date().toISOString(),
    }
    const updated = [...teams, newTeam]
    storageSet('teams', updated)
    setTeams(updated)
    setForm({ name: '', intro: '', lookingFor: '', contactUrl: '', isOpen: true })
    setShowForm(false)
  }

  function handleJoin(team: Team) {
    setJoinTarget(team)
    setJoinIntro('')
  }

  function submitJoin() {
    if (!joinTarget || !joinIntro) return
    const updated = { ...joinRequests, [joinTarget.teamCode]: 'pending' }
    storageSet('join_requests', updated)
    setJoinRequests(updated)
    setJoinTarget(null)
  }

  async function handleAIMatch() {
    if (!aiSkills && !aiTags) return
    setAiLoading(true)
    setAiError('')
    setAiResults([])
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: aiSkills, tags: aiTags, teams: filtered }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAiResults(data.recommendations ?? [])
    } catch (e: any) {
      setAiError(e.message ?? 'AI 매칭 중 오류가 발생했습니다.')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return <LoadingUI />
  if (error) return <ErrorUI />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">팀원 모집</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + 팀 만들기
        </button>
      </div>

      {/* AI 매칭 패널 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤖</span>
          <h2 className="font-semibold text-gray-900">AI 팀 매칭</h2>
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">내 기술스택과 관심 태그를 입력하면 AI가 어울리는 팀을 추천해드려요.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            placeholder="기술스택 (예: React, Python, ML)"
            value={aiSkills}
            onChange={(e) => setAiSkills(e.target.value)}
            className="flex-1 border border-blue-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white"
          />
          <input
            placeholder="관심 태그 (예: LLM, VibeCoding)"
            value={aiTags}
            onChange={(e) => setAiTags(e.target.value)}
            className="flex-1 border border-blue-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white"
          />
          <button
            onClick={handleAIMatch}
            disabled={aiLoading || (!aiSkills && !aiTags)}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {aiLoading ? '분석 중...' : '매칭 찾기'}
          </button>
        </div>
        {aiError && <p className="text-sm text-red-500">{aiError}</p>}
        {aiResults.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            {aiResults.map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-blue-100 p-4 flex flex-col gap-2">
                <span className="text-sm font-semibold text-blue-600">#{i + 1} {r.teamName}</span>
                <p className="text-sm text-gray-600">{r.reason}</p>
                {teams.find((t) => t.teamCode === r.teamCode)?.isOpen && (
                  <button
                    onClick={() => {
                      const team = teams.find((t) => t.teamCode === r.teamCode)
                      if (team) handleJoin(team)
                    }}
                    className="self-start text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    바로 참여 신청 →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 팀 생성 폼 */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 mb-8 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">새 팀 만들기</h2>
          <input
            placeholder="팀명 *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <textarea
            placeholder="팀 소개 *"
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none h-24"
          />
          <input
            placeholder="모집 포지션 (쉼표로 구분, 예: Frontend, ML Engineer)"
            value={form.lookingFor}
            onChange={(e) => setForm({ ...form, lookingFor: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <input
            placeholder="연락 링크 (오픈카톡 또는 폼 URL)"
            value={form.contactUrl}
            onChange={(e) => setForm({ ...form, contactUrl: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
            />
            모집 중
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCreateTeam}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700"
            >
              생성
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 팀 리스트 */}
      {filtered.length === 0 ? (
        <EmptyUI message="팀이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((team) => (
            <div key={team.teamCode} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{team.name}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  team.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {team.isOpen ? '모집 중' : '모집 마감'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{team.intro}</p>
              {team.lookingFor.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {team.lookingFor.map((pos) => (
                    <span key={pos} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {pos}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">멤버 {team.memberCount}명</span>
                <div className="flex items-center gap-2">
                  {team.contact?.url && (
                    <a
                      href={team.contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      연락하기
                    </a>
                  )}
                  {team.isOpen && (
                    joinRequests[team.teamCode] ? (
                      <span className="text-xs text-green-600 font-medium">신청 완료</span>
                    ) : (
                      <button
                        onClick={() => handleJoin(team)}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        참여 신청
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 참여 신청 모달 */}
      {joinTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">"{joinTarget.name}" 팀에 참여 신청</h2>
            <textarea
              placeholder="자기소개를 작성해주세요 *"
              value={joinIntro}
              onChange={(e) => setJoinIntro(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none h-32"
            />
            <div className="flex gap-2">
              <button
                onClick={submitJoin}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700"
              >
                신청하기
              </button>
              <button
                onClick={() => setJoinTarget(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CampPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">로딩 중...</div>}>
      <CampContent />
    </Suspense>
  )
}