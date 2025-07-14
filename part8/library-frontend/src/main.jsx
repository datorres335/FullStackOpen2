import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

// const query = gql`
//   query {
//     allBooks {
//       title
//       author {
//         name
//       }
//       published
//       genres
//     }
//   }
// `

// client.query({ query })
//   .then(response => console.log(response.data)); // this sends a query to the server

ReactDOM.createRoot(document.getElementById("root")).render(
 //ApolloProvider makes the Apollo Client available to the rest of your app
 <ApolloProvider client={client}>
    <App />
  </ApolloProvider>  
);
