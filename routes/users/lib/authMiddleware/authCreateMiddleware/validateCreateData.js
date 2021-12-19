const {
  isAlpha,
  isAlphanumeric,
  isEmail,
  isStrongPassword,
} = require("validator");

function validateCreateData(req, res, next) {
  let errObj = {};

  const { firstName, lastName, username, email, password } = req.body;

  if (!isAlpha(firstName, "en-US", { "ignore": "-'" })) {
    errObj.firstName = "First Name can only include letters A-Z, hyphen or apostrophe";
  }


  if (!isAlpha(lastName, "en-US", { "ignore": "-'" })) {
    errObj.lastName = "Last Name can only include letters A-Z, hyphen or apostrophe";
  }


  if (!isAlphanumeric(username)) {
    errObj.username = "Username cannot have special characters.";
  }


  if (!isEmail(email)) {
    errObj.email = "Please enter a valid email.";
  }


  if (!isStrongPassword(password)) {
    errObj.password =
      "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character and at least 8 characters long";
  }
  if (Object.keys(errObj).length > 0) {
    return res.status(500).json({
      message: "error",
      error: errObj,
    });
  } else {
    next();
  }
}


module.exports = {
  validateCreateData,
}