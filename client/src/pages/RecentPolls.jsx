import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Spinner,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Badge,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import UserRecentPoll from "../components/UserRecentPoll";
import { BiSearchAlt } from "react-icons/bi";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { getTopicVisual } from "../utils/topicVisuals";
import { useSelector } from "react-redux"; // Added useSelector import

const RecentPolls = () => {
  const [userData, setUserData] = useState([]);
  const [recentData, setRecent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const authData = useSelector((store) => store.auth.auth.token);
  const userToken = authData?.primaryToken || localStorage.getItem("adminToken") || localStorage.getItem("userToken") || "";
  const [loader, setLoader] = useState(false);

  const bgColor = useColorModeValue("gray.50", "black");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");

  const pagination = (payload, current, total) => {
    setRecent(payload);
  };

  const filteredPolls = recentData.filter((poll) =>
    poll.pollName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  useEffect(() => {
    setLoader(true);
    axios
      .get(`/api/user/user-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setUserData(response?.data.userDetails?.pollsAttended.reverse());
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, [userToken]);

  return (
    <Box bg={bgColor} minH="100vh">
      <Navbar />
      
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>
            <Box>
              <Heading size="lg" fontWeight="800" color={textColor} mb={1}>
                Recent <Text as="span" color="#D71A20">Polls</Text>
              </Heading>
              <Text color={subTextColor} fontSize="sm">
                Track your participation history
              </Text>
            </Box>

            <InputGroup maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <BiSearchAlt color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={inputBg}
                color={textColor}
                _placeholder={{ color: subTextColor }}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
                _focus={{ borderColor: "#D71A20", boxShadow: "0 0 0 1px #D71A20" }}
              />
            </InputGroup>
          </Flex>

          {loader ? (
            <Flex h="40vh" align="center" justify="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.100" color="#D71A20" size="xl" />
            </Flex>
          ) : (
            <Box>
              {filteredPolls.length === 0 ? (
                <Flex direction="column" align="center" justify="center" h="40vh" bg={cardBg} borderRadius="3xl" border="1px dashed" borderColor={borderColor}>
                  <Text fontSize="xl" fontWeight="700" color={subTextColor}>No Polls Found</Text>
                  <Text color={subTextColor}>You haven't participated in any polls yet.</Text>
                </Flex>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                  {filteredPolls.map((poll) => (
                    <Box
                      key={poll.pollId}
                      bg={cardBg}
                      p={6}
                      borderRadius="2xl"
                      boxShadow="sm"
                      border="1px solid"
                      borderColor={cardBorder}
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-4px)", boxShadow: "md", borderColor: "red.100" }}
                    >
                      <Box h="140px" w="100%" borderRadius="xl" overflow="hidden" mb={4} position="relative">
                        <Image 
                          src={poll.topicImage || getTopicVisual(poll.topic).image} 
                          alt={poll.topic} 
                          objectFit="cover" 
                          w="100%" 
                          h="100%" 
                          transition="transform 0.3s"
                          _groupHover={{ transform: "scale(1.1)" }}
                        />
                        <Box position="absolute" top={2} left={2}>
                          <Badge colorScheme={getTopicVisual(poll.topic).color} variant="solid" borderRadius="full" px={2} fontSize="xs">
                            {getTopicVisual(poll.topic).icon} {poll.topic || "Poll"}
                          </Badge>
                        </Box>
                      </Box>
                      <VStack align="stretch" spacing={2}>
                        <Text fontWeight="700" color="gray.800" fontSize="lg" noOfLines={1} textTransform="capitalize">
                          {poll.pollName}
                        </Text>
                        <UserRecentPoll {...poll} />
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          )}

          <Flex justify="center" pt={8} borderTop="1px solid" borderColor="gray.100">
            <Pagination data={userData} pagination={pagination} />
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default RecentPolls;
