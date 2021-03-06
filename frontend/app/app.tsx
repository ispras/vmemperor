/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 *
 * !!!!
 * If you add a local api query, initialize local api state here!
 * See function initializeCache
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';
// Import all the third party stuff
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';
// Import root app
import App from './containers/App';
// Import Language Provider
import LanguageProvider from './containers/LanguageProvider';
// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./images/icon-72x72.png';
import '!file-loader?name=[name].[ext]!./images/icon-96x96.png';
import '!file-loader?name=[name].[ext]!./images/icon-128x128.png';
import '!file-loader?name=[name].[ext]!./images/icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/icon-192x192.png';
import '!file-loader?name=[name].[ext]!./images/icon-384x384.png';
import '!file-loader?name=[name].[ext]!./images/icon-512x512.png';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
import configureStore from './configureStore';
// Import i18n messages
import {translationMessages} from './i18n';
// Import CSS reset and Global Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './global-styles';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
//Import application-level sagas (login flow)
import appSaga from './containers/App/saga'
//Import apollo
import {ApolloClient} from 'apollo-client';
import {defaultDataIdFromObject, InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';


import {ApolloProvider} from "react-apollo-hooks";

import {ApolloLink, split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {onError} from "apollo-link-error";
// @ts-ignore
import localSchema from './localApi/schema.graphql';
import {resolvers} from "./localApi/resolvers";
import {
  SelectedItemsQueryDocument,
  SelectedItemsQueryQuery,
  SelectedItemsQueryQueryVariables,
  Table
} from "./generated-models";
/* eslint-enable import/no-unresolved, import/extensions */

//Import Yup (for add method)
import * as Yup from 'yup';

import {dataIdFromObject} from './utils/cacheUtils';

//import introspection query for apollo fragment matcher
import introspectionQuery from './introspection-query';

//Init Sentry
import * as Sentry from '@sentry/browser';


Sentry.init({
  dsn: "https://c3fc58777f354afcb23214433e6fcf27@sentry.io/1417093",
  /*integrations: [new Sentry.Integrations.RewriteFrames({
    iteratee: async (frame) => {
      console.log("Sentry frame sent: ", frame);
      return frame;
    }
  })] */
});

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');


function getCookie(name) {
  function escape(s) {
    return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
  }

  const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://${window.location.hostname}:${window.location.port}/api/graphql`,
  credentials: 'same-origin',
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${window.location.hostname}:${window.location.port}/api/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getCookie('user'),
    }
  }
});
//Create a fragment matcher based on introspection query result:
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionQuery
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({query}) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient(
  {
    link: ApolloLink.from(
      [
        onError(({graphQLErrors, networkError}) => {
          if (graphQLErrors)
            graphQLErrors.map(error => {
                console.log(
                  `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
                );
              }
            );
          if (networkError) {
            console.log(`[Network error]: ${networkError}`);
          }

        }),
        link]),
    cache: new InMemoryCache(
      {
        fragmentMatcher,
        dataIdFromObject: dataIdFromObject
      }
    ),
    defaultOptions: {
      mutate: {
        errorPolicy: "none",
      },
      query: {
        errorPolicy: "none"
      },
      watchQuery: {
        errorPolicy: "none",
      }
    },
    typeDefs: localSchema,
    resolvers: resolvers,
  }
);

const initializeCache = () => {
  //VMs table has empty selection
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.VMS},
      data: {selectedItems: []}
    });
  //Network attach table has empty selection
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.NetworkAttach},
      data: {selectedItems: []}
    });
  //Disk attach table has empty selection
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.DiskAttach},
      data: {selectedItems: []}
    });
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.Templates},
      data: {selectedItems: []}
    });
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.Networks},
      data: {selectedItems: []}
    });
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.SRs},
      data: {selectedItems: []}
    });
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.VDIs},
      data: {selectedItems: []}
    });
  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.ISOs},
      data: {selectedItems: []}
    });

  client.cache.writeQuery<SelectedItemsQueryQuery, SelectedItemsQueryQueryVariables>(
    {
      query: SelectedItemsQueryDocument,
      variables: {tableId: Table.Tasks},
      data: {selectedItems: []}
    });

};

initializeCache();


const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <ApolloProvider client={client}>
              <Suspense fallback={<div>Loading...</div>}>
                <div id="react-toast">
                </div>
                <App/>
              </Suspense>
            </ApolloProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </div>
    </Provider>,
    MOUNT_NODE
  );
};

//run login flow saga
store.runSaga(appSaga);

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

declare global {
  interface Window {
    Intl: any,
  }
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
