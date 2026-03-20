import {
  Box,
  Flex,
  Input,
  Stack,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  Text,
  Icon,
  FormLabel,
  Heading,
  HStack,
  Badge,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DeleteIcon, AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import StarsRating from "stars-rating";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addTemplateData, postPollData } from "../redux/data/action";
import { MdFormatListBulleted } from "react-icons/md";
import { FaStar, FaCheckCircle, FaToggleOn, FaPlusCircle, FaImage } from "react-icons/fa";
import styles from "../styles/create.module.css";
import Navbar from "../components/Navbar";
import { SUGGESTED_TOPICS, getTopicVisual } from "../utils/topicVisuals";

const MotionBox = motion(Box);

function CreatePoll() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questions, setQuestions] = useState([]);
  const [rating, setRating] = useState(0);
  const [pollName, setPollName] = useState("");
  const [topic, setTopic] = useState("");
  const [topicImage, setTopicImage] = useState("");
  const [topicPreview, setTopicPreview] = useState(getTopicVisual(""));
  const fileInputRef = React.useRef(null);

  const handleTopicChange = (value) => {
    setTopic(value);
    setTopicImage(""); // Reset custom image if they pick a preset
    setTopicPreview(getTopicVisual(value));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTopicImage(reader.result);
        setTopicPreview({
          image: reader.result,
          color: "red",
          icon: "ðŸ–¼ï¸"
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const [template, setTemplate] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  let token = localStorage.getItem("adminToken");
  const dispatch = useDispatch();

  const handleQuestionCreate = (type) => {
    let options = [];
    let maxSelections = "1";
    
    if (type === "truefalse") {
      options = ["True", "False"];
    } else if (type === "poll" || type === "mcq") {
      options = ["", ""];
      maxSelections = type === "mcq" ? "2" : "1";
    } else if (type === "imagechoice") {
      options = [
        { text: "Option 1", image: "" },
        { text: "Option 2", image: "" }
      ];
    } else if (type === "openended") {
      options = [""];
    }

    const newQuestion = {
      question: "",
      options,
      type: type,
      maxSelections,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleOptionCreate = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleTitleChange = (event, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSelectionChange = (event, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].maxSelections = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionTitleChange = (event, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].type === "imagechoice") {
      newQuestions[questionIndex].options[optionIndex].text = event.target.value;
    } else {
      newQuestions[questionIndex].options[optionIndex] = event.target.value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionImageUpload = (e, questionIndex, optionIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex].image = reader.result;
        setQuestions(newQuestions);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionRatingChange = (event, questionIndex) => {
    setRating(event);
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = Array.from({ length: event }, (_, i) => i + 1);
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const newQuestions = questions.filter((_, index) => index !== questionIndex);
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
    setQuestions(newQuestions);
  };

  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const [createdPollUrl, setCreatedPollUrl] = useState("");

  const handleSubmit = async () => {
    if (!pollName) {
      toast({ title: "Error", description: "Please enter a poll name", status: "error", duration: 3000 });
      return;
    }
    const data = {
      pollName,
      topic,
      topicImage,
      questions: questions.map((q) => ({
        question: q.question,
        type: q.type,
        maxSelections: Number(q.maxSelections),
        options: q.options
      })),
      pollStatus: true,
      pollCreatedAt: Date.now(),
      pollEndsAt: Date.now() + 6 * 60 * 30 * 1000
    };
    const response = await dispatch(postPollData(data, token));
    if (response) {
      setCreatedPollUrl(response.data.url);
      onSuccessOpen();
    } else {
      toast({ title: "Success", description: "Poll created successfully!", status: "success", duration: 5000 });
      navigate("/live-polls");
    }
  };

  const handleCreateTemplate = async () => {
    if (!template) {
      toast({ title: "Error", description: "Please enter a template name", status: "error", duration: 3000 });
      return;
    }
    const data = {
      templateName: template,
      topic,
      topicImage,
      questions: questions.map((q) => ({
        question: q.question,
        type: q.type,
        maxSelections: Number(q.maxSelections),
        options: q.options
      }))
    };
    await dispatch(addTemplateData(data, token));
    toast({ title: "Success", description: "Template saved successfully!", status: "success", duration: 5000 });
    onClose();
    navigate("/template-page");
  };

  const pageBg = useColorModeValue("#f8fafc", "black");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300"); // Brighter subtext for dark mode
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const cardBodyBg = useColorModeValue("gray.50", "#1A202C"); // Darker body for cards in dark mode
  const badgeVariant = useColorModeValue("subtle", "solid");
  const ratingEmptyColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Navbar />
      <Box className={styles.cont}>
        <Box className={styles.optionCont} bg={sidebarBg} border="1px solid" borderColor={borderColor}>
          <Heading size="md" mb={2} color={textColor}>Add Question</Heading>
          <Text fontSize="sm" color={subTextColor} mb={6}>Select the type of question to add.</Text>
          
          <Stack spacing={3}>
            <Button
              className={styles.btn}
              onClick={() => handleQuestionCreate("poll")}
              leftIcon={<Icon as={FaCheckCircle} color="#38A169" />}
              bg={useColorModeValue("white", "gray.700")}
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
            >
              Single Choice
            </Button>
            <Button
              className={styles.btn}
              onClick={() => handleQuestionCreate("mcq")}
              leftIcon={<Icon as={MdFormatListBulleted} color="#A000FF" />}
              bg={useColorModeValue("white", "gray.700")}
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
            >
              Multiple Choice
            </Button>
            <Button
              className={styles.btn}
              onClick={() => handleQuestionCreate("truefalse")}
              leftIcon={<Icon as={FaToggleOn} color="#26D948" />}
              bg={useColorModeValue("white", "gray.700")}
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
            >
              True / False
            </Button>
              <Button
                className={styles.btn}
                onClick={() => handleQuestionCreate("rating")}
                leftIcon={<Icon as={FaStar} color="#ffd700" />}
                bg={useColorModeValue("white", "gray.700")}
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
              >
                Rating Scale
              </Button>
              <Button
                className={styles.btn}
                onClick={() => handleQuestionCreate("openended")}
                leftIcon={<Icon as={FaPlusCircle} color="#4A5568" />}
                bg={useColorModeValue("white", "gray.700")}
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
              >
                Open Ended
              </Button>
              <Button
                className={styles.btn}
                onClick={() => handleQuestionCreate("imagechoice")}
                leftIcon={<Icon as={FaImage} color="#E53E3E" />}
                bg={useColorModeValue("white", "gray.700")}
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
              >
                Image Choice
              </Button>
            </Stack>
        </Box>

        <Box className={styles.quesCont} bg={cardBg} border="1px solid" borderColor={borderColor}>
          {questions.length > 0 ? (
            <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={8}>
              <FormControl>
                <FormLabel fontWeight="700" color="gray.700">Poll Name</FormLabel>
                <Input
                  className={styles.inputField}
                  placeholder="e.g. Weekly Team Feedback"
                  onChange={(e) => setPollName(e.target.value)}
                />
              </FormControl>
                <FormControl id="topic">
                  <FormLabel fontWeight="600" color="gray.700">Poll Topic</FormLabel>
                  <HStack spacing={4} align="flex-start">
                    <VStack align="stretch" flex={1} spacing={2}>
                      <Menu>
                        <MenuButton 
                          as={Button} 
                          rightIcon={<ChevronDownIcon />} 
                          variant="outline" 
                          w="full" 
                          textAlign="left"
                          fontWeight="normal"
                          color={topic ? "gray.800" : "gray.400"}
                        >
                          {topic || "Select or type a topic..."}
                        </MenuButton>
                        <MenuList maxH="200px" overflowY="auto">
                          {SUGGESTED_TOPICS.map((t) => (
                            <MenuItem key={t} onClick={() => handleTopicChange(t)}>
                              {getTopicVisual(t).icon} {t}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                      <Input
                        placeholder="Or type custom topic..."
                        value={topic}
                        onChange={(e) => handleTopicChange(e.target.value)}
                        borderRadius="lg"
                        _focus={{ borderColor: "#D71A20", boxShadow: "0 0 0 1px #D71A20" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="red" 
                        onClick={() => fileInputRef.current.click()}
                        leftIcon={<Icon as={FaStar} />} // Reuse an icon or add new one
                      >
                        Upload Custom Image
                      </Button>
                    </VStack>
                    
                    <Box 
                      w="100px" 
                      h="100px" 
                      borderRadius="xl" 
                      overflow="hidden" 
                      border="2px solid" 
                      borderColor={topicPreview.color + ".200"}
                      bg={topicPreview.color + ".50"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <Image 
                        src={topicPreview.image} 
                        alt="Topic" 
                        objectFit="cover" 
                        w="100%" 
                        h="100%" 
                        fallbackSrc="https://via.placeholder.com/100?text=Poll"
                      />
                      <Box 
                        position="absolute" 
                        top="0" 
                        left="0" 
                        w="100%" 
                        h="100%" 
                        bg="blackAlpha.200" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        <Text fontSize="2xl">{topicPreview.icon}</Text>
                      </Box>
                    </Box>
                  </HStack>
                </FormControl>
              </Stack>
            ) : (
            <Box textAlign="center" py={10}>
              <Box className={styles.emptyCont} />
              <Heading size="md" color={textColor} mb={2}>Start Building Your Poll</Heading>
              <Text color={subTextColor}>Pick a question type from the sidebar to get started.</Text>
            </Box>
          )}

          <AnimatePresence>
            {questions.map((question, questionIndex) => (
              <MotionBox
                key={questionIndex}
                className={styles.questionCard}
                bg={cardBg}
                color={textColor}
                border="1px solid"
                borderColor={borderColor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <HStack>
                    <Box bg="#D71A20" color="white" w={7} h={7} borderRadius="lg" display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="bold">
                      {questionIndex + 1}
                    </Box>
                    <Badge colorScheme={getTopicVisual(topic).color} variant={badgeVariant} px={3} borderRadius="full" textTransform="uppercase">
                      {question.type === "mcq" ? "Multi Choice" : 
                       question.type === "poll" ? "Single Choice" : 
                       question.type === "truefalse" ? "True/False" : 
                       question.type === "rating" ? "Rating" :
                       question.type === "openended" ? "Open Ended" : "Image Choice"}
                    </Badge>
                  </HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDeleteQuestion(questionIndex)}
                  >
                    <DeleteIcon />
                  </Button>
                </Flex>

                <FormControl mb={6}>
                  <FormLabel fontSize="sm" fontWeight="700" color={subTextColor}>Question Text</FormLabel>
                  <Input
                    className={styles.inputField}
                    placeholder="What would you like to ask?"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: subTextColor }}
                    value={question.question}
                    onChange={(event) => handleTitleChange(event, questionIndex)}
                  />
                </FormControl>

                <Stack spacing={3}>
                  {question.type !== "rating" && question.type !== "openended" && question.type !== "imagechoice" && question.options.map((option, optionIndex) => (
                    <Flex key={optionIndex} gap={2}>
                      <Input
                        className={styles.inputField}
                        placeholder={question.type === "truefalse" ? option : `Option ${optionIndex + 1}`}
                        bg={inputBg}
                        color={textColor}
                        _placeholder={{ color: subTextColor }}
                        value={option}
                        isReadOnly={question.type === "truefalse"}
                        onChange={(event) => handleOptionTitleChange(event, questionIndex, optionIndex)}
                      />
                      {question.type !== "truefalse" && (
                        <Button 
                          size="md" 
                          variant="ghost" 
                          colorScheme="gray" 
                          onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                          isDisabled={question.options.length <= 1}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </Flex>
                  ))}

                  {question.type === "imagechoice" && question.options.map((option, optionIndex) => (
                    <Box key={optionIndex} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100">
                      <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ md: "center" }}>
                        <Box 
                          w="100px" 
                          h="100px" 
                          borderRadius="lg" 
                          overflow="hidden" 
                          bg="gray.50" 
                          border="1px solid" 
                          borderColor="gray.200"
                          flexShrink={0}
                          cursor="pointer"
                          onClick={() => document.getElementById(`img-choice-${questionIndex}-${optionIndex}`).click()}
                        >
                          <Image src={option.image} alt="Option" w="100%" h="100%" objectFit="cover" fallback={<Flex h="100%" align="center" justify="center"><AddIcon color="gray.300" /></Flex>} />
                        </Box>
                        <Input
                          type="file"
                          id={`img-choice-${questionIndex}-${optionIndex}`}
                          display="none"
                          accept="image/*"
                          onChange={(e) => handleOptionImageUpload(e, questionIndex, optionIndex)}
                        />
                        <VStack align="stretch" flex={1}>
                          <Flex gap={2}>
                            <Input
                              placeholder={`Option ${optionIndex + 1} text...`}
                              value={option.text}
                              onChange={(event) => handleOptionTitleChange(event, questionIndex, optionIndex)}
                              bg={inputBg}
                              borderRadius="lg"
                            />
                            <Button 
                              size="md" 
                              variant="ghost" 
                              colorScheme="red" 
                              onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                              isDisabled={question.options.length <= 1}
                            >
                              <DeleteIcon />
                            </Button>
                          </Flex>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}

                  {question.type === "openended" && (
                    <Box py={4} px={6} bg="blue.50" borderRadius="xl" border="1px dashed" borderColor="blue.200">
                      <Text color="blue.600" fontSize="sm" fontWeight="600">
                        <Icon as={MdFormatListBulleted} mr={2} />
                        Users will see a text box to provide their response.
                      </Text>
                    </Box>
                  )}

                  {question.type === "rating" && (
                    <Box py={4} textAlign="center" bg={cardBodyBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                      <StarsRating
                        count={10}
                        value={rating}
                        half={false}
                        onChange={(event) => handleOptionRatingChange(event, questionIndex)}
                        size={40}
                        color2="#ffd700"
                        color1={ratingEmptyColor}
                      />
                      <Text mt={2} fontSize="sm" color={subTextColor}>Current Scale: {rating} Stars</Text>
                    </Box>
                  )}

                  {question.type === "mcq" && (
                    <FormControl pt={2}>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase">Max Allowed Selections</FormLabel>
                      <Input
                        type="number"
                        className={styles.inputField}
                        bg="white"
                        w="100px"
                        value={question.maxSelections}
                        onChange={(event) => handleSelectionChange(event, questionIndex)}
                      />
                    </FormControl>
                  )}

                  {question.type !== "rating" && question.type !== "truefalse" && question.type !== "openended" && (
                    <Button
                      size="sm"
                      leftIcon={<AddIcon />}
                      onClick={() => handleOptionCreate(questionIndex)}
                      variant="ghost"
                      colorScheme="red"
                      w="fit-content"
                    >
                      Add Another Option
                    </Button>
                  )}
                </Stack>
              </MotionBox>
            ))}
          </AnimatePresence>

          {questions.length > 0 && (
            <Stack direction="row" spacing={4} mt={12} justify="center">
              <Button
                size="lg"
                bg="#D71A20"
                color="white"
                flex={1}
                h="60px"
                fontSize="lg"
                fontWeight="800"
                _hover={{ bg: "#b5161b", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                onClick={handleSubmit}
              >
                Launch Live Poll
              </Button>
              <Button
                size="lg"
                variant="outline"
                flex={1}
                h="60px"
                fontSize="lg"
                border="2px solid"
                onClick={onOpen}
              >
                Save as Template
              </Button>
            </Stack>
          )}

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(8px)" />
            <ModalContent bg={cardBg} color={textColor} borderRadius="2xl" p={4}>
              <ModalHeader fontWeight="800">Save as Template</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel fontWeight="700" color={subTextColor}>Template Name</FormLabel>
                  <Input
                    focusBorderColor="#D71A20"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: subTextColor }}
                    placeholder="e.g. Monthly Social Sync"
                    onChange={(e) => setTemplate(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button bg="#D71A20" color="white" px={8} fontWeight="700" mr={3} onClick={handleCreateTemplate}>
                  Save Template
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>

      {/* Launch Success Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={cardBg} color={textColor} borderRadius="3xl" p={4} boxShadow="2xl">
          <ModalHeader textAlign="center" pt={8}>
            <VStack spacing={3}>
              <Icon as={FaCheckCircle} color="green.400" w={12} h={12} />
              <Heading size="lg" fontWeight="900" color={textColor}>Poll Launched!</Heading>
              <Text fontSize="md" color={subTextColor} fontWeight="500">
                Your poll is now live and ready for participants.
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={8}>
            <VStack spacing={6}>
              <Box w="100%" bg={cardBodyBg} p={5} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                <Text fontSize="xs" fontWeight="700" color={subTextColor} textTransform="uppercase" mb={2}>Shareable Link</Text>
                <InputGroup size="lg">
                  <Input
                    readOnly
                    value={createdPollUrl}
                    bg="white"
                    borderRadius="xl"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    pr="4.5rem"
                  />
                  <InputRightElement width="4.5rem" h="100%">
                    <Button
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      color="#D71A20"
                      onClick={() => {
                        navigator.clipboard.writeText(createdPollUrl);
                        toast({ title: "Copied!", status: "success", duration: 2000 });
                      }}
                      _hover={{ bg: "red.50" }}
                    >
                      Copy
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>

              <HStack w="100%" spacing={4}>
                <Button 
                  flex={1} 
                  size="lg" 
                  variant="outline"
                  borderRadius="2xl" 
                  borderColor="gray.200"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => {
                    onSuccessClose();
                    navigate("/live-polls");
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  flex={1} 
                  size="lg" 
                  bg="#D71A20" 
                  color="white"
                  borderRadius="2xl"
                  _hover={{ bg: "#b5161b" }}
                  onClick={() => window.open(createdPollUrl, "_blank")}
                >
                  View as Participant
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CreatePoll;
