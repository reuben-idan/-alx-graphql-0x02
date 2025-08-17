import { gql } from '@apollo/client';

export const GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        air_date
        episode
      }
    }
  }
`;

export interface GetEpisodesQuery {
  episodes: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Array<{
      id: string;
      name: string;
      air_date: string;
      episode: string;
    }>;
  };
}

export interface GetEpisodesQueryVariables {
  page: number;
}
