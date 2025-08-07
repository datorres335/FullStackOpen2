import Text from './Text';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
  },
  text: {
    color: theme.colors.textWhite,
  }
});

const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>The sign-in view</Text>
    </View>
  );
};

export default SignIn;