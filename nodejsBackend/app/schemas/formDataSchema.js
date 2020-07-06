var mongoose = require('mongoose')
var Schema = mongoose.Schema

var formDataSchema = new Schema(
    {
        sno: Number,
        clean_query: String,
        brand: String,
        b_in: Number,
        color_slug: String,
        c_in: Number,
        category: String,
        cat_in: Number,
        meta_n: String,
        m_in: Number
    },
    {
        collection: 'Intentweight'
    }
)
module.exports = mongoose.model('FormDataSchema', formDataSchema)
