const mongoose=require('mongoose')


const surveySchema=mongoose.Schema({
    aadhaar:{
        type: Number,
        minlength: 12,
        maxlength: 12,
        required: [true,'Aadhaar is required'],
        unique:true
    },
    household:{
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
    },

    localAsset:{
        agriculturalLand: {
            type:{
                owned:{
                type: Boolean,
                required: true
            },
            areaDetails:{
                type:[{
                irrigated:{
                    type:Boolean,
                    required:function(){ return Survey.schema.localAsset.agriculturalLand.owned===true}
                },
                leasedIn:{
                    type: Boolean,
                    required:function(){ return Survey.schema.localAsset.agriculturalLand.owned===true}
                },
                leasedout:{
                    type:Boolean,
                    required:function(){return Survey.schema.localAsset.agriculturalLand.owned===true}
                },
                bighasTotal:{
                    type:Number,
                    required:function(){ return Survey.schema.localAsset.agriculturalLand.owned===true}
                }
            }],
            required: function(){ return this.owned===true}
        }
        }
    
        },
    
        builtUpArea: {
            type:{
                owned:{
                type:Boolean,
                required:true
            },
            areaDetails:{
                type:[{
                    areaType:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.builtUpArea.owned===true}
                    },
                    totalArea:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.builtUpArea.owned===true}
                    },
                    totalValue:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.builtUpArea.owned===true}
                    }
                }],
                required:function(){ return Survey.schema.localAsset.builtUpArea.owned===true}
            },
            totalNum:{
                type:Number,
                required:function(){ return this.owned===true}
            }
        }
            
        },
    
        livestockPoultry:{
            type:{
                owned:{
                type:Boolean,
                required:true
                },
            animalDetails:{
                type:[{
                    
                        name:{
                            type:String,
                            required: function(){ return Survey.schema.localAsset.livestockPoultry.owned===true}
                        },
                        gender:{
                            type:String,
                            required: function(){ return Survey.schema.localAsset.livestockPoultry.owned===true}
                        },
                        age:{
                            type:Number,
                            required: function(){ return Survey.schema.localAsset.livestockPoultry.owned===true}
                        },
                        quantity:{
                            type:Number,
                            required: function(){ return Survey.schema.localAsset.livestockPoultry.owned===true}
                        }
                    
                }],
    
                required:function(){ return this.owned===true}
            }
         }
        },
    
        agriculturalMachinery:{
            type:{
                owned:{
                type:Boolean,
                required:true
            },
            machineryDetails:{
                type:[{
                    name:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.agriculturalMachinery.owned===true}
                    },
                    quantity:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.agriculturalMachinery.owned===true}
                    },
                    value:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.agriculturalMachinery.owned===true}
                    }
                }],
                required:function(){ return this.owned===true}
            }}
        },
    
        sourcesOfirrigation:{
           type:{
                owned:{
                type:Boolean,
                required:true
            },
            sourcesDetails:{
                type:[{
                    name:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.sourcesOfirrigation.owned===true}
                    },
                    quantity:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.sourcesOfirrigation.owned===true}
                    },
                    area:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.sourcesOfirrigation.owned===true}
                    }
                }],
                required:function(){ return this.owned===true}
            }}
        },
    
    
        areaForSourceOfirrigation:{
            type:{
                owned:{
                type:Boolean,
                required:true
            },
            sources:{
                type:[{
                    name:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.areaForSourceOfirrigation.owned===true}
                    },
                    quantity:{
                        type:Number,
                        required:function(){ return Survey.schema.localAsset.areaForSourceOfirrigation.owned===true}
                    }
                }],
                required:function(){ return this.owned===true}
            }}
        },
    
        areaForCrops:{
           type:{
                owned:{
                type:Boolean,
                required:true
            },
            crop:{
                type:[{
                    typeName:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.areaForCrops.owned===true}
                    },
                    cropName:{
                        type:String,
                        required:function(){ return Survey.schema.localAsset.areaForCrops.owned===true}
                    }
                }],
                required:function(){ return this.owned===true}
            }
        }}
    }

})

const Survey = mongoose.model('surveys', surveySchema)

module.exports = Survey