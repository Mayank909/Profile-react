import Input from "../components/UI/Input";
import Label from "../components/UI/label";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import React, { useEffect, useState, useRef } from "react";
import storage from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

// import useFetch from "../hooks/useFetch";
const UserData = (props) => {
  const params = useParams();
  // const [
  //   isLoading: updateLoading,
  //   error: updateError,
  //   sendRequest: updateUser,
  // ] = useFetch();
  // async function updateUserHandler() {
  //   updateUser({
  //     url: `https://profile-react-436pr-default-rtdb.firebaseio.com/users.json/${params.userId}`,
  //     method: "POST",
  //     body: data,
  //     headers: { "Content-Type": "application/json" },
  //   })

  const { isLoading, error, sendRequest: sendUserData } = useFetch();
  useEffect(() => {}, []);
  const image = useRef();
  const toDashboard = useNavigate();
  const [file, setFile] = useState("");
  const [invalidPass, setInvalidPass] = useState(false);
  const [mobileInvalid, setMobileInvalid] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    mobile: "",
    projects: "",
    photo: null,
    gender: "",
    password: "",
    confirm_pass: "",
    agree: false,
  });

  useEffect(() => {
    function getData(data) {
      const gotdata = () => {
        return {
          ...data,
          confirm_pass: data?.password,
        };
      };
      setUserInput(gotdata);
    }
    function fetchUserData() {
      sendUserData(
        {
          url: `https://profile-react-436pr-default-rtdb.firebaseio.com/users/${params.userId}.json`,
        },
        getData
      );
    }
    fetchUserData();
  }, [sendUserData, params.userId]);

  const inputHandler = (e) => {
    let input = e.target;
    if (input.name === "photo") {
      console.log(input.files[0]);
      setFile(input.files[0]);
    }
    if (input.name === "mobile")
      input.value.match(/^[9876][\d]{9}$/)
        ? setMobileInvalid(false)
        : setMobileInvalid(true);
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        [input.name]: input.value,
      };
    });
  };
  function updateImg(e) {
    // console.log(e.target.files)
    const [file] = e.target.files;
    console.log("changed", file);
    if (file) {
      setUserInput({ ...userInput, photo: URL.createObjectURL(file) });
      setFile(file);
      // console.log("img",userInput.photo)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (userInput.password === userInput.confirm_pass) {
      setInvalidPass(false);
      if (!mobileInvalid) {
        const storageRef = ref(storage, `/files/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        let imageUrl = "";
        await getDownloadURL(storageRef).then((url) => {
          imageUrl = url;
        });
        let imageData =  params.userId ? userInput.photo.split(":") : [];
        let imgDataTosend = null;
        if (!imageData[0] === "blob") {
          imgDataTosend = userInput.photo;
        }
        let userData = {
          ...userInput,
          photo: imgDataTosend || imageUrl,
        };
        console.log(userData);
        (await params.userId) ? updateData(userData) : sendData(userData);
      }
    } else {
      setInvalidPass(true);
    }
  };
  async function updateData(data) {
    sendUserData({
      url: `https://profile-react-436pr-default-rtdb.firebaseio.com/users/${params.userId}.json`,
      method: "PUT",
      body: data,
      headers: { "Content-Type": "application/json" },
    });
    if (error) {
      alert(error);
    }
    toDashboard("/dashboard");
  }
  async function sendData(data) {
    sendUserData({
      url: "https://profile-react-436pr-default-rtdb.firebaseio.com/users/.json",
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json" },
    });
    if (error) {
      alert(error);
    }
    toDashboard("/dashboard");
  }
  return (
    <>
      {!isLoading && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-16 w-auto"
              src="https://img.freepik.com/free-photo/assortment-leaves-flowers-white-background_24972-2180.jpg?w=740&t=st=1685968831~exp=1685969431~hmac=0e63e5c43810ba60f214244a4121bc1e3dfd7c63277ad0325886ebfceac17a8f"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {params.userId ? "Welcome Back!" : "Welcome!"}
            </h2>
            <h3 className="mt-2 text-center text-xl font-bold leading-6 tracking-tight text-gray-900">
              {params.userId
                ? "Update your Profile Details"
                : "Register in your account"}
            </h3>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              action="#"
              onSubmit={submitHandler}
              method="POST"
            >
              <div className="flex flex-row">
                <div>
                  <Label labelFor="name">Name</Label>
                  <Input
                    input="name"
                    onChange={(e) => inputHandler(e)}
                    value={userInput?.name}
                    required={true}
                    type="text"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <Label labelFor="email" className="ml-2">
                    Email address
                  </Label>
                  <Input
                    input="email"
                    className="ml-2"
                    onChange={(event) => inputHandler(event)}
                    value={userInput?.email}
                    required={true}
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex flex-row">
                <div>
                  <Label labelFor="mobile">Mobile Number</Label>
                  <Input
                    input="mobile"
                    onChange={(event) => inputHandler(event)}
                    value={userInput?.mobile}
                    required={true}
                    className={mobileInvalid && "border-2 border-rose-600"}
                    name="mobile"
                    type="tel"
                  />
                </div>

                <div className="ml-2">
                  <Label labelFor="projects">Projects</Label>
                  <div className="mt-2">
                    <select
                      name="projects"
                      className="block p-2 w-full h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id="projects"
                      onChange={(event) => inputHandler(event)}
                      value={userInput?.projects}
                    >
                      <option value="select">--Select--</option>
                      <option value="volvo">Volvo</option>
                      <option value="saab">Saab</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="audi">Audi</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-start">
                <div className="">
                  {!params.userId && <Label labelFor="photo">Photo</Label>}
                  <Input
                    input="photo"
                    accept="image/*"
                    ref={image}
                    required={false}
                    onChange={
                      params.userId
                        ? (e) => updateImg(e)
                        : (event) => inputHandler(event)
                    }
                    type="file"
                    className={`w-[80%] ${params.userId ? "hidden" : ""}`}
                  />
                  {params.userId && (
                    <div className="h-25 w-25 mr-4">
                      <Label labelFor="photo">
                        <img
                          src={userInput.photo || image.value}
                          alt="user"
                          width="200px"
                          height="200px"
                        />
                      </Label>
                    </div>
                  )}
                </div>
                {params.userId ? (
                  <div className="py-12">
                    <legend className="block text-sm font-medium leading-6 text-gray-900 text-center">
                      Gender
                    </legend>
                    <div className="flex flex-row mt-3">
                      <Label labelFor="male" className=" ml-2">
                        Male
                      </Label>
                      <div className="mt-0.5 ml-2">
                        <input
                          id="male"
                          name="gender"
                          value={userInput?.gender}
                          type="radio"
                          autoComplete=""
                          required
                          checked={userInput.gender === "male" ? true : false}
                          onChange={(event) => inputHandler(event)}
                          className="w-4 h-4"
                        />
                      </div>
                      <Label labelFor="female" className=" ml-2">
                        Female
                      </Label>
                      <div className="mt-0.5 ml-2">
                        <input
                          id="female"
                          name="gender"
                          type="radio"
                          value={userInput?.gender}
                          onChange={(event) => inputHandler(event)}
                          autoComplete=""
                          required
                          checked={userInput.gender === "female" ? true : false}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <legend className="block text-sm font-medium leading-6 text-gray-900">
                      Gender
                    </legend>
                    <div className="flex flex-row mt-3">
                      <Label labelFor="male" className=" ml-2">
                        Male
                      </Label>
                      <div className="mt-0.5 ml-2">
                        <input
                          id="male"
                          name="gender"
                          type="radio"
                          autoComplete=""
                          required
                          onChange={(event) => inputHandler(event)}
                          className="w-4 h-4"
                        />
                      </div>
                      <Label labelFor="female" className=" ml-2">
                        Female
                      </Label>
                      <div className="mt-0.5 ml-2">
                        <input
                          id="female"
                          name="gender"
                          type="radio"
                          onChange={(event) => inputHandler(event)}
                          autoComplete=""
                          required
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row">
                <div>
                  <div className="flex items-center justify-between">
                    <Label labelFor="password">Password</Label>
                  </div>
                  <Input
                    input="password"
                    onChange={(event) => inputHandler(event)}
                    value={userInput?.password}
                    inputDivClass="mr-2"
                    required={true}
                    type="password"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label labelFor="confirm_pass">Confirm Password</Label>
                  </div>
                  <Input
                    input="confirm_pass"
                    className={invalidPass && "border-2 border-red-600"}
                    type="password"
                    required={true}
                    onChange={(event) => inputHandler(event)}
                    value={userInput?.confirm_pass}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {params.id && (
                <div className="flex flex-row">
                  <div className="mt-0.5 ml-2">
                    <input
                      id="agree"
                      name="agree"
                      type="checkbox"
                      onChange={(event) => inputHandler(event)}
                      value={userInput?.agree}
                      autoComplete=""
                      required
                      className="w-4 h-4"
                    />
                  </div>
                  <Label labelFor="agree" className="ml-2">
                    I accept the terms and conditions.
                  </Label>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {params.userId ? "Update" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserData;
