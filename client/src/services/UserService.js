

// import GenericService from "./GenericService";

// class UserService extends GenericService{
// constructor(){
//     super();
// }

// login=(email,password)=>new Promise((resolve,reject)=>{
//     this.post("users/login",{username,email}).then(token=>{
//         localStorage.setItem("token",token);
//         resolve();
//     }).catch((err)=>{
//   reject(err);
//     })
// });
// register=(name,email,password)=>this.post("users/login",{username,email});
// logout=()=>{
//     localStorage.setItem("token","");

// }
// }