const validator = require('validator');

module.exports = {
  fields: {
    id: {
      type: "uuid",
      default: {"$db_function": "uuid()"}
    },
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
    gender: {
      type: 'text'
    },
    displayName: {
      type: 'text',
      default: function() {
        return this.firstName + ' ' + this.lastName;
      }
    },
    profileImageURL: {
      type: 'text',
      default: '/modules/users/client/img/profile/default.png'
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
    roles: {
      type: 'text'
    },
    token       : 'text',
    groupId     : 'text',
    type        : 'text',
    color       : 'text',
    date        : 'timestamp',
    validDate  : 'timestamp',
    endDate     : 'timestamp',
    SharedPercentage : 'int',
    created: {
      type: 'timestamp',
      default: new Date()
    },
    provider: 'text',
    /* For reset password */
    resetPasswordToken: {
      type: 'text'
    },
    resetPasswordExpires: {
      type: 'timestamp',
      default: null
    }
  },
  key:['id', 'email']
};
