"use client"

import { Fragment, useEffect, useState } from "react"
import { format } from 'date-fns-tz';

export default function Tickets(
    {showTickets, setShowTickets}:
    {showTickets: boolean; setShowTickets: any}
    
    ){
    // tailwind css:
    const cellTittles = 'px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider';
    const cellBody = 'px-6 py-4 whitespace-nowrap text-left text-black';
    const closeTickets = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-10 rounded text-lg ml-[40px] mt-2 mb-2 w-[200px] h-[40px] text-center'
    const btnNextandBack= 'bg-blue-500 hover:bg-blue-700 text-white font-bold  px-1 rounded-xl text-lg w-[30px] h-[30px] mt-[10px] ml-[5px]';


    // HOOKS
    const [tickets, setTickets] = useState<any[]>([]); // hook to save tickets
    const [totalTickets, setTotalTickets] = useState<number>(0); // hook to save te count of tickets
    const [page, setPage] = useState<number>(1);


    // hook to change the limit of tickets
    // when limit is 10 then offset is 0 and when limit is 20 then offset is 10
    // this because just need 10 tickets. (the first 10 tickets and later the other 10 tickets)
    const [limit, setLimit] = useState<number>(10); //<- first 10 tickets (this can be changed)
    const [offset, setOffset] = useState<number>(0); //<- excludes the first 0 tickets

    // Api to get tickets
    const getTickets = async (limit: number, offset: number) => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/get_tickets?limit=${limit}&offset=${offset}`,{
                method: "GET",
                headers: {'Content-Type': 'application/json'},
            });

            if(response.ok){
                const data = await response.json();
                if(data.length == 0){
                    back();
                    setPage(page-1);
                    alert("No se han encontrado más boletas.");
                }
                else{
                    setTickets(data);
                }
                
            }
            else {
                alert("No se pudo obtener las boletas!");
            }

        }
        catch(err){
            console.error("Ha ocurrido un error: " + err);
        }
    };

    // Api to get the count of rows in the table tickets
    const getCountTickets = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/total_tickets`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
            });

            if(response.ok){
                const data = await response.json();
                setTotalTickets(data[0]);
            }

        }
        catch(err){
            console.error("Ha ocurrido un error: " + err);
        }
    };


    // Function to get the next 10 tickets
    const next = () => {
        setTickets([]);
        setLimit(limit+10);
        setOffset(offset+10);
        setPage(page+1);
    };

    // Function to get the previous 10 tickets
    const back = () => {
        if(offset != 0){
            setTickets([]);
            setLimit(limit-10);
            setOffset(offset-10);
            setPage(page-1);
        }
        else{
            alert('No se puede retroceder más')
        }

    };

    // Function that close the window of tickets and reset the limit and offset
    const close = () => {
        setLimit(10);
        setOffset(0);
        setTickets([]);
        setShowTickets(false);
    };

    // Function that parse the date of the tickets (library: date-fns-tz)
    const formatDate = (dateString: any) => {

        const date = new Date(dateString);
        const formattedDate = format(date, 'dd-MM-yyyy', { timeZone: 'auto' });
        return formattedDate;
    }


    // useEffect to show the tickets
    useEffect(() => {
        if (showTickets && tickets.length == 0) {
            getTickets(limit, offset);
        }
    }, [tickets]);





    return(
        <>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className='bg-white p-4 shadow-lg rounded-lg w-[1000px] h-[570px] '>
                <p className="text-lg text-black ml-[40px] mb-3">
                    Pagina: {page}
                </p>


                <div className="overflow-y-auto w-[900px] h-[430px] ml-[40px] mb-3 border-[0.5px] border-gray-300">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className={cellTittles}>
                                    Neto
                                </th>
                                <th scope="col" className={cellTittles}>
                                    Iva
                                </th>
                                <th scope="col" className={cellTittles}>
                                    Bruto
                                </th>
                                <th scope="col" className={cellTittles}>
                                    Método de Pago
                                </th>
                                <th scope="col" className={cellTittles}>
                                    Fecha de Pago
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <Fragment key={ticket.id}>
                                <tr>
                                    <td className={cellBody}>${ticket.subtotal}</td>
                                    <td className={cellBody}>${ticket.iva}</td>
                                    <td className={cellBody}>${ticket.total}</td>
                                    <td className={cellBody}>{ticket.paymethod}</td>
                                    <td className={cellBody}>{formatDate(ticket.date)}</td>  
                                </tr>
                            </Fragment>
                        ))}
                        </tbody>
                    </table> 
                </div>
                <div className="flex">
                    <button 
                        className={closeTickets}
                        onClick={() => close()}
                    >
                        Cerrar
                    </button>
                    <div className="flex ml-[630px]">
                        <div className={`${offset == 0 ? 'invisible' : ''}`}>
                            <button 
                                className={btnNextandBack}
                                onClick={() => back()}
                            >
                                ◁
                            </button>
                        </div>
                        <div>
                            <button 
                                className={btnNextandBack}
                                onClick={() => next()}
                            >
                                ▷ 
                            </button>
                        </div>
                    </div>
                </div>




            </div>

        </div>

        
        
        
        </>
)}

