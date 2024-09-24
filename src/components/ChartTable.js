import React, { useMemo, useState } from "react";
import jsonData from "../data.json";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'; // Import the filter icon
import "./ChartTable.css";

export default function ChartTable() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState({
    id: '',
    name: '',
    category: '',
    subcategory: '',
    createdAt: '',
    updatedAt: '',
    price: '',
    sale_price: '',
  });

  const data = useMemo(() => {
    return jsonData.map((item) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format("MMM-DD-YY"),
        updatedAt: moment(item.updatedAt).format("DD-MMM-YY"),
        price: item.price ?? 0,
        sale_price: item.sale_price ?? 0,
      };
    });
  }, [jsonData]);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "Id", size: 50, enableGrouping: true },
      { accessorKey: "name", header: "Name", size: 50, enableGrouping: true },
      {
        accessorKey: "category",
        header: "Category",
        size: 50,
        enableGrouping: true,
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        size: 50,
        enableGrouping: true,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 50,
        enableGrouping: true,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 50,
        enableGrouping: true,
      },
      { accessorKey: "price", header: "Price", size: 50, enableGrouping: true },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        size: 50,
        enableGrouping: true,
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.keys(filterValue).every(key => {
        return (
          filterValue[key] === "" || 
          item[key].toString().toLowerCase().includes(filterValue[key].toLowerCase())
        );
      });
    });
  }, [data, filterValue]);

  const table = useMaterialReactTable({
    data: filteredData,
    columns,
    enableGrouping: true,
    enableColumnFilters: true,
    muiPaginationProps: {
      className: "pagination",
      color: "standard",
      shape: "rounded",
      showRowsPerPage: false,
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    positionPagination: "bottom",
  });

  const handleFilterChange = (columnId, value) => {
    setFilterValue((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  return (
    <div className="table-container">
      {/* Filter Button with Icon */}
      <button className="filter-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
        <FontAwesomeIcon icon={faFilter} />
      </button>

      {/* Filter Pop-up */}
      {isFilterOpen && (
        <div className="filter-popup">
          <h3>Filter Products</h3>
          {columns.map((column) => (
            <div key={column.accessorKey} className="filter-input">
              <label>{column.header}</label>
              <input
                type="text"
                placeholder={`Filter ${column.header}`}
                value={filterValue[column.accessorKey]}
                onChange={(e) => handleFilterChange(column.accessorKey, e.target.value)}
              />
            </div>
          ))}
          <button onClick={() => setIsFilterOpen(false)}>Close</button>
        </div>
      )}

      <MaterialReactTable
        table={table}
        className="table-body"
        headerClassName="table-header"
        footerClassName="table-footer"
      />
    </div>
  );
}
