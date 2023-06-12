import React, { useEffect, useState } from "react";
import storage from "../../firebaseConfig";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import checkbox from "../../Icons/checkbox.svg";
import deleteIcon from "../../Icons/delete.svg";
import { Link } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  function getData(data) {
    const users = [];
    for (const key in data) {
      users.push({
        id: key,
        name: data[key].name,
        email: data[key].email,
        projects: data[key].projects,
        gender: data[key].gender,
        mobile: data[key].mobile,
        photo: data[key].photo,
      });
    }
    setItems(users);
    for (const element of items) {
      let file = element.photo.split("/");
      console.log(file);
      const storageRef = ref(storage, `files/${file[1]}`);
      getDownloadURL(storageRef).then((url) => {
        element[`photo`] = url;
        console.log(element.photo);
      });
    }
    setLoading(false);
  }
  useEffect(() => {
    try {
      setLoading(true);
      async function fetchData() {
        const respose = await fetch(
          "https://profile-react-436pr-default-rtdb.firebaseio.com/users.json"
        );
        if (!respose.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await respose.json();
        getData(data);
      }
      fetchData();
    } catch (e) {
      alert(e);
    }
  }, []);
  return (
    <>
      {!loading ? (
        <table className="table-auto border-2 rounded-lg border-gray-600 text-center table w-full ">
          <thead className="table-header-group">
            <tr className="table-row border-b-2 border-gray-500">
              <th className="table-cell">User</th>
              <th className="table-cell">Project</th>
              <th className="table-cell">Gender</th>
              <th className="table-cell">Mobile No.</th>
              <th className="table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <tr key={item.id} className="border-b-2 border-gray-500 p-2">
                  <td>
                    <div className="flex flex-row text-left px-2 m-2">
                      <img
                        className="h-12 w-12 mx-1 flex-none rounded-full bg-gray-50"
                        src={item.photo}
                        alt=""
                      />
                      <div className="min-w-0 ml-2 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {item.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{item.projects}</td>
                  <td>{item.gender}</td>
                  <td>{item.mobile}</td>
                  <td className="pl-16">
                    <div className="flex justify-evenly flex-col sm:mr-0 mr-20 sm:flex-row">
                      <Link to="/">
                      <button className="flex flex-row">
                        <img
                          src={checkbox}
                          alt="o"
                          className="h-4 w-4 mx-1 my-2"
                        />
                        <p className=" mt-1">Edit</p>
                      </button>
                      </Link>
                      <button className="flex text-rose-600 flex-row">
                        <img
                          src={deleteIcon}
                          alt="o"
                          className="h-4 w-4 mx-1 my-2"
                        />
                        <p className=" mt-1">Delete</p>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </>
  );
};

export default Home;
