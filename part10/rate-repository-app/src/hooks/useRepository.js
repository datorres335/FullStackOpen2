import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (repositoryId, first) => {
  const [repository, setRepository] = useState();
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORY, {
    variables: { repositoryId, first },
    fetchPolicy: 'cache-and-network',
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    console.log('🔄 Infinite scroll triggered!');
    console.log('📊 Loading:', loading);
    console.log('📄 Has next page:', data?.repository.reviews.pageInfo.hasNextPage);
    console.log('🎯 Can fetch more:', canFetchMore);

    if (!canFetchMore) {
      console.log('❌ Cannot fetch more - returning early');
      return;
    }

    console.log('✅ Fetching more reviews...');
    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        repositoryId,
        first,
      },
    });
  };

  useEffect(() => {
    if (data?.repository) {
      setRepository(data.repository);
      console.log('📝 Reviews loaded:', data.repository.reviews?.edges?.length || 0);
      console.log('🔚 Has next page:', data.repository.reviews?.pageInfo?.hasNextPage);
    }
  }, [data]);

  return {
    repository,
    loading,
    fetchMore: handleFetchMore,
    ...result,
  };
};

export default useRepository;