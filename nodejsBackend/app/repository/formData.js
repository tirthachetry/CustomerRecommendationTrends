const {FormDataSchema} = require('../schemas');
const moment = require('moment');
const mongoose = require('mongoose');

function getAllFormData(str) {
    return FormDataSchema.find({"clean_query": {$regex: `.*${str}.*`}});

};

async function createFormData(item) {
    await FormDataSchema.deleteMany({});
    const formData = new FormDataSchema(item);
    return formData.save();

};

module.exports = {
    getAllFormData,
    createFormData
}
