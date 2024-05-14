import { Rating } from "react-simple-star-rating"
import { displayedBookFields } from "../contentSections/OutputSection"

import './BookDisplay.css'

interface props {
    bookFields: displayedBookFields,
    index: number
}

//"https://covers.openlibrary.org/b/olid/OL22819394M-M.jpg" George Orwell
interface ratingProps {
    rating: number
}
const RatingDisplay: React.FC<ratingProps> = ({ rating }) => {
    return (
        <>
            {rating ? (
                <>
                    <Rating initialValue={rating} allowFraction={true} readonly={true} />
                    <p>{rating.toFixed(2)} stars
                    </p></>
            ) : (
                <>
                    <p>No rating available</p>
                </>
            )}

        </>

    )
}

const BookDisplay: React.FC<props> = ({ bookFields, index }) => {
    return (
        <div className="fullBookCard">
            <h1 className="titleLine">0{index} {bookFields.title} </h1>
            <div className="bookDisplayContent">
                <a>
                    <img src={"https://covers.openlibrary.org/b/olid/OL22819394M-M.jpg"} />
                    <span>We only have images of 1984 at the moment - as we should</span>
                </a>
                <div className="sideContent">
                    Written by {bookFields.author}
                    <br></br>
                    <RatingDisplay rating={bookFields.rating} />
                    <div className="descriptionText">
                        {bookFields.description}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDisplay
