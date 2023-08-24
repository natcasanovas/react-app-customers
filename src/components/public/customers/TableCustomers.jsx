import {
  Box,
  IconButton,
  Pagination,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import * as utilDate from '../../../utilities/DateTools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as service from '../../../services/CustomersService';
import { useContext, useRef, useState } from 'react';
import { CustomersContext } from '../../../pages/dashboard/Customers';

export const TableCustomers = (props) => {

  const { customers, backdrop } = props;

  const { totalPages } = useContext(CustomersContext);

  const orientationRef = useRef('asc');
  const orderRef = useRef('lastName');
  const pageRef = useRef(0);

  const[activePopover, setActivePopover] = useState(false);

  const dateColumnHeadRef = useRef(null);


  const changeOrientation = async (events) => {
    if (orderRef.current != events.target.dataset.name) {
      orderRef.current = events.target.dataset.name;
      orientationRef.current = 'asc';
      customers.reload(orientationRef.current, orderRef.current);
    } else {
      let orientation = orientationRef.current;
      orientationRef.current = orientation == 'asc' ? 'desc' : 'asc';
      customers.reload(orientationRef.current, orderRef.current);
    }
  };

  const changePage = async (events, page) => {
    pageRef.current = page - 1;
    customers.reload(orientationRef.current, orderRef.current, pageRef.current);
  };

  const openPopover = () => {
    setActivePopover(true);
  };

  const closePopover = () => {
    setActivePopover(false);
  };

  const tHeadStyles = {
    backgroundColor: '#DDD',
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '1em' }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={tHeadStyles}>Acciones</TableCell>
                <TableCell align={'left'} padding={'normal'}>
                  <TableSortLabel
                    data-name='id'
                    active={orderRef.current == 'id'}
                    direction={orientationRef.current}
                    onClick={changeOrientation}
                  >
                    Id
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={tHeadStyles} align={'left'} padding={'normal'}>
                  <TableSortLabel
                    data-name='name'
                    active={orderRef.current == 'name'}
                    direction={orientationRef.current}
                    onClick={changeOrientation}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={tHeadStyles} align={'left'} padding={'normal'}>
                  <TableSortLabel
                    data-name='lastName'
                    active={orderRef.current == 'lastName'}
                    direction={orientationRef.current}
                    onClick={changeOrientation}
                  >
                    Apellido
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={tHeadStyles} align={'left'} padding={'normal'}>
                <TableSortLabel
                    data-name='mail'
                    active={orderRef.current == 'mail'}
                    direction={orientationRef.current}
                    onClick={changeOrientation}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={tHeadStyles} align={'left'} padding={'normal'}>
                <TableSortLabel
                    data-name='dateOfBirth'
                    aria-owns={activePopover ? 'mouse-over-popover': undefined}
                    aria-haspopup='true'
                    active={orderRef.current == 'dateOfBirth'}
                    direction={orientationRef.current}
                    onClick={changeOrientation}
                    onMouseEnter={openPopover}
                    onMouseLeave={closePopover}
                    ref={dateColumnHeadRef}
                  >
                    Fecha de nacimiento
                  </TableSortLabel>
                  <Popover
                    id='mouse-over-popover'
                    sx={{
                      pointerEvents: 'none'
                    }}
                    open={activePopover}
                    anchorEl={dateColumnHeadRef.current}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'left'
                    }}
                    onClose={closePopover}
                    disableRestoreFocus
                  >
                    <Typography sx={{ p: 1 }}>{'dd/mm/yyyy'}</Typography>
                  </Popover>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.collection.map((customer) => (
                <TableRow
                  key={customer.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  hover
                >
                  <TableCell component='th' scope='row'>
                    <IconButton
                      data-id={customer.id}
                      data-name={`${customer.name} ${customer.lastName}`}
                      sx={{ marginRight: '.5em' }}
                      size='medium'
                      color='error'
                      //onClick={openConfirmation}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                    <IconButton
                      data-customer={JSON.stringify(customer)}
                      size='medium'
                      color='warning'
                      //onClick={openModalEdit}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </IconButton>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {customer.id}
                  </TableCell>
                  <TableCell align='center'>{customer.name}</TableCell>
                  <TableCell align='center'>{customer.lastName}</TableCell>
                  <TableCell align='center'>{customer.mail}</TableCell>
                  <TableCell align='center'>
                    {utilDate.formatDateToTable(new Date(customer.dateOfBirth))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#EEE',
            }}
          >
            <Pagination
            sx={{
              padding: '.5em'
            }}
            count={totalPages}
            showFirstButton
            showLastButton
            onChange={changePage}
            />

          </Box>
        )}          

      </Paper>
    </>
  );
};
