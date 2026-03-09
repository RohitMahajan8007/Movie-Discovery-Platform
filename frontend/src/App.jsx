import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Popular from "./pages/Popular";
import TvShows from "./pages/TvShows";
import AdminPanel from "./pages/AdminPanel";
import History from "./pages/History";
import Settings from "./pages/Settings";
import People from "./pages/People";
import Media from "./pages/Media";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import backendApi from "./api/backend";
import { setUser, logout } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // You might want an endpoint like /auth/me for this,
          // but for now we'll just check if login details are in localStorage or similar.
          // Since we save user in state, on refresh it's lost.
          // Let's at least try to get profile if token exists.
          const res = await backendApi.get("/users/profile").catch(() => null);
          if (res && res.data) {
            dispatch(setUser(res.data));
          } else {
            const savedUser = localStorage.getItem("user");
            if (savedUser && savedUser !== "undefined") {
              try {
                dispatch(setUser(JSON.parse(savedUser)));
              } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem("user");
              }
            }
          }
        } catch (e) {
          dispatch(logout());
        }
      }
    };
    checkUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/tv-shows" element={<TvShows />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<MovieDetail isTv={true} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/people" element={<People />} />
            <Route path="/media" element={<Media />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={user?.role === "admin" ? <AdminPanel /> : <Home />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
