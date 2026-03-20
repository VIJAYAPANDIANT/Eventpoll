import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  Container,
  VStack,
  Badge,
  Card,
  CardBody,
  Icon,
  FormLabel,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getAllData, getTemplateByIdData, postPollData } from "../redux/data/action";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { BiSearchAlt, BiPlusCircle, BiTimeFive } from "react-icons/bi";
import { motion } from "framer-motion";
import { getTopicVisual } from "../utils/topicVisuals";

const MotionCard = motion(Card);

const DEMO_TEMPLATES = [
  {
    templateId: "demo-1",
    templateName: "Daily Standup",
    topic: "Work",
    topicImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
    questions: [
      {
        question: "How's your progress today?",
        type: "single",
        options: ["Great", "Stable", "Blocked"],
      }
    ],
    isDemo: true,
  },
  {
    templateId: "demo-2",
    templateName: "Event RSVPs",
    topic: "Events",
    topicImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop",
    questions: [
      {
        question: "Will you attend the annual retreat?",
        type: "single",
        options: ["Yes", "No", "Maybe"],
      }
    ],
    isDemo: true,
  },
  {
    templateId: "demo-3",
    templateName: "Product Feedback",
    topic: "Product",
    topicImage: "https://images.unsplash.com/photo-1553484771-047a44eee27b?q=80&w=400&auto=format&fit=crop",
    questions: [
      {
        question: "Rate our new feature",
        type: "rating",
      }
    ],
    isDemo: true,
  },
  {
    templateId: "demo-4",
    templateName: "Team Pizza Night",
    topic: "Food",
    topicImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop",
    questions: [
      {
        question: "Which topping do you prefer?",
        type: "multi",
        options: ["Pepperoni", "Mushroom", "Olives", "Veggie"],
      }
    ],
    isDemo: true,
  }
];

function TemplatePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const data = useSelector((store) => store.data.data);
  const dataById = useSelector((store) => store.data.dataDetails);
  const dispatch = useDispatch();
  
  const [dataArray, setDataArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pollName, setPollName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [postsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(0);

  const authData = useSelector((store) => store.auth.auth.token);
  const token = authData?.primaryToken || localStorage.getItem("userToken") || localStorage.getItem("adminToken");
  const toast = useToast();

  useEffect(() => {
    dispatch(getAllData(token));
  }, [token, dispatch]);

  useEffect(() => {
    let rawTemplates = [];
    if (data?.userDetails?.templateCreated) {
      rawTemplates = [...data.userDetails.templateCreated].reverse();
    }
    // Merge with demo templates
    setDataArray([...rawTemplates, ...DEMO_TEMPLATES]);
  }, [data]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const getPageData = () => {
    const start = currentPage * postsPerPage;
    const end = start + postsPerPage;
    return dataArray
      .filter((val) =>
        searchTerm === "" ||
        val.templateName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        val.topic?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
      .slice(start, end);
  };

  const pageNumbers = [];
  const filteredCount = dataArray.filter((val) =>
    searchTerm === "" ||
    val.templateName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    val.topic?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  ).length;

  for (let i = 0; i < Math.ceil(filteredCount / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleStartPollClick = (item) => {
    setSelectedTemplate(item);
    onOpen();
  };

  const handleSubmit = (item) => {
    if (item.isDemo) {
      // For demo templates, we already have the questions in the 'item'
      const pollDataObj = {
        pollName: pollName,
        topic: item.topic || "General",
        questions: item.questions,
        pollStatus: "live", // Backend expects 'live' or status string
        pollCreatedAt: Date.now(),
        pollEndsAt: Date.now() + 8 * 60 * 30 * 1000,
        topicImage: item.topicImage || ""
      };
      dispatch(postPollData(pollDataObj, token));
      toast({
        title: "Success",
        description: `Poll "${pollName}" launched from demo template!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      dispatch(getTemplateByIdData(item.templateId, token));
      toast({
        title: "Poll Starting...",
        description: "Preparing your poll from template.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (dataById && dataById.length !== 0 && selectedTemplate) {
      const data = {
        pollName: pollName,
        topic: selectedTemplate.topic || "General",
        questions: dataById?.template?.questions,
        pollStatus: true,
        pollCreatedAt: Date.now(),
        pollEndsAt: Date.now() + 8 * 60 * 30 * 1000,
      };
      dispatch(postPollData(data, token));
      toast({
        title: "Success",
        description: "Poll launched successfully!",
        status: "success",
        duration: 5000,
      });
      onClose();
    }
  }, [dataById, pollName, token, dispatch, selectedTemplate, onClose, toast]);

  const pageBg = useColorModeValue("#f8fafc", "black");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const searchBorder = useColorModeValue("gray.200", "gray.700");
  const cardDivider = useColorModeValue("gray.50", "gray.700");
  const cardBodyBg = useColorModeValue("gray.50", "#1A202C");
  const modalBoxBg = useColorModeValue("gray.50", "gray.800");
  const modalBoxBorder = useColorModeValue("gray.100", "gray.600");

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Navbar />

      {/* Hero Section */}
      <Box 
        bg="#D71A20" 
        color="white" 
        py={16} 
        px={6} 
        textAlign="center"
        backgroundImage="linear-gradient(45deg, #D71A20 0%, #b5161b 100%)"
        mb={12}
      >
        <Container maxW="container.xl">
          <Heading size="2xl" mb={4} fontWeight="900">Poll Templates</Heading>
          <Text fontSize="xl" opacity={0.9} maxW="container.md" mx="auto">
            Choose from your saved templates to launch polls in seconds. Efficiency at its finest.
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={20}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={10} gap={6}>
          <InputGroup maxW={{ base: "100%", md: "400px" }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={BiSearchAlt} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={searchBorder}
              _focus={{ borderColor: "#D71A20", boxShadow: "0 0 0 1px #D71A20" }}
            />
          </InputGroup>

          <Button 
            as={Link} 
            to="/create" 
            leftIcon={<BiPlusCircle fontSize="20px" />} 
            colorScheme="red" 
            bg="#D71A20"
            borderRadius="xl"
            px={8}
            _hover={{ bg: "#b5161b" }}
          >
            Create New Poll
          </Button>
        </Flex>

        {getPageData().length === 0 ? (
          <Box textAlign="center" py={20} bg={cardBg} borderRadius="3xl" boxShadow="sm">
            <Text color={subTextColor} fontSize="lg">No templates found matching your search.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8}>
            {getPageData().map((item, idx) => (
              <MotionCard
                key={item.templateId || idx}
                bg={cardBg}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="sm"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                whileHover={{ y: -5 }}
                border="1px solid"
                borderColor={cardBorder}
              >
                <Box h="140px" w="100%" position="relative">
                  <Image 
                    src={item.topicImage || getTopicVisual(item.topic).image} 
                    alt={item.topic} 
                    objectFit="cover" 
                    w="100%" 
                    h="100%" 
                  />
                  {item.isDemo && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme="purple"
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      fontSize="xs"
                    >
                      Demo
                    </Badge>
                  )}
                  <Box position="absolute" top={2} left={2}>
                    <Badge colorScheme={getTopicVisual(item.topic).color} variant="solid" borderRadius="full" px={2} fontSize="xs">
                      {getTopicVisual(item.topic).icon} {item.topic || "Poll"}
                    </Badge>
                  </Box>
                </Box>
                <Box p={6} borderBottom="1px solid" borderColor={cardDivider}>
                  <Heading size="md" fontWeight="800" color={textColor} mb={1} noOfLines={1}>
                    {item.templateName}
                  </Heading>
                  <Flex align="center" color={subTextColor} fontSize="xs">
                    <Icon as={BiTimeFive} mr={1} />
                    <Text fontWeight="600">{item.isDemo ? "Professional Demo" : "Your Saved Template"}</Text>
                  </Flex>
                </Box>
                <CardBody bg={cardBodyBg} p={5}>
                  <VStack spacing={3}>
                    <Button
                      w="100%"
                      variant="solid"
                      bg="#D71A20"
                      color="white"
                      _hover={{ bg: "#b5161b" }}
                      onClick={() => handleStartPollClick(item)}
                      borderRadius="xl"
                    >
                      Start Poll
                    </Button>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {pageNumbers.length > 1 && (
          <Flex justify="center" mt={16} gap={2}>
            <Button
              isDisabled={currentPage === 0}
              onClick={() => paginate(currentPage - 1)}
              variant="ghost"
              borderRadius="xl"
            >
              <GrCaretPrevious />
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                onClick={() => paginate(number)}
                bg={currentPage === number ? "#D71A20" : "transparent"}
                color={currentPage === number ? "white" : "gray.600"}
                _hover={{ bg: currentPage === number ? "#b5161b" : "gray.100" }}
                borderRadius="xl"
                w="40px"
              >
                {number + 1}
              </Button>
            ))}
            <Button
              isDisabled={currentPage >= pageNumbers.length - 1}
              onClick={() => paginate(currentPage + 1)}
              variant="ghost"
              borderRadius="xl"
            >
              <GrCaretNext />
            </Button>
          </Flex>
        )}
      </Container>

      {/* Start Poll Modal */}
      <Modal 
        initialFocusRef={initialRef} 
        isOpen={isOpen} 
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="2xl" p={2}>
          <ModalHeader fontWeight="900" pb={0}>Launch Poll</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Box p={4} bg={modalBoxBg} borderRadius="xl" border="1px solid" borderColor={modalBoxBorder}>
                <Text fontSize="xs" fontWeight="700" color={subTextColor} textTransform="uppercase" mb={1}>Template</Text>
                <Text fontWeight="800" color={textColor}>{selectedTemplate?.templateName}</Text>
                <Badge mt={2} colorScheme={selectedTemplate?.isDemo ? "purple" : "red"} variant="subtle" borderRadius="full">
                  Topic: {selectedTemplate?.topic || "General"}
                </Badge>
              </Box>
              <FormControl>
                <FormLabel fontWeight="700">Poll Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="e.g. Q1 Marketing Sync"
                  borderRadius="xl"
                  focusBorderColor="#D71A20"
                  onChange={(e) => setPollName(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              bg="#D71A20" 
              color="white" 
              px={8} 
              _hover={{ bg: "#b5161b" }}
              onClick={() => handleSubmit(selectedTemplate)}
              borderRadius="xl"
            >
              Start Live Poll
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose} borderRadius="xl">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TemplatePage;