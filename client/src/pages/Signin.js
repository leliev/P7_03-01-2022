import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signinSchema } from "../helpers/Schema/signinSchema";
import "../styles/base_form.css"
import icon from "../images/icon.svg"

function Signin() {
  
  const {userState} = useContext(UserContext)
  const [message, setMessage] = useState();
  let navigate = useNavigate();
  
  useEffect(() => {
    const user = userState;
    if (user.isLogged) {
      navigate("/")
    };
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
          sessionStorage.setItem("accessToken", JSON.stringify(res.data.accessToken));
          console.log("session:" + res.data.accessToken)
          window.location.replace('/');
        };

      }).catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  
  return (
    <>
      {message && (
        <span className="error_response">{message}</span>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="base_form">
          <h1>Sign In</h1>
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
          <br />
          <button
            className="base_form_button"
            type="submit"
            aria-label="valider"
          >
            Sign In
          </button>
        </Form>
      </Formik>
    </>
  )
}

export default Signin;