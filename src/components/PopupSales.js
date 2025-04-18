import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import '../styles/popupclients.css';
import suppliersService from '../services/suppliersService';
import { useAuth } from './AuthContext';
import salesService from '../services/salesService';
import { useNavigate } from 'react-router-dom';

function PopupSales({ closeModal, data, customers }) {

    const [inputs, setInputs] = useState({});
    const [customerSelected, setCustomerSelected] = useState(customers[0]);
    const [change, setChange] = useState(0);
    let navigate = useNavigate();
    const auth = useAuth();
    const getTotal = data.reduce((total, p) => total + p.amount, 0);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }));

        // Si se ingresa la cantidad de dinero nomas
        if (name === 'customerMoney') {
            setChange(inputs.customerMoney > getTotal ? inputs.customerMoney - getTotal : 0);
        }

    }

    async function handleSubmit(e) {
        e.preventDefault();
        const todaysDate = new Date();
        const date = `${todaysDate.getFullYear()}-${(todaysDate.getMonth() + 1).toString().padStart(2, '0')}-${todaysDate.getDate().toString().padStart(2, '0')}`;

        try {
            // Se va iterar por todos los productos del carrito para registrar cada venta por separado

            const receipt = []
        
            // Inserción a tabla Sales
            data.map(async (product) => {

                const dataForSalesOrder = {
                    'product_id': product.product_id,
                    'customer_id': customerSelected.customer_id,
                    'user_id': auth.auth.user.id,
                    'date': date,
                    'price': product.price,
                    'amount': product.quantity * product.price,
                    'qty': product.quantity,
                }

                const dataForReceipt = {
                    'product_id': product.product_id,
                    'product_code': product.product_code,
                    'product_name': product.product_name,
                    'customer': customerSelected.customer_name,
                    'qty': product.quantity,
                    'amount': product.quantity * product.price,
                    'date': date,
                    'customerMoney': inputs.customerMoney // Este sólo se usa para hacer el ticket/recibo
                }

                // Mandando datos la table `sales_order`
                receipt.push(dataForReceipt)
                console.log(dataForSalesOrder)
                const res = await salesService.postSalesOrder(dataForSalesOrder)
                console.log(res)
            })

            navigate("/receipt", { state: receipt });

        } catch (e) {
            console.log(e);
        }
    }

    return (

        <div className='popup-client-card-container shadow' style={{ width: '35%' }}>
            <a className='close-modal' onClick={() => closeModal(false)}>
                <FontAwesomeIcon icon={faXmarkSquare} size='2x' color='#260B01' />
            </a>
            <div style={{ marginTop: 20 }}>
                <span style={{ color: "#370021", fontWeight: 'bold', fontSize: 36 }}>
                    Cash
                </span>
            </div>
            <form className='popup-client-card' onSubmit={handleSubmit} name='clientForm'>

                {/* <br> */}

                <div className='input-container'>
                    <div className="input-add-client-container">
                        <span style={{ fontSize: 16 }}>Customer: </span>
                        <select name='select' className='input-form-popup' onChange={(e) => { setCustomerSelected(JSON.parse(e.target.value)) }}>
                            {
                                customers.map((client) => (
                                    <option key={client.customer_id} value={JSON.stringify(client)}>{client.customer_name}</option>
                                ))

                            }
                        </select>
                    </div>
                    <div className="input-add-client-container">
                        <span style={{ fontSize: 16 }}>Cash: </span>
                        <input className='input-form-popup' onChange={handleChange} type="text" name="customerMoney" required />
                    </div>
                    {/* <div className="input-add-client-container">
                        <span style={{ fontSize: 16 }}>Change: {change} </span>
                        <input className='input-form-popup' type="text" required />

                    </div> */}
                    <div className="input-add-client-container">
                        <span style={{ fontSize: 18, fontWeight: 'bold' }}>Total: {getTotal} </span>
                    </div>
                </div>

                {
                    inputs.customerMoney >= getTotal &&
                    <div className="submit-container">
                        <button className="submit-button shadow" type="submit">Save</button>
                    </div>
                }

            </form>
        </div>
    )
}

export default PopupSales;