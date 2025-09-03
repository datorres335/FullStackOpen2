import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split } from "@apollo/client"
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000'
})

const wsLink = new GraphQLWsLink(createClient({ 
  url: import.meta.env.VITE_GRAPHQL_WS_URI || 'ws://localhost:4000',
  connectionParams: () => {
    const token = localStorage.getItem('library-user-token')
    return {
      authorization: token ? `Bearer ${token}` : null,
    }
  }
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.createRoot(document.getElementById("root")).render(
 //ApolloProvider makes the Apollo Client available to the rest of your app
 <ApolloProvider client={client}>
    <App />
  </ApolloProvider>  
);
