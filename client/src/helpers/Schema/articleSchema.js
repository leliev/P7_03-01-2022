import * as Yup from "yup";

export const articleSchema = Yup.object().shape({
  title: Yup.string()
    .required('Veuillez remplir ce champ'),
  content: Yup.string()
    .required('Veuillez remplir ce champ'),
});