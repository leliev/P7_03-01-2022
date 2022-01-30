import * as Yup from "yup";

export const signinSchema = Yup.object().shape({
  username: Yup.string()
    .required('Veuillez remplir ce champ'),
  password: Yup.string()
    .required('Veuillez remplir ce champ'),
});