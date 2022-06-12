import { Container, Card, Button } from 'react-bootstrap';
import '../styles.css';
import Carousel from 'react-grid-carousel';
import { useHolderjs } from "use-holderjs";
import projectsData from "../Data/Projects/Undergraduated.json";

const Undergraduated = () => {
    useHolderjs();
    const options = {
        showDots:true,
        scrollSnap: true,
        loop: true,
        hideArrow: false,
        cols:4,
        rows:1,
        gap:10,
        responsiveLayout:[
            {
                breakpoint: 500,
                cols: 1,
                rows: 1,
                gap: 5,
                loop: true,
                hideArrow: true,
                showDots:true,
                scrollSnap: true,
              }
        ]
      };

    const rendercontent = ()=>{
        const content =[];
        projectsData.Data.forEach( (data, i) =>{
            content.push(
                <Carousel.Item key={{i}}>
                    <Card className="m-5 border-0 shadow" className="card">
                        <div className="img-card">
                            <Card.Img as="img" variant="top" src="holder.js/100px420" className="img"/>
                            <Card.Body>
                                <Card.Subtitle className="text-muted">{data.year} {data.semester} {data.lecture}</Card.Subtitle >
                                <Card.Title>{data.topic} 。 {data.name} </Card.Title>
                            </Card.Body>
                        </div>
                        <ul className="social-media">
                            <li>
                            <div className='descript'>
                                <Card.Text className='small'>{data.abstract}</Card.Text>
                                <Button variant="outline-primary">LINK</Button>
                            </div>
                            </li>
                        </ul>
                    </Card>
                </Carousel.Item>
            );
        });

        return content;
    }

    return (
        <Container className='pages-content'>
            <Carousel {...options} className='carousel-warpper'>
                {rendercontent()}
            </Carousel>
        </Container>
    );
  };
  
  export default Undergraduated;
  
