const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ms = require('ms');
const mailgun = require('mailgun-js');
const mg = mailgun({apiKey:process.env.MAILGUN_API_KEY,domain:process.env.MAILGUN_DOMAIN})
const mg_url= process.env.MAILGUN_API_KEY;
const axios = require('axios')
// const maxAge = 12 * 30 * 24 * 60 * 60;

const createToken = (id,role) => {
  return jwt.sign(
    { id,role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  );
};



module.exports.checkToken = (token) => {
  return jwt.decode(token,process.env.JWT_SECRET_KEY)?.id
}

const handleErrors = (err) => {
  console.log(err.message, err.code);
  const errors = [];
  if (err.code === 11000) {
    // console.log('key pattern and key value',err.keyPattern,Object.keys(err.keyValue)[0])
    Object?.keys(err.keyValue)[0] == "email"
      ? errors.push({
          message: "This email is already used",
          type: "unique",
          path: "email",
        })
      : Object?.keys(err.keyValue)[0] == "userName"
      ? errors.push({
          message: "This user name is used",
          type: "unique",
          path: "userName",
        })
      : "";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e) =>
      errors.push({
        message: e.properties.message,
        type: e.properties.type,
        path: e.properties.path,
        value: e.properties.value,
      })
    );
    console.log(errors);
  }
  return errors;
};

module.exports.create_user = async (req, res) => {
  let response_message = "";
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((data) => data)
    .catch((err) => {
      response_message = err;
      return "";
    });
  if (user) {
    const token = createToken(user._id,'user');
    res.status(200).cookie('hospitalsToken',token,{ expires: new Date(Date.now() + ms('1d')) }).json({message:'new account created'});
  } else {
    res.status(400).send(handleErrors(response_message));
  }
};

module.exports.log_user = async (req, res) => {
  let response_message = "";
  const user = await User.login(
    req.body.email,
    req.body.password
  )
    .then((data) => data)
    .catch((err) => {
      response_message = err;
      return "";
    });
  console.log("USER TO BE LOGGED:", user);
  if (user) {
    const token = createToken(user._id,'user');
    res.status(200).cookie('hospitalsToken',token,{ expires: new Date(Date.now() + ms('1d')) }).json({message:'Logged in successfully'});
  } else res.status(400).send(response_message);
};

module.exports.forgot_password = async (req,res) => {
    console.log('dnakjngdagjnkdjnv',req.body.email)
    let state=true;
    const user = await User.findOne({email:req.body.email}).then(data=>data).catch(()=>'')
    if(user){
        const token = jwt.sign({_id:user._id},process.env.JWT_RESET_PASSWORD_SECRET_KEY,{expiresIn:'30m'});
        const data = {
            from:'noreplay@hospitalsFinder.com',
            to:req.body.email,
            subject:'Account Activation Link',
            html:`
            <h2>Please Click The Link to reset your password</h2>
            <p>${process.env.URL}/reset-password/${token}</p>
            `
        }
        await User.updateOne({resetLink:token})
        .then((data)=>{console.log('reset Link successfully',data)})
        .catch((err)=>{console.log('reset Link failed',err); state=false;})
        if(state) mg.messages().send(data,(error,body)=>{
            if(error)
            res.status(400).json({error:error.message})
            else
            res.status(200).json({message:'email has been sent, follow the instructions'})
        })
        else res.status(400).json({error:'error at reseting password link'})
    }else res.status(400).json({error:'error the user doesnt exists'})
}

module.exports.resetPassword = async (req,res) => {
    console.log('rp1:',req.params.token?.fff,'rp2:',process.env.JWT_RESET_PASSWORD_SECRET_KEY,'rp3:',req.body.newPassword)
    if(req.params.token){
        const ID=jwt.decode(req.params.token,process.env.JWT_RESET_PASSWORD_SECRET_KEY)?._id
        console.log('jwt decode',ID)
        jwt.verify(req.params.token,process.env.JWT_RESET_PASSWORD_SECRET_KEY,async(err,data)=>{
            if(err){
                res.status(401).json({error:"expired or wrong token"})
            }
            else{
                // const user=User.findOne({resetPassword:req.params.token})
                // .then(data=>data)
                // .catch((err)=>'')
                // const temp = { password:req.body.newPassword }
                const pass = await User.reset(req.body.newPassword).then(data=>data).catch(err=>'')
                if(pass)
                { await User.findOneAndUpdate(
                    {
                      _id:ID,
                    },
                    { $set: { password:pass } }
                  ).then(data=>{console.log('successful updating',data)}).catch(err=>{console.log('error updating:',err)})}
            }
        })
    }
    else{
        res.status(401).json({error:'authentication error'})
    }
}

module.exports.getUserData = async (req,res,next) => {
    const user = await User.findById(jwt.decode(req?.cookies?.token?req.cookies.token:req.headers?.authorization?.split(' ')[1],process.env.JWT_SECRET_KEY).id)
    res.status(200).json({firstName:user.firstName,lastName:user.lastName,email:user.email})
}

module.exports.nearbySearch = async (req,res,next) => {
  const [lat,lng]=req.params.coordinates.split('-')
  console.log('req',lat,lng,process.env.GOOGLE_MAPS_API_KEY)
  axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=1500&type=hospital&key=${process.env.GOOGLE_MAPS_API_KEY}`)
  .then(axiosRES=>{
      console.log('search results',axiosRES)
      res.status(200).send(axiosRES.data?.results)
  })
  .catch(err=>{
      console.log('error fetching',err)
      res.status(400).send('Failed getting nearby places')
  })
}