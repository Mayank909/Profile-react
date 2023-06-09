import React, { useEffect, useState, useRef } from "react";
import storage  from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Input from "../components/Input";
import Label from "../components/label";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  useEffect(() => {}, []);
  const image = useRef();
  // const imga = useRef();
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

  const inputHandler = (e) => {
    let input = e.target;
    if (input.name === "photo") {

      console.log(input.files[0])
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (userInput.password === userInput.confirm_pass) {
      setInvalidPass(false);
      if (!mobileInvalid) {
        const storageRef = ref(storage, `/files/${file.name}`);
        await uploadBytesResumable(storageRef, file)
        let imageUrl = ''
        await getDownloadURL(storageRef)
        .then((url) => {
          imageUrl = url;
        })
        let userData = {
          ...userInput,
          photo: imageUrl,
        };
        console.log(userData);
        await sendData(userData);
      }
    } else {
      setInvalidPass(true);
    }
    function sendData(data) {
      fetch(
        "https://profile-react-436pr-default-rtdb.firebaseio.com/users.json",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((respose) => respose.json())
        .then((result) => {
          console.log(result);
        });
      toDashboard("/dashboard");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16 w-auto"
            src="https://img.freepik.com/free-photo/assortment-leaves-flowers-white-background_24972-2180.jpg?w=740&t=st=1685968831~exp=1685969431~hmac=0e63e5c43810ba60f214244a4121bc1e3dfd7c63277ad0325886ebfceac17a8f"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome!
          </h2>
          <h3 className="mt-2 text-center text-xl font-bold leading-6 tracking-tight text-gray-900">
            Register in your account
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
                  onChange={(event) => inputHandler(event)}
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
                <Label labelFor="photo">Photo</Label>
                <Input
                  input="photo"
                  accept="image/*"
                  ref={image}
                  onChange={(event) => inputHandler(event)}
                  type="file"
                  className="w-[80%]"
                />
                {/* <img ref={imga} src="" width='200px' height="200px" /> */}
              </div>
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
                      value="male"
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
                      value="female"
                      onChange={(event) => inputHandler(event)}
                      autoComplete=""
                      required
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div>
                <div className="flex items-center justify-between">
                  <Label labelFor="password">Password</Label>
                </div>
                <Input
                  input="password"
                  onChange={(event) => inputHandler(event)}
                  inputDivClass="mr-2"
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
                  onChange={(event) => inputHandler(event)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="mt-0.5 ml-2">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  onChange={(event) => inputHandler(event)}
                  autoComplete=""
                  required
                  className="w-4 h-4"
                />
              </div>
              <Label labelFor="agree" className="ml-2">
                I accept the terms and conditions.
              </Label>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
