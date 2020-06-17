const Household=require('../models/Household');
const LocalAsset=require('../models/LocalAsset');
const Survey=require('../models/Survey')
/*exports.household=(req,res)=>{//Client
    const houseHold = new Household(req.body);
    houseHold.save()
    .then(user => {
        // console.log(user);
        var message={error:false,user: user};
        res.json(message);
    })
    .catch(err => {
        // console.log(err);
        var message={error:true,err:err};
        res.json(message);
    })
}

exports.localasset=(req,res)=>{//Client
    const localAsset = new LocalAsset(req.body);
    localAsset.save()
    .then(user => {
        // console.log(user);
        var message={error:false,user: user};
        res.json(message);
    })
    .catch(err => {
        // console.log(err);
        var message={error:true,err:err};
        res.json(message);
    })
}*/

exports.survey=async (req,res)=>{
    try{
    /*const {household,localasset}=req.body
    const localAsset=new LocalAsset(localasset)
    const houseHold=new Household(household)
    const la=await localAsset.save()*/


    /*.then(user => {
        // console.log(user);
        var message={error:false,msg:"LocalAsset Survey Saved"};
        res.json(message);
    })
    .catch(err => {
        // console.log(err);
        var message={error:true,err:err};
        res.json(message);
    })*/

    /*const hh=await houseHold.save()
    var message={error:false,msg:"LocalAsset Survey Saved",hh,la};
    res.status(200).send(message)*/
    /*.then(user => {
        // console.log(user);
        var message={error:false,msg:"Household and Local Survey Saved"};
        res.json(message);
    })
    .catch(err => {
        // console.log(err);
        var message={error:true,err:err};
        res.json(message);
    })*/



    const survey=new Survey(req.body)
    const s=await survey.save()
    var message={error:false,msg:"Household and LocalAsset Survey Saved",s}
    res.status(200).send(message)

}catch(err){
    res.status(500).send(err);
}
}

/*
TEST CASE TO BE USED WHILE TESTING(IN POSTMAN)
{
	"aadhaar":123443211234,
	"household":{
	
  
 "occupation":"Student",
 "annualIncome":0,
 "landOwned":"yes",
 "landSize":1,
 "houseType":"Pucca",
 "type":"Nuclear",
 "pD":"Yes",
 "pDT":"Since Birth"
 

	},
 "localAsset":{
 	
 "agriculturalLand":{
 	"owned":"true",
 	"areaDetails":[
 		{
			"irrigated":"true",
 			"leasedIn":"false",
 			"leasedout":"true",
 			"bighasTotal":10
 		},
 		{
 			"irrigated":"true",
 			"leasedIn":"true",
 			"leasedout":"false",
 			"bighasTotal":10
 		}]
 		
 		},
 		
 		"builtUpArea":{
 			"owned":"true",
 			"areaDetails":[
 				{
 					"areaType":"Residential",
 					"totalArea":2000,
 					"totalValue":8000000
 				},
 				{
 					"areaType":"Animal Farm",
 					"totalArea":6000,
 					"totalValue":10000000
 				}
 				],
 				"totalLand":2
 		},
 		
 		"livestockPoultry":{
 			"owned":"true",
 			"animalDetails":[
 				{
 					"name":"Cow",
 					"gender":"Female",
 					"age":2,
 					"quantity":20
 				},
 				{
 					"name":"Horse",
 					"gender":"Male",
 					"age":4,
 					"quantity":15
 				}
 				]
 		},
 		
 		"agriculturalMachinery":{
 			"owned":"true",
 			"machineryDetails":[
 				{
 					"name":"Electric Pump",
 					"quantity":10,
 					"value":150000
 				}
 				
 				]
 		},
 		
 		"sourcesOfirrigation":{
 			"owned":"false"
 		},
 		"areaForSourceOfirrigation":{
 			"owned":"false"
 		},
 		"areaForCrops":{
 			"owned":"false"
 		}
 		
 }
 

 }
*/
