const mongoose=require('mongoose')


const localAssetSchema=mongoose.Schema({
    aadhaar:{
        type: Number,
        minlength: 12,
        maxlength: 12,
        required: [true,'Aadhaar is required'],
        unique:true
    },
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
                required:function(){ return LocalAsset.schema.agriculturalLand.owned===true}
            },
            leasedIn:{
                type: Boolean,
                required:function(){ return LocalAsset.schema.agriculturalLand.owned===true}
            },
            leasedout:{
                type:Boolean,
                required:function(){return LocalAsset.schema.agriculturalLand.owned===true}
            },
            bighasTotal:{
                type:Number,
                required:function(){ return LocalAsset.schema.agriculturalLand.owned===true}
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
                    required:function(){ return LocalAsset.schema.builtUpArea.owned===true}
                },
                totalArea:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.builtUpArea.owned===true}
                },
                totalValue:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.builtUpArea.owned===true}
                }
            }],
            required:function(){ return LocalAsset.schema.builtUpArea.owned===true}
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
                        required: function(){ return LocalAsset.schema.livestockPoultry.owned===true}
                    },
                    gender:{
                        type:String,
                        required: function(){ return LocalAsset.schema.livestockPoultry.owned===true}
                    },
                    age:{
                        type:Number,
                        required: function(){ return LocalAsset.schema.livestockPoultry.owned===true}
                    },
                    quantity:{
                        type:Number,
                        required: function(){ return LocalAsset.schema.livestockPoultry.owned===true}
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
                    required:function(){ return LocalAsset.schema.agriculturalMachinery.owned===true}
                },
                quantity:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.agriculturalMachinery.owned===true}
                },
                value:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.agriculturalMachinery.owned===true}
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
                    required:function(){ return LocalAsset.schema.sourcesOfirrigation.owned===true}
                },
                quantity:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.sourcesOfirrigation.owned===true}
                },
                area:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.sourcesOfirrigation.owned===true}
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
                    required:function(){ return LocalAsset.schema.areaForSourceOfirrigation.owned===true}
                },
                quantity:{
                    type:Number,
                    required:function(){ return LocalAsset.schema.areaForSourceOfirrigation.owned===true}
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
                    required:function(){ return LocalAsset.schema.areaForCrops.owned===true}
                },
                cropName:{
                    type:String,
                    required:function(){ return LocalAsset.schema.areaForCrops.owned===true}
                }
            }],
            required:function(){ return this.owned===true}
        }
    }}

})


const LocalAsset = mongoose.model('localassets', localAssetSchema)

module.exports = LocalAsset