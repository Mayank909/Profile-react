import useFetch  from "./useFetch"

const useDelete = () => {
  const { isLoading: deleteLoder, error: deleteError, sendRequest: deleteRequest } = useFetch();
const deleteData = (deleteItem)=>{
    deleteRequest({url: `https://profile-react-436pr-default-rtdb.firebaseio.com/users/${deleteItem}.json`,
    method: 'DELETE'
  })
  if(deleteError) {
    alert(deleteError)
  }
  }
  return {
    deleteLoder,
    deleteError,
    deleteData,
  };
}

export default useDelete