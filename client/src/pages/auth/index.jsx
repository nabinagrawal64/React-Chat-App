import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () => {

    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateSignup = () => {
        if(!email.length){
            alert("Email is required")
            toast.error("Please enter Email");
            return false
        }
        if(!password.length){
            alert("Password is required")
            toast.error("Please enter Passowrd");
            return false
        }
        if(password !== confirmPassword){
            toast.error("Password & Confirm Passowrd should be same");
            return false
        }
        return true;
    }

    const handleSignup = async() => {
        if(validateSignup()){
            try {
                const response = await apiClient.post(
                    SIGNUP_ROUTES,
                    {email, password, confirmPassword},
                    { withCredentials: true},
                )
                console.log("Response", response);
                toast.success("Successfully registered")
                if(response.status === 201){
                    setUserInfo(response.data.user);
                    navigate("/profile");
                }
            } catch (error) {
                console.error("Response error:", {
                    status: error.response.status,
                    data: error.response.data
                });
            }
        }
    }

    const validateLogin = () => {
        if(!email.length){
            alert("Email is required")
            toast.error("Please enter Email");
            return false
        }
        if(!password.length){
            alert("Password is required")
            toast.error("Please enter Passowrd");
            return false
        }
        
        return true;
    }

    const handleLogin = async () => {
        if(validateLogin()){
            try {
                const response = await apiClient.post(
                    LOGIN_ROUTES,
                    {email, password},
                    { withCredentials: true},
                )
                console.log("Response", response);
                toast.success("Successfully logged in");
                if(response.data.user.id){
                    setUserInfo(response.data.user);
                    if(response.data.user.profileSetup){
                        navigate("/chat");
                    }
                    else {
                        navigate("/profile");
                    }
                }

            } catch (error) {
                console.error("Response error:", {
                    status: error.response.status,
                    data: error.response.data
                });
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div 
                className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 
                shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
            >
                {/* form */}
                <div className="flex flex-col gap-10 items-center justify-center">
                    {/* welcome + emoji */}
                    <div className="flex flex-col items-center justify-center">
                        {/* image */}
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory Imoji" className='h-[100px]' />
                        </div>
                        {/* text */}
                        <p className='font-medium text-center'>
                            Fill the deatils to get started with the best chat app
                        </p>
                    </div>
                    {/* forms */}
                    <div className="flex items-center justify-center w-full">
                        <Tabs className='w-3/4' defaultValue='login'>
                            {/* login and signup heading */}
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger 
                                    value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="signup"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            {/* login form */}
                            <TabsContent className="flex flex-col gap-5 mt-5" value="login">
                                
                                <Input 
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-2"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Passowrd"
                                    type="passowrd"
                                    className="rounded-full p-2"
                                    value={password}
                                    onChange={e=>setPassword(e.target.value)}
                                />

                                <Button className="rounded-full p-2 " onClick={handleLogin}>
                                    Login
                                </Button>

                            </TabsContent>
                            {/* signup form */}
                            <TabsContent className="flex flex-col gap-5 " value="signup">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-2"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Passowrd"
                                    type="passowrd"
                                    className="rounded-full p-2"
                                    value={password}
                                    onChange={e=>setPassword(e.target.value)}
                                />
                                <Input 
                                    placeholder="Confirm Passowrd"
                                    type="passowrd"
                                    className="rounded-full p-2"
                                    value={confirmPassword}
                                    onChange={e=>setConfirmPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleSignup}>
                                    Signup
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {/* background image */}
                <div className="hidden xl:flex items-center justify-center">
                    <img src={Background} alt="Background" className='h-[700px]' />
                </div>
            </div>
        </div>
    )
}

export default Auth