import React, { useState, useEffect } from 'react'
import TableSuppliers from '../components/TableSuppliers';
import '../styles/clients.css';
import PopupSuppliers from '../components/PopupSuppliers';
import suppliersService from '../services/suppliersService';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Sales() {

  const [suppliers, setSuppliers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Cargando sólo una vez los clientes que hay
    suppliersService.getSuppliers()
      .then((clients) => {
        setSuppliers(clients);
        setDataLoaded(true);
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  return (

    <main className="page-container">

      <aside>
        <Sidebar />
      </aside>

      <article className='page-content-container'>
        <Header />
        <section className='clients-container'>
          <div className='page-title-container'>
            <span className='page-title'>Sales</span>
          </div>
          <div className='select-container'>
            <label for='select'>Select a Product</label>
            <select name='select' id='select'>
              <option>

              </option>
            </select>
          </div>
          <div className='add-customer-content'>
            <div className='add-customer-container'>
              <a className='add-customer' onClick={() => {
                setShowModal(true);
              }}>+ Add Sale</a>
            </div>
          </div>
        </section>
        {dataLoaded ? <TableSuppliers data={suppliers} /> : <p>cargando datos</p>}
      </article>


      {showModal && <PopupSuppliers closeModal={setShowModal} />}

    </main>
  );
}

export default Sales