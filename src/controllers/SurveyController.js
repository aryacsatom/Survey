const Household=require('../models/Household');
const LocalAsset=require('../models/LocalAsset');

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
    const {household,localasset}=req.body
    const localAsset=new LocalAsset(localasset)
    const houseHold=new Household(household)
    const la=await localAsset.save()
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

    const hh=await houseHold.save()
    var message={error:false,msg:"LocalAsset Survey Saved",hh,la};
    res.status(200).send(message)
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
}catch(err){
    res.status(500).send(err);
}
}
