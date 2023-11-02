"use client"

import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react';
import Ticket from './components/ticket';
import Tickets from './components/tickets';

export default function Home() {
  // tailwind css repited classes
  const buttonOptions = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded text-lg ml-2 mb-2 w-[200px] h-[70px] flex items-center justify-center';
  const sellButton = 'bg-[#30ac27] hover:bg-[#289021] text-white font-bold py-5 px-10 rounded text-lg ml-2 mb-2 w-[200px] h-[70px]';
  const cancelButton= 'bg-[#dc2b2b] hover:bg-[#bb2626] text-white font-bold py-5 px-10 rounded text-lg -ml-[50px] mb-2 w-[200px] h-[70px]';
  const deleteProductButton = 'bg-[#dc2b2b] hover:bg-[#bb2626] text-white font-bold  px-1 rounded text-lg w-[25px] h-[30px] ';
  const incrementQuantityButton = 'bg-[#30ac27] hover:bg-[#289021] text-white font-bold  px-1 rounded-full text-lg w-[30px] h-[30px] ';
  const decrementQuantityButton = 'bg-[#dc2b2b] hover:bg-[#bb2626] text-white font-bold  px-1 rounded-full text-lg w-[30px] h-[30px] ml-1';
  const toTicketsButton = 'bg-[#9f9f9f] hover:bg-[#777777] text-white font-bold py-5 px-10 rounded text-lg ml-2 mb-2 col-span-2 h-[70px] text-center w-[410px] h-[70px]';

  // HOOKS
  const [products, setProducts] = useState<any[]>([]); // hook to save data of products
  const [codeProduct, setCodeProduct] = useState('');
  const [quantityProduct, setQuantityProduct] = useState('');
  const [productsToSell, setProductsToSell] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpenIncQuant, setIsOpenIncQuant] = useState(false);
  const [inputValueIncQuant, setInputValueInc] = useState('');
  const [isIncORDec, setIsIncORDec] = useState(true);
  const [codeIncORDec, setCodeIncORDec] = useState('');
  const [isQuantHigherThan0, setIsQuantHigherThan0] = useState(true);
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [addProductformData, setAddProductFormData] = useState({code: '', name: '', price: '', quantity: ''});
  const [codeToDelete, setCodeToDelete] = useState('');
  const [isOpenCodeToDelete, setIsOpenCodeToDelete] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [valueUpdatePrice, setValueUpdatePrice] = useState('');
  const [isOpenUpdatePrice, setIsOpenUpdatePrice] = useState(false);
  const [codeToUpdate, setCodeToUpdate] = useState('');
  const [filterCodeProducts, setFilterCodeProducts] = useState('');
  const [isOpenSell, setIsOpenSell] = useState(false);
  const [payMethod, setPayMethod] = useState('');
  const [ticket, setTicket] = useState({subTotal: Math.round(totalPrice/1.19), iva: null, total: null, payMethod: payMethod, date: null});
  const [isEfectivo, setIsEfectivo] = useState(false);
  const [totalPayClient, setTotalPayClient] = useState('');

  const [isTicket, setIsTicket] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  



  // FUNCTIONS AND HANDLES
  const clearProductsToSell = () => { //<- clears all data saved
    deleteProductsToSell();
    setTotalPrice(0);
    setCodeProduct('');
    setQuantityProduct('');
  };

  const handleCodeProduct = (e: { target: { value: any; }; }) => {
    const newValue = e.target.value;
    setCodeProduct(newValue);
  };

  const handleQuantityProduct = (e: { target: { value: any; }; }) => {
    const newValue = e.target.value;
    setQuantityProduct(newValue);
  };

  const addProduct = (product: any) => {
    setProductsToSell([...productsToSell, product]);
  };

  const deleteProductsToSell = () => {
    setProductsToSell([]);
  };

  const deleteOneProductToSell = (code: any) => {
    const updatedProducts = productsToSell.filter((product) => product.code !== code);
    setProductsToSell(updatedProducts);
    calculateTotal();
  };

  const calculateTotal = () => {
    let total = 0;
    for (let product of productsToSell) {
        total += product.price * product.quantity;
    }

    setTotalPrice(total);
  };

  const handleOpenIncQuant = (code: any) => {
    setIsIncORDec(true);
    setIsOpenIncQuant(true);
    setCodeIncORDec(code);
  };

  const handleOpenDecQuant = (code: any) => {
    setIsIncORDec(false);
    setIsOpenIncQuant(true);
    setCodeIncORDec(code);
  };

  const handleCloseIncQuant = () => {
      setIsOpenIncQuant(false);
  };

  const handleInputIncQuant = (e: any) => {
      setInputValueInc(e.target.value);
  };

  const handleAcceptIncQuant = () => {
      const valueIncOrQuant = parseInt(inputValueIncQuant);
      if(valueIncOrQuant > 0){
        incrementeOrDecrementQuantity(codeIncORDec, inputValueIncQuant);
        setInputValueInc('');
        setCodeIncORDec('');
        setIsQuantHigherThan0(true);
        handleCloseIncQuant();
      }
      else {
        setIsQuantHigherThan0(false);
      }
  };

  const handleCancelIncQuant = () => {
      setInputValueInc('');
      setCodeIncORDec('');
      handleCloseIncQuant();
  };


  const handleCloseAddProduct = () => {
    clearAddProductData();
    setIsOpenAddProduct(false);
  };

  const clearAddProductData = () => {
    setAddProductFormData({code: '', name: '', price: '', quantity: ''});
  };

  const handleChangeAddProductFormData = (e: any) => {
    const { name, value } = e.target;
    setAddProductFormData({
      ...addProductformData,
      [name]: value,
    });
  };

  const handleCloseIsOpenCodeToDelete = () => {

    setCodeToDelete('');
    getProducts();
    setIsOpenCodeToDelete(false);
  };

  const handleInputCodeToDelete = (e: any) => {
    setCodeToDelete(e.target.value);
  };

  const handleCloseIsOpenUpdatePrice = () => {
    setValueUpdatePrice('');
    getProducts();
    setIsOpenUpdatePrice(false);
  };

  const handleInputUpdatePrice = (e: any) => {
    setValueUpdatePrice(e.target.value);
  };

  const handleInputCodeToUpdate = (e: any) => {
    setCodeToUpdate(e.target.value);
  };

  const decrementValidation = (code: number, value: number) => {
    let result = true;
    const productsCopy = [...products];
    for(let product of productsCopy){
      if(product.code == code){
          if(product.quantity - value < 0){
            result = false;
            break;
          }
      }
    }
    return result;
  };

  const handleFilterChangeProducts = (e: any) => {
    setFilterCodeProducts(e.target.value);
  };
  
  const filteredProducts = products.filter((product) => {
    return product.code.toString().includes(filterCodeProducts);
  });

  const clearDataTicket = () => {
    setTicket({subTotal: Math.round(totalPrice/1.19), iva: null, total: null, payMethod: payMethod, date: null});
  };

  const closeIsOpenTicket = () => {
    
    clearDataTicket();
    setTotalPayClient('');
    setPayMethod('');
    setIsEfectivo(false);
    setIsOpenSell(false);
  }

  const handleIsOpenSell = () => {
      if(productsToSell.length>0){
        setIsOpenSell(true);
      }
      else{
        alert("Debe haber al menos un producto ingresado para realizar la venta.");
      }

  }; 

  const handleChangePayMethod = (e: any) => {
    const payMethodValue = e.target.value;
    setPayMethod(payMethodValue);
    if (payMethodValue == 'Efectivo') {
      setIsEfectivo(true);
    }
    else{
      setIsEfectivo(false);
    }
  };

  const handleTotalPayCliente = (e: any) => {
      const value = e.target.value;
      setTotalPayClient(value);
  };







  // APIS
  // get products method
  const getProducts = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/get_products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
              });
          
              if (response.ok) {
                  const data = await response.json();
                  setProducts(data);
          
              } else {
                console.error('Error al obtener los productos');
              }
          
      } catch (error) {
          console.error('Error de red:', error);
      }
  };

  // method to get one product and push it to productsToSell
  const getProduct = async (code: any) => {
    try{
      const response = await fetch(`http://127.0.0.1:8000/get_product/${code}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });
      
      if (response.ok){
        const product = await response.json();
        const newQuantityProduct = parseInt(quantityProduct);

        if(newQuantityProduct > 0){
          product.quantity = newQuantityProduct;
          addProduct(product);

          // cleaning inputs
          setCodeProduct('');
          setQuantityProduct('');
        }
        else{
          alert('Debe ingresar una cantidad de productos válida!');
        }

      }
      else{
        alert('Error al obtener el producto');
      }

    } catch(error){
        alert('El producto no existe.');
    }
  };

  // method to increment de quantity of one product
  const incrementeOrDecrementQuantity = async (code: any, quantity: any) => {

      code = parseInt(code);
      quantity = parseInt(quantity);
      

      const url = isIncORDec 
      ? `http://127.0.0.1:8000/increment_product/${code}?increment=${quantity}` 
      : `http://127.0.0.1:8000/decrement_product/${code}?decrement=${quantity}`;
      
      if(!decrementValidation(code, quantity) && !isIncORDec) {
        alert('El monto ingresado no debe ser mayor a la cantidad de productos en inventario');
      }
      else {
          try{
            const response = await fetch(url ,{
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
            });
      
            if (response.ok){
              getProducts();
      
            } else{
              const mensaje = isIncORDec 
              ? 'No se pudo incrementar la cantidad del producto' 
              : 'No se pudo decrementar la cantidad del producto'
              console.error(mensaje);
              alert(mensaje);
            }
      
          }
          catch(error){
            console.error('Error de red:', error);
          }
      }

  };


  // method to create a product object in the database
  const createProduct = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/create_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addProductformData),
      });

      if (response.ok) {
        alert('Producto creado exitosamente');
        handleCloseAddProduct();
        
      } 
      else {
        alert('El producto ya existe!');

      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // method to delete a product from the database
  const deleteProduct = async () => {
    const codeProd = parseInt(codeToDelete);
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete_product/${codeProd}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Producto eliminado!');
        handleCloseIsOpenCodeToDelete();
        
      } 
      else {
        alert('El producto no existe!');

      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };


  // method to update the price of one product 
  const updatePrice = async () => {
    const codeProd = parseInt(codeToUpdate);
    const newPrice = parseFloat(valueUpdatePrice);
    try {
      const response = await fetch(`http://127.0.0.1:8000/update_price/${codeProd}?newPrice=${newPrice}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Precio actualizado!');
        handleCloseIsOpenUpdatePrice();
        
      } 
      else {
        alert('El producto no existe!');

      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // useEffect to show the data of products
  useEffect(() => {
    if (products.length == 0) {
        getProducts();
    }
  }, [products]);

  // useEffect to calculate the total price automatically
  useEffect(()=>{
    if(totalPrice >= 0){
      calculateTotal();
    }
  }, [calculateTotal, totalPrice]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;
      setCurrentDateTime(formattedDateTime);
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-10 bg-[#bcbcbc]">
      <div className="z-10 max-w-6xl w-6xl items-center justify-between font-mono text-sm bg-[#efefef] pl-20 pr-20 pt-20 pb-[9px] shadow-lg shadow-black h-screen">
        <div className='-mt-[50px] mb-5 text-lg text-[#1eb8bd]'>
          <p> <span className='text-black'>Fecha y hora actual: </span> {currentDateTime}</p>
        </div>
        <div className='flex'>
          <div className=''>
              <div className='border-2 border-[#9a9e9e] w-[500px] h-[250px] rounded bg-white overflow-y-auto max-h-[500px] border border-gray-300'>
                <p className='text-black pl-5 pt-1 bg-[#f3ff28] w-[200px] border-[0.5px] border-black'>
                    Total = ${totalPrice}
                </p>
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsToSell.map((product) => (
                        <Fragment key={product.id}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-rose-600">{product.code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-500">${product.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-black">x{product.quantity}</td>
                            <td>
                              <button 
                                className={deleteProductButton}
                                onClick={() => deleteOneProductToSell(product.code)}
                              >
                                x
                              </button>
                            </td>  
                          </tr>
                        </Fragment>
                    ))}
                  </tbody>
                </table>    
              </div>
              <div className="flex items-center mt-2 text-black">
                  <input
                    className="border rounded-l px-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2"
                    type="text"
                    placeholder="código del producto"
                    value={codeProduct}
                    onChange={handleCodeProduct}
                  />
                  <input
                    className="border rounded-l px-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[100px] ml-1"
                    type="number"
                    placeholder="cantidad"
                    value={quantityProduct}
                    onChange={handleQuantityProduct}
                  />
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-r px-4 py-1"
                    onClick={() => getProduct(codeProduct)}
                    >
                    Añadir
                  </button>
              </div>
          </div>
          <div className='grid grid-cols-2 gap-[85px] ml-[40px]'>
              <div>
                  <button 
                  className={sellButton}
                  onClick={handleIsOpenSell}
                  >
                    Vender
                  </button>
              </div>
              <div>
                  <button 
                    className={cancelButton}
                    onClick={() => clearProductsToSell()}
                    >
                    Cancelar
                  </button>
              </div>
              <div className='-mt-[145px]'>
                  <button
                    className={toTicketsButton}
                    onClick={() => setShowTickets(true)}
                  >
                    Ver Boletas
                  </button>
              </div>

          </div>


        
        </div>
        <div className='flex'>
          <div className='text-gray-500 mt-10 text-lg '>
                <div className='flex'>
                  <h1 className='mb-2'>Productos en Inventario:</h1>
                  <input
                    type="text"
                    placeholder="Filtrar por código"
                    className='border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-1 w-[250px] text-black text-sm mb-2'
                    value={filterCodeProducts}
                    onChange={handleFilterChangeProducts}
                  />
                </div>
                <div className='overflow-y-auto w-[700px] h-[230px]'>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                          <tr>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                  Código
                              </th>
                              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                  Nombre
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                  Precio
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                  Cantidad
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">

                              </th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {filteredProducts.map((product) => (
                          <Fragment key={product.id}>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-rose-600 text-sm">{product.code}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-green-500 text-sm">${product.price}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{product.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                <button 
                                  className={incrementQuantityButton}
                                  onClick={() => handleOpenIncQuant(product.code)}
                                >+</button>
                                <button 
                                  className={decrementQuantityButton}
                                  onClick={() => handleOpenDecQuant(product.code)}
                                >-</button>
                              </td>
                          </tr>
                          </Fragment>
                          ))}
                      </tbody>
                    </table>  
                </div>
          </div>
          <div className='w-[250px] h-[250px] mt-20 ml-10'>
                <button 
                  className={buttonOptions}
                  onClick={() => setIsOpenAddProduct(true)}
                  >
                  Agregar Producto
                </button>
                <button 
                className={buttonOptions}
                onClick={() => setIsOpenCodeToDelete(true)}
                >
                  Eliminar Producto
                </button>
                <button 
                className={buttonOptions}
                onClick={() => setIsOpenUpdatePrice(true)}
                >
                  Modificar Precio
                </button>
          </div>
        </div>
        <div>
          {isOpenIncQuant && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div className="bg-white p-4 rounded shadow-lg w-[300px] h-[180px]">
                    <h2 className="text-lg font-semibold mb-2 text-center text-gray-500">
                      {isIncORDec ? "Aumentar productos" : "Disminuir productos"}
                    </h2>
                    {!isQuantHigherThan0 && (
                      <p className='text-xs text-rose-500 ml-5'>Debes ingresar un numero mayor a 0</p>
                    )}
                    <input
                    type="number"
                    value={inputValueIncQuant}
                    onChange={handleInputIncQuant}
                    placeholder='Ingrese un numero'
                    className="border rounded-lg px-2 ml-10 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 ml-5 w-[180px] text-black"
                    />
                    <div className="flex mt-[30px] ml-[40px]">
                      <button onClick={handleAcceptIncQuant} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                          Aceptar
                      </button>
                      <button onClick={handleCancelIncQuant} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Cancelar
                      </button>
                    </div>
                </div>
              </div>
          )}
        </div>
        <div>
          {isOpenAddProduct && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div className="w-[300px] bg-white p-4 shadow-lg rounded-lg">
                  <h2 className="text-lg text-gray-500 font-semibold mb-4 text-center">Crear Producto</h2>
                  <form onSubmit={createProduct} className='text-black'>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="code">
                        Código
                      </label>
                      <input
                        className="border rounded-lg px-3 py-2 w-[240px] outline-0 focus:ring focus:ring-blue-500 focus:ring-2"
                        type="text"
                        name="code"
                        value={addProductformData.code}
                        onChange={handleChangeAddProductFormData}
                        placeholder="Ej: 10001 (cod. único)"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="name">
                        Nombre
                      </label>
                      <input
                        className="border rounded-lg px-3 py-2 w-[240px] outline-0 focus:ring focus:ring-blue-500 focus:ring-2 "
                        type="text"
                        name="name"
                        value={addProductformData.name}
                        onChange={handleChangeAddProductFormData}
                        placeholder="Ej: Salsa de tomate"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="price">
                        Precio
                      </label>
                      <input
                        className="border rounded-lg px-3 py-2 w-[240px] outline-0 focus:ring focus:ring-blue-500 focus:ring-2"
                        type="text"
                        name="price"
                        value={addProductformData.price}
                        onChange={handleChangeAddProductFormData}
                        placeholder="Ej: 980"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="quantity">
                        Cantidad
                      </label>
                      <input
                        className="border rounded-lg px-3 py-2 w-[240px] outline-0 focus:ring focus:ring-blue-500 focus:ring-2"
                        type="text"
                        name="quantity"
                        value={addProductformData.quantity}
                        onChange={handleChangeAddProductFormData}
                        placeholder="Ej: 85"
                      />
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[80px] ml-[40px]"
                      type="submit"
                    >
                      Crear
                    </button>
                    <button onClick={handleCloseAddProduct} className="bg-red-500 hover:bg-red-700 w-[100px] text-white font-bold py-2 px-4 rounded ml-2">
                          Cancelar
                    </button>
                  </form>
                </div>
              </div>
          )}
        </div>
        <div>
          {isOpenCodeToDelete  && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white p-4 rounded shadow-lg w-[300px] h-[180px]">
                  <h2 className="text-lg font-semibold mb-2 text-center text-gray-500">
                    Eliminar Producto
                  </h2>
                  <input
                  type="text"
                  value={codeToDelete}
                  onChange={handleInputCodeToDelete}
                  placeholder='Codigo producto'
                  className="border rounded-lg px-2 ml-10 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 ml-5 w-[180px] text-black"
                  />
                  <div className="flex mt-[30px] ml-[40px]">
                    <button onClick={deleteProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Eliminar
                    </button>
                    <button onClick={handleCloseIsOpenCodeToDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancelar
                    </button>
                  </div>
              </div>
            </div>
          )}
        </div>
        <div>
          {isOpenUpdatePrice  && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white p-4 rounded shadow-lg w-[320px] h-[280px]">
                  <h2 className="text-lg font-semibold mb-4 text-center text-gray-500">
                    Modificar Precio
                  </h2>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="code">
                        Código del producto
                  </label>
                  <input
                  type="text"
                  value={codeToUpdate}
                  onChange={handleInputCodeToUpdate}
                  placeholder='Codigo producto'
                  className="border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[250px] text-black mb-3"
                  />
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="newPrice">
                        Nuevo Precio $
                  </label>
                  <input
                  type="number"
                  value={valueUpdatePrice}
                  onChange={handleInputUpdatePrice}
                  placeholder='Nuevo precio'
                  className="border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[250px] text-black"
                  />
                  <div className="flex mt-[30px] ml-[40px]">
                    <button onClick={updatePrice} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Actualizar
                    </button>
                    <button onClick={handleCloseIsOpenUpdatePrice} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancelar
                    </button>
                  </div>
              </div>
            </div>
          )}
        </div>
        <div>
        {isOpenSell && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white p-4 rounded shadow-lg w-[650px] h-[540px]">
                  <h2 className="text-lg font-semibold mb-3 text-center text-gray-500">
                    Sección de Venta
                  </h2>
                  <div className='ml-[10px] w-[600px] h-[250px] rounded bg-white overflow-y-auto border-[2px] border-gray-300 rounded mb-5'>
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productsToSell.map((product) => (
                            <Fragment key={product.id}>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-rose-600">{product.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-black">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-500">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-black">x{product.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-500">${product.price * product.quantity}</td>
                              </tr>
                            </Fragment>
                        ))}
                      </tbody>
                    </table>  
                  </div>
                  <div className='flex'>
                      <div className='ml-10 text-black'>
                          <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="payMethod">
                              Método de pago
                          </label>
                          <div className="relative inline-flex mb-4">
                            <select
                              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                              value={payMethod} 
                              onChange={handleChangePayMethod} 
                            >
                              <option value="">Seleccione un método de pago</option>
                              <option value="Efectivo">Efectivo</option>
                              <option value="Débito">Débito</option>
                              <option value="Transferencia">Transferencia</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5z"/></svg>
                            </div>
                          </div>
                      </div>
                      <div className='ml-[20px]'>
                          <p className='text-lg text-green-500 text-left ml-[70px]'>
                            Neto = ${Math.round(totalPrice/1.19)}
                          </p>
                          <p className='text-lg text-green-500 text-left ml-[70px]'>
                            IVA = ${Math.round((totalPrice/1.19)*0.19)}
                          </p>
                          <p className='text-lg text-green-500 text-left ml-[70px]'>
                            Bruto = ${totalPrice}
                          </p>
                          <div className='flex mt-10 mr-5'>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[90px] ml-[68px] text-center"
                              type="submit"
                              onClick={() => {
                                setIsTicket(true)
                                setIsOpenSell(false)
                              }}
                            >
                              Aceptar
                            </button>
                            <button 
                            onClick={closeIsOpenTicket} 
                            className="bg-red-500 hover:bg-red-700 w-[100px] text-white font-bold py-2 px-4 rounded ml-2"
                            >
                                  Cancelar
                            </button>
                          </div>
                      </div>
                  </div>

              </div>
              { isEfectivo && (
                <div className='fixed inset-0 bg-white p-4 rounded shadow-lg w-[300px] h-[300px] ml-[80px] mt-[100px]'>
                  <h2 className="text-lg font-semibold mb-3 text-center text-gray-500">
                    Pago en Efectivo
                  </h2>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="totalPayClient">
                      Monto pagado por el cliente
                  </label>
                  <input
                    type="text"
                    value={totalPayClient}
                    onChange={handleTotalPayCliente}
                    placeholder='Ej: 10000'
                    className="border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[220px] text-black mb-3"
                  />
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="totalPay">
                      Total venta
                  </label>
                  <input
                    type="text"
                    value={`$${totalPrice}`}
                    placeholder='Ej: 8560'
                    className="border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[220px] pointer-events-none text-black bg-gray-200 mb-3"
                  />
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="change">
                      Vuelto
                  </label>
                  <input
                    type="text"
                    value={`$${totalPayClient && (parseInt(totalPayClient) > totalPrice) ? parseInt(totalPayClient) - totalPrice : '' }`}
                    placeholder='Ej: 1140'
                    className="border rounded-lg px-2 ml-2 py-1 outline-0 focus:ring focus:ring-blue-500 focus:ring-2 w-[220px] pointer-events-none text-black bg-gray-200 mb-3"
                  />
                  
                </div>
              )}


            </div>
          )}
        </div>
        
        {isTicket && (
          <Ticket
            products = {productsToSell}
            total_price = {totalPrice}
            payMethod = {payMethod}
            setIsTicket={setIsTicket}
          ></Ticket>
        )}

        {showTickets && (
          <Tickets
            showTickets = {showTickets}
            setShowTickets = {setShowTickets}
          ></Tickets>
        )}





      </div>
    </main>
  )
}
