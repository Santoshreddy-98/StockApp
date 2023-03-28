import React, { useState, useEffect } from "react";
import "./stock.css"
import Chart from "chart.js/auto";
import axios from "axios";

function StockPriceChart() {
  const [symbols, setSymbols] = useState(["","",""]);
  const [charts, setCharts] = useState([null, null, null]);
  const [data, setData] = useState([null, null, null]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symbols[0] === symbols[1] || symbols[0] === symbols[2] || symbols[1] === symbols[2]) {
      alert("Please enter different symbols");
      return;
    }
    const newData = [];
    try {
      for (let i = 0; i <= symbols.length; i++) {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbols[i]}&apikey=9O0NK2YFXUKC5KP4`
        );
        newData.push(response.data);
      }
      setData(newData);
    } catch (error) {
      alert("Entered symbol does not exist");
    }
  };
  
      
  

  useEffect(() => {
    if (data[0] && data[1] && data[2]) {
      const dates = Object.keys(data[0]["Time Series (Daily)"])
      .reverse()
  
      const prices1 = Object.values(data[0]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
  
      const prices2 = Object.values(data[1]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
  
      const prices3 = Object.values(data[2]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
  
      const canvas = document.getElementById("stock-chart");
  
      if (canvas) {
        if (charts[0]) {
          charts[0].destroy();
        }
        const newChart = new Chart(canvas, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: symbols[0],
                data: prices1,
                fill: false,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
              {
                label: symbols[1],
                data: prices2,
                fill: false,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
              {
                label: symbols[2],
                data: prices3,
                fill: false,
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          },
        });
        setCharts([newChart]);
      }
    }
  }, [data]);
  
  
  const handleChange = (e, index) => {
    const newSymbols = [...symbols];
    newSymbols[index] = e.target.value;
    setSymbols(newSymbols);
  };

  return (
    <div className="container">
    <div className="navbar nabvar-dark bg-dark" style={{color:"#1D976C"}}><h1>Stock Price Chart</h1></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="symbol1"><h5>Company Symbol 1:</h5></label>
          <input
            type="text"
            id="symbol1"
            value={symbols[0]}
            onChange={(e) => handleChange(e, 0)}
          />
        </div>
        <div>
          <label htmlFor="symbol2"><h5>Company Symbol 2:</h5></label>
          <input
            type="text"
            id="symbol2"
            value={symbols[1]}
            onChange={(e) => handleChange(e, 1)}
          />
        </div>
        <div>
        <label htmlFor="symbol3"><h5>Company Symbol 3:</h5></label>
          <input
            type="text"
            id="symbol3"
            value={symbols[2]}
            onChange={(e) => handleChange(e, 2)}
          />
        </div><br/>
        <button type="submit" className="btn btn-grad btn-grad:hover">
          Submit
        </button>
      </form>
      {<canvas id="stock-chart"/>}
    </div>
  );
}
export default StockPriceChart;
         
