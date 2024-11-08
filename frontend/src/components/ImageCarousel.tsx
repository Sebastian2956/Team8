import Photo from "../assets/photos/Greece.jpg";

export default function ImageCarousel(){
    return(
        <div className="carousel">
            <div className="carouselSlider">
                <img src={Photo} alt="Croatia"/>
            </div>

        </div>
    )
}