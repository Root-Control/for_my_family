const uuidv1 = require('uuid/v1');
module.exports = {
  fields: {
    id: {
      type: 'text',
      default: uuidv1()
    }
  },
  key:['id']
}