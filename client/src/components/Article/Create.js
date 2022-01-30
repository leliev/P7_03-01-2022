import React, {useEffect, useState} from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { articleSchema } from "../../helpers/Schema/articleSchema";

function Create(props) {

  const user = props.props
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    console.log(user.id)
    setMessage("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const validationSchema = articleSchema;
  const initialValues = {
    title: "",
    content: ""
  };

  const onSubmit = (data) => {
    
    const payload = {
      ...data,
      id: user.id
    };

    axios.post("http://localhost:8080/api/article", payload, { headers : { 'x-access-token': user.accessToken } })
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
          <h1>Share your story</h1>
          <br />
          <ErrorMessage name="title" component="span" />
          <br />
          <label htmlFor="title">Title : </label>
          <br/>
          <Field
            aria-label="titre de l'article"
            id="title"
            name="title"
            placeholder="My Title"
            autoComplete="off"
          />
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

export default Create;