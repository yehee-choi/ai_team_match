import { storageGet, storageSet } from './storage'
import hackathonsData from '@/data/public_hackathons.json'
import hackathonDetailData from '@/data/public_hackathon_detail.json'
import teamsData from '@/data/public_teams.json'
import leaderboardData from '@/data/public_leaderboard.json'

const SEED_VERSION = 2  // ← 앞으로 데이터 바뀔 때 숫자만 올리기

export function initSeedData(): void {
  const currentVersion = storageGet<number>('seed_version')
  if (currentVersion === SEED_VERSION) return

  storageSet('hackathons', hackathonsData)
  storageSet('hackathon_detail', hackathonDetailData)
  storageSet('teams', teamsData)
  storageSet('leaderboard', leaderboardData)
  storageSet('join_requests', [])

  storageSet('seed_version', SEED_VERSION)
  storageSet('seeded', true)
}