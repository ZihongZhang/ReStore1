import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catlogSlice";
import { useState } from "react";

export default function Productsearch(){
    const {productParams}=useAppSelector(state=>state.catlog)
    const dispatch=useAppDispatch();
    const [searchTerm,setSearchTerm]=useState(productParams.searchTerm)

    const debouncedSearch =debounce((event:any)=>{
        dispatch(setProductParams({ searchTerm: event.target.value}))
    },1000)
    return <TextField label='search products'
              variant="outlined"
              fullWidth
              value={searchTerm||''}
              onChange={(event:any)=>{
                setSearchTerm(event.target.value);
                debouncedSearch(event)
              }}
              />
}