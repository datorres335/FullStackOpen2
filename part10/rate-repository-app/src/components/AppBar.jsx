import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Constants from 'expo-constants';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.backgroundColor,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 10,
    marginRight: 20,
    flexShrink: 1, // Allow the tab to shrink if necessary
    flexGrow: 0, // Prevent the tab from growing
    alignSelf: 'flex-start',
  },
  tabText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBarTab = ({ text, to }) => {
  return (
      <Link to={to} component={Pressable} style={styles.tab}>
        <Text style={styles.tabText}>{text}</Text>
      </Link>
  )
};

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab text="Repositories" to="/" />
        <AppBarTab text="Sign In" to="/signin" />
      </ScrollView>
    </View>
  );
};

export default AppBar;