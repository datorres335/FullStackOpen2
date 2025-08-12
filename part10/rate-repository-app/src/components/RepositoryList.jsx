import React from 'react';
import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
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

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const props = this.props;

    return (
      <RepositoryListHeader 
        selectedOrder={props.selectedOrder}
        onOrderChange={props.onOrderChange}
        searchKeyword={props.searchKeyword}
        onSearchKeywordChange={props.onSearchKeywordChange}
      />
    );
  };

  render() {
    const { repositories, onEndReach } = this.props;

    // Get the nodes from the edges array
    const repositoryNodes = repositories
      ? repositories.edges.map(edge => edge.node)
      : [];

    const renderItem = ({ item }) => (
      <Pressable 
        style={styles.repositoryContainer}
        onPress={() => this.props.navigate(`/repositories/${item.id}`)}
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
        ListHeaderComponent={this.renderHeader}
        onEndReached={onEndReach}
        onEndReachedThreshold={0.5}
      />
    );
  }
}

const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  // Debounce the search keyword with 300ms delay
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 300);

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

  const variables = {
    ...orderVariables,
    searchKeyword: debouncedSearchKeyword || undefined,
  };

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    ...variables,
  });

  const onEndReach = () => {
    fetchMore();
  };

  const onOrderChange = (order) => {
    setSelectedOrder(order);
  };

  const onSearchKeywordChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <RepositoryListContainer 
      repositories={repositories}
      selectedOrder={selectedOrder}
      onOrderChange={onOrderChange}
      searchKeyword={searchKeyword}
      onSearchKeywordChange={onSearchKeywordChange}
      navigate={navigate}
      onEndReach={onEndReach}
    />
  );
};

export default RepositoryList;