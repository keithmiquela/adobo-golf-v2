import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../pages/App";
import Series from "../pages/Series";
import Players from "../pages/Players";
import Gallery from "../pages/Gallery";



const routes = (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/series' element={<Series />} />
            <Route path='/players' element={<Players />} />
            <Route path='/gallery' element={<Gallery />} />
        </Routes>
    </BrowserRouter>
)

export default routes;