import { Route, Routes, Navigate } from "react-router-dom";

import BarChart from "./components/Bar/bar";
import BasicPie from "./components/Pie/pie"
import Box from "./components/Box/box"
function App() {


	return (
		<Routes>
			<Route path="/bar" exact element={<BarChart />} />
			<Route path="/pie" exact element={<BasicPie />} />
			<Route path="/box" exact element={<Box />} />
		</Routes>
	);
}

export default App;
