import React from 'react';
import Slider from 'react-slick';
import '../../assets/css/animate.min.css';
import image1 from "../../assets/images/special-menu-1.jpg";
import image2 from "../../assets/images/special-menu-2.jpg";
import image3 from "../../assets/images/special-menu-3.jpg";
import image4 from "../../assets/images/special-menu-2.jpg";
import image5 from "../../assets/images/special-menu-1.jpg";
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

const menuItems = [
  { name: "SALMON STEAK", description: "Lorem ipsum dolor sit amet, consectetur adip aliqua. Ut enim ad minim venia.", imgSrc: image1 },
  { name: "ITALIAN PIZZA", description: "Lorem ipsum dolor sit amet, consectetur adip aliqua. Ut enim ad minim venia.", imgSrc: image2 },
  { name: "VEG. ROLL", description: "Lorem ipsum dolor sit amet, consectetur adip aliqua. Ut enim ad minim venia.", imgSrc: image3 },
  { name: "SALMON STEAK", description: "Lorem ipsum dolor sit amet, consectetur adip aliqua. Ut enim ad minim venia.", imgSrc: image4 },
  { name: "VEG. ROLL", description: "Lorem ipsum dolor sit amet, consectetur adip aliqua. Ut enim ad minim venia.", imgSrc: image5 },
];
const ExclusiveSection = styled.section`
  .active-product-area .owl-nav button.owl-prev {
    position: absolute !important;
    left: 30% !important;
    top: -14% !important;
    opacity: .5 !important;
  }
  .active-product-area .owl-nav button.owl-next {
    position: absolute !important;
    right: 30% !important;
    top: -14% !important;
    opacity: .5 !important;
  }
  .active-product-area .owl-nav button.owl-prev:hover,
  .active-product-area .owl-nav button.owl-next:hover {
    opacity: 1 !important;
  }
`;

export default function SpecialMenu() {

  const firstGroup = menuItems.slice(0, 3);
  const secondGroup = menuItems.slice(3, 6);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        }
      }
    ]
  };

  return (
    <ExclusiveSection>
    <div className="special-menu pad-top-100 parallax" data-aos="fade-up">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
              <h2 className="block-title color-white text-center">Today's Special</h2>
              <h5 className="title-caption text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm incididunt ut labore et dolore magna aliqua. Ut enim ad minim venia, nostrud exercitation ullamco.
              </h5>
            </div>
            <div className="special-box">
              <div id="owl-demo">
                <Slider {...settings}>
                  {menuItems.map((item, index) => (
                    <div className="item item-type-zoom" key={index}>
                      <a href="#" className="item-hover">
                        <div className="item-info">
                          <div className="headline">
                            {item.name}
                            <div className="line"></div>
                            <div className="dit-line">{item.description}</div>
                          </div>
                        </div>
                      </a>
                      <div className="item-img">
                        <img src={item.imgSrc} alt={item.name} />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ExclusiveSection>
  );
}