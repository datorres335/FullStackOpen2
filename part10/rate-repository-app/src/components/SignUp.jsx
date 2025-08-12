import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';
import Text from './Text';
import theme from '../theme';
import useSignUp from '../hooks/useSignUp';
import useSignIn from '../hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5da',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: theme.colors.errorState,
  },
  errorText: {
    color: theme.colors.errorState,
    fontSize: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textWhite,
    textAlign: 'center',
    marginTop: 20,
  },
  placeholderTextColor: {
    color: '#999999',
  },
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

export const SignUpContainer = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      
      <Formik 
        initialValues={initialValues} 
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                touched.username && errors.username && styles.inputError
              ]}
              placeholder="Username"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              autoCapitalize="none"
              autoCorrect={false}
              testID="usernameField"
            />
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
            
            <TextInput
              style={[
                styles.input,
                touched.password && errors.password && styles.inputError
              ]}
              placeholder="Password"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              testID="passwordField"
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            
            <TextInput
              style={[
                styles.input,
                touched.passwordConfirmation && errors.passwordConfirmation && styles.inputError
              ]}
              placeholder="Password confirmation"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.passwordConfirmation}
              onChangeText={handleChange('passwordConfirmation')}
              onBlur={handleBlur('passwordConfirmation')}
              secureTextEntry
              testID="passwordConfirmationField"
            />
            {touched.passwordConfirmation && errors.passwordConfirmation && (
              <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
            )}
            
            <Pressable style={styles.button} onPress={handleSubmit} testID="signUpButton">
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

const SignUp = () => {
  const [signUp] = useSignUp();
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signUp({ username, password });
      await signIn({ username, password });
      navigate('/');
    } catch (e) {
      console.log('Sign up failed:', e);
      
      if (e.message.includes('USERNAME_TAKEN')) {
        alert('Username is already taken. Please choose another username.');
      } else {
        alert('Sign up failed. Please try again.');
      }
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;