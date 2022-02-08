import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupSchema } from "../helpers/Schema/signupSchema";
import icon from "../images/icon.svg"

function Signup() {
  const {userState} = useContext(UserContext)
  const [isSubmited, setIsSubmited] = useState(false);
  const [message, setMessage] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    //Check context if user logged or not
    const user = userState;
    //Send user to home if logged
    if (user.isLogged) {
      navigate("/")
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  //Initial form values
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmation: '',
  };
  //From imported validation schema
  const validationSchema = signupSchema;
  
  const onSubmit = (data) => {
    axios.post(process.env.REACT_APP_BASE_URL + "/auth/signup", data)
      .then((res) => {
        //If submit successful display response and info
        if (res.data) {
          setMessage(res.data.message);
          setIsSubmited(true);
        };
      //If not display error message
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
        <p className="response">Please Login to review content</p>
      ):(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="base_form">
            <h1>Account creation</h1>
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