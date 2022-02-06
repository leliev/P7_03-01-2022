import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'At least 3 characters')
    .max(15, '15 characters max')
    .required('This field is required'),
  email: Yup.string()
    .email('Invalid email (jean@jean.com)')
    .required('This field is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .max(18, '15 characters max')
    .required('This field is required')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
      'At least one uppercase, one lowercase and one digit'
    ),
  confirmation: Yup.string()
    .oneOf(
      [Yup.ref('password'), null],
      "Passwords don't match"
    )
    .required('This field is required'),
});