import React, { useEffect } from 'react'
import {Container,Heading,VStack,Box,Text, Button, color} from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { buySubscription } from '../../redux/actions/user';
import axios from 'axios';
import { server } from '../../redux/store';
import { use } from 'react';
import toast from 'react-hot-toast';
import logo from '../../assets/images/logo.png';
import { useSelector } from 'react-redux';


const Subscribe = ({user}) => {


    const dispatch = useDispatch();
    const [key,setKey] = useState('');

    const { loading ,error,subscriptionId} = useSelector(state => state.subscription);
    const {error : courseError} = useSelector(state => state.course);

    const subscribeHandler = async () => {

         const { data : {key} } = await axios.get(`${server}/api/v1/razorpaykey`);
         setKey(key);

        dispatch(buySubscription(key));
    };

    useEffect(() => {
        if(error)
        {
            toast.error(error);
             dispatch({type : 'clearError'});
        }

        if(courseError)
        {
            toast.error(courseError);
            dispatch({type : 'clearCourseError'});
        }

        if(subscriptionId)
        {
            const openPopUp = () => {

                const options = {
                    key,
                    name:"courseHub",
                    description:"Get access to all premium content",
                    image:logo,
                    subscription_id:subscriptionId,
                    callback_url:`${server}/api/v1/paymentverification`,
                    prefill : {
                        name:user.name,
                        email:user.email,
                        constact:"",
                    },
                    notes :{
                        address:"Ritwik Biswas at backend First Principles"
                    },
                    theme :{
                        color:"#FFC800",
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
            openPopUp();
        }
    },[dispatch,error,subscriptionId,key,user.name,user.email,courseError]);
    

    
                            

  return (
    <Container h="90vh" p="16">
        <Heading children="Welcome" my="8" textAlign={'center'}/>
        <VStack
         boxShadow={'lg'}
         alignItems={'stretch'}
         borderRadius={'lg'}
         spacing="0"
        >

            <Box bg="yellow.400" p={"4"} css={{borderRadius : '8px 8px 0 0 '}}>
                <Text color={'black'} children={`Pro Pack - ₹299.00`}/>

            </Box>

            <Box p="4">
                <VStack textAlign={"center"} px="8" mt={"4"} spacing={'8'}>
                    <Text 
                    children={`Join pro pack and get access to all content.`}
                    />
                    <Heading size="md" children={'₹299 Only'}/>

                </VStack>
                <Button isLoading={loading} onClick={subscribeHandler} my="8" w="full" colorScheme={"yellow"}>Buy Now</Button>
            </Box>

            <Box
            bg="blackAlpha.600"
            p="4"
            css={{borderRadius:'0 0 8px 8px'}}
            >
                <Heading 
                color={"white"} 
                textTransform="uppercase"
                size="sm"
                children={'100% refund at cancellation'}
                />


            <Text  fontSize={"xs"} color={"white"} children={"*Terms & Conditions Apply"}/>
            </Box>

        </VStack>
    </Container>
  )
}

export default Subscribe
