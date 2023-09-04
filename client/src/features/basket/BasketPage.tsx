import { useEffect, useState } from "react";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { error } from "console";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  addBasketItemAsync,
  removeBasketItemAsyc,
  setBasket,
} from "./basketSlice";
import BasketTable from "./BasketTable";

export default function BasketPage() {
  // const {basket,setBasket,removeItem}=useStoreContext();
  const { basket } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  // const[status,setStatus]=useState({
  //   loading:false,
  //   name:''
  // });

  // function handleAddItem(productId:number,name:string){
  //   setStatus({loading:true,name});
  //   agent.Basket.addItem(productId)
  //   .then(basket=>dispatch( setBasket(basket)))
  //   .catch(error=>console.log(error))
  //   .finally(()=>setStatus({loading:false,name:''}))
  // }
  // function handleRemoveItem(productId:number,quantity= 1,name:string){
  //   setStatus({loading:true,name});
  //   agent.Basket.removeItem(productId,quantity)
  //   .then(()=>dispatch(removeItem({productId,quantity})))
  //   .catch(error=>console.log(error))
  //   .finally(()=>setStatus({loading:false,name:''}))
  // }

  if (!basket)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <BasketTable items={basket.items} />
      
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
