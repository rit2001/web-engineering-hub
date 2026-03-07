import React,{useEffect, useState} from 'react'
import {Button, Container,Heading,Stack,Avatar, VStack, HStack,Text,Image, ModalOverlay, ModalCloseButton, ModalContent, ModalFooter,useDisclosure,Modal,ModalBody,Input,ModalHeader} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { fileUploadCss } from '../Auth/Register';
import { use } from 'react';
import { cancelSubscription, loadUser, register } from '../../redux/actions/user';
import { updateProfilePicture } from '../../redux/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  removeFromPlaylist,
} from '../../redux/actions/profile';



const Profile = ({user}) => {


    const {isOpen,onClose,onOpen} =useDisclosure();

    const dispatch = useDispatch();

     const {loading,message,error} = useSelector(state => state.profile);
     const {loading : subscriptionLoading,
        error : subscriptionError,
        message : subscriptionMessage } = useSelector(state => state.subscription);

     const removeFromPlaylistHandler = async (id) =>{

       await dispatch(removeFromPlaylist(id));
       dispatch(loadUser());
    };


     

     const changeImageSubmitHandler = async (e,image) =>{
        e.preventDefault();
        const myForm = new FormData();

        myForm.append('file',image);
        await dispatch(updateProfilePicture(myForm));
        dispatch(loadUser());

     };

     const cancelSubscriptionHandler = () => {
        dispatch(cancelSubscription());


     };

     useEffect(() => {

      if(error)
      {
        toast.error(error);
        dispatch({type:'clearError'});
      }
      if(message)
      {
        toast.success(message);
        dispatch({type:'clearMessage'});
      }

      if(subscriptionError)
      {
        toast.error(subscriptionError);
        dispatch({type:'clearError'});
      }

      if(subscriptionMessage)
      {
        toast.success(subscriptionMessage);
        dispatch({type:'clearMessage'});
        dispatch(loadUser());
      }
    },[dispatch,error,message,subscriptionError,subscriptionMessage]);


  return (
    <Container minH={'95vh'} maxH="container.lg" py="8">
        <Heading children="profile" m="8" textTransform={'uppercase'}/>

        <Stack
        justifyContent={"flex-start"}
        direction={["column","row"]}
        alignItems={"center"}
        spacing={["8","16"]}
        padding={"8"}
        >
        <VStack>
            <Avatar boxSize={"48"} src={user.avatar.url}/>
            <Button onClick={onOpen} colorScheme={"yellow.500"} variant={'unstyled'}>
            Change Photo
            </Button>
        </VStack>
     <VStack spacing={'4'} alignItems={['center','flex-start']}>
        <HStack>
            <Text children="Name" fontWeight={'bold'}/>
            <Text children={user.name}/>
        </HStack>

        <HStack>
            <Text children="Email" fontWeight={'bold'}/>
            <Text children={user.email}/>
        </HStack>

        <HStack>
            <Text children="CreatedAt" fontWeight={'bold'}/>
            <Text children={user.createdAt.split('T')[0]}/>
        </HStack>

        {
            user.role !== 'admin' && (
            <HStack>
                <Text children="Subscription" fontWeight={'bold'}/>
                {user.subscription && user.subscription.status === "active" ? (
                    <Button isLoading={subscriptionLoading} onClick={cancelSubscriptionHandler} color={'yellow.500'} variant={'unstyled'}>
                        Cancel Subscription
                    </Button>
                ) : (
                    <Link to="/subscribe">
                        <Button colorScheme={'yellow'}>
                            Subscribe
                           
                        </Button>

                    </Link>
                )}
            </HStack>
        )}
        <Stack direction={['column','row']} alignItems={'center'}>
            <Link to="/updateprofile">
                <Button colorScheme={'yellow.500'} variant={'unstyled'}>
                    Update Profile
                </Button>
            </Link>

            <Link to="/changepassword">
                <Button colorScheme={'yellow.500'} variant={'unstyled'}>
                    Change Password
                </Button>
            </Link>
        </Stack>
     </VStack>
        </Stack>


        <Heading children="Playlist" size={'md'} my="8"/>
        {
            user?.playlist?.length > 0 ? (
                <Stack
                direction={['column','row']}
                flexWrap={'wrap'}
                alignItems={['center','flex-start']}
                p="4"
                >
                    {
                        user.playlist.map((element,index) => (
                            <VStack key={index} m="2" w="48">
                                <Image boxSize={"full"} objectFit={"contain"} src={element.poster}/>

                                <HStack>
                                    <Link to={`/course/${element.course}`}>
                                      <Button variant={"ghost"} colorScheme={'yellow'}>
                                        Watch Now
                                      </Button>
                                    </Link>
                                    <Button isLoading={loading} onClick={() => removeFromPlaylistHandler(element.course)}>
                                        <RiDeleteBin7Fill/>
                                    </Button>
                                </HStack>
                            </VStack>
                        ))
                    }
                </Stack>
            ) : (
                <Heading children="No courses in playlist" size={'sm'}/>
            )
        }

        <ChangePhotoBox isOpen={isOpen} onClose={onClose} changeImageSubmitHandler={changeImageSubmitHandler} loading={loading} />

    </Container>
  )
}

export default Profile;



function ChangePhotoBox({isOpen,onClose,changeImageSubmitHandler,loading}){


    const [image,setImage]= useState("");
    const [imagePrev,setImagePrev]= useState("");

    const changeImage = (e) =>
    {
        const file= e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            
            setImagePrev(reader.result);
            setImage(file);
            

        };
    };

    const closehandler = () => {
        onClose();
        setImagePrev("");
        setImage("");
    }

    return  (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter={'blur(10px'}/>
        <ModalContent>
            <ModalHeader>Change Photo</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Container>
                    <form onSubmit={(e) => changeImageSubmitHandler(e,image)}>
                        <VStack spacing={'8'}>
                            {
                                imagePrev && <Avatar src={imagePrev} boxSize={'48'}/>
                            }
                            <Input 
                            type={"file"} css={{"&::file-selector-button":fileUploadCss}}
                            onChange={changeImage}


                            />
                            <Button isLoading={loading} w="full" colorScheme={'yellow'} type='submit'>Change</Button>

                        </VStack>
                    </form>
                </Container>
            </ModalBody>

            <ModalFooter>
                <Button mr="3" onClick={closehandler}>
                   Cancel 
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>

    )

};



