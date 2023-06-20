import React, { useCallback, useEffect, useMemo, useState } from "react";
import storage from "../../firebaseConfig";
import { ref, getDownloadURL, deleteObject} from "firebase/storage";
import checkbox from "../../Icons/checkbox.svg";
import deleteIcon from "../../Icons/delete.svg";
import { Link } from "react-router-dom";
import useFetch  from "../../hooks/useFetch"
import useDelete  from "../../hooks/useDelete"
import Pagination from "../../components/UI/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";



const Home = () => {
  const { isLoading, error, sendRequest: fetchData } = useFetch();
  const { deleteData: deleteUser } = useDelete();
  // const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
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
    }
    fetchData({ url: "https://profile-react-436pr-default-rtdb.firebaseio.com/users.json"}, getData); 
    if(error) {
      alert(error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const deleteData = (deleteItem)=>{
    let deletedUser = items.filter((item)=> item.id === deleteItem)
    // const [ userProfile ] = deletedUser
    // console.log(userProfile.photo)
    //   let pictureRef = storage.refFromURL(userProfile.photo);
    //   console.log(pictureRef)
    //   pictureRef.delete()
    // deleteUser(deleteItem)
      // Create a reference to the file to delete
      deleteUser(deleteItem)
    items.splice(items.indexOf(deletedUser), 1)
  }
  const paginatedData = (filteredData) => {
    setItems(filteredData);
  }

  const [paginationObject, setPagination] = useState({
    rowsPerPage: 5,
    isInFirstPage: true,
    isInLastPage: false,
    currentPage: 1,
    numberOfPages: 0,
    paginatedItem: [],
  });
  const [lastPage, setLast] = useState();
  const [pageNumbers, setPageNumbers] = useState([]);
  const [defaultClass, setDefault] = useState(
    "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  );
  const [currentClass, setCurrent] = useState(
    "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  );
  useEffect(() => {
    let numbers = [];
    for (let i = 1; i <= items.length; i++) {
      numbers.push(i);
    }
    setPageNumbers(numbers);
    console.log(numbers)
  }, []);
  const paginate=(data, pageSize, pageNumber)=> {
    return data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }
  const pageMove = (value, tableData, paginationObject)=> {
    let dataLength = tableData.length;
    // This is for checking Even and Odd number of item and divde pages accordingly.
    paginationObject.numberOfPages =
      dataLength % paginationObject.rowsPerPage === 0
        ? Math.floor(dataLength / paginationObject.rowsPerPage)
        : Math.floor(dataLength / paginationObject.rowsPerPage) + 1;

    let data = paginate(tableData, paginationObject.rowsPerPage, value);

    setPagination((prevObj) => {
      return {
        ...prevObj,
        paginatedItem: data,
      };
    });

    paginatedData(paginationObject.paginatedItem);
  }
  const nextPage=()=> {
      setPagination((prevObj) => {
        return {
          ...prevObj,
          currentPage: paginationObject.currentPage !== pageNumbers.length? paginationObject.currentPage + 1 : paginationObject.currentPage,  
          isInLastPage: paginationObject.currentPage !== pageNumbers.length? false : true,
          isInFirstPage: false,
        };
      });
    pageMove(paginationObject.currentPage, items, paginationObject);
  }
  const prevPage=()=> {
      setPagination((prevObj) => {
        return {
          ...prevObj,
          currentPage: paginationObject.currentPage !== 1? paginationObject.currentPage - 1 : paginationObject.currentPage,
          isInLastPage: false,
          isInFirstPage: paginationObject.currentPage !== 1? false: true,
        };
      });
    pageMove(paginationObject.currentPage, items, paginationObject);
  }
  return (
    <>
      {!isLoading ? (
        <div>
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
                      <Link to={`${item.id}`}>
                      <button className="flex flex-row">
                        <img
                          src={checkbox}
                          alt="o"
                          className="h-4 w-4 mx-1 my-2"
                        />
                        <p className=" mt-1">Edit</p>
                      </button>
                      </Link>
                      <button className="flex text-rose-600 flex-row" onClick={() => deleteData(item.id)}>
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
        {/* <Pagination items={items} paginatedData ={ onPagination }/> */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            onClick={prevPage}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            onClick={nextPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">97</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
              <a
                href="#"
                onClick={prevPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
            {pageNumbers.map((element) => {
              return (
                <a
                  href="#"
                  onClick={pageMove(element, items, paginationObject)}
                  aria-current="page"
                  className={
                    paginationObject.currentPage === element
                      ? currentClass
                      : defaultClass
                  }
                >
                  {element}
                </a>
              );
            })}

            
              <a
                href="#"
                onClick={nextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
          </nav>
        </div>
      </div>
    </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </>
  );
};

export default Home;
