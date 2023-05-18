const set = require('lodash/set');
const get = require('lodash/get');
const uuid = require('uuid/v1');
const mock = require('../../mock');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  Query: {
    messages: (parent, { roomName }) => {
      const messages = get(mock, `rooms.${roomName}.messages`, []);
      return messages;
    },
    roomExists: (parent, { roomName }) => {
      const room = get(mock, `rooms.${roomName}`, {});
      return room.messages != undefined;
    },
  },

  Mutation: {
    sendMessage: (parent, { roomName, message, name }) => {
      const newMessage = { id: uuid(), body: message, from: { name: name } };
      set(mock, `rooms.${roomName}.messages`, [
        ...get(mock, `rooms.${roomName}.messages`, []),
        newMessage,
      ]);
      pubsub.publish('NEW_MESSAGE', { newMessage });

      return {
        successful: true,
      };
    },
    createRoom: (parent, { roomName }) => {
      if (get(mock, `rooms.${roomName}`)) {
        return {
          successful: false,
        };
      }

      set(mock, `rooms.${roomName}`, { messages: [] });

      return {
        successful: true,
      };
    },
  },
  Subscription: {
    newMessage: {
      subscribe: (_, { roomName }, { pubsub }) => {
        return pubsub.asyncIterator('NEW_MESSAGE');
      },
      resolve: (payload) => {
        return payload.newMessage;
      },
    },
  },
};
