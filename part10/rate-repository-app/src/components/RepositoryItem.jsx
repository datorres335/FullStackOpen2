import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4fa1ffff',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row', //Controls the primary axis direction for child elements: 'row' - Children are laid out horizontally (left to right)
    marginBottom: 5,
    backgroundColor: '#ffc2c2ff',
    borderRadius: 8,
    padding: 10,
  },
  avatarContainer: {
    flexGrow: 0, // Defines how much a child should grow relative to other children: 0 - Don't grow (maintain original size) - default
    marginRight: 15,
  },
  contentContainer: {
    flexGrow: 1, // Defines how much a child should grow relative to other children: 1 - Take up remaining space after other flex items have been laid out
    flexShrink: 1, // Defines how much a child should shrink when there's not enough space: 1 - Shrink equally with other flex items - default
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    color: '#240c1dff',
    marginBottom: 10,
  },
  languageContainer: {
    alignSelf: 'flex-start', // Overrides alignItems for individual child: 'flex-start' - Align to the start of the cross axis
    backgroundColor: '#c70000ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    backgroundColor: '#fff1f1ff',
    borderRadius: 8,
    padding: 5,
    boxShadow: '4px 6px 6px rgba(0, 0, 0, 0.5)', //"offsetX offsetY blurRadius color"
    elevation: 3,
  },
  statItem: {
    alignItems: 'center', //alignItems property does the same as justifyContent but for the opposite axis. 
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#586069',
  },
});

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const RepositoryItem = ({ repository }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{repository.fullName}</Text>
          <Text style={styles.descriptionText}>{repository.description}</Text>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>{repository.language}</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{repository.fullName}</Text>
          <Text style={styles.descriptionText}>{repository.description}</Text>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>{repository.language}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatCount(repository.stargazersCount)}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatCount(repository.forksCount)}</Text>
          <Text style={styles.statLabel}>Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{repository.reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{repository.ratingAverage}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );
};

export default RepositoryItem;