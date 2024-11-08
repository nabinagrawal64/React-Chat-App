import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5"
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const ProfileInfo = () => {

    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async() => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials: true});
            if (response.status === 200 ){
                toast.success("Logout successful");
                navigate("/auth");      
                setUserInfo(null);
            }
            console.log("response of logout: ", {response});
        } catch (error) {
            console.log("Error in logout: " + error.message);
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between lg:px-5 md:px-2 w-full bg-[#2a2b33]  " >
            {/* avatar and name */}
            <div className="flex gap-3 items-center justify-between">
                {/* avatar */}
                <div className="h-12 w-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {
                            userInfo.image ? (
                                <AvatarImage 
                                    src={`${HOST}/${userInfo.image}`} 
                                    alt="profile" 
                                    className="object-cover w-full h-full bg-black" 
                                />
                            ) : ( 
                                <div className={
                                        `uppercase h-12 w-12 text-lg border-[1px] 
                                        flex items-center justify-center rounded-full ${getColor(userInfo.color)} `
                                    }
                                >
                                    {
                                        userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()
                                    }
                                </div>
                            )
                        }
                    </Avatar>
                </div>
                {/* name */}
                <div>
                    {
                        userInfo.firstName || userInfo.lastName ?
                        <div className="text-lg font-bold text-white">{userInfo.firstName} {userInfo.lastName}</div>
                        : ""
                    }
                </div>
            </div>
            <div className="flex md:gap-2 lg:gap-4 ">
                {/* edit icon */}
                <div className="flex ">
                    {
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <FiEdit2 className="text-purple-500 text-xl font-medium" 
                                        onClick={()=> navigate("/profile")}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#1c1b1e] text-white border-none ">
                                    Edit Profile
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    }
                </div>
                {/* log out */}
                <div className="flex ">
                    {
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <IoPowerSharp className="text-red-500 text-xl font-medium" 
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
        </div>
    )
}

export default ProfileInfo