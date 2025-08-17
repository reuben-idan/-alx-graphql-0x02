import { useQuery } from '@apollo/client';
import { GET_EPISODES, type GetEpisodesQuery, type GetEpisodesQueryVariables } from '@/graphql/queries';
import EpisodeCard from '@/components/common/EpisodeCard';
import { useState, useCallback, useMemo } from 'react';
import { FaSpinner } from 'react-icons/fa';

const Home: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  
  const { loading, error, data, refetch } = useQuery<GetEpisodesQuery, GetEpisodesQueryVariables>(
    GET_EPISODES,
    {
      variables: { page },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    }
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(prev => {
      // Prevent page from going below 1 or above total pages
      const nextPage = Math.max(1, newPage);
      const maxPage = data?.episodes.info.pages || 1;
      return Math.min(nextPage, maxPage);
    });
  }, [data?.episodes?.info.pages]);

  const { episodes } = data || {};
  const { results = [], info } = episodes || {};
  const isLoading = loading && !data;

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-[#4CA1AF]" />
          <span className="ml-2 text-lg">Loading episodes...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error loading episodes</h2>
          <p className="text-gray-600">{error.message || 'Please try again later.'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-[#4CA1AF] text-white px-4 py-2 rounded hover:bg-[#3D8B9B] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!results?.length) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-700">No episodes found</h2>
          <p className="text-gray-500">Try a different page or check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((episode) => (
          <EpisodeCard
            key={episode.id}
            id={episode.id}
            name={episode.name}
            air_date={episode.air_date}
            episode={episode.episode}
          />
        ))}
      </div>
    );
  }, [isLoading, error, results, refetch]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#A3D5E0] to-[#F4F4F4] text-gray-800">
      <header className="bg-[#4CA1AF] text-white py-6 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-wide">Rick and Morty Episodes</h1>
        <p className="mt-2 text-lg italic">Explore the multiverse of adventures!</p>
      </header>

      <main className="flex-grow p-6">
        {renderContent}

        {info && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className={`flex items-center px-4 py-2 rounded-lg shadow-lg transition-all ${
                page <= 1 || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#45B69C] text-white hover:bg-[#3D9B80] hover:scale-105'
              }`}
            >
              Previous
            </button>
            
            <span className="text-gray-700 font-medium">
              Page {page} of {info.pages}
            </span>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!info.next || isLoading}
              className={`flex items-center px-4 py-2 rounded-lg shadow-lg transition-all ${
                !info.next || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#45B69C] text-white hover:bg-[#3D9B80] hover:scale-105'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <footer className="bg-[#4CA1AF] text-white py-4 text-center shadow-md">
        <p>&copy; {new Date().getFullYear()} Rick and Morty Fan Page</p>
      </footer>
    </div>
  );
};

export default Home;
