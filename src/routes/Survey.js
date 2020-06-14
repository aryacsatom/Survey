const router=require('express').Router();
const SurveyController=require('../controllers/SurveyController');
const auth=require('../middleware/auth')

router.post('/Household',auth,SurveyController.household);
router.post('/LocalAsset',auth,SurveyController.localasset);


module.exports=router;