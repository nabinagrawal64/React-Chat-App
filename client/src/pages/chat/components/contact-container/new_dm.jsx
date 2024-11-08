import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
    const {setSelectedChatData, setSelectedChatType, } = useAppStore();
    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm: searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts); // Adjusted to use response data structure properly.
                } else {
                    setSearchedContacts([]);
                }
            } else {
                // When searchTerm is cleared, reset the contacts list.
                setSearchedContacts([]);
            }
        } catch (error) {
            console.log("Error in new DM: ", error);
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModel(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

    return (
        <div>
            {/* + icon */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-sm text-start
                            hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Dialog box */}
            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
                <DialogContent className="bg-[#181920] border-none w-[400px] text-white h-[400px] flex flex-col">
                    {/* Heading */}
                    <DialogHeader>
                        <DialogTitle>Please Select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    {/* Search Input */}
                    <div>
                        <Input
                            placeholder="Search Contact"
                            className="p-5 w-full rounded-lg bg-[#2c2e3b] border-none"
                            type="text"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>

                    {/* Contact List */}
                    {searchedContacts.length > 0 && (     
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-5">
                                {
                                    searchedContacts.map((contact) => (
                                        <div 
                                            key={contact._id} 
                                            className="flex gap-3 items-center cursor-pointer"
                                            onClick={() => selectNewContact(contact)}
                                        >
                                            {/* avatar */}
                                            <div className="h-12 w-12 relative">
                                                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                    {contact.image ? (
                                                        <AvatarImage
                                                            src={`${HOST}/${contact.image}`}
                                                            alt="profile"
                                                            className="object-cover w-full rounded-full h-full bg-black"
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`uppercase h-12 w-12 text-lg border-[1px] 
                                                            flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                                                        >
                                                            {
                                                                contact.firstName 
                                                                ? contact.firstName.split("").shift()
                                                                : contact.email.split("").shift()
                                                            }
                                                        </div>
                                                    )}
                                                </Avatar>
                                            </div>
                                            
                                            {/* names */}
                                            <div className="flex flex-col">
                                                <span>
                                                    {
                                                        contact.firstName && contact.lastName 
                                                        ? `${contact.firstName} ${contact.lastName}`
                                                        : contact.email 
                                                    }
                                                </span>
                                                
                                                <span className="text-xs">
                                                    {contact.email}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </ScrollArea>
                    )}
                    
                    {searchedContacts.length <= 0 &&
                        <div className="flex-1 md:bg-[#1c1d25] mt-5 md:flex flex-col justify-center items-center transition-all duration-1000">
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    Hi<span className="text-purple-500">!</span> Search New
                                    <span className="text-purple-500"> Contact.</span>
                                </h3>
                            </div>
                        </div>
                    }       
                
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewDM;
