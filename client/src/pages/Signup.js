import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupSchema } from "../helpers/signupSchema";

function Signup() {
  const [isSubmited, setIsSubmited] = useState(false);
  const [message, setMessage] = useState(null);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmation: '',
  };
  const validationSchema = signupSchema;

  const onSubmit = (data) => {
    axios.post("http://localhost:8080/api/auth/signup", data)
      .then((res) => {
        console.log(res.data);
        if (res.ok) {
          setMessage(res.data.message);
          setIsSubmited(true);
        };
      }).catch((error) => {
        setMessage(error.response.data.message);
        console.log(error.response);
      });
  };

  return (
    <div>
      {message && (
        <span>{message}</span>
      )}

      {isSubmited ? (
        <p>Please Login to review content</p>
      ):(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="sign_form">
            <h1>Créer un compte</h1>
            <br />
            <ErrorMessage name="username" component="span" />
            <br />
            <label for="username">Name : </label>
            <Field
              aria-label="votre nom d'utilisateur"
              id="username"
              name="username"
              placeholder="Votre nom d'utilisateur"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="email" component="span" />
            <br />
            <label for="email">E-mail : </label>
            <Field
              aria-label="votre adresse email"
              id="email"
              name="email"
              placeholder="Votre adresse email"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="password" component="span" />
            <br />
            <label for="password">Mot de passe : </label>
            <Field
              aria-label="votre mot de passe"
              id="password"
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="confirmation" component="span" />
            <br />
            <label for="confirmation">Confirmation : </label>
            <Field
              aria-label="confirmer votre mot de passe"
              id="confirmation"
              type="password"
              name="confirmation"
              placeholder="Confirmez votre mot de passe"
              autoComplete="off"
            />
            <br />
            <br />
            <button
              className="sign_form_button"
              type="submit"
              aria-label="valider"
            >
              Valider
            </button>
          </Form>
        </Formik>
      )}
    </div>
  );
}

export default Signup;