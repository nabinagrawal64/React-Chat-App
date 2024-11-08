import ChatHeader from "./chat_header"
import MeesageBar from "./meesage_bar"
import MessageContainer from "./message_container"

const ChatContainer = () => {
    return (
        <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
            <ChatHeader />
            <MessageContainer />
            <MeesageBar />
        </div>
    )
}

export default ChatContainer