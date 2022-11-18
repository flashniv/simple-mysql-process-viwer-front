import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import IndexPage from "./pages/index/IndexPage";
import {useState} from "react";
import NavBar from "./components/NavBar/NavBar";
import Login from "./pages/login/Login";
import API from "./API/API";
import Processes from "./pages/processes/Processes";

let theme = createTheme({
    palette: {
        primary: {
            main: '#76607d',
        },
        secondary: {
            main: '#628d5b',
        }
    }
})

function App() {
    const [title, setTitle] = useState("")
    const [alert, setAlert] = useState(<></>)
    const [loggedIn, setLoggedIn] = useState(API.isLoggedIn());

    const setAlertWithTimer = function (newAlert){
        setAlert(newAlert)
        window.setTimeout(()=>{
            setAlert(<></>)
        },3000)
    }

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar title={title} loggedIn={loggedIn} setLoggedIn={setLoggedIn} alert={alert}
                        setAlert={setAlertWithTimer}/>
                <Routes>
                    <Route path="/" element={<IndexPage setTitle={setTitle}/>}/>
                    <Route path="/login"
                           element={<Login setTitle={setTitle} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/processes"
                           element={<Processes setTitle={setTitle} setAlert={setAlertWithTimer} loggedIn={loggedIn}/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
