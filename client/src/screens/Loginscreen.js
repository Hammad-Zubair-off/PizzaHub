import React,{useState} from 'react'
import Registerscreen from './Registerscreen'
import {useNavigate} from 'react-router-dom'
export default function Loginscreen() {
  

    let navigate=useNavigate();
   
    
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const LoginUser= async (e)=>{
  const res=await fetch('/login',{
    method:"POST",
    headers:{
         "Content-Type":"application/json"
    },
    body:JSON.stringify({
      email,password
    })
  });
  const data=res.json();
  if(res.status===400 || !data){
    alert("Invalid Username or Password");
    console.log("Invalid form");
}
  else{
    navigate('/');
  }
  }

  function handleClick() {
    navigate("/Registerscreen");
  }
    return (
        <div className="container" style={{backgroundColor:'transparent'}}>
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                            <form method="POST">
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" name="email" id="floatingInput" 
                                    autoComplete="off"
                                    value={email}
                                    onChange={(e)=>{setEmail(e.target.value)}}
                                    ></input>
                                    <label for="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" autoComplete="off"  className="form-control" name="password" id="floatingPassword" placeholder="Password"
                                    value={password}
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                    ></input>
                                    <label for="floatingPassword">Password</label>
                                </div>

                               
                                <div className="d-grid">
                                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit"
                                    onClick={LoginUser}
                                    >Sign
                                        in</button>
                                </div>
                                <hr className="my-4"></hr>
                                
                                <div className="d-grid">
                                    
                                    
                                    <b>Don't have account  <button className="btn  btn-login  fw-bold" type="submit" 
                                    onClick={handleClick}>
                                     Register Now
                                    </button></b> 
                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}