import Menu from "./components/Menu";
import RedPage from "./pages/RedPages";
import BluePage from "./pages/BluePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
	return (
		<div>
			<Menu />
			<hr />
			<Routes>
				<Route path="/red" element={<RedPage />} />
				<Route path="/blue" element={<BluePage />} />
			</Routes>
		</div>
	);
};

export default App;
