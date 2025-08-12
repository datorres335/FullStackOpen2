import { View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#f6f8fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5da',
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#f6f8fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5da',
  },
  pickerItem: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});

const RepositoryListHeader = ({ 
  selectedOrder, 
  onOrderChange, 
  searchKeyword, 
  onSearchKeywordChange 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search repositories..."
        placeholderTextColor="#999999"
        value={searchKeyword}
        onChangeText={onSearchKeywordChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Picker
        selectedValue={selectedOrder}
        onValueChange={onOrderChange}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        prompt="Select an item..."
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
    </View>
  );
};

export default RepositoryListHeader;