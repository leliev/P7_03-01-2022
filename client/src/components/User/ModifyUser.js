import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik";

function ModifyUser(data) {

  const props = data.data;
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const { userState } = useContext(UserContext);
  const user = userState;
  const [displayForm, setDisplayForm] = useState(false);

  //Initial form values
  const initialValues = {
    username: "",
    email: "",
    old_password: "",
    password: "",
    password_confirmation: ""
  };
  //Validation schema similar to user signup
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
    //Set the data in temporary object
    var payload = {
      email: values.email,
      old_password: values.old_password,
      password: values.password,
      password_confirmation: values.password_confirmation
    }
    //Clean empty key from object
    function removeEmptyKeys(values) {
      Object.keys(values).map((key)=> {
      if(payload && payload[key] === "") {
        delete payload[key]
      };
      return payload
    })};
    removeEmptyKeys(values);
    //If no key left no data where entered send error message
    if (Object.keys(payload).length === 0) {
      props.error("You must at least update one field!")
    } else {
      //Format the data to send with user ID and cleaned up object
      console.log(payload)
      const prepData = new FormData();
      prepData.append('id', user.id);
      Object.keys(payload).map((key) => {
        prepData.append(key, payload[key])
        return prepData
      });
      console.log(prepData)
      //Send the data to server for update
      axios.put(process.env.REACT_APP_BASE_URL + `/user/${props.currentProfile.targetId}`, 
        prepData, { headers : { 'x-access-token': accessToken } 
      }).then(() => {
        //If success close form and activate refresh
        console.log(displayForm)
        toggleForm();
        props.func();
      }).catch((error) => {
        //Or save error message in state to display
        props.error(error.response.data.message);
      });
    };
    //Set formik submit state off
    bag.setSubmitting(false);
  };
  //Form display action
  function toggleForm() {
    setDisplayForm(!displayForm);
  };

  return (
    <>
      <button onClick={toggleForm} className={displayForm ? "base_form_closebtn" : "base_form_button"}>
        {displayForm ? "Close" : "Update user"}
      </button>
      {displayForm && (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={handleFormSubmit}
          >
          {({ isValid, isSubmitting, touched, errors }) => (
            <Form className="popup_form">
              <button onClick={toggleForm} className="base_form_closebtn">Close</button>
              <h3>Modify your info</h3>
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
              <ErrorMessage name="old_password" component="span" className="form_error"/>
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
              <ErrorMessage name="password" component="span" className="form_error"/>
              
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
              <br />
              <ErrorMessage name="password_confirmation" component="span" className="form_error"/>
              <br/>
              <button
                className="base_form_button"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Modify
              </button>
            </Form>
          )}
          </Formik>
        </>
      )}
    </>
  );
};

export default ModifyUser;