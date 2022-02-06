import * as Yup from "yup";

export const signinSchema = Yup.object().shape({
  username: Yup.string()
    .required('Please enter name'),
  password: Yup.string()
    .required('Please enter password'),
});