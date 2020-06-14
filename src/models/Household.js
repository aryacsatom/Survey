const mongoose=require('mongoose')


const householdSchema=mongoose.Schema({
    aadhaar:{
        type: Number,
        minlength: 12,
        maxlength: 12,
        required: [true,'Aadhaar is required'],
        unique:true
    },
    occupation: {
        type: String,
        required: [true, 'Household occupation is required']
    },
    annualIncome:{
        type:Number,
        required: [true, 'Annual Income is required']
    },
    landOwned: {
        type: String,
        enum:['yes','no'],
        required: [true, 'land  status is required']
    },
    landSize: {
        type: Number,
        required: function() { return this.landOwned === 'yes'; }
    },
    houseType: {
        type: String,
        enum:['Kutcha','Pucca','Mixed'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    pD: {
        type: String,
        enum:['Yes','No'],
        required: true
    },
    pDT:{
        type: String,
        enum: ['Since Birth','Immigrant'],
        required: function() {
            return this.pD === 'Yes'
        }
    },
    immigrationReason:{
        type: String,
        required: function() {
            return this.pDT==='Yes'
        }
    }

})


const Household = mongoose.model('households', householdSchema)

module.exports = Household
