import React, { useState } from 'react'
import {Container,Heading,VStack,Box,Input,Button, Textarea,form,FormLabel} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { contactUs } from '../../redux/actions/other';
import { use } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");

    const  dispatch = useDispatch();
    const {loading,error,message : stateMessage} = useSelector(state => state.other);

    const submitHandler =(e) => {
        e.preventDefault();
        dispatch(contactUs(name,email,message));
    };

    useEffect(() => {

        if (error) {
          toast.error(error);
          dispatch({ type: 'clearError' });
        }

        if (stateMessage) {
          toast.success(stateMessage);
          dispatch({ type: 'clearMessage' });
        }
    },[dispatch,error,stateMessage]);
  return (
    <Container h="92vh">
        <VStack h="full" justifyContent={"center"} spacing={'16'}>
            <Heading children="Contact Us"/>
            <form  onSubmit={submitHandler} style={{width : '100%'}}>

             <Box my={'4'}>
                <FormLabel htmlFor="name" children="Name"/>
                <Input 
                required
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="abc"
                focusBorderColor="yellow.500"
                />

            </Box>


            <Box my={'4'}>
                <FormLabel htmlFor="email" children="Email Address"/>
                <Input 
                required
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Message..."
                type={"email"}
                focusBorderColor="yellow.500"
                />

            </Box>

             <Box my={'4'}>
                <FormLabel htmlFor="message" children="Message"/>
                <Textarea
                required
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="abc"
                type={"message"}
                focusBorderColor="yellow.500"
                />

            </Box>

            <Button my="4" colorScheme={'yellow'} type='submit'>
                Send Email
            </Button>

            <Box my="4">
                Request for a course?{' '} 
                <Link to="/request">
                <Button isLoading={loading} colorScheme={'yellow'} variant="link">
                   Click
                </Button>{' '}
                here    
                </Link>

            </Box>

        </form>
        </VStack>
    </Container>
   
  )
}

export default Contact
