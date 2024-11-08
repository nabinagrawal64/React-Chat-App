import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoPowerSharp } from 'react-icons/io5'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import  { FaTrash, FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE, HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Profile = () => {

    const { userInfo, setUserInfo, logout } = useAppStore();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [image, setImage] = useState(null)
    const [hovered, setHovered] = useState(false)
    const [selectedColor, setSelectedColor] = useState(0)
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Fetch from `userInfo` and set states each time `userInfo` changes
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        if (userInfo.image) {
            setImage(`${HOST}/${userInfo.image}`);
        } else {
            setImage(null);
        }
    }, [userInfo, userInfo.image]); 
    
    const validateprofile = () => {
        if(!firstName){
            toast.error("First name is required");
            return false;
        }
        if(!lastName){
            toast.error("Last name is required");
            return false;
        }
        if(firstName.length < 2 || firstName.length > 20){
            toast.error("First name must be between 2 and 20 characters");
            return false;
        }
        if(lastName.length < 2 || lastName.length > 20){
            toast.error("Last name must be between 2 and 20 characters");
            return false;
        }
        return true;
    }

    const saveChanges = async() => {
        if(validateprofile()){
            try {
                const response = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    {firstName, lastName, color: selectedColor,},
                    {withCredentials: true},
                )
                if(response.status === 200 && response.data){
                    setUserInfo({...response.data});
                    toast.success("Profile updated successfully");
                    navigate("/chat");
                }
                console.log("Response", response);
                setUserInfo(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to update profile, please try again later");
            }
        }
    }

    const handleNavigate = () => {
        if(userInfo.profileSetup){
            navigate("/chat");
        } else {
            toast.error("Please Setup Profile ");
        }

    }

    const handleFileInput = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        console.log({ file: file});
        if(file){
            const formData = new FormData();
            formData.append("profile-image", file);
            try {
                const response = await apiClient.post(
                    ADD_PROFILE_IMAGE,
                    formData,
                    {withCredentials: true},
                )
                if(response.status === 200 && response.data){
                    setUserInfo({...userInfo, image: response.data.image});
                    toast.success("Image uploaded successfully");
                }
                const reader = new FileReader();
                reader.onload = () => {
                    setImage(reader.result);
                }
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload image, please try again later");
            }
        }
    }

    const handleDeleteImage = async () => {
        try {
            const response = await apiClient.delete(REMOVE_PROFILE_IMAGE,{withCredentials:true})
            if(response.status === 200 && response.data){
                setUserInfo({...userInfo, image: null});
                toast.success("Image removed successfully");
                setImage(null)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const logOut = async() => {
        logout(); // Clear the user info from state
        navigate('/auth'); 
    }

    return (
        <div className="bg-[#1b1c24] h-[100vh] flex justify-center items-center flex-col gap-10">
            <div className="flex flex-col gap-8 w-[80vw] md:w-max ">
                {/* buttons */}
                <div className="gap-5 flex items-center justify-between">
                    {/* back button */}
                    <div>
                        <IoArrowBack className="text-4xl lg:text-6xl hover:text-slate-400 text-white/90 cursor-pointer" onClick={handleNavigate} />
                    </div>
                    {/* logout */}
                    <div className="flex ">
                        {
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IoPowerSharp className="text-red-500 hover:bg-white/30 
                                            hover:p-1 hover:rounded-full text-3xl font-medium" 
                                            onClick={logOut}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1c1b1e] text-white border-none ">
                                        Log out
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }
                    </div>
                </div>
                {/* setup profile */}
                <div className='grid grid-cols-2'>
                    {/* image add */}
                    <div className='h-full w-32 md:w-48 md:h-48 relative flex justify-center items-center '
                        onMouseEnter={()=>setHovered(true)}
                        onMouseLeave={()=>setHovered(false)}
                    >
                        {/* avatar */}
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {
                                image ? (
                                    <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />
                                ) : ( 
                                    <div 
                                        className={
                                            `uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] 
                                            flex items-center justify-center rounded-full ${getColor(selectedColor)} `
                                        }
                                    >{
                                        firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                                    }
                                    </div>
                                )
                            }
                        </Avatar>

                        {/* image add */}
                        {
                            hovered && (
                                <div className="absolute inset-0 bg-black/50 rounded-full cursor-pointer
                                ring-fuchsia-50 flex items-center justify-center"
                                onClick={image ? handleDeleteImage : handleFileInput}
                                >
                                    {
                                        image 
                                        ? <FaTrash className="text-3xl text-white cursor-pointer" /> 
                                        : <FaPlus className="text-3xl text-white cursor-pointer" />
                                    }
                                </div>
                            ) 
                        }

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleImageChange} 
                            name="profile-image" 
                            accept=".png, .jpeg, .jpg, .svg, .webp "
                        />
                    </div>

                    {/* details */}
                    <div className="flex min-w-32 md:min-w-64 gap-5 flex-col justify-center items-center text-white" >
                        {/* first name */}
                        <div className="w-full">
                            <Input 
                                type="text" 
                                placeholder="First Name" 
                                value={firstName} 
                                onChange={(e)=>setFirstName(e.target.value)} 
                                className="bg-[#2c2e3b] border-white p-2 rounded-lg border-none"
                            />
                        </div>
                        {/* last name */}
                        <div className="w-full">
                            <Input 
                                type="text" 
                                placeholder="Last Name" 
                                value={lastName} 
                                onChange={(e)=>setLastName(e.target.value)} 
                                className="bg-[#2c2e3b] border-white p-2 rounded-lg border-none"
                            />
                        </div>
                        {/* email */}
                        <div className="w-full">
                            <Input
                                type="email" 
                                placeholder="Email" 
                                disabled value={userInfo.email}
                                className="bg-[#2c2e3b] border-white p-2 rounded-lg border-none"
                            />
                        </div>
                        {/* colors */}
                        <div className="flex w-full gap-5">
                            {
                                colors.map((color, index) => {
                                    return (
                                        <div 
                                            key={index} 
                                            className={`${color} h-8 w-8 rounded-full 
                                            cursor-pointer transition-all duration-300
                                            ${selectedColor === index ? "outline outline-white/50 outline-2" : ""}`}
                                            onClick={() => setSelectedColor(index)}
                                        >
                                        </div>
                                    )
                                })
                            }
                        </div>      
                    </div>
                </div>
                {/* save button */}
                <div className="w-full" onClick={saveChanges}>
                        <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300">
                            Save Changes
                        </Button>
                </div>
                
            </div>  
        </div>
    )
}

export default Profile