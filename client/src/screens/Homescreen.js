import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { getAllPizzas } from '../actions/pizzaActions'
import Pizza from '../components/Pizza'

export default function Homescreen(){

    const dispatch=useDispatch()
    const pizzasstates=useSelector(state=>state.getAllPizzasReducer);
    const {pizzas,error,loading}=pizzasstates
    useEffect(()=>{
        dispatch(getAllPizzas());
    },[])
    
    return (
        <div>
            <div className='row'>
                {loading ? (<h1>Loading...</h1>):error ? (<h1>Error couldn't find data........</h1>):(
 pizzas.map(pizza=>{
    return <div className='col-md-4'>
        <div>
            <Pizza pizza={pizza} />
            </div>
        </div>

 })
                )}
        
            </div>
        </div>
    )
}