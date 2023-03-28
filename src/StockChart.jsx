import React, { useState, useEffect } from "react";
import "./stock.css"
import Chart from "chart.js/auto";
import axios from "axios";

function StockPriceChart() {
  const [symbols, setSymbols] = useState([]);
  const [charts, setCharts] = useState([]);
  const [data, setData] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (symbols.some(symbol => !symbol.trim())) {
      alert("Please enter a symbol");
      return;
    }
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        if (symbols[i] === symbols[j]) {
          alert("Please enter different symbols");
          return;
        }
      }
    }
    const newData = [];
      for (let i = 0; i < symbols.length; i++) {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbols[i]}&apikey=9O0NK2YFXUKC5KP4`
        )
        if(response.data['Error Message']){
          alert(`symbol ${symbols[i]} does not exist`)
          return
        }
        newData.push(response.data);
      }
      setData(newData);
  };
  
      
  

  useEffect(() => {
    if (data.length > 0) {
      const dates = Object.keys(data[0]["Time Series (Daily)"])
      .reverse()

      const datasets = [];
      for (let i = 0; i < data.length; i++) {
        const prices = Object.values(data[i]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
        datasets.push({
          label: symbols[i],
          data: prices,
          fill: false,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 2,
        });
      }
  
      const canvas = document.getElementById("stock-chart");
  
      if (canvas) {
        if (charts.length > 0) {
          charts[0].destroy();
        }
        const newChart = new Chart(canvas, {
          type: "line",
          data: {
            labels: dates,
            datasets: datasets,
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

  const handleAddSymbol = () => {
    setSymbols([...symbols, ""]);
  };

  return (
    <div className="container">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <h1 className="navbar-brand">Stock Price Chart</h1>
    </nav>
    
    <form onSubmit={handleSubmit}>
      {symbols.map((symbol, index) => (
        <div  key={index}>
          <label for={`symbol${index+1}`}><h5>Company Symbol {index+1}:</h5></label>
          <input
            className="form-group"
            type="text"
            id={`symbol${index+1}`}
            value={symbol}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      ))}
          <button type="button"  className="btn-grad btn-grada:hover" onClick={handleAddSymbol}>Add Stock</button>
    
          <button type="submit" className="btn-grad btn-grad:hover">Get Chart</button>

    </form>
    
    <canvas id="stock-chart" width="800" height="400"></canvas>
  </div>
  
);
}

export default StockPriceChart;