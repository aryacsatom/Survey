const IndividualUser=require('../models/IndividualUser');
const Family=require('../models/Family');

exports.getIndividualUser=(req,res)=>{//Client
    const {aadharId}=req.body;
    IndividualUser.find({aadhar:aadharId},(err,userArr)=>{
        if(err){
            res.json({error:true,message:`Error while finding the user from the given aadhar ID`,errMessage:err})
        }else{
            if(userArr.length>0){
                res.json({error:false,message:`Successfully fetched the user with the given aadharID`,user:userArr[0]});
            }else{
                res.json({error:true,message:`No such user with the given userId exists`});
            }
        }
    })
}

exports.getAllUsers=(req,res)=>{//Admin
    IndividualUser.find({},(err,users)=>{
        if(err){
            res.json({error:true,message:`Error while finding the users`,errMessage:err});
        }else{
            res.json({error:false,message:`Successfully fetched all the users`,users,count:users.length});
        }
    })
}

exports.deleteIndividualUser=(req,res)=>{//both user and admin
    IndividualUser.findByIdAndRemove(req.params.userId,(err,succ)=>{
        if(err){
            res.json({error:true,message:`Error while deleting the user`,errMessage:err})
        }else{
            res.json({error:true,message:'Successfully deleted user'});
        }
    })   
}

exports.deleteAllUsers=(req,res)=>{//Admin
    IndividualUser.remove({},(err,succ)=>{
        if(err){
            res.json({error:true,message:`Error while deleting all the users`,errMessage:err});
        }else{
            res.json({error:false,message:`Successfully deleted all the users`});
        }
    })
}

exports.getIndividualFamily=(req,res)=>{//client
    Family.findById(req.params.familyId,(err,family)=>{
        if(err){
            res.json({error:true,message:`Error while finding the family`,errMessage:err})
        }else{
            res.json({error:false,message:`Successfully fetched the family`,family});
        }
    })
}

exports.getAllFamilies=(req,res)=>{//admin
    Family.find({},(err,families)=>{
        if(err){
            res.json({error:true,message:`Error while finding the families`,errMessage:err});
        }else{
            res.json({error:false,message:`Successfully fetched all the families`,families,count:families.length});
        }
    })
}

exports.deleteIndividualFamily=(req,res)=>{//both
    Family.findByIdAndRemove(req.params.familyId,(err,succ)=>{
        if(err){
            res.json({error:true,message:`Error while deleting the family`,errMessage:err})
        }else{
            res.json({error:true,message:'Successfully deleted family'});
        }
    })   
}

exports.deleteAllFamilies=(req,res)=>{//admin
    Family.remove({},(err,succ)=>{
        if(err){
            res.json({error:true,message:`Error while deleting all the families`,errMessage:err});
        }else{
            res.json({error:false,message:`Successfully deleted all the families`});
        }
    })
}

exports.createIndividualUser=(req,res)=>{//client
    const {name,gender,aadhar,dateOfBirth,contact,address,place,district,occupation}=req.body;
    const user=new IndividualUser({
        name,
        gender,
        birth:new Date(dateOfBirth),
        contact,
        address,
        place,
        district,
        aadhar,
        occupation
    });
    user.save()
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

exports.addParent=(req,res)=>{//client
    const {name,contact,parentAadharId}=req.body;//required details are extracted from the request body
    IndividualUser.findById(req.params.myId,(err,user)=>{ //find the user by using request parameter myId, HOW object_id is known to the request sender??Sugg:Use aadharId
        if(err){
            res.json({error:true,message:`Error while finding the user`,errMessage:err});
        }else{
            IndividualUser.find({aadhar:parentAadharId},(terr,parentArr)=>{//find the parent as an individual user by using parentAadharId
                if(terr){
                    res.json({error:true,message:`Error while finding the parent by its aadhar ID`,errMessage:terr});
                }else{
                    const userGender=user.gender;//gender of the user whose parent is to be added
                    const userToParent=userGender==='male'?'sons':'daughters';//decide whether the user is son or daughter to the user
                    if(parentArr.length>0){//if parent exists
                        let parent=parentArr[0];//[...parentArr[0]];
                        Family.findById(parent.nuclearFamilyID,(tterr,family)=>{//find the parent's nuclear family doc using nuclearfamilyid
                            family[userToParent].push(user._id);//user is pushed in either son or daughter array
                            family.save()//then family doc is saved
                            .then(updatedFamily=>{//if correctly saved
                                user.ownFamilyID=updatedFamily._id;
                                user.save()//the ownfamilyId of user is updated(here family id is same as the family doc obj id)
                                .then(updatedUser=>{
                                    if(updatedUser.marital==='married'){//if user is married find his/her spouse
                                        IndividualUser.findById(updatedUser.partner,(ttterr,partner)=>{
                                            if(ttterr){
                                                res.json({error:true,message:`Error while finding the user's partner`,errMessage:ttterr});
                                            }else{
                                                partner.inLawsFamilyID=updatedFamily._id;//update the inLawsfamilyid of user's partner(spouse) and send success response
                                                partner.save()
                                                .then(updatedPartner=>{
                                                    res.json({error:false,message:`Updated successfully the family doc and the user, alongwith the user's partner`,user:updatedUser});
                                                })
                                                .catch(cerr1=>res.json({error:true,message:`Error while updating the partner`,errMessage:cerr1}));
                                            }
                                        })
                                    }else{
                                        res.json({error:false,message:`Updated successfully the family doc and the user`,user:updatedUser});
                                    }
                                })
                                .catch(cerr=>res.json({error:true,message:`Error while updating the user`,errMessage:err}));
                            })//catch error of family doc update missing***
                        })
                    }else{
                        //if there is not any individual user document of the parent
                        const parent=new IndividualUser({
                            name,
                            contact,
                            gender:req.params.parentGender,
                            marital:'married',
                            aadhar:parentAadharId
                        });
                        parent.save()
                        .then(createdParent=>{//if parent is created as an individual user
                            
                            let family={};//create a new family doc in Family db

                            const parentName=createdParent.gender==='male'?'father':'mother';//error
                            //res.json({error:true,message:`Error here`});
                            family[parentName]=createdParent._id;
                            family[userToParent]=[user._id];
                            const newFamily=new Family(family);//new family doc created
                            newFamily.save()//saved to Family db
                            .then(createdFamily=>{
                                user.ownFamilyID=createdFamily._id;//update the user's ownFID
                                createdParent.nuclearFamilyID=createdFamily._id;//error removed*********************
                                createdParent.save();//erroe removed *************************
                                user.save()
                                .then(updatedUser=>{
                                    if(updatedUser.marital==='married'){
                                        IndividualUser.findById(updatedUser.partner,(tterr,partner)=>{
                                            if(tterr){
                                                res.json({error:true,message:`Error while finding the user's partner`,errMessage:tterr});
                                            }else{
                                                partner.inLawsFamilyID=updatedFamily._id;
                                                partner.save()
                                                .then(updatedPartner=>{
                                                    res.json({error:false,message:`Updated successfully the family doc and the user, alongwith the user's partner`,user:updatedUser});
                                                })
                                                .catch(cerr1=>res.json({error:true,message:`Error while updating the partner`,errMessage:cerr1}));
                                            }
                                        })
                                    }else{
                                        res.json({error:false,message:`Updated successfully the family doc and the user`,user:updatedUser});
                                    }
                                })
                                .catch(cerr2=>res.json({error:true,message:`Error while updating the user`,errMessage:cerr2}));
                            })
                            .catch(cerr1=>res.json({error:true,message:`Error while creating a family document`,errMessage:cerr1}));//this is the error gen if new fam doc not created
                        })
                        .catch(cerr=>res.json({error:true,message:`Error while creating a parent document`,errMessage:cerr}));
                    }
                }
            })
        }
    })
}

exports.changeMarriageStatus=(req,res)=>{//both
    IndividualUser.findById(req.params.myId,(err,user)=>{
        if(err){
            res.json({error:true,message:`Error while finding the user`})
        }else{
            let m=user.marital;
            user.marital=req.params.status;
            if(m==='married'){
                res.json({error:false,message:`User already married`,user:user})
            }
            else if(req.params.status===`married`&& m==='unmarried'){
                //if the user changes status to married
                //create a family
                const family=new Family({
                    father:user._id
                });
                //save that family
                family.save()
                .then(createdFamily=>{
                    //storing the nuclearFamilyID of the user as the id of the newly created Family document
                    user.nuclearFamilyID=createdFamily._id;
                    user.save()
                    .then(updatedUser=>{
                        res.json({error:false,message:`Successfuly updated the user and also created a family document`,user:updatedUser})
                    })
                    .catch(err=>res.json({error:true,message:`Error while updating the marital status of the user to married`,errMessage:err}));
                })
                .catch(err=>res.json({error:true,message:`Error while creating the nuclear family of the user`,errMessage:err}))
            }else{
                user.save()
                .then(updatedUser=>{
                    res.json({error:false,message:`Marital status changed to unmarried`,user:updatedUser})
                })
                .catch(err=>res.json({error:true,message:`Error while updating the marital status of the user to unmarried`,errMessage:err}));
            }
        }
    })
}

exports.addPartner=(req,res)=>{//client
    const {name,contact,partnerAadharId}=req.body;//partner details
    IndividualUser.findById(req.params.myId,(err,user)=>{//find the user by myID
        if(err){
            res.json({error:true,message:`Error while finding the user with id`,errMessage:err});
        }else{
            if(user.marital==='married'){//add partner details ony if user is married
                const partnerName=req.params.partnerGender==='male'?'father':'mother';
                IndividualUser.find({aadhar:partnerAadharId},(terr,partnerArr)=>{
                    if(terr){
                        res.json({error:true,message:`Error while finding the partner with the given aadharId`})
                    }else{
                        if(partnerArr.length>0){
                            //already the partner user document exists
                            let partner=partnerArr[0]//[...partnerArr[0]];
                            partner.marital='married';
                            partner.partner=user._id;
                            partner.nuclearFamilyID=user.nuclearFamilyID;
                            partner.inLawsFamilyID=user.ownFamilyID;
                            IndividualUser.findByIdAndUpdate(partner._id,partner,(tterr,updatedPartner)=>{
                                if(tterr){
                                    res.json({error:true,message:`Error while updating the partner`,errMessage:tterr});
                                }else{
                                    user.partner=updatedPartner._id;
                                    user.inLawsFamilyID=partner.ownFamilyID;
                                    user.save()
                                    .then(updatedUser=>{
                                        Family.findById(updatedUser.nuclearFamilyID,(ttterr,family)=>{
                                            if(ttterr){
                                                res.json({error:true,message:`Error while finding the family`,errMessage:ttterr});
                                            }else{
                                                family[partnerName]=updatedPartner._id;
                                                family.save()
                                                .then(updatedFamily=>{
                                                    res.json({error:false,message:`Successfully added the partner and updated the nuclear family doc`,user:updatedUser});
                                                })
                                                .catch(err1=>res.json({error:true,message:`Error while updating the family`,errMessage:err1}));
                                            }
                                        })
                                    })
                                    .catch(err=>res.json({error:true,message:`Error while updating the user`,errMessage:err}));
                                }
                            })
                        }else{
                            //there does not exist an account of the partner
                            const partner=new IndividualUser({
                                name,
                                contact,
                                gender:req.params.partnerGender,
                                marital:'married',
                                aadhar:partnerAadharId,
                                partner:user._id,
                                nuclearFamilyID:user.nuclearFamilyID,
                                inLawsFamilyID:user.ownFamilyID
                            });
                            partner.save()
                            .then(updatedPartner=>{
                                user.partner=updatedPartner._id;
                                user.inLawsFamilyID=updatedPartner.ownFamilyID;
                                user.save()
                                .then(updatedUser=>{
                                    Family.findById(updatedUser.nuclearFamilyID,(tterr,family)=>{
                                        if(tterr){
                                            res.json({error:true,message:`Error while finding the family`,errMessage:err})
                                        }else{
                                            family[partnerName]=updatedPartner._id;
                                            family.save()
                                            .then(updatedFamily=>{
                                                res.json({error:false,message:`Created a user document for the partner, updated the user and also the family`,user:updatedUser});
                                            })
                                            .catch(err2=>res.json({error:true,message:`Error while updating the family`,errMessage:err2}))
                                        }
                                    })
                                })
                                .catch(err1=>res.json({error:true,message:`Error while updating the user`,errMessage:err1}));
                            })
                            .catch(err=>res.json({error:true,message:`Error while creating a partner`,errMessage:err}))
                        }
                    }
                })
            }else{
                res.json({error:true,message:`Marital status of the user is unmarried`})
            }
        }
    })    
}

exports.addChild=(req,res)=>{//client
    const {name,contact,childAadharId}=req.body;
    IndividualUser.findById(req.params.myId,(err,user)=>{
        if(err){
            res.json({error:true,message:`Error while finding the user`,errMessage:err});
        }else{
            if(user.marital==='married'){
                const childGender=req.params.childGender;
                const childToUser=childGender==='male'?'sons':'daughters';
                IndividualUser.find({aadhar:childAadharId},(terr,childArr)=>{
                    if(terr){
                        res.json({error:true,message:`Error while finding the child with the given aadharID`,errMessage:terr});
                    }else{
                        if(childArr.length>0){
                            let child=[...childArr[0]];
                            Family.findById(user.nuclearFamilyID,(tterr,family=>{
                                family[childToUser].push(child._id);
                                family.save()
                                .then(updatedFamily=>{
                                    child.ownFamilyID=updatedFamily._id;
                                    IndividualUser.findByIdAndUpdate(child._id,child,(ttterr,updatedChild)=>{
                                        if(ttterr){
                                            res.json({error:true,message:`Error while updating the child user`,errMessage:ttterr});
                                        }else{
                                            res.json({error:false,message:`Succesfully added a child`,user})
                                        }
                                    })
                                })
                                .catch(cerr=>res.json({error:true,message:`Error while updating the family of the user`}));
                            }))
                        }else{
                            //the child document doesn't exist
                            const child=new IndividualUser({
                                name,
                                contact,
                                aadhar:childAadharId,
                                gender:childGender,
                                ownFamilyID:user.nuclearFamilyID
                            });
                            child.save()
                            .then(createdChild=>{
                                Family.findById(createdChild.ownFamilyID,(tterr,family)=>{
                                    if(tterr){
                                        res.json({error:true,message:`Error while finding the family`,errMessage:tterr});
                                    }else{
                                        family[childToUser].push(createdChild._id);
                                        family.save()
                                        .then(updatedFamily=>{
                                            res.json({error:false,message:`Successfully created a user doc for the child and updated the details in the family doc`,user})
                                        })
                                        .catch(cerr1=>res.json({error:true,message:`Error while updating the family doc of the user`,errMessage:cerr1}));
                                    }
                                })
                            })  
                            .catch(cerr=>res.json({error:true,message:`Error while creating a new user document for the child`,errMessage:cerr}));                
                        }
                    }
                })
            }else{
                res.json({error:true,message:`User is unmarried according to its status, so cannot add children`})
            }
        }
    })
}

exports.addSibling=(req,res)=>{//client
    const {name,contact,siblingAadharId}=req.body;
    IndividualUser.findById(req.params.myId,(err,user)=>{
        if(err){
            res.json({error:true,message:`Error while finding the user`,errMessage:err})
        }else{
            const siblingGender=req.params.siblingGender;
            const siblingToParent=siblingGender==='male'?'sons':'daughters';
            IndividualUser.find({aadhar:siblingAadharId},(terr,siblingArr)=>{
                if(terr){
                    res.json({error:true,message:`Error while finding the sibling with the given Aadhar Id`,errMessage:terr});
                }else{
                    if(siblingArr.length>0){
                        let sibling=[...siblingArr[0]];
                        sibling.ownFamilyID=user.ownFamilyID;
                        IndividualUser.findByIdAndUpdate(sibling._id,sibling,(tterr,updatedSibling)=>{
                            if(tterr){
                                res.json({error:true,message:`Error while updating the sibling`,errMessage:tterr});
                            }else{
                                Family.findById(user.ownFamilyID,(ttterr,family)=>{
                                    if(ttterr){
                                        res.json({error:true,message:`Error while fetching the family`,errMessage:ttterr});
                                    }else{
                                        family[siblingToParent].push(updatedSibling._id);
                                        family.save()
                                        .then(updatedFamily=>{
                                            res.json({error:false,message:`Successfully updated the sibling and the family document`,user});
                                        })
                                        .catch(cerr=>res.json({error:true,message:`Error while updating the family`,errMessage:cerr}));
                                    }
                                })
                            }
                        })
                    }else{
                        //sibling user document doesn't exist
                        const sibling=new IndividualUser({
                            name,
                            contact,
                            aadhar:siblingAadharId,
                            gender:siblingGender,
                            ownFamilyID:user.ownFamilyID
                        });
                        sibling.save()
                        .then(updatedSibling=>{
                            Family.findById(user.ownFamilyID,(tterr,family)=>{
                                if(tterr){
                                    res.json({error:true,message:`Error while fetching the family`,errMessage:tterr});
                                }else{
                                    family[siblingToParent].push(updatedSibling._id);
                                    family.save()
                                    .then(updatedFamily=>{
                                        res.json({error:false,message:`Successfully updated the sibling and the family document`,user});
                                    })
                                    .catch(cerr=>res.json({error:true,message:`Error while updating the family`,errMessage:cerr}));
                                }
                            })
                        })
                        .catch(cerr=>res.json({error:true,message:`Error while creating a user doc for the sibling`,errMessage:cerr}));
                    }
                }
            })
        }
    })
}