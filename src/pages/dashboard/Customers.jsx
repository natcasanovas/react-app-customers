import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { createContext, useEffect, useRef, useState } from 'react';
import * as service from '../../services/CustomersService';
import { TableCustomers } from '../../components/public/customers/TableCustomers';
import { Customer } from '../../utilities/AppTools';

export const CustomersContext = createContext({});

export const Customers = () => {

  const [customers, setCustomers] = useState([]);
  const [activeBackdrop,setActiveBackdrop] = useState(false);
  const [hasCustomers, setHasCustomers] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const defaultPageRef = useRef(0);
  const defaultOrientationRef = useRef('asc');
  const defaultOrderRef = useRef('lastName');

  const closeBackdrop = () => {
    setActiveBackdrop(false);
  };

  const openBackdrop = () => {
    setActiveBackdrop(true);
  };

  const getCustomers = async(orientation, order, page) => {
    openBackdrop(); 
    defaultPageRef.current =
        defaultPageRef.current != page && page != null && page != undefined
            ? page
            : defaultPageRef.current;
    
    defaultOrientationRef.current =
        defaultOrientationRef.current != orientation &&
        orientation != null &&
        orientation != undefined
            ? orientation
            : defaultOrientationRef.current;

    defaultOrderRef.current =
        defaultOrderRef.current != order && order != null && order != undefined
            ? order
            : defaultOrderRef.current;        


    const response = await service.getCustomers(
        defaultOrientationRef.current,
        defaultOrderRef.current,
        defaultPageRef.current
    
    );
    if(response?.status == 200) {
        setTotalPages(response.data.totalPages);
        setCustomers(response.data.content);
        //console.log(response);    
    } else {
        console.error(response.data.message);
    }
    closeBackdrop();
  };

  useEffect(() => {
    if(hasCustomers != customers.length > 0) {
        setHasCustomers(customers.length > 0);
    }
    getCustomers();
  }, [customers.length]);

  return (
    <>
    <CustomersContext.Provider
        value={{
          totalPages: totalPages,
        }}
    >
        {hasCustomers ? (
            <TableCustomers 
                customers={{ collection: customers, reload: getCustomers }}
                backdrop={{ open: openBackdrop, close: closeBackdrop}}
            />
        ) : (
            <p className='mt-4 text-slate-300'>No hay clientes cargados.</p>
        )}
    </CustomersContext.Provider>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={activeBackdrop}
        >
            <CircularProgress color='inherit' />
        </Backdrop>

        
    </>
  );
};

