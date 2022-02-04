import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom"


function DeleteUser(data) {

    const props = data.data;
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
    const { userState } = useContext(UserContext);
    const user = userState;
    const URL = "http://localhost:8080/api/user/"
    const [confirm, setConfirm] = useState(false);
    const navigate = useNavigate();

    const toggleConfirm = () => {
        setConfirm(!confirm)
    };


    const onClickDel = (value) => {

        console.log("field value:" + JSON.stringify(value))
        console.log(props.currentProfile)
        const payload = { "element": props.currentProfile.targetId, "user": user.id };
        const data = JSON.stringify(payload);
        console.log("data:" +  data);
        axios.delete(URL + data, { headers : { 'x-access-token': accessToken } })
          .then(() => {
              if (props.currentProfile.targetId === user.id) {
                sessionStorage.removeItem("user");
                navigate('/');
              } else {
                navigate('/admin');
              };
          }).catch((error) => {
            props.data.error(error.response.data.message);
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
