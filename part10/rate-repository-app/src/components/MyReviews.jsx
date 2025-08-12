import { useQuery } from '@apollo/client';
import { View, StyleSheet, FlatList } from 'react-native';
import MyReviewItem from './MyReviewItem';
import Text from './Text';
import { ME } from '../graphql/queries';
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
    padding: 20,
  },
  emptyText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.subheading,
    textAlign: 'center',
  },
  separator: {
    height: 10,
    backgroundColor: theme.colors.backgroundColor,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const MyReviews = () => {
  const { data, loading, error, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  const handleDelete = () => {
    refetch();
  };

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
        <Text style={styles.errorText}>Error loading reviews</Text>
      </View>
    );
  }

  const reviews = data?.me?.reviews?.edges?.map(edge => edge.node) || [];

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          You haven&apos;t written any reviews yet.{'\n'}
          Start by reviewing a repository!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={reviews}
      renderItem={({ item }) => <MyReviewItem review={item} onDelete={handleDelete} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default MyReviews;