import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { ChakraProvider } from "@chakra-ui/react";
import "./app.css";
import ChatProvider from "./Context/ChatProvider";
function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
          </Routes>
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
