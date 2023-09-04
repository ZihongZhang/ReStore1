import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductLIst";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { error } from "console";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductAsync, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catlogSlice";
import { type } from "os";
import Productsearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";
import { setBasket } from "../basket/basketSlice";




const sortOptions=[
  {value:'name',label:'Alphabetical'},
  {value:'priceDesc',label:'Price-High to low'},
  {value:'price',label:'Price-Low to high '}
]


export default function Catalog(){
    // const [products,setProducts]=useState<Product[]>([]);
    const products =useAppSelector(productSelectors.selectAll);
    const dispatch= useAppDispatch();
    const{productsLoaded,filtersLoaded,brands,types,productParams,metaData}=useAppSelector(state=>state.catlog)


    // useEffect(()=>{
    //   fetch('http://localhost5138/api/products')
    //   .then(Response=>Response.json)
    //   .then(data=>setProducts(data))
    // })
    // const [Loading,setLoading] = useState(true);

    useEffect(()=>{
      if(!productsLoaded){
        dispatch(fetchProductsAsync())
        
      }
      
      // agent.Catlog.list()
      // .then(Response=>setProducts(Response))
      // .catch(error=>console.log(error))
      // .finally(()=>setLoading(false))
    },[productsLoaded,dispatch])

    useEffect(()=>{
      if(!filtersLoaded)dispatch(fetchFilters());


    },[dispatch,filtersLoaded])

    if(!filtersLoaded) return<LoadingComponent message="Loading products..."/>
    
    return(
        <Grid container columnSpacing={4}>
          <Grid item xs={3}>
            <Paper sx={{mb:2}}>
              
              <Productsearch/>
              
              
            </Paper>
            <Paper sx={{mb:2,p:2}}>
              <RadioButtonGroup
              selectedValue={productParams.orderBy}
              onChange={(e)=>dispatch(setProductParams({orderBy: e.target.value}))}
              options={sortOptions}
              /> 
            </Paper>
            <Paper>
              <CheckboxButtons
              items={brands}
              checked={productParams.brands}
              onChange={(items:string[])=>dispatch(setProductParams({brands:items}))}
              />
            </Paper>
            <Paper>
            <CheckboxButtons
              items={types}
              checked={productParams.types}
              onChange={(items:string[])=>dispatch(setProductParams({types:items}))}
              />
            </Paper>
            
          </Grid>
          <Grid item xs={9}>
            <ProductList products={products}/>
          
          </Grid>  
          <Grid item xs={3}></Grid> 
        <Grid item xs={9} sx={{mb:2}}>
          {metaData&&
            <AppPagination
            metaData={metaData}
            onPageChange={(page:number)=>dispatch(setPageNumber({pageNumber:page}))}
            
            />}
            
          </Grid>    
      </Grid>
      )
}