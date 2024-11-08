import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const {userInfo} = useAppStore();
    useEffect(() => {
        if(userInfo){
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            })
            socket.current.on('connect', () => {
                console.log('Connected to socket.io server');
            });

            socket.current.on('disconnect', () => {
                console.log('Disconnected from socket.io server');
            });

            const handleRecieveMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState();
                console.log("i am under handle Recieved message");
                if(selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id)){
                    console.log("Recieved message: ", message);
                    addMessage(message)
                }
            }
            
            socket.current.on('recieveMessage', handleRecieveMessage);

            return () => {
                if (socket.current) {
                    socket.current.off('receivedMessage', handleRecieveMessage);
                    socket.current.disconnect();
                }
            };
        }
    },[userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )

}


