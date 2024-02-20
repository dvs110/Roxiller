
import React, { useEffect } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from "react";
import axios from "axios";

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
export default function BasicPie() {
    const [selected, setSelected] = useState(options[1].value);
    const handleChange = (event) => {
        console.log(event.target.value);
        setSelected(event.target.value);

    };
    const [labaray, setlabaray] = useState([]);
    // const [datbaray, setdataray] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `http://localhost:8080/products/pie-chart?month=${selected}`;
                const d = await axios.get(url);
                console.log(d.data);
                setlabaray([]);
                for (let i = 0; i < d.data.length; i++) {
                    setlabaray(current => [...current, { id: i, label: d.data[i]._id, value: d.data[i].count }]);
                }
                console.log(labaray);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [selected]);




    return (
        <div className="bar" style={{ position: "relative" }}>
            <select value={selected} onChange={handleChange} style={{ marginLeft: "28rem", marginTop: "0.4rem", position: "absolute", border: "none" }}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <PieChart
                series={[
                    {
                        data: labaray
                    },
                ]}
                width={500}
                height={200}
            />
        </div>

    );
}
