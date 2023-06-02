import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    formname: {type: String, required: true},
    formtype: {type: String, required: true},
    formcategory :{type: String, required: true},
    // authentication: {
    //     password: {type: String, required: true, select:false},
    //     salt: {type: String, select:false},
    //     sessionToken: {type: String, select: false}
    // },
});

export const FormModel = mongoose.model('Form', FormSchema);

export const getForms = () => FormModel.find();
export const createNewForm = (values: Record<string, any>) => new FormModel(values).save().then((form) => form.toObject());
export const getFormByName = (formName:string) => FormModel.findOne({formName});
export const getFormById = (id:string) => FormModel.findById(id);
export const deleteFormById = (id:string) => FormModel.findOneAndDelete({_id:id});