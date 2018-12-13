/**
 * An `Object` of form responses that can be passed directly
 * to the response, based on status.
 */
const formResponses = {
  authError: error => {
    let errorResponse = {
      description: "",
      authError: true
    };

    switch (error.name) {
      case "MongoDB Error":
        errorResponse.description = "Whoops! Something seems not quite right";
        return errorResponse;
      case "User Not Found":
        errorResponse.description =
          "User not found. Please ensure your email address is entered correctly";
        return errorResponse;
      case "Password Mismatch":
        errorResponse.description =
          "Password mismatch. Note, passwords are case sensitive";
        return errorResponse;
    }
  },
  registrationInvalidFields: fields => {
    const messages = {
      name: "Please enter your full name",
      email: "Please enter your email address",
      username: "Please enter your chosen username",
      password: "Please provide a password",
      passwordConfirmation: "Please confirm your password",
      passwordsMismatch: "Please ensure that your passwords match"
    };
    let responseMsg = {};

    fields.forEach(field => {
      responseMsg[field] = messages[field];
    });

    return responseMsg;
  },
  registrationSuccessful: fullName => {
    return {
      registrationSuccessful: true,
      name: fullName
    };
  }
};

module.exports = formResponses;
