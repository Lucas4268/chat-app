const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    token: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
    },
    tokenNotification: {
        type: String
    },
    online: {
        type: Boolean,
        default: false
    }
});

// UserSchema.method('toJSON', function() {
//     const { __v, _id, password, ...object } = this.toObject();
//     object.uid = _id;
//     return object;
// });

module.exports = model('User', UserSchema );
