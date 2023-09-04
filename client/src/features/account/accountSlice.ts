
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/userr";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { json } from "stream/consumers";
import { router } from "../../app/router/Router";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;

}
export const signInUser=createAsyncThunk<User,FieldValues> (
    'account/signInUser',
    async (data,thunkAPI)=>{
        try{
            const userDto =await agent.Account.login(data)
            const {basket,...user}=userDto;
            if(basket){
                thunkAPI.dispatch(setBasket(basket))
            }
            localStorage.setItem('user',JSON.stringify(user));
            return user
            

        }catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data})

        }
    }
)
export const FetchCurrentUser=createAsyncThunk<User> (
    'account/fetchCurrentUser',
    async (_,thunkAPI)=>{
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try{
            const userDto =await agent.Account.currentUser()
            const {basket,...user}=userDto;
            if(basket){
                thunkAPI.dispatch(setBasket(basket))
            }
            localStorage.setItem('user',JSON.stringify(user));
            return user
            

        }catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data})

        }
    },
    {
        condition:()=>{
            if(!localStorage.getItem('user'))return false
        }
    }

)
const initialState: AccountState = {
    user: null

    
}
export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers:{
        signOut:(state)=>{
            localStorage.removeItem('user');
            state.user=null;
            router.navigate('/')
        },
        setUser:(state,action)=>{
            state.user=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(FetchCurrentUser.rejected,(state)=>{
            state.user=null
            localStorage.removeItem('user');
            toast.error('Session expired -please login again')
            router.navigate('/')
        })
        builder.addMatcher(
            isAnyOf(signInUser.fulfilled,FetchCurrentUser.fulfilled),
            (state,action)=>{
                state.user=action.payload
            });
            builder.addMatcher(
                isAnyOf(signInUser.rejected,FetchCurrentUser.rejected),
                (state,action)=>{
                   throw action.payload;
                }
            )

                
}})
export const {signOut,setUser}=accountSlice.actions;