// A demonstration of using React for simple UI SPA, 
// a) collecting data from REST API
// b) displaying data in table
// c) searching data
// d) storing locally the data if row is clicked
//
// a) is done immediately page is loaded. 
// b) is done immeduately page is loaded
// c) Search can be done at top of each column
// d) Local store is triggered on rowclick, can be reviewed with a button
// click

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';
// the API URL to call for a listing of flags.
const url = 'https://restcountries.com/v3.1/all?fields=name,flags'
const LOCAL_ARRAY_NAME = 'stored_country'

// Renderer class to hanlde rendering inside a cell (ie image of flags)
class FlagRenderer  {
    eGui;

    // Optional: Params for rendering. The same params that are passed to the cellRenderer function.
    init(params) {
        let companyLogo = document.createElement('img');
        companyLogo.src = `${params.value.toLowerCase()}`;
        companyLogo.setAttribute('class', 'logo');

        this.eGui = document.createElement('span');
        this.eGui.setAttribute('class', 'imgSpanLogo');
        this.eGui.appendChild(companyLogo);
    }

    // Return the DOM element of the component
    getGui() {
        return this.eGui;
    }

    // Get the cell to refresh.
    refresh(params) {
        return false;
    }
}



export function FlagTable() {
  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('')
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // CLean up data from API, and install to grid
        const processedData = data.map(item => ({
                                                 flag_url: item.flags.png,
                                                 common_name: item.name.common,
                                                 official_name: item.name.official
                                                 }));
        setRowData(processedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // define columns 	
  const columnDefs = [
    { headerName: "Flag", field: "flag_url", cellRenderer: FlagRenderer},
    { headerName: "Name", field: "common_name" },
    { headerName: "Official Name", field: "official_name" }
  ];
  
  return (
      <div>
      <div>
      <input type="text" 
	     placeholder="Enter Search Term ..."
             onChange={(e) => setQuickFilterText(e.target.value)}
	     style={{ marginBottom: '10px', padding: '5px' }} />
       </div>
	  <div className="ag-theme-alpine" style={{ height: 600, width: 800 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
	  onRowClicked={(e) => save_row_data(e)}
	  quickFilterText={quickFilterText}
        />
         </div>
       </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <div className="left-side">
          <FlagTable />
        </div>
        <div className="right-side">
          <h1>Simple React Demo</h1>
          <p>This is to show basic facility with React.</p>
	  
	  <div>
          <ShowLocalStorageButton/>
         </div>
        </div>
      </div>
    </div>
  );
}
export default App;


// save the row of data when it is clicked
function save_row_data (e) {
	// store the data part of the row passed in onclick
    saveArray(LOCAL_ARRAY_NAME, e.data)
}

// Show the localstorage values
export function ShowLocalStorageButton() {
  function handleClick() {
	  let val = readArray(LOCAL_ARRAY_NAME);
	  window.alert(val)};
  
  return (
    <button onClick={handleClick} className="flagbutton">
      Click to view Local Storage
    </button>
  );
}




// functions to read and write to local storage.
// We are only storing one array at a time, the row that was clicked
// Future functionality can include multiple selection.

function saveArray(arrayName, array) {
  localStorage.setItem(arrayName, JSON.stringify(array));
}

function readArray(arrayName){
  return localStorage.getItem(arrayName);
}



