import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Checkbox,
  CheckboxGroup,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Icon,
  Badge,
  Textarea,
  SimpleGrid,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiErrorWarningLine } from "react-icons/ri";
import StarsRating from "stars-rating";

const QuestionCard = ({
  question,
  options,
  index,
  onSelectionChange,
  questionId,
  maxSelections,
  type,
}) => {
  const [value, setValue] = useState([]);
  const [radioValue, setRadioValue] = useState("");
  const [rateVal, setRateVal] = useState(0);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const itemBg = useColorModeValue("white", "black"); 
  const itemSelectedBg = useColorModeValue("red.50", "rgba(215, 26, 32, 0.15)");
  const itemHoverBg = useColorModeValue("red.50", "gray.700");
  const inputBg = useColorModeValue("gray.50", "#1A202C");
  const ratingEmptyColor = useColorModeValue("#f1f5f9", "#2D3748");
  const badgeVariant = useColorModeValue("subtle", "solid");

  const isSingleChoice = Number(maxSelections) === 1 && type !== "rating";

  useEffect(() => {
    if (type === "rating" && rateVal > 0) {
      onSelectionChange({
        selectedAns: [options[rateVal - 1].optionId],
        question,
        questionId,
        options,
      });
    }
  }, [rateVal, type, question, questionId, options, onSelectionChange]);

  const handleCheckboxChange = (selectedValues) => {
    setValue(selectedValues);
    onSelectionChange({
      selectedAns: selectedValues,
      question,
      questionId,
      options,
    });
  };

  const handleRadioChange = (val) => {
    setRadioValue(val);
    onSelectionChange({
      selectedAns: [val],
      question,
      questionId,
      options,
    });
  };

  return (
    <Box
      bg={cardBg}
      p={8}
      borderRadius="3xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      mb={6}
      position="relative"
      transition="all 0.3s"
      _hover={{ boxShadow: "md", borderColor: "red.200" }}
    >
      <Flex align="center" mb={4} gap={3}>
        <Box
          bg="#D71A20"
          color="white"
          w={8}
          h={8}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="md"
          fontWeight="bold"
        >
          {index + 1}
        </Box>
        <Text fontSize="xl" fontWeight="800" color={textColor}>
          {question}
        </Text>
        <Badge ml="auto" colorScheme="red" variant={badgeVariant} borderRadius="full" px={3}>
          {type === "rating" ? "Rating Scale" : 
           type === "openended" ? "Text Feedback" :
           type === "imagechoice" ? (isSingleChoice ? "Image Choice (Single)" : "Image Choice (Multiple)") :
           isSingleChoice ? "Single Choice" : "Multi Choice"}
        </Badge>
      </Flex>

      <Box pl={11}>
        {type === "rating" ? (
          <Box py={2}>
            <StarsRating
              count={options?.length || 5}
              onChange={setRateVal}
              value={rateVal}
              half={false}
              size={40}
              color2={"#D71A20"}
              color1={ratingEmptyColor}
            />
          </Box>
        ) : type === "openended" ? (
          <Box py={2}>
            <Textarea 
              placeholder="Type your response here..." 
              bg={inputBg} 
              color={textColor}
              _placeholder={{ color: subTextColor }}
              borderRadius="xl" 
              focusBorderColor="#D71A20"
              borderColor={borderColor}
              rows={4}
              onChange={(e) => {
                onSelectionChange({
                  selectedAns: [e.target.value],
                  question,
                  questionId,
                  options,
                });
              }}
            />
          </Box>
        ) : type === "imagechoice" ? (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {options.map((opt, i) => (
              <Box
                key={i}
                p={2}
                borderRadius="2xl"
                border="2px solid"
                borderColor={isSingleChoice ? (radioValue === opt.optionId ? "#D71A20" : borderColor) : (value.includes(opt.optionId) ? "#D71A20" : borderColor)}
                bg={isSingleChoice ? (radioValue === opt.optionId ? itemSelectedBg : itemBg) : (value.includes(opt.optionId) ? itemSelectedBg : itemBg)}
                transition="all 0.2s"
                _hover={{ borderColor: "red.200" }}
                cursor="pointer"
                onClick={() => {
                  if (isSingleChoice) {
                    handleRadioChange(opt.optionId);
                  } else {
                    const newValue = value.includes(opt.optionId)
                      ? value.filter((v) => v !== opt.optionId)
                      : value.length < Number(maxSelections)
                      ? [...value, opt.optionId]
                      : value;
                    handleCheckboxChange(newValue);
                  }
                }}
              >
                <VStack spacing={2}>
                  <Box w="100%" h="140px" borderRadius="xl" overflow="hidden" bg="gray.100">
                    <Image 
                      src={opt.option.image || opt.topicImage} // Handle both formats
                      alt={opt.option.text || opt.option} 
                      objectFit="cover" 
                      w="100%" 
                      h="100%" 
                    />
                  </Box>
                  <Text fontWeight="700" color={textColor} textAlign="center" py={2}>
                    {opt.option.text || opt.option}
                  </Text>
                  <Flex justify="center" pb={2}>
                    {isSingleChoice ? (
                      <Radio isChecked={radioValue === opt.optionId} colorScheme="red" size="lg" />
                    ) : (
                      <Checkbox isChecked={value.includes(opt.optionId)} colorScheme="red" size="lg" />
                    )}
                  </Flex>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : isSingleChoice ? (
          <RadioGroup onChange={handleRadioChange} value={radioValue}>
            <Stack spacing={4}>
              {options.map((opt, i) => (
                <Box
                  key={i}
                  p={4}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={radioValue === opt.optionId ? "#D71A20" : borderColor}
                  bg={radioValue === opt.optionId ? itemSelectedBg : itemBg}
                  transition="all 0.2s"
                  _hover={{ borderColor: "red.200", bg: itemHoverBg }}
                  cursor="pointer"
                  onClick={() => handleRadioChange(opt.optionId)}
                >
                  <Radio value={opt.optionId} colorScheme="red" size="lg" cursor="pointer">
                    <Text fontWeight="600" color="gray.700" ml={2}>
                      {opt.option}
                    </Text>
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        ) : (
          <CheckboxGroup onChange={handleCheckboxChange} value={value}>
            <Stack spacing={4}>
              {options.map((opt, i) => (
                <Box
                  key={i}
                  p={4}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={value.includes(opt.optionId) ? "#D71A20" : borderColor}
                  bg={value.includes(opt.optionId) ? itemSelectedBg : itemBg}
                  transition="all 0.2s"
                  _hover={{ borderColor: "red.200", bg: itemHoverBg }}
                  cursor="pointer"
                  onClick={() => {
                    const newValue = value.includes(opt.optionId)
                      ? value.filter((v) => v !== opt.optionId)
                      : value.length < Number(maxSelections)
                      ? [...value, opt.optionId]
                      : value;
                    handleCheckboxChange(newValue);
                  }}
                >
                  <Checkbox
                    value={opt.optionId}
                    colorScheme="red"
                    size="lg"
                    isDisabled={value.length >= Number(maxSelections) && !value.includes(opt.optionId)}
                  >
                    <Text fontWeight="600" color="gray.700" ml={2}>
                      {opt.option}
                    </Text>
                  </Checkbox>
                </Box>
              ))}
            </Stack>
          </CheckboxGroup>
        )}

        {!isSingleChoice && type !== "rating" && type !== "openended" && (
          <Flex align="center" mt={6} gap={2} color={subTextColor} fontSize="xs" fontWeight="700" textTransform="uppercase">
            <Icon as={RiErrorWarningLine} />
            <Text letterSpacing="wider">Select up to {maxSelections} options</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default QuestionCard;
