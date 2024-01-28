const mongoose = require("mongoose")
const env = require("dotenv");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { schema } = require("./product");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        required: true,
        default: "buyer"

    },
    email: {
        type: String,
        required: [true, "Email is a required field"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email")
            }
        }
    },
    phonenumber: {
        type: String,
        minLength: [10, "enter a valid number"],
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("invalid phone number")
            }
        }
    },
    password: {
        type: String,
        min: 10
    },
    img: {
        data: Buffer,
        contentType: String,
    },

    tokens: {
        type: [{
            token: {
                type: String,
                required: true
            }
        }]
    },

},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
)

userSchema.methods.unique = async function () {
    try {
        const model = this;
        const check = await User.findOne({ $or: [{ name: model.username }, { phonenumber: model.phonenumber }, { gmail: model.email }] }).exec();
        if (check) return true;
        return false
    }
    catch (e) {
        res.send(e).status(400);
    }
}
userSchema.virtual("cartItems", {
    ref: "Cart",
    localField: "_id",
    foreignField: "owner"
})
userSchema.virtual("Pcomments", {
    ref: "Product",
    localField: "_id", // The _id of the user in User schema
    foreignField: "comments.owner", // The owner field in comments array of Product schema
    justOne: false,
    
  });
userSchema.statics.findByCredentials = async (Username, Password) => {
    const data = await User.findOne({ username: Username }).exec()
    // console.log(data)
    if (data == null) {
        console.log("fournt")
    }
    const isMatch = bcrypt.compare(Password, data.password)
    if (!isMatch) {
        console.log("Wrong password bro")
    }
    return data;
}
userSchema.methods.GenerateToken = async function () {
    const data = this
    const token = jwt.sign({ _id: (data.id).toString() }, process.env.SECRET_KEY);
    data.tokens = data.tokens.concat({ token })
    return token;
}
userSchema.methods.getUserProfile=function(){
    const data=this;
    const dataobj=data.toObject();
    delete dataobj.password;
    delete dataobj.tokens;
     return dataobj;
}
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
const User = mongoose.model("User", userSchema);
module.exports = User;

[]