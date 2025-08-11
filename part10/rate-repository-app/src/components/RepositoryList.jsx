import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.primary,
  },
  repositoryContainer: {
    backgroundColor: 'transparent',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories }) => {
  const navigate = useNavigate();

  // Get the nodes from the edges array
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  const renderItem = ({ item }) => (
    <Pressable 
      style={styles.repositoryContainer}
      onPress={() => navigate(`/repositories/${item.id}`)}
    >
      <RepositoryItem repository={item} showGitHubButton={false} />
    </Pressable>
  );
  
  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const RepositoryList = () => {
  const { repositories } = useRepositories();

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;