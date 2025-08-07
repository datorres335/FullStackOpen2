import { View, StyleSheet, Pressable, Text } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.backgroundColor,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    flexShrink: 1,
    flexGrow: 0,
    alignSelf: 'flex-start',
  },
  tabText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBarTab = ({ text }) => {
  return (
      <Pressable style={styles.tab}>
        <Text style={styles.tabText}>{text}</Text>
      </Pressable>
  )
};

const AppBar = () => {
  return (
    <View style={styles.container}>
      <AppBarTab text="Repositories" />
    </View>
  );
};

export default AppBar;