import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import { GET_REPOSITORY } from '../graphql/queries';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
  },
  loadingText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.subheading,
  },
  errorText: {
    color: theme.colors.errorState,
    fontSize: theme.fontSizes.subheading,
  },
});

const SingleRepository = () => {
  const { repositoryId } = useParams();
  
  const { data, loading, error } = useQuery(GET_REPOSITORY, {
    variables: { repositoryId },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading repository</Text>
      </View>
    );
  }

  const repository = data?.repository;

  if (!repository) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Repository not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RepositoryItem repository={repository} showGitHubButton={true} />
    </View>
  );
};

export default SingleRepository;