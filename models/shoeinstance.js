const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ShoeInstanceSchema = new Schema(
    {
        shoe: { type: Schema.Types.ObjectId, ref: 'Shoe', required: true },
        size: {type: Number, required: true, min: [6],
            max: [15]}

    }
)


// Virtual for shoe's URL
ShoeInstanceSchema
    .virtual('url')
    .get(function(){
        return '/catalog/shoe/' + this._id
    })


//Export model
module. exports = mongoose.model('ShoeInstance', ShoeInstanceSchema)


