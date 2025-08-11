import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { View, StyleSheet, FlatList } from 'react-native';
import RepositoryInfo from './RepositoryInfo';
import ReviewItem from './ReviewItem';
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
  separator: {
    height: 10,
    backgroundColor: theme.colors.backgroundColor,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

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

  const reviews = repository.reviews.edges.map(edge => edge.node);

  return (
    <FlatList
      style={styles.container}
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default SingleRepository;