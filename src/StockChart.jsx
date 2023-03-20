import React, { useState, useEffect } from "react";
import "./stock.css"
import Chart from "chart.js/auto";
import axios from "axios";

function StockPriceChart() {
  const [symbols, setSymbols] = useState(["", "", ""]);
  const [charts, setCharts] = useState([null, null, null]);
  const [data, setData] = useState([null, null, null]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = [];
    for (let i = 0; i < symbols.length; i++) {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbols[i]}&apikey=YOUR_API_KEY`
      );
      newData.push(response.data);
    }
    setData(newData);
    console.log(data)
  };

  useEffect(() => {
    if (data[0] && data[1] && data[2]) {
      const dates = Object.keys(data[0]["Time Series (Daily)"]).reverse();
      const prices1 = Object.values(data[0]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
      const prices2 = Object.values(data[1]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
      const prices3 = Object.values(data[2]["Time Series (Daily)"])
        .map((val) => parseFloat(val["4. close"]))
        .reverse();
  
      const newCharts = charts.map((chart, index) => {
        if (chart) {
          chart.destroy();
        }
        const canvas = document.getElementById(`stock-chart-${index}`);
        if (canvas){
        return new Chart(canvas, {
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
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          }
        });
      }
      })
      setCharts(newCharts);
    }
  
  }, [data]);
  const handleChange = (e, index) => {
    const newSymbols = [...symbols];
    newSymbols[index] = e.target.value;
    setSymbols(newSymbols);
  };

  return (
    <div className="container">
    <div className="navbar nabvar-dark bg-dark" style={{color:"azure"}}><h1>Stock Price Chart</h1></div>
      <form className="form-grp" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="symbol1"><h5>Company Symbol 1:</h5></label>
          <input
            type="text"
            className="form-control"
            id="symbol1"
            value={symbols[0]}
            onChange={(e) => handleChange(e, 0)}
          />
        </div>
        <div>
          <label htmlFor="symbol2"><h5>Company Symbol 2:</h5></label>
          <input
            type="text"
            className="form-control"
            id="symbol2"
            value={symbols[1]}
            onChange={(e) => handleChange(e, 1)}
          />
        </div>
        <div>
        <label htmlFor="symbol3"><h5>Company Symbol 3:</h5></label>
          <input
            type="text"
            className="form-control"
            id="symbol3"
            value={symbols[2]}
            onChange={(e) => handleChange(e, 2)}
          />
        </div><br/>
        <button type="submit" className="btn btn-grad btn-grad:hover">
          Submit
        </button>
      </form>
      {charts.map((chart, index) => (
    <canvas key={index} id={`stock-chart-${index}`} />
  ))}
    </div>
  );
}
export default StockPriceChart;
         
