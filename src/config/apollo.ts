import { ApolloClient, HttpLink } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { ENV } from './env';

const client = new ApolloClient({
  link: new HttpLink({ uri: ENV.GQL_URL }),
  cache: new InMemoryCache(),
});

export default client;
