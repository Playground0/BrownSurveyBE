import mongoose from "mongoose";

const AdminConfigurationSchema = new mongoose.Schema({
    type: {type: String},
    formType: {type:String},
    collections: [],
});

const Contributors = new mongoose.Schema({
    cont_name: {type: String, required: true},
    cont_desc: {type:String,required: true},
    cont_img: {type:String}
});

export const AdminConfigurationModel = mongoose.model('Admin_Configuration', AdminConfigurationSchema);
export const ContributorsModel = mongoose.model('Contributor', Contributors);

export const getAllConfiguration = () => AdminConfigurationModel.find();
export const createNewConfiguration = (values: Record<string, any>) => new AdminConfigurationModel(values).save().then((configuration) => configuration.toObject());
export const getConfigurationByType = (type:string) => AdminConfigurationModel.findOne({type:type});
export const getConfigurationById = (id:string) => AdminConfigurationModel.findById(id);
export const deleteConfigurationById = (id:string) => AdminConfigurationModel.findOneAndDelete({_id:id});
export const getContributorsList = () => ContributorsModel.find();