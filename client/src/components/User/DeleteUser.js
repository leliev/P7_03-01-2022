import React, {useState} from "react";
import axios from "axios";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik";


function DeleteUser(data) {

    const props = data.data;
    const URL = "http://localhost:8080/api/user/"
    const [confirm, setConfirm] = useState(false);

    const toggleConfirm = () => {
        setConfirm(!confirm)
    };


    const onClickDel = (value) => {

        console.log("field value:" + JSON.stringify(value))
        console.log(props.currentProfile)
        const payload = { "element": props.currentProfile.targetId, "user": props.user.id };
        const data = JSON.stringify(payload);
        console.log("data:" +  data);
        axios.delete(URL + data, { headers : { 'x-access-token': props.user.accessToken } })
          .then(() => {
              if (props.currentProfile.targetId === props.user.id) {
                sessionStorage.removeItem("user");
                window.location.replace('/');
              } else {
                window.location.replace("/");
              };
          }).catch((error) => {
            console.log(error.response.data.message);
          });
      };

      const initialValues = {
        confirm: ""
      };

      const confirmSchema = Yup.object().shape({
        confirm: Yup.string()
          .matches(/confirm/, "You must type 'confirm'")
          .required("Please confirm")
      });

  return (
    <>
      <button onClick={toggleConfirm}>
        Delete profile
      </button>
      {confirm && (
        <Formik
          initialValues={initialValues}
          validationSchema={confirmSchema}
          onSubmit={onClickDel}
        >
          <Form>
            <br />
            <ErrorMessage name="confirm" component="span" />
            <br />
            <label htmlFor="confirm">Enter "confirm" to delete </label>
            <br/>
            <Field
              aria-label="confirmation"
              id="confirm"
              name="confirm"
              placeholder="confirm"
              autoComplete="off"
            />
            <br/>
            <button type="submit">
              Delete
            </button>
          </Form>
        </Formik>
      )}
    </> 
    );
};

export default DeleteUser;
