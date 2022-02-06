import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupSchema } from "../helpers/Schema/signupSchema";
import icon from "../images/icon.svg"

function Signup() {

  const [isSubmited, setIsSubmited] = useState(false);
  const [message, setMessage] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      navigate("/")
    }
  });

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
        if (res.data) {
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
        <span className="error_response">{message}</span>
      )}

      {isSubmited ? (
        <p>Please Login to review content</p>
      ):(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="base_form">
            <h1>Créer un compte</h1>
            <img src={icon} alt="Logo groupomania rouge simple"/>
            <label htmlFor="username">Name : </label>
            <Field
              aria-label="votre nom d'utilisateur"
              id="username"
              name="username"
              placeholder="User name"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="username" component="span" className="form_error"/>
            <br />
            <label htmlFor="email">E-mail : </label>
            <Field
              aria-label="votre adresse email"
              id="email"
              name="email"
              placeholder="E mail"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="email" component="span" className="form_error"/>
            <br />
            <label htmlFor="password">Password : </label>
            <Field
              aria-label="votre mot de passe"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="password" component="span" className="form_error"/>
            <br />
            <label htmlFor="confirmation">Confirmation : </label>
            <Field
              aria-label="confirmer votre mot de passe"
              id="confirmation"
              type="password"
              name="confirmation"
              placeholder="Password confirm"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="confirmation" component="span" className="form_error"/>
            <br />
            <br />
            <button
              className="base_form_button"
              type="submit"
              aria-label="valider"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
      )}
    </div>
  );
}

export default Signup;