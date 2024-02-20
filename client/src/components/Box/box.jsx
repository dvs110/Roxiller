
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
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
export default function Box() {
    const [selected, setSelected] = useState(options[1].value);
    const handleChange = (event) => {
        console.log(event.target.value);
        setSelected(event.target.value);

    };
    const [totalsale, settotalsale] = useState("");
    const [totalsolditems, settotalsolditems] = useState("");
    const [totalnotsolditems, settotalnotsolditems] = useState("");
    // const [datbaray, setdataray] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `http://localhost:8080/products/statistics?month=${selected}&number=1`;
                const d = await axios.get(url);
                console.log(d.data);
                settotalsale(d.data)
                const url2 = `http://localhost:8080/products/statistics?month=${selected}&number=2`;
                const d2 = await axios.get(url2);
                console.log(d2.data);
                settotalsolditems(d2.data)
                const url3 = `http://localhost:8080/products/statistics?month=${selected}&number=3`;
                const d3 = await axios.get(url3);
                console.log(d3.data);
                settotalnotsolditems(d3.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [selected]);




    return (
        <div >
            <div className="options" >
                <h3>Statistics</h3>
                <select value={selected} onChange={handleChange} style={{ position: "absolute", marginLeft: "11rem", marginTop: "1.4rem", border: "none" }}>
                    {options.map(option => (
                        <option key={option.value} value={option.value} >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="big">
                <div className="mid">
                    <div className="small1">Total sale</div>
                    <div className="small2">{totalsale}</div>
                </div>
                <div className="mid">
                    <div className="small1">Total sold items</div>
                    <div className="small2">{totalsolditems}</div>
                </div>
                <div className="mid">
                    <div className="small1">Total not sold items</div>
                    <div className="small2">{totalnotsolditems}</div>
                </div>

            </div>
        </div>

    );
}
