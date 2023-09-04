import mongoose from "mongoose";

const AdminConfigurationSchema = new mongoose.Schema({
    type: {type: String},
    formType: {type:String},
    collections: [],
});

export const AdminConfigurationModel = mongoose.model('Admin_Configuration', AdminConfigurationSchema);

export const getAllConfiguration = () => AdminConfigurationModel.find();
export const createNewConfiguration = (values: Record<string, any>) => new AdminConfigurationModel(values).save().then((configuration) => configuration.toObject());
export const getConfigurationByType = (type:string) => AdminConfigurationModel.findOne({type:type});
export const getConfigurationById = (id:string) => AdminConfigurationModel.findById(id);
export const deleteConfigurationById = (id:string) => AdminConfigurationModel.findOneAndDelete({_id:id});