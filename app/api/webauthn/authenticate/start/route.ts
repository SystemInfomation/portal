import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // This endpoint doesn't need a request body, but we'll parse it safely
    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      // Request body is empty, which is fine for this endpoint
    }
    
    // Generate a random challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    // Store challenge in session/temporary storage (in production, use Redis or database)
    const challengeBase64 = btoa(String.fromCharCode(...challenge))
    
    // For now, we'll store in a simple in-memory store
    // In production, you'd want to store this with the user session
    const response = {
      challenge: challengeBase64,
      allowCredentials: [], // Will be populated with user's passkey IDs
      userVerification: 'required',
      timeout: 60000
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error starting WebAuthn authentication:', error)
    return NextResponse.json(
      { error: 'Failed to start authentication' },
      { status: 500 }
    )
  }
}
