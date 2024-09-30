import { getGameDataByGenre } from "../../Services/GameApiService";

const getMovies = async () => {
    try {
        const res = await getGameDataByGenre("Animation");
        console.log(res);
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

getMovies();

export const quizData = {
    Animation: [
        {
            type: "fill-in-blank",
            question: "Complete the movie quote: 'I'll be _______.'",
            answer: "back",
            hint: "It's something that returns.", // Adding hint to the question
        },
        {
            type: "fill-in-blank",
            question: "Complete the movie quote: 'May the _______ be with you.'",
            answer: "force",
            hint: "It's something strong, often related to power.",
        },
        {
            type: "multiple-choice",
            question: "Which movie features the quote 'Here's Johnny!'?",
            options: ["The Shining", "Titanic", "Avatar", "Inception"],
            correct: 0,
        },
    ],
    Romance: [
        {
            type: "fill-in-blank",
            question: "Complete the movie quote: 'I'll be _______.'",
            answer: "back",
            hint: "It's something that returns.", // Adding hint to the question
        },
        {
            type: "fill-in-blank",
            question: "Complete the movie quote: 'May the _______ be with you.'",
            answer: "force",
            hint: "It's something strong, often related to power.",
        },
        {
            type: "multiple-choice",
            question: "Which movie features the quote 'Here's Johnny!'?",
            options: ["The Shining", "Titanic", "Avatar", "Inception"],
            correct: 0,
        },
    ],
};
