import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },

    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const userModel = mongoose.model('userSchema', userSchema);
export default userModel;