import React from 'react'
import { Button, DrawerBody,Drawer, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure, VStack, HStack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../../colorModeSwitcher'
import {RiMenu5Fill,RiLoginBoxLine, RiDashboardFill} from 'react-icons/ri';
import {Link} from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../../../redux/actions/user';




const LinkButton = ({url="/",title="Home",onClose}) =>
(
    <Link onClick={onClose} to={url}>
        <Button variant={'ghost'}>{title}</Button>
    </Link>
)


const Header = ({isAuthenticated=false,user}) => {

    const {isOpen,onOpen,onClose} = useDisclosure();

    // const user = {
    //     role : 'admin',
    // };

    const dispatch = useDispatch();

    const logoutHandler =() =>{

       
        onClose();
        dispatch(logout());

    };
  return (
    <>
    <ColorModeSwitcher/>

    <Button 
    onClick={onOpen}
    ColorModeSwitcher={'yellow'} 
    width={'12'} 
    height={'12'} 
    rounded="full" 
    zIndex={'overlay'}
    position={"fixed"} 
    top="6" 
    left="6">
        <RiMenu5Fill/>
    </Button>
    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth={'1px'}>COURSE BUNDLER</DrawerHeader>
            <DrawerBody>
                <VStack spacing={"4"} alignItems={"flex-start"}>
                    <LinkButton onClose={onClose} url="/" title="Home"/>
                    <LinkButton onClose={onClose} url="/courses" title="Browser All Courses"/>
                    <LinkButton onClose={onClose} url="/request" title={"Request a Course"}/>
                    <LinkButton onClose={onClose} url="/contact" title={"Contact Us"}/>
                    <LinkButton onClose={onClose} url="/about" title={"About"}/>

                    <HStack
                     justifyContent={"space-evenly"}
                     position={"absolute"}
                     bottom={"2rem"}
                     width="80%"
                    >
                        {isAuthenticated ? (
                        <>
                        <VStack>
                            <HStack>
                                <Link onClick={onClose} to="/profile">
                                  <Button variant={'ghost'} colorScheme={'yellow'}>
                                    Profile
                                  </Button>
                                  <Button variant={'ghost'} colorScheme={'yellow'} onClick={logoutHandler}>
                                    <RiLoginBoxLine />
                                    Logout
                                  </Button>
                                </Link>
                            </HStack>


                            {user && user.role == 'admin' && (
                                <Link onClick={onClose} to="/admin/dashboard">
                                    <Button colorScheme={"purple"} variant={"ghost"}>
                                        <RiDashboardFill style={{margin : "4px"}}/>
                                        DashboardFill
                                    </Button>
                                </Link>
                            )

                            }
                        </VStack>

                        </>
                        ) 
                        :
                        (<>
                         <Link onClick={onClose} to="/login">
                           <Button colorScheme="yellow">Login</Button>
                         </Link>

                         <p>OR</p>

                         <Link onClick={onClose} to="/register">
                           <Button colorScheme="yellow">Sign Up</Button>
                         </Link>
                        </>)}

                    </HStack>
                </VStack>
            </DrawerBody>
        </DrawerContent>


    </Drawer>
    </>
  )
}

export default Header;
