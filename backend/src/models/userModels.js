const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, "Please provide a valid email"],
        validate: {
            validator: function(value){
              return validator.isEmail(value);
            },
            message: props => `${props.value} is an invalid email!`
          }
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
              return validator.isMobilePhone(value, 'en-IN');
            },
            message: props => `${props.value} is not a valid mobile number!`
          }
        
    },
    password:{
        type: String,
        required: [true, "Please provide your password "], 
        // validate: {
        //     validator: function(v){
        //         return v.length = 8 && /[/\@!#$%^&*()]/.test(v);
        //     },
        //     message: (pw) => `${pw.value} is not a valid password!`
        // }
        validate: {
            validator: function(value){
              return validator.isStrongPassword(value);
            },
            message: props => `${props.value} is not a strong password!`
          }
    },
    avatar:{
        type: String,
    },
    education: [educationSchema],
    skills:{
        type: String,
    },
    projects: [projectSchema],
    resume: {
        type: String,
    },
    profileVisibility: {
        type: String,
        enum: {
            values: ['public', 'private'],
            message: '{VALUE} is not supported'
        },
        default: 'public'
    },
},
{
    timestamps: true
})

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
    },
    degree: {
        type: String,
    },
    YearOfPassing: {
        type: String
    }
},
{
    timestamps: false
});

const projectSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
    },
    projectDescription: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    }
})

userSchema.pre('save', async function(next){
    const user = this;
    if(!(user.isModified('password'))){
        next();
    }

    try{
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = String(hashedPassword);
        next();
    }
    catch(error){
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(enteredPassword){
    try{
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        return isMatch;
    }
    catch(error){
        throw error;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User