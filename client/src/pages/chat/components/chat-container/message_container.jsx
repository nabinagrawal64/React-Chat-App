import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import {IoMdArrowRoundDown} from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {

    const scrollRef = useRef();
    const {
        selectedChatData, 
        selectedChatType, 
        setIsDownloading,
        selectedChatMessages, 
        setSelectedChatMessages, 
        setFileDownloadProgress,
    } = useAppStore();
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null)

    useEffect(() => {

        const getMessages = async() => {
            try {
                const response = await apiClient.post(
                    GET_ALL_MESSAGES_ROUTES,
                    {id: selectedChatData._id},
                    {withCredentials: true},
                )
                console.log(response.data);
                if(response.data.messages){
                    setSelectedChatMessages(response.data.messages);
                }
                console.log("messageContainer response: " + {response});
            } catch (error) {
                console.error("Failed to fetch messages: ", error);
            }
        }

        if(selectedChatData._id){
            if(selectedChatType == "contact") getMessages();
        }
    },[selectedChatData, selectedChatType, setSelectedChatMessages])

    useEffect(() => {
        if(scrollRef.current){
            scrollRef.current.scrollIntoView({
                behavior: "smooth",
                top: scrollRef.current.scrollHeight,
            });
        }
    },[selectedChatMessages])

    const checkIfImage = (filePath) => {
        console.log("filePath: " + filePath);
        const imageRagex = /\.(jpg|png|jpeg|gif|bmp|svg|heic|heif|webp|tif|tiff)$/i;
        return imageRagex.test(filePath);
    }

    const renderMessages = () => {
        let lastdate = null;
        return selectedChatMessages.map((message, index) => {
            console.log("message content: ", message.content);
    
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastdate || index === 0; // Always show for the first message
            lastdate = messageDate;

            return (
                <div key={index}>
                    {showDate && 
                        (<div className="text-center text-gray-500 my-2">
                            {moment(message.timeStamp).format("LL")}
                        </div>)
                    }
                    {selectedChatType === "contact" && renderDMMessage(message)}
                </div>
            );
        });
    };

    const downloadFile = async(url) => {
        setIsDownloading(true);
        setFileDownloadProgress(0);
        const response = await apiClient.get(
            `${HOST}/${url}`, 
            {
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                    const {loaded, total} = progressEvent;
                    const percentComplete = Math.round((loaded*100)/total);
                    setFileDownloadProgress(percentComplete);
                }
            }
        )
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownloading(false);
        setFileDownloadProgress(0);
    }

    const renderDMMessage = (message) => (
        <div className={`${message.sender === selectedChatData.id ? "text-left" : "text-right"}`}>
            {/* if msg = text */}
            {message.messageType === "text" &&
                <div 
                    className={`
                        ${message.sender !== selectedChatData._id 
                        ? "text-white/80 bg-[#8417ff]/90 border-[#8417ff]/50 "
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "}
                        border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                >   
                    {message.content}
                </div>
            }

            {/* if msg = file */}
            {message.messageType === "file" &&
                <div 
                    className={`
                        ${message.sender !== selectedChatData._id 
                        ? "text-white/80 bg-[#8417ff]/90 border-[#8417ff]/50 "
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "}
                        border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                >   {/* if image */}
                    {checkIfImage(message.fileUrl) ? (
                        <div className="cursor-pointer" 
                            onClick={() => {setShowImage(true), setImageURL(message.fileUrl)}}
                        >
                            <img 
                                src={`${HOST}/${message.fileUrl}`} 
                                alt="File" 
                                height={300} 
                                width={300} 
                            />
                        </div>
                    ) : (
                        // if file
                        <div>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">📄</span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span className=" bg-black/20 p-2 rounded-full hover:bg-black/50
                                    duration-300 transition-all cursor-pointer text-2xl"
                                    onClick={() => {downloadFile(message.fileUrl)}}    
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            }
            <div className="text-xs text-gray-600 ">
                {moment(message.timeStamp).format("LT")}
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
            {renderMessages()}
            <div ref={scrollRef}></div>
            {
                showImage &&
                <div className="fixed top-0 left-0 w-[100vw] h-[100vh] z-50 bg-black/70
                    flex flex-col items-center justify-center backdrop-blur-lg "
                >   
                    {/* image */}
                    <div>
                        <img 
                            src={`${HOST}/${imageURL}`} 
                            alt="File" 
                            className="w-[80vw] h-[80vh] bg-cover" 
                        />
                    </div>

                    {/* buttons */}
                    <div className="flex gap-5 fixed top-0 mt-5">
                        {/* download button */}
                        <Button className=" bg-black/20 p-3 rounded-full hover:bg-white/20
                            duration-300 transition-all cursor-pointer text-2xl"
                            onClick={() => {downloadFile(imageURL)}}
                        >
                            <IoMdArrowRoundDown />
                        </Button>
                        {/* close button */}
                        <Button className=" bg-black/20 p-3 rounded-full hover:bg-white/20
                            duration-300 transition-all cursor-pointer text-2xl"
                            onClick={() => {setShowImage(false), setImageURL(null)}}
                        >
                            <IoCloseSharp />
                        </Button>
                    </div>
                </div>
            }
        </div>
    ) 
}

export default MessageContainer