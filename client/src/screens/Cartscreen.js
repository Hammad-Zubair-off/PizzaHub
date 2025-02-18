import React from 'react';
import { useSelector,useDispatch } from 'react-redux'
import { addToCart } from '../actions/cartActions';
import { deleteFromCart } from '../actions/cartActions';
export default function Cartscreen(){
   
    const cartstate=useSelector(state=>state.cartReducer)
    const cartItems=cartstate.cartItems
    var subtotal=cartItems.reduce((x,item)=>x+item.price,0)
    const dispatch=useDispatch()
    return (
        <div>
           <div className='row justify-content-center'>
   <div className='col-md-6'>
    <h2 style={{fontSize:'40px'}}>MY CART</h2>
      {cartItems.map(item=>{

        return <div className='flex-container'>
       
        <div className='text-left m-1 w-100'>
            <h1>{item.name} [{item.varient}]</h1>
            <h1>Price: {item.quantity} * {item.prices[0][item.varient]}={item.price}</h1>
            <h1 style={{display:'inline'}}>Quantity:</h1>
            <i className='fa fa-plus' style={{color:'grey'}} aria-hidden="true"
            onClick={()=>{dispatch(addToCart(item,item.quantity+1,item.varient))}}
            ></i>
            <b>{item.quantity}</b>
            <i className='fa fa-minus' style={{color:'red'}} aria-hidden="true"
             onClick={()=>{dispatch(addToCart(item,item.quantity-1,item.varient))}}
            ></i>
            <hr></hr>
        </div>
        <div className='m-1 w-100'>
            <img src={item.image} alt='' height='80px' width="80px" />
        </div>
        <div className='m-1 w-10'>
        <i className='fa fa-trash' style={{color:'red'}} aria-hidden="true"
        onClick={()=>{dispatch(deleteFromCart(item))}}
        ></i>
        </div>
     </div>
      })}
    
   </div>

   <div className='col-md-4'>
   <h3 style={{fontSize:'40px'}}>SubTotal: {subtotal} /-</h3>
   <button className='btn'>CHECK-OUT</button>
   </div>
           </div>
        </div>
    )
}