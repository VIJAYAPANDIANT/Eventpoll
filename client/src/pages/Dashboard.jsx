import { Box, Button, Stack, Heading, Text, Image, Container, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dashboard_image from "../images/dashboard_image.png";
import image_1 from "../images/image_1.png";
import image_2 from "../images/image_2.png";
import image_3 from "../images/image_3.png";
import image_4 from "../images/image_4.png";
import Navbar from "../components/Navbar";

const MotionBox = motion(Box);

const FeatureItem = ({ img, title, delay }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <MotionBox
      bg={cardBg}
      p={6}
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={cardBorder}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      _hover={{ transform: "translateY(-5px)", boxShadow: "md", borderColor: "red.100" }}
    >
      <Box h="160px" mb={4} display="flex" alignItems="center" justifyContent="center">
        <Image src={img} maxH="100%" objectFit="contain" />
      </Box>
      <Text
        fontWeight="700"
        fontSize="lg"
        textAlign="center"
        color={textColor}
      >
        {title}
      </Text>
    </MotionBox>
  );
};

export default function Simple() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const isAdmin = userName === "Admin";

  const handleShowPoll = () => {
    if (isAdmin) {
      navigate("/live-polls");
    } else {
      navigate("/user/participate");
    }
  };

  const pageBg = useColorModeValue("#f8fafc", "black");
  const heroTextColor = useColorModeValue("gray.900", "white");
  const heroSubTextColor = useColorModeValue("gray.600", "gray.300");
  const dashboardImgBg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={pageBg} minH="100vh" color={heroTextColor}>
      <Navbar />
      
      <Container maxW="container.xl" py={12}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={12}
          align="center"
          mb={20}
        >
          <Box flex={1} textAlign={{ base: "center", lg: "left" }}>
            <Heading 
              fontSize={{ base: "4xl", md: "5xl" }} 
              fontWeight="800" 
              lineHeight="1.2"
              color={heroTextColor}
              mb={6}
            >
              Interactive <Text as="span" color="#D71A20">Live Polling</Text>
            </Heading>
            <Text 
              fontSize="lg" 
              color={heroSubTextColor} 
              mb={8}
              maxW="600px"
              mx={{ base: "auto", lg: "0" }}
            >
              Votek gives you the power to design a wide variety of
              interactive polls. Polling your audience is the most effective
              way to increase engagement and make your presentation dynamic and
              memorable.
            </Text>
            <Button
              size="lg"
              bg="#D71A20"
              color="white"
              px={10}
              borderRadius="xl"
              _hover={{ bg: "#b5161b", transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              onClick={handleShowPoll}
            >
              Show Poll
            </Button>
          </Box>
          <MotionBox 
            flex={1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box 
              p={4} 
              bg={dashboardImgBg} 
              borderRadius="3xl" 
              boxShadow="2xl"
              border="1px solid"
              borderColor={useColorModeValue("gray.100", "gray.700")}
            >
              <Image src={dashboard_image} w="100%" borderRadius="2xl" />
            </Box>
          </MotionBox>
        </Stack>

        <Box>
          <Heading textAlign="center" mb={12} fontSize="3xl" fontWeight="800">
            Powerful Features for <Text as="span" color="#D71A20">Every Need</Text>
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <FeatureItem img={image_1} title="Multiple Choice Questions" delay={0.1} />
            <FeatureItem img={image_2} title="Segmentation & Trends" delay={0.2} />
            <FeatureItem img={image_3} title="Easy & Intuitive UI" delay={0.3} />
            <FeatureItem img={image_4} title="Cloud Sync Functionality" delay={0.4} />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
