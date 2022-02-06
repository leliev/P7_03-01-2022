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
  const URL = process.env.REACT_APP_BASE_URL + "/user/"
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  //Manage the confirm form display
  const toggleConfirm = () => {
    setConfirm(!confirm)
  };

  const onClickDel = (value) => {

    console.log("field value:" + JSON.stringify(value))
    console.log(props.currentProfile)
    //Set params to send
    const payload = { "element": props.currentProfile.targetId, "user": user.id };
    const data = JSON.stringify(payload);
    console.log("data:" +  data);
    //Send the delete user request
    axios.delete(URL + data, { headers : { 'x-access-token': accessToken } })
      .then(() => {
        //If current user is the target of delete activate logout
        if (props.currentProfile.targetId === user.id) {
          sessionStorage.removeItem("accessToken");
          navigate('/');
        } else {
          //Else user should be admin and navigate to admin page
          navigate('/admin');
        };
      }).catch((error) => {
        //Or save error message in state to display
        props.data.error(error.response.data.message);
      });
  };
  //Initial confirm value
  const initialValues = {
    confirm: ""
  };
  //Simple validation schema validate only on "confirm" value
  const confirmSchema = Yup.object().shape({
    confirm: Yup.string()
      .matches(/confirm/, "You must type 'confirm'")
      .required("Please confirm")
  });

  return (
    <>
      <button onClick={toggleConfirm} className="base_form_closebtn">
        {confirm ? ("Close") : ("Delete profile")} 
      </button>
      {confirm && (
        <Formik
          initialValues={initialValues}
          validationSchema={confirmSchema}
          onSubmit={onClickDel}
        >
          <Form className="popup_form">
            <button onClick={toggleConfirm}className="base_form_closebtn">
              Close
            </button>
            <label htmlFor="confirm">Enter "confirm" to delete </label>
            <Field
              aria-label="confirmation"
              id="confirm"
              name="confirm"
              placeholder="confirm"
              autoComplete="off"
            />
            <br />
            <ErrorMessage name="confirm" component="span" className="form_error"/>
            <br/>
            <button type="submit" className="base_form_closebtn">
              Delete
            </button>
          </Form>
        </Formik>
      )}
    </> 
  );
};

export default DeleteUser;
