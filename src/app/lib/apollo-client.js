import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from 'js-cookie';

// Define the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql", // Replace with your API endpoint
});

// Add the token to the headers
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from localStorage or any other storage
  // const token = localStorage.getItem("authToken");

  let token = Cookies.get("authToken");

  // Return the headers with the token
  return {
    headers: {
      ...headers,
      authorization: token,
      // authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGYzMGNjNjlkMGE0NzQ4NWFiNGMyZiIsImlhdCI6MTczNDM2NjkwMH0.7tpBCdLw15t6l1Jo0SmFqdMotjj3ASmOG3z1LDrpkL0",
    },
  };
});

// Combine the authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
