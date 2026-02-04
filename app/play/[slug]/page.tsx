import { games } from '@/data/games'
import { utilities } from '@/data/utilities'
import PlayPageClient from './PlayPageClient'

// Generate static params for all games and utilities
// This is required for static export (GitHub Pages)
export function generateStaticParams() {
  const gameParams = games.map((game) => ({
    slug: game.id,
  }))
  
  const utilityParams = utilities.map((utility) => ({
    slug: utility.id,
  }))
  
  return [...gameParams, ...utilityParams]
}

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PlayPageClient slug={slug} />
}
