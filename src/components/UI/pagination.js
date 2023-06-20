import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function Pagination(props) {
  const [paginationObject, setPagination] = useState({
    rowsPerPage: 5,
    isInFirstPage: true,
    isInLastPage: false,
    currentPage: 1,
    numberOfPages: 0,
    paginatedItem: [1],
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
    for (let i = 1; i <= props.items.length; i++) {
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

    props.paginatedData(paginationObject.paginatedItem);
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
    pageMove(paginationObject.currentPage, props.items, paginationObject);
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
    pageMove(paginationObject.currentPage, props.items, paginationObject);
  }
  return (
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
                  onClick={pageMove(element, props.items, paginationObject)}
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
  );
}
