import React, { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Menu,
  MenuButton,
  VStack,
  Text,
  MenuList,
  MenuItem,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const NavLink = ({ children, href, active }) => {
  const activeColor = useColorModeValue("#D71A20", "white");
  const inactiveColor = useColorModeValue("#475569", "gray.400");
  const hoverBg = useColorModeValue("rgba(215, 26, 32, 0.05)", "rgba(255, 255, 255, 0.1)");
  
  return (
    <Link
      href={href}
      className={styles.navLink}
      color={active ? activeColor : inactiveColor}
      bg={active ? hoverBg : "transparent"}
      _hover={{
        color: activeColor,
        bg: hoverBg,
        textDecoration: "none"
      }}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [show, setShow] = useState(false);
  const data = useSelector((store) => store.auth.auth.token?.primaryToken);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  let userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if (userName || data) {
      setShow(true);
    }
  }, [data, userName]);

  const isAdmin = userName === "Admin";

  const navItems = isAdmin 
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Create Polls", href: "/create" },
        { label: "Live Polls", href: "/live-polls" },
        { label: "Ended Polls", href: "/ended-polls" },
        { label: "Templates", href: "/template-page" },
      ]
    : [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Create Polls", href: "/create" },
        { label: "Participate", href: "/user/participate" },
        { label: "Live Polls", href: "/live-polls" },
        { label: "Recent Polls", href: "/user/recentpolls" },
        { label: "Templates", href: "/template-page" },
      ];

  const navBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "black");
  const navBorder = useColorModeValue("rgba(226, 232, 240, 0.5)", "gray.700");
  const userNameColor = useColorModeValue("#0f172a", "white");
  const userRoleColor = useColorModeValue("#64748b", "gray.400");
  const logoFilter = useColorModeValue("none", "brightness(1.2) grayscale(0.2)"); // Subtle adjustment for dark mode
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorder = useColorModeValue("gray.100", "gray.700");
  const menuHoverBg = useColorModeValue("gray.50", "gray.700");
  const logoutHoverBg = useColorModeValue("red.50", "gray.700");
  const mobileMenuBg = useColorModeValue("white", "black");
  const mobileMenuBorder = useColorModeValue("gray.100", "gray.700");

  return (
    <Box 
      className={styles.navContainer} 
      bg={navBg} 
      borderColor={navBorder}
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl" h="100%">
        <Flex h="100%" alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />
          
          <HStack spacing={10} alignItems={"center"}>
            <Box
              cursor={"pointer"}
              onClick={() => navigate("/")}
              className={styles.logo}
              filter={logoFilter}
            />
            
            <HStack
              as={"nav"}
              spacing={2}
              display={{ base: "none", md: "flex" }}
            >
              {navItems.map((item) => (
                <NavLink 
                  key={item.href} 
                  href={item.href}
                  active={location.pathname === item.href}
                >
                  {item.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={"center"}>
            {!show ? (
              <Button
                className={styles.loginButton}
                onClick={() => navigate("/signin")}
              >
                Login
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Flex align="center">
                    <Avatar
                      size={"32px"}
                      round="full"
                      name={userName}
                      style={{ border: "2px solid #e2e8f0" }}
                    />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="0"
                      ml="3"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={userNameColor}
                      >
                        {userName}
                      </Text>
                      <Text
                        fontSize="xs"
                        color={userRoleColor}
                        fontWeight="500"
                      >
                        {isAdmin ? "Administrator" : "User"}
                      </Text>
                    </VStack>
                  </Flex>
                </MenuButton>
                <MenuList bg={menuBg} borderRadius="xl" border="1px solid" borderColor={menuBorder} boxShadow="xl">
                  <MenuItem
                    fontWeight="600"
                    onClick={() => navigate("/dashboard")}
                    _hover={{ bg: menuHoverBg }}
                  >
                    My Dashboard
                  </MenuItem>
                  <MenuItem 
                    fontWeight="600" 
                    color="red.500" 
                    onClick={handleLogout}
                    _hover={{ bg: logoutHoverBg }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
            <ColorModeSwitcher />
          </Flex>
        </Flex>
      </Container>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }} bg={mobileMenuBg} px={4} borderBottom="1px solid" borderColor={mobileMenuBorder}>
          <Stack as={"nav"} spacing={4}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                fontWeight="600"
                color={location.pathname === item.href ? "#D71A20" : "#475569"}
                py={2}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
