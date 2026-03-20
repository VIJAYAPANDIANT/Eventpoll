import React from "react";
import { Box, Flex, Text, Button, Container, SimpleGrid, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiZap, FiShield, FiLayout, FiClock } from "react-icons/fi";
import styles from "../styles/landingpage.module.css";
import Navbar from './../components/Navbar';
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const FeatureCard = ({ icon, title, text, delay }) => (
  <MotionBox
    className={styles.featureCard}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Box className={styles.iconBox}>
      <Icon as={icon} className={styles.icon} />
    </Box>
    <Text className={styles.featureTitle}>{title}</Text>
    <Text className={styles.featureText}>{text}</Text>
  </MotionBox>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Navbar />
      
      <Container maxW="container.xl">
        <Flex className={styles.heroSection}>
          <MotionBox 
            className={styles.heroText}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box className={styles.badge}>Next Gen Polling</Box>
            <Text className={styles.title}>
              Create Live Polls <br />
              <Text as="span" color="#D71A20">With Ease.</Text>
            </Text>
            <Text className={styles.subtitle}>
              Votek is the most powerful way to capture real-time feedback. 
              Interactive, sleek, and built for modern teams.
            </Text>
            
            <Flex className={styles.ctaGroup}>
              <Button 
                className={styles.primaryBtn}
                onClick={() => navigate('/create')}
              >
                Create Poll Now
              </Button>
              <Button 
                variant="outline"
                className={styles.secondaryBtn}
                onClick={() => navigate('/template-page')}
              >
                Explore Templates
              </Button>
            </Flex>
          </MotionBox>

          <MotionBox 
            className={styles.heroImageWrap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box className={styles.pollimg} />
          </MotionBox>
        </Flex>
      </Container>

      <Box className={styles.featureSection}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <FeatureCard 
              icon={FiZap}
              title="Real-Time"
              text="Instant results as votes happen. No refresh needed."
              delay={0.1}
            />
            <FeatureCard 
              icon={FiShield}
              title="Secure"
              text="Enterprise-grade security and authentication built-in."
              delay={0.2}
            />
            <FeatureCard 
              icon={FiLayout}
              title="Templates"
              text="Dozens of pre-built templates for quick starts."
              delay={0.3}
            />
            <FeatureCard 
              icon={FiClock}
              title="Analytics"
              text="Deep insights and beautiful data visualizations."
              delay={0.4}
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
