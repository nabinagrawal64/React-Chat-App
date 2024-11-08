import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({children}) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    console.log("isAuthenticated", isAuthenticated);
    return isAuthenticated ? <Navigate to="/chat" /> : children
}

function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await apiClient.get(GET_USER_INFO,{
                    withCredentials: true,  
                })
                console.log("response", response);
                if(response.status === 200 && response.data.id){
                    setUserInfo(response.data);
                } else{
                    setUserInfo(null);
                }
            } catch (error) {
                setUserInfo(null);
                console.log("Error found ", error);
            } finally{
                setLoading(false);
            }
        }

        if(userInfo === undefined){
            getUserData();
        } else{
            setLoading(false);  
        }
    },[userInfo, setUserInfo])

    // Render loading indicator if data is still being fetched
    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/auth" 
                    element={
                        <AuthRoute loading={loading}>
                            <Auth/>
                        </AuthRoute>
                    } 
                />
                <Route 
                    path="/chat" 
                    element={
                        <PrivateRoute loading={loading}>
                            <Chat/>
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute loading={loading}>
                            <Profile/>
                        </PrivateRoute>
                    } 
                />
                <Route path="/" element={<Auth />}/>
                <Route path="*" element={<Navigate to="/auth"/>} />
            </Routes>
        </BrowserRouter>
    ) 
}

export default App
