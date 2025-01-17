export const validate = (data, type) => {
  const errors = {};

  if (!data.username) {
    errors.username = "Username is Required!";
  } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.username).toLowerCase())) {
    errors.username = "Username address is invalid!";
  } else {
    delete errors.username;
  }

  if (!data.password) {
    errors.password = "Password is Required";
  } else if (!(data.password.length >= 6)) {
    errors.password = "Password needs to be 6 character or more";
  } else {
    delete errors.password;
  }

  if (type === "signUp") {
    if (!data.username.trim()) {
      errors.username = "Username is Required!";
    } else {
      delete errors.username;
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm the Password";
    } else if (!(data.confirmPassword === data.password)) {
      errors.confirmPassword = "Password is not match!";
    } else {
      delete errors.confirmPassword;
    }

    if (data.IsAccepted) {
      delete errors.IsAccepted;
    } else {
      errors.IsAccepted = "Accept terms!";
    }
  }

  return errors;
};
