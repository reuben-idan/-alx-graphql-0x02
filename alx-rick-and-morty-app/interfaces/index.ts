export interface InfoProps {
  pages: number
  next: number | null
  prev: number | null
  count: number
}

export interface Episode {
  id: string
  name: string
  air_date: string
  episode: string
}

export interface EpisodesResponse {
  episodes: {
    info: InfoProps
    results: Episode[]
  }
}

export type EpisodeCardProps = Pick<Episode, 'id' | 'name' | 'air_date' | 'episode'>
