const Household=require('../models/Household');
const LocalAsset=require('../models/LocalAsset');

exports.household=(req,res)=>{//Client
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
}

exports.survey=(req,res)=>{
    const {localasset,household}=req.body
    const localAsset=new LocalAsset(localasset)
    const houseHold=new HouseHold(household)
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