const set = require('lodash/set');
const get = require('lodash/get');
const uuid = require('uuid/v1');
const mock = require('../../mock');

module.exports = {
  Query: {
    messages: (parent, { roomName }) => {
      const messages = get(mock, `rooms.${roomName}.messages`, []);
      return messages;
    },
  },
  Mutation: {
    sendMessage: (parent, { roomName, message, name }) => {
      set(mock, `rooms.${roomName}`, {
        messages: [
          ...get(mock, `rooms.${roomName}.messages`, []),
          { id: uuid(), body: message, from: { name: name } },
        ],
      });
      return {
        successful: true,
      };
    },
  },
};
