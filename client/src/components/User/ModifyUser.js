import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik";

function ModifyUser(data) {

  const props = data.data;
  const [message, setMessage] = useState(null);

  const initialValues = {
    username: "",
    email: "",
    old_password: "",
    password: "",
    password_confirmation: ""
  };

  const formSchema = Yup.object().shape({
    email: Yup.string().email(),
    password: Yup.string()
      .min(6, 'At least than 6 characters')
      .max(18, 'No more than 18 characters')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
        'At least one uppercase, one lowercas and one digit'
      ),
    password_confirmation: Yup.string().when("password", {
      is: value => value && value.length > 0,
      then: Yup.string()
        .required(
          "Confirm password is required when setting new password."
        )
        .oneOf([Yup.ref("password"), null], "Must match new password."),
      otherwise: Yup.string()
      }),
    old_password: Yup.string().when("password", {
      is: value => value && value.length > 0,
      then: Yup.string().required(
        "Old password is required when setting new password"
      ),
      otherwise: Yup.string()
    })
  });

  const handleFormSubmit = (values, bag) => {
    var payload = {
      email: values.email,
      old_password: values.old_password,
      password: values.password,
      password_confirmation: values.password_confirmation
    }

    function removeEmptyKeys(values) {
      Object.keys(values).map((key)=> {
      if(payload && payload[key] === "") {
        delete payload[key]
      };
      return payload
    })};

    removeEmptyKeys(values);

    if (Object.keys(payload).length === 0) {
      setMessage("You must at least update one field!")
    } else {
      console.log(payload)
      const prepData = new FormData();
      prepData.append('id', props.user.id);
      Object.keys(payload).map((key) => {
        prepData.append(key, payload[key])
        return prepData
      });
      console.log(prepData)
      axios.put(`http://localhost:8080/api/user/${props.currentProfile.targetId}`, 
        prepData, { headers : { 'x-access-token': props.user.accessToken } 
      }).then((res) => {
        window.location.replace(`/user/${props.currentProfile.username}`);
      }).catch((error) => {
        console.log(error.response.data.message || "user update failed");
      });
    };
    bag.setSubmitting(false);
  };

  return (
    <div>
      {message && (
        <span>{message}</span>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleFormSubmit}
      >
      {({ isValid, isSubmitting }) => (
        <Form>
          <br />
          <ErrorMessage name="email" component="span" />
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
          <ErrorMessage name="old_password" component="span" />
          <br />
          <label htmlFor="old_password">Old Password : </label>
          <Field
            aria-label="votre ancien mot de passe"
            id="old_password"
            type="password"
            name="old_password"
            placeholder="Old Password"
            autoComplete="off"
          />
          <br />
          <ErrorMessage name="password" component="span" />
          <br />
          <label htmlFor="password">New password : </label>
          <Field
            aria-label="votre nouveau mot de passe"
            id="password"
            type="password"
            name="password"
            placeholder="New password"
            autoComplete="off"
          />
          <br />
          <ErrorMessage name="password_confirmation" component="span" />
          <br />
          <label htmlFor="password_confirmation">Confirmation : </label>
          <Field
            aria-label="confirmez votre mot de passe"
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Confirmation"
            autoComplete="off"
          />
          <br/>
          <button
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            Modify
          </button>
        </Form>
      )}
      </Formik>
    </div>
  );
};

export default ModifyUser;