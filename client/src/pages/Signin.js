import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signinSchema } from "../helpers/signinSchema";

function Signin() {

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
    password: '',
  };
  const validationSchema = signinSchema;

  const onSubmit = (data) => {
    axios.post("http://localhost:8080/api/auth/signin", data)
      .then((res) => {
        
        if (res.data) {
          const user = res.data;
          sessionStorage.setItem("user", JSON.stringify(user));
          navigate('/');
        };

      }).catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  return (
    <div>
      {message && (
        <span>{message}</span>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="sign_form">
          <h1>Enregistez vous</h1>
          <br />
          <ErrorMessage name="username" component="span" />
          <br />
          <label htmlFor="username">Name : </label>
          <Field
            aria-label="votre nom d'utilisateur"
            id="username"
            name="username"
            placeholder="Votre nom d'utilisateur"
            autoComplete="off"
          />
          <br />
          <ErrorMessage name="password" component="span" />
          <br />
          <label htmlFor="password">Mot de passe : </label>
          <Field
            aria-label="votre mot de passe"
            id="password"
            type="password"
            name="password"
            placeholder="Votre mot de passe"
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
    </div>
  )
}

export default Signin;