import React, { useState } from 'react'
import {Button,VStack,Image, Container,Heading,HStack,Input,Text,Stack} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { use } from 'react';
import { addToPlaylist } from '../../redux/actions/profile';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/actions/course';
import { loadUser } from '../../redux/actions/user';




const Course =({views,title,imageSrc,id,addToPlayListHandler,creator,description,lectureCount,loading}) =>{
   return (
      <VStack className="course" alignItems={['center','flex-start']}>
         <Image src={"https://media.gettyimages.com/id/2174859520/photo/vibrant-city.jpg?s=1024x1024&w=gi&k=20&c=usSc7Zh-rOdiVR_rZ3rUNEoCzd9DnUb3bmCALkOy1uM="} boxSize="60" objectFit={'contain'}/>
         <Heading textAlign={["center","left"]} maxW="200px" size={"sm"}fontFamily={"sans-serif"} noOfLines={3} children={title}/> 
         <Text noOfLines={2} children={description}/>

         <HStack>
            <Text
             fontWeight={'bold'}
             textTransform="uppercase"
             children={'Creator'}
            
            />

            <Text
             fontFamily={'body'}
             textTransform="uppercase"
             children={creator}
            
            />

         </HStack>

         <Heading 
          textAlign={"center"}
          size="xs"
          children={`Lecture - ${lectureCount}`}
          textTransform="uppercase"
         />

         <Heading 
          size="xs"
          children={`Views - ${views}`}
          textTransform="uppercase"
         />

         <Stack
          direction={['column','row']}
          alignItems={"center"}
         >
            <Link to={`/course/${id}`} >
                <Button colorScheme={'yellow'}>Watch Now</Button>
            
            </Link>
            <Button 
            isLoading={loading}
            variant={"ghost"} 
            colorScheme={'yellow'}
            onClick={() =>addToPlayListHandler(id)}
            >
               Add to playlist
            </Button>

         </Stack>

      </VStack>

   );
};
const Courses = () => {

    const [keyword,setKeyword] = useState("");
    const [category,setCategory]=useState("");
    const dispatch = useDispatch();



    const addToPlayListHandler= async (courseId) => {

       await dispatch(addToPlaylist(courseId));
       dispatch(loadUser());

    };

    const Categories =[
      'Web Development',
      'Artificial Intellegence',
      'Data Structure & Algorithm',
      'App Development',
      'Data Scienec',
      'Game Development',

    ];

    const {courses,loading,error,message} = useSelector(state => state.course);

    useEffect(() => {
      dispatch(getAllCourses(category,keyword));

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

    },[dispatch,category,keyword,error,message]);

  return (
     <Container minH={'95vh'} maxW={'container.lg'} paddingY={'8'}> 
        <Heading children="All Courses" m={'8'}/>
        <Input
         value={keyword} 
         onChange={(e) => setKeyword(e.target.value)} 
         placeholder="Search a course..."
         type={'text'}
         focusBorderColor="yellow.500"/>

         <HStack
          overflowX={"auto"} 
          paddingY="8" 
          css={{
            '&::-webkit-scorllbar' : {
               display:'none',
            },
          }}>
            {
               Categories.map((item,index) =>(
                  <Button key={index} onClick={() => setCategory(item)} minW={'60'}>
                     <Text children={item}/>
                  </Button>
               ))
            }
         </HStack>

         <Stack
          direction={['column','row']}
          flexWrap="wrap"
          justifyContent={['flex-start','space-evenly']}
          alignItems={['center','flex-start']}
         >
            {
               courses.length > 0 ? courses.map((item) => (
                  <Course 
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  views={item.views}
                  imageSrc={item.poster.url}
                  id={item._id}
                  creator={item.createdBy}
                  lectureCount={item.numOfVideos}
                  addToPlayListHandler={addToPlayListHandler}
                  loading={loading}
                  
                  />
               )) : <Heading mt={'4'} children="No Course Found" />
            }


         </Stack>
     </Container>
  )
}

export default Courses
