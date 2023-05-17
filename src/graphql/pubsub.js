// import { PubSub } from 'apollo-server';
// export const pubsub = new PubSub();

const { PubSub, gql } = require('apollo-server');
const pubsub = new PubSub();

module.exports = pubsub;
