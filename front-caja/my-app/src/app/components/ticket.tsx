"use client"

import { Fragment } from "react"

export default function Ticket(
    { products, total_price, payMethod, setIsTicket }:
    { products: any[]; total_price: number; payMethod: string; setIsTicket: any}){

    

    // this function can create a new Ticket en the database
    const createTicket = async () => {
        const data =  {
            subTotal: Math.round(total_price/1.19),
            iva: null,
            total: null,
            payMethod: `${payMethod}`,
            date: null
        };

        try{
            const response = await fetch(`http://127.0.0.1:8000/create_ticket`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            if(response.ok){
                decrementProducts();
                setIsTicket(false);
                window.location.href = '/';
            }
            else{
                alert('No se ha podido crear el ticket!')
            }

        }
        catch(error){
            console.error("Ha ocurrido un error: " + error)
        }
    };

    // this function decrements the quantity of each product in the db per sell
    const decrementProducts = () => {
        const decApi = async (code: number, quantity: number) => {
            try{
                await fetch(`http://127.0.0.1:8000/decrement_product/${code}?decrement=${quantity}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                });
            }
            catch(error){}
        }

        products.forEach(product => {
            decApi(product.code, product.quantity);
        })
    };


    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div className="bg-white p-4 rounded shadow-lg w-[420px] h-[540px]">
                    <p className='text-xl text-gray-600 text-center -ml-[10px]'>
                        ------------- Boleta -------------
                    </p>
                    <div className="overflow-y-auto h-[210px]">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <Fragment key={product.id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-black">{product.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-black">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-black">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-black">x{product.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-black">${product.price * product.quantity}</td>
                                    </tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table> 
                    </div>

                    <div className="mt-[100px] ml-[200px]">
                        <p className='text-lg text-gray-600 text-left'>
                            Neto = ${Math.round(total_price/1.19)}
                        </p>
                        <p className='text-lg text-gray-600 text-left'>
                            IVA = ${Math.round((total_price/1.19)*0.19)}
                        </p>
                        <p className='text-lg text-gray-600 text-left'>
                            Bruto = ${total_price}
                        </p>
                    </div>
                    
                    <div className="ml-[110px] mt-[40px]">
                        <button 
                            onClick={createTicket} 
                            className="bg-blue-500 hover:bg-blue-700 w-[150px] text-white font-bold py-2 px-4 rounded ml-2"
                            >
                            Aceptar
                        </button>
                    </div>


                </div>
            </div>
        </>
    )

}