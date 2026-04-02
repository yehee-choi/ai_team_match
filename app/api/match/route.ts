import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { skills, tags, teams } = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `
당신은 해커톤 팀 매칭 전문가입니다.
아래 사용자 정보와 팀 목록을 분석해서 가장 잘 맞는 팀 최대 3개를 추천해주세요.

사용자 기술스택: ${skills || '없음'}
관심 태그: ${tags || '없음'}

팀 목록:
${JSON.stringify(teams, null, 2)}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{
  "recommendations": [
    {
      "teamCode": "팀코드",
      "teamName": "팀이름",
      "reason": "추천 이유를 2-3문장으로 설명"
    }
  ]
}
          `,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const result = JSON.parse(text)
    return Response.json(result)
  } catch (error) {
    console.error('AI match error:', error)
    return Response.json({ error: 'AI 매칭 중 오류가 발생했습니다.' }, { status: 500 })
  }
}