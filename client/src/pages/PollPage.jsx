import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  useToast,
  Container,
  VStack,
  Heading,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BiErrorCircle } from "react-icons/bi";

const PollPage = () => {
  const [pollData, setPollData] = useState("");
  const { pollName, questions } = pollData;
  const userToken = localStorage.getItem("userToken") || "";
  const [selections, setSelections] = useState();
  const [voteData, setVoteData] = useState();
  const [questionData, setQuesData] = useState([]);
  const [, setPollDetail] = useState([]);
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [statusCode, setStatus] = useState("");

  const pageBg = useColorModeValue("#f8fafc", "black");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const badgeVariant = useColorModeValue("subtle", "solid");

  const handleSelectionChange = (selectedOptions) => {
    setSelections(selectedOptions);
  };

  const vote = (e) => {
    e.preventDefault();
    if (!userToken) {
      toast({ title: "Authentication required", description: "Please sign in to vote.", status: "warning", duration: 3000 });
      return;
    }
    setSubmitting(true);
    axios({
      method: "POST",
      url: "/api/firebase/vote",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      data: voteData,
    })
      .then((res) => {
        setSubmitting(false);
        if (res?.status === 200) {
          toast({ title: "Vote Cast! 👍", description: "Your opinion has been recorded.", status: "success", duration: 5000 });
        } else if (res?.status === 208) {
          toast({ title: "Already Voted", description: "You have already cast your vote for this poll.", status: "info", duration: 5000 });
        }
      })
      .catch((error) => {
        setSubmitting(false);
        toast({ title: "Error", description: "Failed to submit vote. Please try again.", status: "error", duration: 3000 });
      });
  };

  useEffect(() => {
    if (selections) {
      const { question, questionId, selectedAns, options } = selections;
      setPollDetail((prevPollDetail) => {
        const existingQuestionIndex = prevPollDetail.findIndex((q) => q.questionId === questionId);
        let updatedPollDetail;
        if (existingQuestionIndex === -1) {
          updatedPollDetail = [...prevPollDetail, { question, questionId, selectedAns, options }];
        } else {
          updatedPollDetail = [...prevPollDetail];
          updatedPollDetail[existingQuestionIndex] = { ...updatedPollDetail[existingQuestionIndex], selectedAns };
        }
        setVoteData({
          pollData: updatedPollDetail,
          pollId: pollData?.pollId,
          pollName: pollData?.pollName,
          selectedAnswers: questionData,
        });
        return updatedPollDetail;
      });
    }
  }, [selections, questionData, pollData?.pollId, pollData?.pollName]);

  useEffect(() => {
    if (selections) {
      const { questionId, selectedAns } = selections;
      setQuesData((prevQuestionData) => {
        const existingQuestion = prevQuestionData.find((q) => q.questionId === questionId);
        if (existingQuestion) {
          const updatedQuestion = { ...existingQuestion, optionsIds: selectedAns };
          return [...prevQuestionData.filter((q) => q.questionId !== questionId), updatedQuestion];
        } else {
          return [...prevQuestionData, { questionId, optionsIds: selectedAns }];
        }
      });
    }
  }, [selections]);

  useEffect(() => {
    setLoader(true);
    axios
      .get(`/api/firebase/live-poll/${id}`, {
        headers: {
          Authorization: userToken,
        },
      })
      .then((response) => {
        setPollData(response.data[0]);
        setLoader(false);
      })
      .catch((err) => {
        setStatus(err?.response?.status);
        setLoader(false);
      });
  }, [userToken, id]);

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Navbar />
      
      <Container maxW="container.md" py={12}>
        {statusCode === 404 ? (
          <Flex direction="column" align="center" justify="center" py={20} textAlign="center">
            <Icon as={BiErrorCircle} w={20} h={20} color="red.400" mb={6} />
            <Heading size="xl" mb={4} color={textColor}>Invalid Link</Heading>
            <Text color={subTextColor} fontSize="lg">
              Either the link is incorrect or the poll has already ended.
            </Text>
            <Button mt={8} onClick={() => window.location.href = '/'} variant="outline" borderColor="#D71A20" color="#D71A20">
              Go Home
            </Button>
          </Flex>
        ) : loader ? (
          <Flex h="60vh" align="center" justify="center">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.100" color="#D71A20" size="xl" />
          </Flex>
        ) : (
          <VStack spacing={8} align="stretch">
            <Box textAlign="center" mb={4}>
              <Badge colorScheme="red" variant="solid" borderRadius="full" px={4} py={1} mb={4} textTransform="uppercase" letterSpacing="widest">
                Active Poll
              </Badge>
              <Heading size="2xl" fontWeight="900" color={textColor}>
                {pollName}
              </Heading>
              {pollData?.topic && (
                <Badge mt={3} colorScheme="gray" variant={badgeVariant} borderRadius="full" px={3} textTransform="none">
                  Topic: {pollData.topic}
                </Badge>
              )}
              <Text color={subTextColor} mt={4} fontSize="lg">
                Please cast your vote below. Your input is valuable!
              </Text>
            </Box>

            <form onSubmit={vote}>
              <VStack spacing={6} align="stretch">
                {questions?.map((q, index) => (
                  <QuestionCard
                    key={index}
                    {...q}
                    index={index}
                    onSelectionChange={handleSelectionChange}
                  />
                ))}
                
                <Button
                  type="submit"
                  size="xl"
                  w="100%"
                  h="70px"
                  bg="#D71A20"
                  color="white"
                  fontSize="xl"
                  fontWeight="800"
                  isLoading={isSubmitting}
                  loadingText="Submitting Your Vote..."
                  _hover={{ bg: "#b5161b", transform: "translateY(-2px)", boxShadow: "xl" }}
                  _active={{ transform: "translateY(0)" }}
                  borderRadius="2xl"
                  mt={4}
                >
                  Submit My Vote
                </Button>
              </VStack>
            </form>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default PollPage;
