import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/SocketContext"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { UPLOAD_FILES_ROUTES } from "@/utils/constants"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import { MdMic } from "react-icons/md";

const MeesageBar = () => {

    const emojiRef = useRef();
    const socket = useSocket();
    const fileInputRef = useRef();
    const {selectedChatData, selectedChatType, userInfo, setIsUploading, setFileUploadProgress} = useAppStore();
    const [message, setMessage] = useState('')
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

    useEffect(() => {
        function clickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener('mousedown', clickOutside)
        return () => {
            document.removeEventListener('mousedown', clickOutside)
        }
    },[emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = () => {
        if (message.trim() === '') return; // Prevent sending empty messages
        if (selectedChatType === 'contact' && socket) {
            console.log('Sending message:', message);
            socket.emit('sendMessage', {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: 'text',
                fileUrl: undefined,
            });
            setMessage(''); // Clear the input after sending
        }
    };

    const handleAttachmentClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async(event) => {
        try {
            const file = event.target.files[0];
            console.log("file: ", {file});
            if(file){
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const response = await apiClient.post(
                    UPLOAD_FILES_ROUTES,
                    formData,
                    {
                        withCredentials: true,
                        onUploadProgress: data => {
                            setFileUploadProgress(Math.round((data.loaded / data.total) * 100))
                        },
                        onUploadError: error => {
                            setIsUploading(false);
                            console.error('Error uploading file:', error);
                        }
                    },
                )
                if(response.status === 200 && response.data){
                    setMessage(''); // Clear the input after sending
                    setIsUploading(false);
                    if(selectedChatType === 'contact'){
                        socket.emit('sendMessage', {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: 'file',
                            fileUrl: response.data.filePath,
                        });
                    }
                }
            }
        } catch (error) {
            setIsUploading(false);
            console.error('Error uploading file:', error.response.data);
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] px-8 mb-6 flex items-center justify-center gap-4 ">
            <div className="flex flex-1 bg-[#2a2b33] rounded-full  items-center pr-5 " >
                {/* emoji section */}
                <div className="relative pl-3 md:pl-4 xl:pl-5 pt-2">
                    <button className="text-neutral-500 focus:border-none focus:outline-none
                        focus:text-white duration-300 transition-all "
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <MdOutlineEmojiEmotions className="text-xl md:text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0 " ref={emojiRef} >
                        <EmojiPicker
                            onEmojiClick={handleAddEmoji}
                            open={emojiPickerOpen}
                            autoFocusSearch = {false}
                            theme="auto"
                            className="absolute translate-x-[300px] w-[200px] h-[200px] bg-[#1c1d25] rounded-md shadow-lg"
                            style={{zIndex: 999, }}
                        />
                    </div>
                </div>
                {/* message input */}
                <input type="text" 
                    className="flex-1 lg:p-4 xl:p-[18px] md:p-3 p-2 bg-transparent rounded-md focus:border-none focus:outline-none" 
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    autoFocus={true}
                />
                {/* attachment icon */}
                <button className="text-neutral-500 focus:border-none focus:outline-none
                                focus:text-white duration-300 transition-all "
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-xxl md:text-2xl" />
                </button>
                <Input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAttachmentChange}
                />
            </div>
            {/* send button */}
            <button className={`bg-[#8417ff]  rounded-full 
                ${message.length > 0 ? "md:p-3 lg:p-[14px] xl:p-4 p-[10px]" : "md:p-[7px] lg:p-[11px] xl:p-[13px] p-[8px]"} 
                flex items-center justify-center focus:border-none focus:outline-none 
                hover:bg-[#741bda] focus:bg-[#741bda] focus:text-white`}
                onClick={handleSendMessage}    
            >   
            {
                message.length > 0 
                ? <IoSend className="text-xl lg:text-2xl md:text-lg " />
                : <MdMic className="text-2xl md:text-[28px] lg:text-3xl" /> 
            }  
            </button>
        </div>
    )
}

export default MeesageBar