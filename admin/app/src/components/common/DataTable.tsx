import React, { isValidElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import moment from 'moment';
import { AuthUserUI } from '../../models/authentication/AuthModels';
import { SchemaUI } from '../cms/CmsModels';
import { NotificationData } from '../../models/notifications/NotificationModels';
import DataTableActions from './DataTableActions';
import Checkbox from '@material-ui/core/Checkbox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: theme.palette.background.paper,
  },
  tableContainer: {
    maxHeight: '70vh',
  },
  ellipsisStyle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '350px',
    maxWidth: '350px',
  },
  tableRowClick: {
    cursor: 'pointer',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
}));

type Action = {
  title: string;
  type: string;
};

interface Props {
  headers: any;
  sort?: { asc: boolean; index: string | null };
  setSort?: any;
  dsData: SchemaUI[] | AuthUserUI[] | NotificationData[] | any;
  selectable?: boolean;
  actions?: Action[];
  handleAction?: (action: Action, data: any) => void;
  selectedItems?: string[];
  handleSelect?: (id: string) => void;
  handleSelectAll?: (data: any) => void;
  handleRowClick?: (data: any) => void;
  placeholder?: string;
}

const DataTable: React.FC<Props> = ({
  headers,
  sort,
  setSort,
  dsData = [],
  actions,
  handleAction,
  selectable = true,
  selectedItems = [],
  handleSelect,
  handleSelectAll,
  handleRowClick,
  placeholder = 'Not available',
  ...rest
}) => {
  const classes = useStyles();

  const onSelectedField = (index: string) => {
    if (!setSort) return;
    setSort((prevState: any) => {
      if (prevState.index === index) {
        return { asc: !prevState.asc, index: index };
      }
      return { asc: prevState.asc, index: index };
    });
  };

  const getValue = (value: any) => {
    if (moment(value, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', true).isValid()) {
      return moment(value).format('DD/MM/YYYY');
    }
    if (isValidElement(value)) {
      return value;
    }
    return value?.toString();
  };

  const getHeaderValues = (value: string) => {
    if (value === 'icon') {
      return '';
    }
    return value;
  };

  const onMenuItemClick = (action: { title: string; type: string }, data: any) => {
    if (handleAction) {
      handleAction(action, data);
    }
  };

  const onMenuItemSelect = (id: string) => {
    if (handleSelect) {
      handleSelect(id);
    }
  };

  const onMenuItemSelectAll = () => {
    if (handleSelectAll) {
      handleSelectAll(dsData);
    }
  };

  const onRowClick = (item: any) => {
    if (handleRowClick) {
      handleRowClick(item);
    }
  };

  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper} {...rest}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell className={classes.header} align="left" padding="none">
                  <Checkbox
                    color="primary"
                    onChange={onMenuItemSelectAll}
                    checked={selectedItems?.length === dsData.length}
                    indeterminate={
                      selectedItems?.length > 0 && selectedItems?.length < dsData.length
                    }
                    indeterminateIcon={<IndeterminateCheckBoxIcon color="primary" />}
                  />
                </TableCell>
              )}
              {headers.map((header: any, index: number) => (
                <TableCell className={classes.header} key={`${header.title}${index}`}>
                  {header.sort ? (
                    <TableSortLabel
                      active={sort?.index === header.sort}
                      direction={sort?.asc ? 'asc' : 'desc'}
                      onClick={() => onSelectedField(header.sort)}>
                      {getHeaderValues(header.title)}
                    </TableSortLabel>
                  ) : (
                    <>{getHeaderValues(header.title)}</>
                  )}
                </TableCell>
              ))}
              {actions && <TableCell className={classes.header} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {dsData.map((row: any, i: number) => (
              <TableRow
                key={i}
                onClick={() => onRowClick(row)}
                className={handleRowClick ? classes.tableRowClick : ''}>
                {selectable && (
                  <TableCell align="left" padding="none">
                    <Checkbox
                      color="primary"
                      checked={selectedItems?.includes(row._id)}
                      onChange={() => onMenuItemSelect(row._id)}
                    />
                  </TableCell>
                )}
                {Object.keys(row).map((item, j) => (
                  <TableCell
                    className={isValidElement(row[item]) ? '' : classes.ellipsisStyle}
                    key={`${i}-${j}`}>
                    {getValue(row[item])}
                  </TableCell>
                ))}
                <TableCell key={`action-${i}`} align={'right'}>
                  <DataTableActions
                    actions={actions}
                    onActionClick={(action) => onMenuItemClick(action, row)}
                    isBlocked={!row.Active}
                    editDisabled={selectedItems?.length > 1}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dsData.length < 1 && (
        <Paper className={classes.placeholder}>
          <Typography variant="subtitle1">{placeholder}</Typography>
        </Paper>
      )}
    </>
  );
};

export default DataTable;
