import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customSchema } from "../../helpers/Schema/customSchema";

function Modify(data) {
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const {userState} = useContext(UserContext);
  const user = userState;
  const props = data.data
  const [displayForm, setDisplayForm] = useState(false);
  const [message, setMessage] = useState(null);


  const validationSchema = customSchema;
  const initialValues = {
    content: props.element.content
  };

  let URL = "";

  if (props.target === "article") {
    URL = "http://localhost:8080/api/article/";
  } else {
    URL = "http://localhost:8080/api/comment/";
  };

  const onSubmit = (data) => {
    //console.log(data)
    const payload = {
      ...data,
      id: user.id
    };

    axios.put(URL + props.element.id, payload, { headers : { 'x-access-token': accessToken } })
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
    <>
      {message && (
        <span className="error_response">{message}</span>
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
              <h3>Modify your story</h3>
              <label htmlFor="content">Content : </label>
              <Field
                as="textarea"
                aria-label="votre histoire"
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
          <button className="popup_form_button" onClick={toggleForm} >
            Modify
          </button>
        </>
      )}
      
    </>
  )
}

export default Modify;