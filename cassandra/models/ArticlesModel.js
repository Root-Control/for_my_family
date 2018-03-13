const uuidv1 = require('uuid/v1');
module.exports = {
    fields: {
      id: {
        type: 'text',
        default: uuidv1()
      },
        created: 'timestamp',
        title: 'text',
        content: 'text',
        user: 'text'
    },
    key:['id']
}