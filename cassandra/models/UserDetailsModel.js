const uuidv1 = require('uuid/v1');
module.exports = {
  fields: {
    id: {
      type: 'text',
      default: uuidv1()
    },
      address: {
        type: 'text',
        default: ''
      },
      phone: {
        type: 'text',
        default: ''
      },
      cellphone: {
        type: 'text',
        default: ''
      },
      birthDate: {
        type: 'timestamp',
        default: null
      },
      user: {
        type: 'text',
        rule: {
          required: true
        }
      }
  },
  key:['id']
}