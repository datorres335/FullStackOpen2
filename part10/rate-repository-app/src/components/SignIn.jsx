import Text from './Text';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    padding: 20,
    alignItems: 'center', 
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    maxWidth: 800,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorderColor,
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
    fontSize: 16,
    marginBottom: 15,
    // marginTop: 2,
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
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

const SignIn = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
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
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              autoCapitalize="none"
              autoCorrect={false}
              error={touched.username && errors.username}
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
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              error={touched.password && errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignIn;