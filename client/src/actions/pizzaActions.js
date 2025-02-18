import axios from "axios"



export const getAllPizzas=()=> async dispatch=>{
    
    
   let authors;

    dispatch({type:'GET_PIZZAS_REQUEST'})

    try{
           const response=await fetch(`/api/pizzas/getallpizzas`)
           .then((response) => {
             return response.json();
           })
           .then((data) => {
              authors = data;
           })
           dispatch({type:'GET_PIZZAS_SUCCESS',payload:authors});
    }
    catch(error){
        dispatch({type:'GET_PIZZAS_FAILED',payload:error})
    }
}