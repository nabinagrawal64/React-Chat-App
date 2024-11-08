import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {

    const { 
        userInfo, 
        selectedChatType,
        isUploading,
        isDownloading,
        fileUploadProgress,
        fileDownloadProgress,
    } = useAppStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup your profile to continue...")
            navigate("/profile");
        }
    }, [userInfo, navigate])
    

    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            {/* uploading */}
            {
                isUploading && <div className="flex justify-center items-center flex-col gap-5
                    backdrop-blur-lg bg-black/80 h-[100vh] w-[100vw] fixed top-0 left-0 z-50"
                >
                    <h5 className="animate-pulse text-5xl">Uploading File</h5>
                    {fileUploadProgress}%
                </div> 
            }
            {/* downloading */}
            {
                isDownloading && <div className="flex justify-center items-center flex-col gap-5
                    backdrop-blur-lg bg-black/80 h-[100vh] w-[100vw] fixed top-0 left-0 z-50"
                >
                    <h5 className="animate-pulse text-5xl">Downloading File</h5>
                    {fileDownloadProgress}%
                </div> 
            }
            <ContactContainer />
            {
                selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
            }
            
        </div>
    )
}

export default Chat