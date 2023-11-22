import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const PopulationChart = () => {
  const [agePops, setAgePops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAgePops = async () => {
      try {
        const res = await axios.get("https://mehdb.vercel.app/agepops");

        if (res.status === 200) {
          const sortedData = res.data.sort((a, b) => a['Sr.No'] - b['Sr.No']); // Sorting the data by Sr.No
          setAgePops(sortedData);
        } else {
          // If status code is not 200, navigate to login page or handle as needed
          navigate('/login'); // Update '/login' with the actual login page route
        }
      } catch (error) {
        // Handle other errors, e.g., network issues
        console.error("Error fetching data:", error);
      }
    };

    getAgePops();
  }, [navigate]); // Include history in the dependency array to prevent a stale closure warning

  const labels = agePops
    .map((agePop, index) =>
      agePops.length > 0 && index < 7 ? agePop.Taluka : "Loading..."
    )
    .slice(0, 7);

  const data = agePops
    .map((agePop, index) =>
      agePops.length > 0 && index < 7 ? agePop.Total : "Loading..."
    )
    .slice(0, 7);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Population",
        backgroundColor: "#e28413",
        borderColor: "#e28413",
        data: data,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMax: 500000,
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Card className="w-full mx-4">
        <CardBody>
          <Bar
            data={chartData}
            options={options}
            style={{ height: "300px", width: "100%" }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default PopulationChart;
