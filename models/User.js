import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        username:  {required: true, type: String},
        password: {index: true, required:true, type:String},
        email: {index: true, required:true, type:String, unique: true},
        phone: {
            required: false,
            type:String, 
            validate: {
                validator: async function(phone) {
                    const user = await this.constructor.findOne({ phone });
                    if(user) {
                        if(this.id === user.id) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                },
                message: props => 'The specified phone number is already associated with an account.'
            }
        },
        primaryContact: {index: true, required:true, type:String, enum : ['phone', 'email'], default: 'email'},
        phoneConfirmed: {index: true, required:true, type:Boolean, default: false},
        emailConfirmed: {index: true, required:true, type:Boolean, default: false},
        avatar: {type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
        wantsSpam: {type: Boolean, default: false},
        isOnline: {type: Boolean, required: false, default: false},
        isDeleted: {type: Boolean, required: true, default: false},
        role: {index: true, required:true, type:String, enum : ['user', 'admin'], default: 'user'},
    },
    { timestamps: true }
);

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
