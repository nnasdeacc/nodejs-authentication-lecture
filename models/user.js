const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	username: { type: String, required: [true, "Username cannot be blank"] },
	password: { type: String, required: [true, "Username cannot be blank"] }, // this will actually store the HASHED password!!!
});

userSchema.statics.findAndValidate = async function (username, password) {
	const foundUser = await this.findOne({ username }); // the keyword 'this' refers to the User model
	// if(!foundUser){}
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // The '.isModified()' method is a mongoose method
	this.password = await bcrypt.hash(this.password, 12); // The keyword 'this' refers to the instance of the user model
	next();
});

module.exports = mongoose.model("User", userSchema);
