import React, {useState} from "react";import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customSchema } from "../../helpers/Schema/customSchema";

function Modify(data) {

  const props = data.data
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
      id: props.user.id
    };

    axios.put(URL + props.element.id, payload, { headers : { 'x-access-token': props.user.accessToken } })
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
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
        <Form className="article_form">
          <h3>Modify your story</h3>
          <br />
          <ErrorMessage name="content" component="span" />
          <br />
          <label htmlFor="content">Content : </label>
          <br />
          <Field
            as="textarea"
            aria-label="votre histoire"
            id="content"
            name="content"
            placeholder="My story"
            autoComplete="off"
          />
          <br />
          <br />
          <button
            className="article_form_button"
            type="submit"
            aria-label="valider"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default Modify;