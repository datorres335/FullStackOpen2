import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import useSignOut from '../hooks/useSignOut';
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

const AppBarTab = ({ text, to, onPress }) => {
  if (onPress) {
    return (
      <Pressable style={styles.tab} onPress={onPress}>
        <Text style={styles.tabText}>{text}</Text>
      </Pressable>
    );
  }

  return (
    <Link to={to} component={Pressable} style={styles.tab}>
      <Text style={styles.tabText}>{text}</Text>
    </Link>
  );
};

const AppBar = () => {
  const { data } = useQuery(ME);
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab text="Repositories" to="/" />
        {data?.me && (
          <AppBarTab text="Create a review" to="/create-review" />
        )}
        {data?.me ? (
          <AppBarTab text="Sign Out" onPress={handleSignOut} />
        ) : (
          <>
            <AppBarTab text="Sign In" to="/signin" />
            <AppBarTab text="Sign up" to="/signup" />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;