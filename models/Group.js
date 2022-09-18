const { Schema, model } = require('mongoose');

const GroupSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

// UserSchema.method('toJSON', function() {
//     const { __v, _id, password, ...object } = this.toObject();
//     object.uid = _id;
//     return object;
// });

module.exports = model('Group', GroupSchema );
