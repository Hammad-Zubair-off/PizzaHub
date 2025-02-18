import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Loginscreen from './Loginscreen';
export default function Registerscreen() {
    let navigate=useNavigate();
    

      const[user,setUser]=useState({
        name:"",
        email:"",
        password:"",
        cpassword:""
   })
let name,value;
   const handleInputs=(e)=>{
        console.log(e)
        name=e.target.name
        value=e.target.value
        setUser({...user,[name]:value})
        
   }

   const PostData= async (e)=>{
       //  e.preventDefault;//
         const {name,email,password,cpassword}=user;
         const res=await fetch('/register',{
             method:"POST",
             headers:{
                  "Content-Type":"application/json"
             },
             body:JSON.stringify({
                  name,email,password,cpassword
             })
         });

         const data=await res.json();
         

         if(res.status===422  ){
             window.alert("Email Exist already");
             
         }
        
         else if(res.status===423){
             alert("Credential did'nt match");
         }
         else{
             window.alert(" Registration Ho Gai");
             navigate('/Loginscreen');
         }
   }
    return (
        <div className="container" style={{backgroundColor:'transparent'}}>
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title text-center mb-5 fw-light fs-5">Register Yourself</h5>
                            <form method="POST">
                            <div className="form-floating mb-3">
                                    <input type="text" className="form-control" name="name" id="floatingInput" placeholder="name"
                                    value={user.name}
                                    onChange={handleInputs}
                                    ></input>
                                    <label for="name">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" name="email" id="floatingInput" placeholder="name@example.com"
                                    value={user.email}
                                    onChange={handleInputs}
                                    ></input>
                                    <label for="email">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" name="password" className="form-control" id="floatingPassword" placeholder="Password"
                                    value={user.password}
                                    onChange={handleInputs}
                                    ></input>
                                    <label for="password">Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" name="cpassword" className="form-control" id="floatingPassword" placeholder="Password"
                                    value={user.cpassword}
                                    onChange={handleInputs}
                                    ></input>
                                    <label for="cpassword">Confirm Password</label>
                                </div>

                               
                                <div className="d-grid">
                                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" onClick={PostData}>
                                        Register
                                    </button>
                                </div>
                                <hr className="my-4"></hr>
                                
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}