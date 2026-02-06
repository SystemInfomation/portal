import { NextRequest, NextResponse } from 'next/server'
export const revalidate = 0;

// Simple in-memory storage (resets on server restart)
let currentAnnouncement: { message: string; timestamp: number } | null = null

export async function GET() {
  return NextResponse.json({ 
    announcement: currentAnnouncement,
    timestamp: Date.now()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message must be 500 characters or less' }, { status: 400 })
    }
    
    // Store the announcement
    currentAnnouncement = { 
      message: message.trim(), 
      timestamp: Date.now() 
    }
    
    console.log('Real-time announcement stored:', message.trim())
    
    return NextResponse.json({ 
      success: true, 
      message: 'Announcement stored successfully',
      announcement: currentAnnouncement
    })
  } catch (error) {
    console.error('Error storing announcement:', error)
    return NextResponse.json({ error: 'Failed to store announcement' }, { status: 500 })
  }
}
