'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { storageGet, storageSet } from '@/lib/storage'
import Link from 'next/link'

export default function HackathonDetailPage() {
  const { slug } = useParams()
  const [detail, setDetail] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const data = storageGet<any>('hackathon_detail')
    if (!data) return
    if (data.slug === slug) {
      setDetail(data)
    } else {
      const extra = data.extraDetails?.find((e: any) => e.slug === slug)
      if (extra) setDetail(extra)
    }
  }, [slug])

  if (!detail) return (
    <div className="text-center py-20 text-gray-400">해커톤 정보를 불러오는 중...</div>
  )

  const tabs = [
    { key: 'overview', label: '개요' },
    { key: 'eval', label: '평가' },
    { key: 'schedule', label: '일정' },
    { key: 'prize', label: '상금' },
    { key: 'teams', label: '팀' },
    { key: 'submit', label: '제출' },
    { key: 'leaderboard', label: '리더보드' },
  ]

  const s = detail.sections

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{detail.title}</h1>

      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <p className="text-gray-700">{s.overview?.summary}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>팀 구성: {s.overview?.teamPolicy?.allowSolo ? '개인 참가 가능' : '팀만 가능'}</span>
            <span>최대 {s.overview?.teamPolicy?.maxTeamSize}인</span>
          </div>
          {s.info?.notice && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-700 mb-2">공지사항</p>
              <ul className="flex flex-col gap-1">
                {s.info.notice.map((n: string, i: number) => (
                  <li key={i} className="text-sm text-blue-600">• {n}</li>
                ))}
              </ul>
            </div>
          )}
          {s.info?.links && (
            <div className="flex gap-4">
              {s.info.links.rules && (
                <a
                  href={s.info.links.rules}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  📋 규정 보기
                </a>
              )}
              {s.info.links.faq && (
                <a
                  href={s.info.links.faq}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ❓ FAQ 보기
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'eval' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <p className="font-semibold text-gray-900">{s.eval?.metricName}</p>
          <p className="text-gray-600 text-sm">{s.eval?.description}</p>
          {s.eval?.limits && (
            <div className="flex gap-4 text-sm text-gray-500">
              <span>최대 실행시간: {s.eval.limits.maxRuntimeSec}초</span>
              <span>일일 제출 횟수: {s.eval.limits.maxSubmissionsPerDay}회</span>
            </div>
          )}
          {s.eval?.scoreDisplay && (
            <div className="flex flex-col gap-3 mt-2">
              <p className="text-sm font-medium text-gray-700">{s.eval.scoreDisplay.label}</p>
              <div className="flex flex-col gap-2">
                {s.eval.scoreDisplay.breakdown?.map((b: any) => (
                  <div key={b.key} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">{b.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${b.weightPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-blue-600 w-10 text-right">{b.weightPercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ul className="flex flex-col gap-4">
            {s.schedule?.milestones?.map((m: any, i: number) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-sm text-gray-500 w-40 shrink-0">{m.at.slice(0, 10)}</span>
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'prize' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col gap-3">
            {s.prize?.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="font-semibold text-gray-800">{item.place}</span>
                <span className="text-blue-600 font-bold">{item.amountKRW.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <TeamsSection slug={slug as string} />
      )}

      {activeTab === 'submit' && (
        <SubmitSection slug={slug as string} sections={s} />
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4">{s.leaderboard?.note}</p>
          <LeaderboardTable slug={slug as string} />
        </div>
      )}
    </div>
  )
}

function TeamsSection({ slug }: { slug: string }) {
  const [teams, setTeams] = useState<any[]>([])
  const [joinTarget, setJoinTarget] = useState<any>(null)
  const [joinIntro, setJoinIntro] = useState('')
  const [joinRequests, setJoinRequests] = useState<Record<string, string>>({})

  useEffect(() => {
    const all = storageGet<any[]>('teams') ?? []
    setTeams(all.filter((t) => t.hackathonSlug === slug))
    const requests = storageGet<Record<string, string>>('join_requests') ?? {}
    setJoinRequests(requests)
  }, [slug])

  function submitJoin() {
    if (!joinTarget || !joinIntro) return
    const updated = { ...joinRequests, [joinTarget.teamCode]: 'pending' }
    storageSet('join_requests', updated)
    setJoinRequests(updated)
    setJoinTarget(null)
  }

  function handleAccept(teamCode: string, requestKey: string) {
    const updated = { ...joinRequests, [requestKey]: 'accepted' }
    storageSet('join_requests', updated)
    setJoinRequests(updated)
  }

  function handleReject(teamCode: string, requestKey: string) {
    const updated = { ...joinRequests, [requestKey]: 'rejected' }
    storageSet('join_requests', updated)
    setJoinRequests(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">이 해커톤에 참가 중인 팀 {teams.length}개</p>
        <Link
          href={`/camp?hackathon=${slug}`}
          className="text-sm text-blue-600 hover:underline"
        >
          팀원 모집 페이지 →
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-200">
          아직 팀이 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.teamCode} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${team.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {team.isOpen ? '모집 중' : '모집 마감'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{team.intro}</p>
              {team.lookingFor?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {team.lookingFor.map((pos: string) => (
                    <span key={pos} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{pos}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">멤버 {team.memberCount}명</span>
                {team.isOpen && (
                  joinRequests[team.teamCode] === 'accepted' ? (
                    <span className="text-xs text-green-600 font-medium">✓ 합류 완료</span>
                  ) : joinRequests[team.teamCode] === 'rejected' ? (
                    <span className="text-xs text-red-400 font-medium">✗ 거절됨</span>
                  ) : joinRequests[team.teamCode] === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(team.teamCode, team.teamCode)}
                        className="text-xs px-2.5 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        수락
                      </button>
                      <button
                        onClick={() => handleReject(team.teamCode, team.teamCode)}
                        className="text-xs px-2.5 py-1 bg-red-400 text-white rounded-lg hover:bg-red-500"
                      >
                        거절
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setJoinTarget(team); setJoinIntro('') }}
                      className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      참여 신청
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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

function SubmitSection({ slug, sections }: { slug: string; sections: any }) {
  const s = sections
  const [submissions, setSubmissions] = useState<Record<string, any>>({})
  const [form, setForm] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const data = storageGet<Record<string, any>>('submissions') ?? {}
    if (data[slug]) {
      setSubmissions(data[slug])
      setSubmitted(true)
    }
  }, [slug])

  function handleSubmit() {
    const hasItems = s.submit?.submissionItems
    if (hasItems) {
      const allFilled = s.submit.submissionItems.every((item: any) => form[item.key])
      if (!allFilled) return alert('모든 항목을 입력해주세요.')
    } else {
      if (!form['file']) return alert('파일명을 입력해주세요.')
    }
    const all = storageGet<Record<string, any>>('submissions') ?? {}
    all[slug] = { ...form, submittedAt: new Date().toISOString() }
    storageSet('submissions', all)
    setSubmissions(all[slug])
    setSubmitted(true)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {s.submit?.guide?.map((g: string, i: number) => (
          <p key={i} className="text-sm text-gray-600">• {g}</p>
        ))}
        <div className="flex gap-2 mt-1">
          {s.submit?.allowedArtifactTypes?.map((t: string) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{t}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        {submitted ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium text-sm">✓ 제출 완료</span>
              <span className="text-xs text-gray-400">{submissions.submittedAt?.slice(0, 16).replace('T', ' ')}</span>
            </div>
            {Object.entries(submissions)
              .filter(([k]) => k !== 'submittedAt')
              .map(([k, v]) => (
                <div key={k} className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">{k}: </span>{v as string}
                </div>
              ))}
            <button
              onClick={() => setSubmitted(false)}
              className="self-start text-xs text-blue-600 hover:underline mt-1"
            >
              수정하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-gray-800">제출하기</p>

            {s.submit?.submissionItems ? (
              <>
                {s.submit.submissionItems.map((item: any) => (
                  <div key={item.key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">{item.title}</label>
                    <input
                      placeholder={item.format === 'url' || item.format === 'pdf_url' ? 'https://' : '내용을 입력하세요'}
                      value={form[item.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">메모 (선택)</label>
                  <textarea
                    placeholder="추가 메모를 입력하세요"
                    value={form['notes'] ?? ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none h-20"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">파일명</label>
                  <input
                    placeholder="제출 파일명 (예: submission.zip)"
                    value={form['file'] ?? ''}
                    onChange={(e) => setForm({ ...form, file: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">메모 (선택)</label>
                  <textarea
                    placeholder="추가 메모를 입력하세요"
                    value={form['notes'] ?? ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none h-20"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              className="self-start px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700"
            >
              제출하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LeaderboardTable({ slug }: { slug: string }) {
  const [entries, setEntries] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<Record<string, any>>({})

  useEffect(() => {
    const data = storageGet<any>('leaderboard')
    if (!data) return
    if (data.hackathonSlug === slug) {
      setEntries(data.entries)
    } else {
      const extra = data.extraLeaderboards?.find((e: any) => e.hackathonSlug === slug)
      if (extra) setEntries(extra.entries)
    }
    const allTeams = storageGet<any[]>('teams') ?? []
    setTeams(allTeams.filter((t) => t.hackathonSlug === slug))
    const subs = storageGet<Record<string, any>>('submissions') ?? {}
    setSubmissions(subs)
  }, [slug])

  const submittedTeamNames = entries.map((e) => e.teamName)
  const unsubmittedTeams = teams.filter((t) => !submittedTeamNames.includes(t.name))

  return (
    <div className="flex flex-col gap-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2 w-12">순위</th>
            <th className="pb-2">팀명</th>
            <th className="pb-2 text-center">세부 점수</th>
            <th className="pb-2 text-right">최종 점수</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-400">제출 내역이 없습니다.</td>
            </tr>
          ) : (
            entries.map((e: any) => (
              <tr key={e.rank} className="border-b border-gray-50">
                <td className="py-2 font-bold text-blue-600">#{e.rank}</td>
                <td className="py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-800">{e.teamName}</span>
                    {e.artifacts && (
                      <div className="flex gap-2 flex-wrap">
                        {e.artifacts.webUrl && (
                          <a href={e.artifacts.webUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline">
                            🔗 웹사이트
                          </a>
                        )}
                        {e.artifacts.pdfUrl && (
                          <a href={e.artifacts.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline">
                            📄 솔루션 PDF
                          </a>
                        )}
                        {e.artifacts.planTitle && (
                          <span className="text-xs text-gray-400">{e.artifacts.planTitle}</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 text-center">
                  {e.scoreBreakdown ? (
                    <div className="flex gap-2 justify-center text-xs text-gray-500">
                      <span>참가자 {e.scoreBreakdown.participant}</span>
                      <span>·</span>
                      <span>심사위원 {e.scoreBreakdown.judge}</span>
                    </div>
                  ) : <span className="text-xs text-gray-300">-</span>}
                </td>
                <td className="py-2 text-right font-semibold">{e.score}</td>
              </tr>
            ))
          )}
          {unsubmittedTeams.map((t) => (
            <tr key={t.teamCode} className="border-b border-gray-50 opacity-40">
              <td className="py-2 text-gray-400">-</td>
              <td className="py-2 text-gray-400">{t.name}</td>
              <td className="py-2 text-right text-xs text-gray-400">미제출</td>
            </tr>
          ))}
        </tbody>
      </table>
      {unsubmittedTeams.length > 0 && (
        <p className="text-xs text-gray-400">* 미제출 팀은 순위에서 제외됩니다.</p>
      )}
    </div>
  )
}