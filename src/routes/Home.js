import { Container, Accordion } from 'react-bootstrap';
import './styles.css';

const Home = () => {
    return (
    <Container className='justify-content-center align-middle pages-content'>
        <Accordion defaultActiveKey='0' flush>
        <Accordion.Item eventKey='0' className='content-italic'>
            Architecture innovation through data science & parameteric design
        </Accordion.Item>
        <Accordion.Item eventKey='1'>
            <Accordion.Header className='content-header'>re:Modeling </Accordion.Header>
            <Accordion.Body className='content-paragraph'>
            The real-time city is real! As layers of networks and digital information
             blanket urban space, new approaches to the study of the built environment 
             are emerging. The way we describe and understand cities is being radically 
             transformed—as are the tools we use to design them. The mission of the 
             Senseable City Laboratory—a research initiative at the Massachusetts 
             Institute of Technology—is to anticipate these changes and study them 
             from a critical point of view.
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey='2'>
            <Accordion.Header>Accordion Item #2</Accordion.Header>
            <Accordion.Body>
            Not bound by the methodologies of a single field, the Lab is characterized 
            by an omni-disciplinary approach: it speaks the language of designers, 
            planners, engineers, physicists, biologists and social scientists. 
            Senseable is as fluent with industry partners as it is with metropolitan governments, 
            individual citizens and disadvantaged communities. Through design and science, 
            the Lab develops and deploys tools to learn about cities—so that cities can learn about us.
            </Accordion.Body>
        </Accordion.Item>
        </Accordion>
    </Container>
    );
  };
  
  export default Home;
  