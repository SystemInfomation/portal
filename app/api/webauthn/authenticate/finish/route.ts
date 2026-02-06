import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://blakeflyz1_db_user:lBb6oiFNK7lhcY5r@forsythcountychat.0rcvols.mongodb.net/?appName=ForsythCountyChat"
const client = new MongoClient(uri)

async function verifyCredential(credential: any, expectedChallenge: string) {
  try {
    // In a real implementation, you'd verify the credential signature
    // For now, we'll do basic validation
    if (!credential.id || !credential.response) {
      return false
    }
    
    // For testing purposes, accept any credential with a valid format
    // In production, you'd verify the actual signature against the stored public key
    console.log('Mock verification for credential:', credential.id)
    
    // Check if this credential exists in your database as an admin passkey
    await client.connect()
    const database = client.db("forsythcountychat")
    const adminPasskeys = database.collection("adminPasskeys")
    
    const passkey = await adminPasskeys.findOne({ 
      credentialId: credential.id,
      isActive: true
    })
    
    // For testing, also accept mock credentials
    if (!passkey && credential.id.includes('mock') || credential.id.startsWith('localhost')) {
      console.log('Accepting mock credential for testing')
      return true
    }
    
    if (!passkey) {
      console.log('No admin passkey found for credential:', credential.id)
      return false
    }
    
    // In production, you'd verify the assertion signature here
    // For now, we'll just check if the passkey exists
    
    return true
  } catch (error) {
    console.error('Error verifying credential:', error)
    return false
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    const { credential, challenge } = body
    
    if (!credential || !challenge) {
      return NextResponse.json(
        { error: 'Missing credential or challenge' },
        { status: 400 }
      )
    }
    
    // Verify the credential
    const isValid = await verifyCredential(credential, challenge)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credential or not authorized' },
        { status: 401 }
      )
    }
    
    // Generate a session token for the bypass
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Store session token (in production, use Redis or database)
    // For now, we'll return it directly
    
    return NextResponse.json({
      success: true,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      message: 'Admin bypass granted'
    })
    
  } catch (error) {
    console.error('Error finishing WebAuthn authentication:', error)
    return NextResponse.json(
      { error: 'Failed to complete authentication' },
      { status: 500 }
    )
  }
}
