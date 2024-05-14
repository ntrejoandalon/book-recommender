import { useCallback, useEffect, useState } from "react";
import { AppState } from "../App"
import BookDisplay from "../components/BookDisplay";
import { RotatingLines } from 'react-loader-spinner';
import { Rating } from 'react-simple-star-rating'
import './OutputSection.css'

interface props {
    appState: AppState,
    recommendations: displayedBookFields[]
}

export interface displayedBookFields {
    title: string;
    author: string;
    rating: number;
    description: string;
    imageUrl: string;
}

//book title, author, generated description, rating, cover

let fillerStatements = ['gathering authorized books', 'checking with the Ministry of Truth', 'asking your neighbors', 'conversing with the Thought Police', 'scoping out your bookshelf']

function Loader() {
    const [indexStatement, setIndexStatement] = useState(0);

    const updateLoadingStatement = useCallback(() => {
        const index = Math.floor(Math.random() * fillerStatements.length);
        setIndexStatement(index)
    }, [])

    useEffect(() => {
        const interval = setInterval(updateLoadingStatement, 4000)
        return () => {
            clearInterval(interval)
        };
    }, [updateLoadingStatement]);

    return (
        <div className="loader">
            <RotatingLines
                visible={true}
                width="96"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                strokeColor="#e76a28"
            />
            {fillerStatements[indexStatement]}...
        </div>
    )
}

const ActualOutputSection: React.FC<props> = ({ appState, recommendations }) => {
    return (
        <div>

            {appState.valueOf() === AppState.Input.valueOf() && 'Follow the steps on the left to get your recommendation.'}
            {appState.valueOf() === AppState.Loading.valueOf() && <Loader />}
            {
                recommendations.map((rec, index) => {
                    return (
                        <BookDisplay bookFields={rec} index={index + 1} />
                    )
                })
            }
        </div>
    )
}

const WrapperOutput: React.FC<props> = ({ appState, recommendations }) => {
    return (
        <>
            {appState.valueOf() === AppState.Read1984.valueOf() ? (
                <>
                    <p className="emergencyText"> Emergency Broadcast: You Must Read</p>
                    {
                        recommendations.map((rec, index) => {
                            return (
                                <BookDisplay bookFields={rec} index={index + 1} />
                            )
                        })
                    }
                </>
            ) : (
                <>
                    <ActualOutputSection appState={appState} recommendations={recommendations} />
                </>
            )}

        </>
    )
}

const OutputSection: React.FC<props> = ({ appState, recommendations }) => {
    return (
        <div>
            <WrapperOutput appState={appState} recommendations={recommendations} />
        </div>
    )
}

export default OutputSection