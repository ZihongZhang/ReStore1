import { create } from "domain";
import { Basket } from "../models/basket";
import { PropsWithChildren, createContext, useContext, useState } from "react";

interface StoreContextValue{
    basket:Basket|null;
    setBasket:(Basket:Basket)=>void;
    removeItem:(productId:number,quantity:number)=>void;

}

export const StoreContext=createContext<StoreContextValue|undefined>(undefined);
export function useStoreContext(){
    //to get access to the store context
    const context =useContext(StoreContext);
    if(context == undefined){
        throw Error('Oops - we do not seem to be inside the provider');
    }
    return context;
}

export function StoreProvider({children}:PropsWithChildren<any>){
    const [basket,setBasket]=useState<Basket|null>(null);
    function removeItem(productId:number,quantity:number){
        if(!basket) return;
        //make a copy of items
        const items =[...basket.items];
       
        const itemIndex=items.findIndex(i=>i.productId===productId);
        if(itemIndex>=0){
            items[itemIndex].quantity-=quantity;
            //remove the item from the array
            if(items[itemIndex].quantity===0)items.splice(itemIndex,1);
            setBasket(prevState=>{
                //replace with items
                return{...prevState!,items}
            })
        }
    }
    return(
        <StoreContext.Provider value={{basket,setBasket,removeItem}}>
            {children}
        </StoreContext.Provider>
    )

} 