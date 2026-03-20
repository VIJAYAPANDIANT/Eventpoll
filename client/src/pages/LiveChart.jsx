import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  useToast, 
  Flex, 
  Icon, 
  HStack, 
  useColorModeValue,
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Container
} from "@chakra-ui/react";
import { BiCopy, BiTimeFive, BiTrash } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Graphs from "../components/Graphs";
import io from 'socket.io-client';
import { useNavigate, useParams } from "react-router-dom";
import { stopPoll } from '../redux/data/action';
import { useDispatch } from 'react-redux';
const LiveChart = () => {
	const [remainingTime, setRemainingTime] = useState(null);
	const {id} = useParams()
	const [pollData,setPollData]=useState([])
	const dispatch = useDispatch()
	let token = localStorage.getItem("adminToken");
    const navigate = useNavigate()
    const toast = useToast()

    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const subTextColor = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.100", "gray.700");
		  useEffect(() => {
		const socket = io(`/api`);

	
			socket.on('pollData', (newPollData) => {
			  setPollData(newPollData);
			});
		
			socket.on('pollDeleted', () => { 
	
			  toast({
                title: `This poll has been deleted!`,
                position: 'top',
				duration: 9000,
                isClosable: true,
              })
			
			});
		 
			socket.emit('getPollData',`${id}`);
		 
			return () => {
			  socket.off('pollData');
			  socket.off('pollDeleted');
			};
		  }, [id,token,dispatch,toast,navigate]);





		  const handleClick = ()=>{
			
		let data = {
			pollId:id
		}
		
			dispatch(stopPoll(data,token))
			toast({
                title: `This poll has been deleted!`,
                position: 'top',
				duration: 9000,
                isClosable: true,
              })
					navigate('/ended-polls')
		}
		





       
		 
		  var endTime = pollData[0]?.pollEndsAt
	
		  useEffect(() => {
			const intervalId = setInterval(() => {
			  const currentTime = new Date().getTime();
			 
			  const diff = endTime - currentTime;
		
			  if (diff <= 0) {
				clearInterval(intervalId);
				let data = {
					pollId:id
				}
				
					dispatch(stopPoll(data,token))
					toast({
						title: 'Poll already ended.',
						description: "Sorry this poll was ended.",
						status: 'warning',
						duration: 8000,
						isClosable: true
					  })
					navigate('/ended-polls')
			  } else {
				const minutes = Math.floor((diff / 1000 / 60) % 60);
				const seconds = Math.floor((diff / 1000) % 60);
				setRemainingTime(` ${minutes}Min :${seconds}Sec`);
			  }
			}, 1000);
		
			return () => clearInterval(intervalId);
		  }, [endTime, id, token, dispatch, toast, navigate]);
		  


	return (
		<Box bg={bgColor} minH="100vh">
			<Navbar />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading color={textColor} mb={2}>Live Poll Data</Heading>
              <HStack color={subTextColor} spacing={6}>
                <HStack>
                  <Icon as={BiTimeFive} />
                  <Text fontWeight="600">Ends in: {remainingTime}</Text>
                </HStack>
                <VStack align="flex-start" spacing={1} flex={1}>
                  <Text fontSize="xs" fontWeight="800" color="red.500" textTransform="uppercase">Participant Link</Text>
                  <InputGroup size="sm" maxW="400px">
                    <Input
                      readOnly
                      value={`${window.location.origin}/event/${id}`}
                      bg={useColorModeValue("white", "gray.700")}
                      borderRadius="lg"
                      fontSize="xs"
                      pr="4.5rem"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.5rem"
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          const link = `${window.location.origin}/event/${id}`;
                          navigator.clipboard.writeText(link);
                          toast({ title: "Copied!", status: "success", duration: 2000 });
                        }}
                      >
                        Copy
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </VStack>
              </HStack>
            </Box>
            
            <HStack spacing={4}>
              <Button
                leftIcon={<Icon as={BiCopy} />}
                colorScheme="red"
                variant="outline"
                size="md"
                borderRadius="xl"
                onClick={() => {
                  const link = `${window.location.origin}/event/${id}`;
                  navigator.clipboard.writeText(link);
                  toast({
                    title: "Link Copied!",
                    description: "Participants can join using this link.",
                    status: "success",
                    duration: 2000,
                  });
                }}
              >
                Copy Link
              </Button>
              <Button 
                leftIcon={<Icon as={BiTrash} />}
                colorScheme="red" 
                bg="#D71A20"
                color="white"
                _hover={{ bg: "#b5161b" }}
                onClick={handleClick}
                borderRadius="xl"
              >
                End Poll
              </Button>
            </HStack>
          </Flex>

          <Box 
            bg={cardBg} 
            p={8} 
            borderRadius="3xl" 
            boxShadow="xl" 
            border="1px solid" 
            borderColor={borderColor}
            minH="500px"
          >
            <Graphs pollData={pollData} />
          </Box>
        </VStack>
      </Container>
		</Box>
	);
};
export default LiveChart;