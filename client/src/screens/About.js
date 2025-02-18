import React,{useEffect} from "react";
import {useNavigate} from 'react-router-dom'
export default function About(){

    let navigate=useNavigate();
useEffect(()=>{
    callAboutPage();
},[])

const callAboutPage=async ()=>{
try{
    const res=await fetch ('/about',{
        method:"GET",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        credentials:"include"
    });
    const data=await res.json();
    if(!res.status===200){
        const error=new Error(res.error);
        throw error
    }
   
}
catch(err){
 navigate('/Loginscreen');
}
}

return(
    <div>
        <h1>About</h1>
    </div>
)
}
