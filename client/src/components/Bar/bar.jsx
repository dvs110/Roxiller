
import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import "./styles.css";
const options = [
	{ label: "January", value: 1 },
	{ label: "Feburary", value: 2 },
	{ label: "March", value: 3 },
	{ label: "April", value: 4 },
	{ label: "May", value: 5 },
	{ label: "June", value: 6 },
	{ label: "July", value: 7 },
	{ label: "August", value: 8 },
	{ label: "September", value: 8 },
	{ label: "October", value: 10 },
	{ label: "November", value: 11 },
	{ label: "December", value: 12 }
];

const BarChart = () => {
	const [selected, setSelected] = useState(options[1].value);
	const handleChange = (event) => {
		console.log(event.target.value);
		setSelected(event.target.value);

	};
	const [labaray, setlabaray] = useState([]);
	const [datbaray, setdataray] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const range = ["0 - 100", "101 - 200", "201 - 300", "301 - 400", "401 - 500", "501 - 600", "601 - 700", "701 - 800", "801 - 900", "901-above"]
				const url = `http://localhost:8080/products/bar-chart?month=${selected}`;
				const d = await axios.get(url);
				console.log(d);
				setlabaray([]);
				setdataray([]);
				let j = 0;
				for (let i = 0; i < range.length; i++) {
					console.log(range[i]);
					if (j <= d.data.length - 1 && range[i] == d.data[j]._id) {
						setlabaray(current => [...current, d.data[j]._id]);
						setdataray(current => [...current, d.data[j].count]);
						j++;
					}
					else {
						setlabaray(current => [...current, range[i]]);
						setdataray(current => [...current, 0]);
					}
				}

			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}

		fetchData();
	}, [selected]);
	const data = {
		labels: labaray,
		datasets: [
			{
				label: 'Bar chart stats',
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgb(255, 99, 132)",
				data: datbaray,
			},
		],
	};
	return (
		<div>
			<div className="bar" style={{ position: "relative" }}>
				{/* <Select options={actions} defaultValue={actions[1].label} onChange={handleChange} value={selected} /> */}
				<select value={selected} onChange={handleChange} style={{ marginLeft: "28rem", marginTop: "0.4rem", position: "absolute", border: "none" }}>
					{options.map(option => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<Bar data={data} />
			</div>
		</div>
	);
};

export default BarChart;



