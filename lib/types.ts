export interface Hackathon {
  slug: string
  title: string
  status: 'ongoing' | 'ended' | 'upcoming'
  tags: string[]
  thumbnailUrl: string
  period: {
    timezone: string
    submissionDeadlineAt: string
    endAt: string
  }
  links: {
    detail: string
    rules: string
    faq: string
  }
}

export interface Team {
  teamCode: string
  hackathonSlug: string
  name: string
  isOpen: boolean
  memberCount: number
  lookingFor: string[]
  intro: string
  contact: {
    type: string
    url: string
  }
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  teamName: string
  score: number
  submittedAt: string
  scoreBreakdown?: {
    participant: number
    judge: number
  }
}

export interface Leaderboard {
  hackathonSlug: string
  updatedAt: string
  entries: LeaderboardEntry[]
}

export interface JoinRequest {
  id: string
  teamCode: string
  intro: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface AIMatchResult {
  teamCode: string
  reason: string
}