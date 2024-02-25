const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: String,
    price: Number,
    model: String,
    type: String,
}, {
    timestamps: true,
});


module.exports = model('Product', productSchema);
