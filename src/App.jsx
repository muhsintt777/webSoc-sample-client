import "./App.css";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const socket = io("http://localhost:3500");

function App() {
  const msgInpRef = useRef(null);
  const roomInpRef = useRef(null);
  const [receive, setReceive] = useState([]);
  const [room, setRoom] = useState("0");

  const handleRoom = (e) => {
    e.preventDefault();
    const roomId = roomInpRef.current.value;
    socket.emit("leave_room", { room });
    socket.emit("join_room", roomId);
    setRoom(roomId);
    roomInpRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    socket.emit("send_message", {
      message: message,
      room: room,
    });
    msgInpRef.current.value = "";
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceive((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="App">
      <Center w="full" minH="100vh" bg="gray.500">
        <VStack>
          <Text textColor="red.400" fontWeight="extrabold" fontSize="4xl">
            {room}
          </Text>
          <form onSubmit={handleRoom} style={{ marginBottom: "40px" }}>
            <HStack>
              <Input
                ref={roomInpRef}
                placeholder="Select Room"
                bg="white"
                w="200px"
              />
              <Button type="submit" bg="cyan.300">
                Set Room
              </Button>
            </HStack>
          </form>
          <form onSubmit={handleSubmit}>
            <HStack>
              <Input
                ref={msgInpRef}
                w="lg"
                bg="white"
                name="message"
                placeholder="Message..."
              />
              <Button bg="twitter.500" type="submit">
                Send
              </Button>
            </HStack>
          </form>
          {receive.length ? (
            receive.map((msg, index) => (
              <Box key={index} bg="white" h="10" rounded="md" minW="3xs">
                <Center w="full" h="full">
                  <Text
                    fontSize="md"
                    textAlign="center"
                    textColor="black"
                    fontWeight="bold"
                  >
                    {msg.message}
                  </Text>
                </Center>
              </Box>
            ))
          ) : (
            <Box bg="white" h="10" rounded="md" minW="3xs">
              <Center w="full" h="full">
                <Text
                  fontSize="md"
                  textAlign="center"
                  textColor="black"
                  fontWeight="bold"
                >
                  No Messages
                </Text>
              </Center>
            </Box>
          )}
        </VStack>
      </Center>
    </div>
  );
}

export default App;
