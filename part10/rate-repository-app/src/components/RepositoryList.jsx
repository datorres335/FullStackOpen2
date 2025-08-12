import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import RepositoryListHeader from './RepositoryListHeader';
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

export const RepositoryListContainer = ({ 
  repositories, 
  selectedOrder, 
  onOrderChange,
  onEndReach 
}) => {
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

  const renderHeader = () => (
    <RepositoryListHeader 
      selectedOrder={selectedOrder}
      onOrderChange={onOrderChange}
    />
  );
  
  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState('latest');

  const getOrderVariables = (order) => {
    switch (order) {
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
      case 'latest':
      default:
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    }
  };

  const orderVariables = getOrderVariables(selectedOrder);
  const { repositories, loading } = useRepositories(orderVariables);

  const onOrderChange = (order) => {
    setSelectedOrder(order);
  };

  return (
    <RepositoryListContainer 
      repositories={repositories}
      selectedOrder={selectedOrder}
      onOrderChange={onOrderChange}
    />
  );
};

export default RepositoryList;