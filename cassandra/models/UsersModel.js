const validator = require('validator');

module.exports = {
  fields: {
    id: 'text',
    firstName: {
      type: 'text',
      rule: {
          required: true
      }
    },
    lastName: {
      type: 'text',
      rule: {
        required: true
      }
    },
    displayName: {
      type: 'text',
      rule: {
        required: true
      }
    },
    username: {
      type: 'text',
      rule: {
        required: true
      }
    },
    email: {
      type: 'text',
      rule: {
        required: true,
        validator: function(email) { return validator.isEmail(email, { require_tld: false }) }
      }
    },
    password: {
      type: 'text',
      rule: {
        required: true
      }
    },
    isAdmin: {
      type: 'int',
      default: 0,
    },
    token       : 'text',
    groupId     : 'text',
    type        : 'text',
    color       : 'text',
    date        : 'timestamp',
    validDDate  : 'timestamp',
    endDate     : 'timestamp',
    SharedPercentage : 'int',
    created: 'timestamp',
    provider: 'text'
  },
  key:['id']
};