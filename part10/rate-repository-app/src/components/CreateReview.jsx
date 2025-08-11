import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-native';
import * as yup from 'yup';
import Text from './Text';
import theme from '../theme';
import useCreateReview from '../hooks/useCreateReview';

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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const validationSchema = yup.object().shape({
  ownerName: yup
    .string()
    .required('Repository owner name is required'),
  repositoryName: yup
    .string()
    .required('Repository name is required'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: yup.string(),
});

export const CreateReviewContainer = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a review</Text>
      
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
                touched.ownerName && errors.ownerName && styles.inputError
              ]}
              placeholder="Repository owner name"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.ownerName}
              onChangeText={handleChange('ownerName')}
              onBlur={handleBlur('ownerName')}
              autoCapitalize="none"
              autoCorrect={false}
              testID="ownerNameField"
            />
            {touched.ownerName && errors.ownerName && (
              <Text style={styles.errorText}>{errors.ownerName}</Text>
            )}
            
            <TextInput
              style={[
                styles.input,
                touched.repositoryName && errors.repositoryName && styles.inputError
              ]}
              placeholder="Repository name"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.repositoryName}
              onChangeText={handleChange('repositoryName')}
              onBlur={handleBlur('repositoryName')}
              autoCapitalize="none"
              autoCorrect={false}
              testID="repositoryNameField"
            />
            {touched.repositoryName && errors.repositoryName && (
              <Text style={styles.errorText}>{errors.repositoryName}</Text>
            )}
            
            <TextInput
              style={[
                styles.input,
                touched.rating && errors.rating && styles.inputError
              ]}
              placeholder="Rating between 0 and 100"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.rating}
              onChangeText={handleChange('rating')}
              onBlur={handleBlur('rating')}
              keyboardType="numeric"
              testID="ratingField"
            />
            {touched.rating && errors.rating && (
              <Text style={styles.errorText}>{errors.rating}</Text>
            )}
            
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                touched.text && errors.text && styles.inputError
              ]}
              placeholder="Review"
              placeholderTextColor={styles.placeholderTextColor.color}
              value={values.text}
              onChangeText={handleChange('text')}
              onBlur={handleBlur('text')}
              multiline
              testID="reviewField"
            />
            {touched.text && errors.text && (
              <Text style={styles.errorText}>{errors.text}</Text>
            )}
            
            <Pressable style={styles.button} onPress={handleSubmit} testID="createButton">
              <Text style={styles.buttonText}>Create a review</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

const CreateReview = () => {
  const [createReview] = useCreateReview();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const { createReview: createdReview } = await createReview({
        ownerName,
        repositoryName,
        rating,
        text,
      });

      navigate(`/repositories/${createdReview.repositoryId}`);
    } catch (e) {
      console.log('Review creation failed:', e);
    }
  };

  return <CreateReviewContainer onSubmit={onSubmit} />;
};

export default CreateReview;