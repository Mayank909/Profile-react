import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyCAV7ugu01nR-DP6IQhX5lDtKChsvbrPwY",
    authDomain: "profile-react-436pr.firebaseapp.com",
    databaseURL: "https://profile-react-436pr-default-rtdb.firebaseio.com",
    projectId: "profile-react-436pr",
    storageBucket: "profile-react-436pr.appspot.com",
    messagingSenderId: "870329080047",
    appId: "1:870329080047:web:6267574ae8e9a7a13f231a"
});
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;