import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';


export default function Pizza({ pizza }) {

  const divStyle = {
   width:"auto"
  };

    const [quantity, setQuantity] = useState(1);
    const [varient, setVarient] = useState("small");
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addtocart = () => {
        dispatch(addToCart(pizza, quantity, varient));
    };

    return (
        <div style={{ margin: '70px' }} className="shadow p-3 mb-5 bg-white rounded">
            <div className="container mt-4">
                <div className="row" style={divStyle}>
                    <div className="col-lg-4 col-md-6 mb-3 h-50 w-auto" style={divStyle} onClick={handleShow}>
                        <h1>{pizza.name}</h1>
                        <img src={pizza.image} className="img-fluid" alt='' ></img>
                    </div>
                    <div className="col-lg-8 col-md-6" style={divStyle}> 
                        <div className="row">
                            <div className="col-md-6" style={divStyle}>
                                <p>Variants</p>
                                <select value={varient} onChange={(e) => setVarient(e.target.value)} className="form-select">
                                    {pizza.varients.map((variant, index) => (
                                        <option key={index} value={variant}>{variant}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6" style={divStyle}>
                                <p>Quantity</p>
                                <select value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-select">
                                    {[...Array(10).keys()].map((x, i) => (
                                        <option key={i} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <h1>Price: {pizza.prices[0][varient] * quantity}</h1>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={addtocart}>ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>{pizza.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={pizza.image} alt='' className='img-fluid' height="400px" />
                    <p>{pizza.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn' onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

