import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLiveData } from "../redux/data/action";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  Container,
  VStack,
  Badge,
  HStack,
  Icon,
  Image,
  IconButton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Active from "../components/Active";
import Navbar from "../components/Navbar";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { BiSearchAlt, BiDetail, BiCopy } from "react-icons/bi";
import { getTopicVisual } from "../utils/topicVisuals";

function LivePoll() {
  const dispatch = useDispatch();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const authData = useSelector((store) => store.auth.auth.token);
  const token = authData?.primaryToken || localStorage.getItem("adminToken") || localStorage.getItem("userToken");
  const [postsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(0);
  const live = useSelector((store) => store.data.liveData) || [];
  const reversedLive = [...live].reverse();

  const pageNumbers = [];
  for (let i = 0; i < Math.ceil(reversedLive.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const getPageData = () => {
    const filtered = reversedLive.filter((val) =>
      !searchTerm || val.pollName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    const start = currentPage * postsPerPage;
    const end = start + postsPerPage;
    return filtered.slice(start, end);
  };

  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handlePrevious = () => setCurrentPage((prev) => prev - 1);

  useEffect(() => {
    if (token) {
      dispatch(getLiveData(token));
    }
  }, [dispatch, token]);

  const pageBg = useColorModeValue("#f8fafc", "black");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const cardBorder = useColorModeValue("gray.100", "gray.700");

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Navbar />
      
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>
            <Box>
              <HStack spacing={4} align="center" mb={1}>
                <Heading size="lg" fontWeight="800" color={textColor}>
                  Live <Text as="span" color="#D71A20">Polls</Text>
                </Heading>
                {live.length > 0 && <Active />}
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  onClick={() => dispatch(getLiveData(token))}
                  _hover={{ color: "#D71A20", bg: "red.50" }}
                  leftIcon={<Icon as={BiSearchAlt} />}
                >
                  Refresh
                </Button>
              </HStack>
              <Text color={subTextColor} fontSize="sm">
                Manage and monitor your active live polls
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
                bg={cardBg}
                borderRadius="xl"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                _focus={{ borderColor: "#D71A20", boxShadow: "0 0 0 1px #D71A20" }}
              />
            </InputGroup>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {getPageData().map((item) => (
              <Box
                key={item.pollId}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor={cardBorder}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "md", borderColor: "red.100" }}
              >
                <VStack align="stretch" spacing={4} h="100%">
                  <Box h="140px" w="100%" borderRadius="xl" overflow="hidden" mb={2} position="relative">
                    <Image 
                      src={item.topicImage || getTopicVisual(item.topic).image} 
                      alt={item.topic} 
                      objectFit="cover" 
                      w="100%" 
                      h="100%" 
                    />
                    <Box position="absolute" top={2} left={2}>
                      <Badge colorScheme={getTopicVisual(item.topic).color} variant="solid" borderRadius="full" px={2} fontSize="xs">
                        {getTopicVisual(item.topic).icon} {item.topic || "Poll"}
                      </Badge>
                    </Box>
                    <Box position="absolute" bottom={2} right={2}>
                      <Active />
                    </Box>
                  </Box>
                  <Heading
                    fontWeight="700"
                    textTransform="capitalize"
                    color={textColor}
                    size="md"
                    noOfLines={1}
                  >
                    {item.pollName}
                  </Heading>
                  <Text color={subTextColor} fontSize="sm" flex="1">
                    Click below to view real-time participant charts and data.
                  </Text>
                  
                  <HStack spacing={2} mt="auto">
                    <Button
                      as={Link}
                      to={`/live-polls/${item.pollId}`}
                      flex={1}
                      size="sm"
                      bg="#D71A20"
                      color="white"
                      _hover={{ bg: "#b5161b" }}
                      borderRadius="xl"
                      leftIcon={<Icon as={BiDetail} />}
                    >
                      Details
                    </Button>
                    <IconButton
                      aria-label="Copy Link"
                      icon={<BiCopy />}
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      borderRadius="xl"
                      _hover={{ bg: "red.50" }}
                      onClick={() => {
                        const link = `${window.location.origin}/event/${item.pollId}`;
                        navigator.clipboard.writeText(link);
                        toast({
                          title: "Link Copied!",
                          description: "Share this link with your participants.",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                          position: "bottom-right"
                        });
                      }}
                    />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {pageNumbers.length > 1 && (
            <Flex justify="center" pt={8} borderTop="1px solid" borderColor="gray.100" gap={2}>
              <Button
                size="sm"
                variant="outline"
                isDisabled={currentPage === 0}
                onClick={handlePrevious}
              >
                <GrCaretPrevious />
              </Button>
              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  size="sm"
                  variant={currentPage === number ? "solid" : "outline"}
                  colorScheme={currentPage === number ? "red" : "gray"}
                  bg={currentPage === number ? "#D71A20" : "transparent"}
                  onClick={() => paginate(number)}
                >
                  {number + 1}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                isDisabled={currentPage >= pageNumbers.length - 1}
                onClick={handleNext}
              >
                <GrCaretNext />
              </Button>
            </Flex>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default LivePoll;
