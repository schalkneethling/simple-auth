const formResponses = require("../utils/form-responses");

const validate = {
  registration: userDetails => {
    let invalidFields = [];
    let valid = true;

    if (userDetails.name.trim() === "") {
      invalidFields.push("name");
      valid = false;
    }

    /* email format validation is handled by the browser via `type="email",
       here we simply ensure it is not empty. Email validation is problematic
       at best https://bit.ly/2oN97qL */
    if (userDetails.email.trim() === "") {
      invalidFields.push("email");
      valid = false;
    }

    if (userDetails.username.trim() === "") {
      invalidFields.push("username");
      valid = false;
    }

    if (userDetails.password.trim() === "") {
      invalidFields.push("password");
      valid = false;
    }

    if (userDetails.passwordConfirmation.trim() === "") {
      invalidFields.push("passwordConfirmation");
      valid = false;
    }

    if (!valid) {
      return formResponses.registrationInvalidFields(invalidFields);
      /* if `validate` is true at this point, we need to ensure that the user's `password`
       and `passwordConfirmation` match */
    } else if (
      valid &&
      userDetails.password !== userDetails.passwordConfirmation
    ) {
      invalidFields.push("passwordsMismatch");
      return formResponses.registrationInvalidFields(invalidFields);
    } else {
      return true;
    }
  }
};

module.exports = validate;
