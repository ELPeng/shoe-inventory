const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ShoeSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        brand: {type: Schema.Types.ObjectId, ref: 'Brand'}, 
        price: {type: Number, required: true},
        description: {type: String, required: true, maxLength: 1000},

        
    }
)


// Virtual for shoe's URL
ShoeSchema
    .virtual('url')
    .get(function(){
        return '/catalog/shoe/' + this._id
    })


//Export model
module. exports = mongoose.model('Shoe', ShoeSchema)