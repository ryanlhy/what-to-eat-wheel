import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        
        const response = await fetch(process.env.FOOD_RECOMMENDATION_API!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in recommendations API:', error)
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        )
    }
} 