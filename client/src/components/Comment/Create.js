import React, {useEffect, useContext, useState} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customSchema } from "../../helpers/Schema/customSchema";

function Create(data) {
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const {userState} = useContext(UserContext);
  const user = userState;
  const props = data.data
  const [displayForm, setDisplayForm] = useState(false);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    console.log(props)
    setMessage("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const validationSchema = customSchema;
  const initialValues = {
    content: ""
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      id: user.id
    };

    axios.post(`http://localhost:8080/api/comment/${props.element.id}`, payload, { headers : { 'x-access-token': accessToken } })
      .then((response) => {
        console.log(response.data.message);
        toggleForm();
        props.func();
      }).catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  function toggleForm() {
    setDisplayForm(!displayForm);
  };
  return (
    <div>
      {message && (
        <span>{message}</span>
      )}
      {displayForm ? (
        <>
          <button className="popup_form_closebtn" onClick={toggleForm}>
            Close form
          </button>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="popup_form">
              <button className="base_form_closebtn" onClick={toggleForm}>
                Close form
              </button>
              <h3>Comment article</h3>
              <label htmlFor="content">Content : </label>
              <Field
                as="textarea"
                aria-label="votre commentaire"
                id="content"
                name="content"
                placeholder="My story"
                autoComplete="off"
              />
              <br />
              <ErrorMessage name="content" component="span" className="form_error"/>
              <br />
              <br />
              <button
                className="base_form_button"
                type="submit"
                aria-label="valider"
              >
                Submit
              </button>
            </Form>
          </Formik>
        </> 
      ) : (
        <>
          <button className="popup_form_button" onClick={toggleForm}>
            Comment
          </button>
        </>
      )}
    </div>
  )
}

export default Create;