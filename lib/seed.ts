import { storageGet, storageSet } from './storage'
import hackathonsData from '@/data/public_hackathons.json'
import hackathonDetailData from '@/data/public_hackathon_detail.json'
import teamsData from '@/data/public_teams.json'
import leaderboardData from '@/data/public_leaderboard.json'

export function initSeedData(): void {
  if (storageGet('seeded')) return

  storageSet('hackathons', hackathonsData)
  storageSet('hackathon_detail', hackathonDetailData)
  storageSet('teams', teamsData)
  storageSet('leaderboard', leaderboardData)
  storageSet('join_requests', [])

  storageSet('seeded', true)
}