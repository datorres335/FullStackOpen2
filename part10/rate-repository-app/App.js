import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () => {
  return (
    <>
      <NativeRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ApolloProvider client={apolloClient}>
          <Main />
        </ApolloProvider>
      </NativeRouter>
      <StatusBar style="auto" />
      {/* The StatusBar component is used to control the appearance of the status bar on iOS and Android devices. 
          Here, it is set to 'auto', which means it will adapt to the current theme of the app. */}
      {/* This is useful for ensuring that the status bar text color contrasts well with the background color of the app. */}
    </>
  );
};

export default App;