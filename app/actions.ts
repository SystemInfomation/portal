'use server'

/**
 * Sends a real-time announcement to all connected clients
 * Uses simple polling - completely FREE!
 * 
 * @param message - The announcement message to broadcast
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function sendAnnouncement(message: string): Promise<{success: boolean, error?: string}> {
  try {
    // Validate input
    if (!message || message.trim().length === 0) {
      return { success: false, error: 'Message cannot be empty' }
    }

    if (message.length > 500) {
      return { success: false, error: 'Message must be 500 characters or less' }
    }

    // TODO: Add admin authentication check here
    // Example: const session = await getServerSession()
    // if (!session || !isAdmin(session.user.email)) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    // Send to our simple API endpoint
    const response = await fetch('http://localhost:3000/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to send announcement' }
    }

    console.log('Real-time announcement broadcasted:', message.trim())

    return { success: true }
  } catch (error) {
    console.error('Failed to send announcement:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
