const mongoose = require ('mongoose')
const {isEmail,isAlpha} = require('validator')
const bcrypt = require('bcrypt')
var Schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,'Please enter first name'],
        validate:[isAlpha,"first name should be contain only letters"]
    }
    ,
    lastName: {
        type: String,
        required: [true,'Please enter last name'],
        validate:[isAlpha,"last name should be contain only letters"]
    }
    ,
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique:true,
        trim:true,
        lowercase: true,
        validate:[isEmail,"email should be in a correct format"]
    }
    ,
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,"password should be larger than 5"],
        maxlength: [20,"password should be smaller than 21"]
    },
    resetLink:{
        data:String,
        default:''
    }
},{timestamp:true})


userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
  });

  userSchema.statics.reset = async function(password){
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password,salt)
      if(password)
      return password
      else
      throw('')
  }

  userSchema.statics.login = async function(email,password) {
      console.log('login params',email,password)
    const user = await this.findOne({email:email});
    console.log('user in userSchema.statics.login equals',user)
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        else
        throw('incorrect password')
    }else
    throw('incorrect email')
}


const User = mongoose.model('user',userSchema)
module.exports = User