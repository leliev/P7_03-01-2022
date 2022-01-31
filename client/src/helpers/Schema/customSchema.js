import * as Yup from "yup";

export const customSchema = Yup.object().shape({
    content: Yup.string()
      .required('Veuillez remplir ce champ'),
});