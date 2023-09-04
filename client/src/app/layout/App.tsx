import { useCallback, useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/catalog";
import { Container, CssBaseline, Typography, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync, setBasket } from "../../features/basket/basketSlice";
import { FetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();
  // const{setBasket}=useStoreContext();
  const dispatch = useAppDispatch();
  const [loading, setloading] = useState(true);
  const initApp = useCallback(async () => {
    try {
      await dispatch(FetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  //setBasket means the dependency which is needed
  useEffect(() => {
    // const buyerId=getCookie('buyerId');
    // dispatch(FetchCurrentUser())
    // if(buyerId){
    //   agent.Basket.get()
    //   .then(basket=>dispatch(setBasket(basket)))
    //   .catch(error=>console.log(error))
    //   .finally(()=>setloading(false));
    // }else{
    //   setloading(false);
    // }
    initApp().then(() => setloading(false));
  }, [initApp]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });
  function changeMode() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      {/* use Mui css */}
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} changeMode={changeMode} />
      {/* container centers your content horizontally */}
      {loading ? (
        <LoadingComponent message="Initialising app ..."></LoadingComponent>
      ) : location.pathname === "/" ? (
        <HomePage></HomePage>
      ) : (
        <Container sx={{mt:4}}>
          {/* use router to change the web page */}
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;
