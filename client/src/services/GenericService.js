// import axios from "axios"
// axios.defaults.baseURL="http://localhost:5000";
// class GenericService{

//     constructor(){
//         get=(url)=>new Promise((resolve,reject)=>{
//             axios.get(url).then((res)=>{
//                 resolve(res.data)
//             }).catch((err)=>{
//                 reject(err);
//             });
//         });

//         post=(url,data)=>new Promise((resolve,reject)=>{
//             axios.post(url,data).then((res)=>{
//                 resolve(res.data)
//             }).catch((err)=>{
//                 reject(err);
//             });
//         });

//         delet=(url)=>new Promise((resolve,reject)=>{
//             axios.delete(url).then((res)=>{
//                 resolve(res.data)
//             }).catch((err)=>{
//                 reject(err);
//             });
//         });

//         put=(url,data)=>new Promise((resolve,reject)=>{
//             axios.put(url,data).then((res)=>{
//                 resolve(res.data)
//             }).catch((err)=>{
//                 reject(err);
//             });
//         });
//     }
// }

// export default GenericService