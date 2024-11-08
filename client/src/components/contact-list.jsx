import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";


const ContactList = ({ contacts, isChannel = false }) => {

    const {selectedChatType, selectedChatData, setSelectedChatType, setSelectedChatData, setSelectedChatMessages, } = useAppStore();
    
    const handleClick = (contact) => {
        console.log("i am under contact list");
        // setSelectedChatType(isChannel? "channel" : "contact");
        if(isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    };

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div key={contact._id} className={`pl-10 py-2 duration-300 transition-all cursor-pointer
                    ${selectedChatData && selectedChatData._id === contact._id ? 
                    "bg-purple-700 hover:bg-purple-600" :
                    "hover:bg-[#f1f1f111] "}`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {/* avatar */}
                        {
                            !isChannel && 
                            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.image ? (
                                    <AvatarImage
                                        src={`${HOST}/${contact.image}`}
                                        alt="profile"
                                        className="object-cover w-full h-full bg-black"
                                    />
                                ) : (
                                    <div
                                        className={` ${
                                            selectedChatData && selectedChatData._id === contact._id 
                                            ? "bg-[#ffffff22] border-2 border-white/70 " 
                                            : getColor(contact.color)
                                        }
                                            uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                                    >
                                        {
                                            contact.firstName 
                                            ? contact.firstName.split("").shift()
                                            : contact.email.split("").shift()
                                        }
                                    </div>
                                )}
                            </Avatar>
                        }
                        {
                            isChannel && 
                            <div
                                className={`bg-[#ffffff22] h-10 w-10 text-lg border-[1px] 
                                flex items-center justify-center rounded-full `}
                            >
                                #
                            </div>
                        }
                        { 
                            isChannel ?
                            <span>{contact.Name}</span> :
                            <span>{`${contact.firstName} ${contact.lastName}`}</span>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactList;
