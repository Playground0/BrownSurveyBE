import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password: {type: String, required: true, select:false},
        salt: {type: String, select:false},
        sessionToken: {type: String, select: false}
    },
    fullname: {type: String},
    phonenumber: {type: String},
    location: {type: String},
    age: {type: String},
    profilePicture: {type:String},
    userRole: {type:Number}
});
const UserRoleSchema = new mongoose.Schema({
    Annonymous: {type: String},
    User: {type: String},
    Super_User: {type: String},
    Admin: {type: String},
})

export const UserModel = mongoose.model('User', UserSchema);
export const UserRoleModel = mongoose.model('User_Roles', UserRoleSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email:string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionsToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionsToken
});
export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id: id});
export const updateUserById = (id:string, values: Record<string,any>) => UserModel.findByIdAndUpdate(id, values);
export const getUserRolesFromDB = () => UserRoleModel.findOne();