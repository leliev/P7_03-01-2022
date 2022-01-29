import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Au moins 3 caractères')
    .max(15, 'Pas plus de 15 caractères')
    .required('Veuillez remplir ce champ'),
  email: Yup.string()
    .email('Email non valide (nom@email.com)')
    .required('Veuillez remplir ce champ'),
  password: Yup.string()
    .min(6, 'Au moins 6 caractères')
    .max(18, 'Pas plus de 18 caractères')
    .required('Veuillez remplir ce champ')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
      'Doit contenir une majuscule, une minuscule et un chiffre '
    ),
  confirmation: Yup.string()
    .oneOf(
      [Yup.ref('password'), null],
      'Les mots de passes ne correspondent pas'
    )
    .required('Veuillez remplir ce champ'),
});