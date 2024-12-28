"use client"
import React from 'react'
import { ApolloProvider } from "@apollo/client";
import client from '@/app/lib/apollo-client';
import { Provider } from 'react-redux';
import store from '@/app/redux/store';

const ProviderApollo = ({ children }) => {
    return <Provider store={store}><ApolloProvider client={client}>{children}</ApolloProvider></Provider>
}

export default ProviderApollo
