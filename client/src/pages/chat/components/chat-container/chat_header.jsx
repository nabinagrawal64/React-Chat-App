import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri"

const ChatHeader = () => {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore();

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
            <div className="flex gap-5 items-center justify-between w-full ">
                {/* avatar */}
                <div className="flex gap-3 items-center justify-center ">
                    <div className="h-12 w-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                            {selectedChatData.image ? (
                                <AvatarImage
                                    src={`${HOST}/${selectedChatData.image}`}
                                    alt="profile"
                                    className="object-cover w-full h-full bg-black"
                                />
                            ) : (
                                <div
                                    className={`uppercase h-12 w-12 text-lg border-[1px] 
                                    flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}
                                >
                                    {
                                        selectedChatData.firstName 
                                        ? selectedChatData.firstName.split("").shift()
                                        : selectedChatData.email.split("").shift()
                                    }
                                </div>
                            )}
                        </Avatar>
                    </div>
                </div>
                {/* chat title */}
                {
                    selectedChatType === "contact" && selectedChatData.firstName 
                    ? <div className="text-xl font-bold text-white">{selectedChatData.firstName} {selectedChatData.lastName}</div>
                    : selectedChatData.email
                }
                <div className="flex items-center justify-center gap-5">
                    <button className="text-neutral-500 focus:border-none focus:outline-none
                    focus:text-white duration-300 transition-all ">
                        <RiCloseFill className="text-3xl" onClick={closeChat}/>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ChatHeader