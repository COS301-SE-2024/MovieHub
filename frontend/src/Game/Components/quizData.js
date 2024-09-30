import { getGameData } from "../../Services/GameApiService";

// const getMovies = async () => {
//     try {
//         const res = await getGameData("Animation");
//         console.log('Yaaas', res);
//     } catch (error) {
//         console.error("Error fetching game data:", error);
//     }
// }

// getMovies();

// export const quizData = {
//     Animation: [
//         {
//             type: "fill-in-blank",
//             question: "Complete the movie quote: 'I'll be _______.'",
//             answer: "back",
//             hint: "It's something that returns.", // Adding hint to the question
//         },
//         {
//             type: "fill-in-blank",
//             question: "Complete the movie quote: 'May the _______ be with you.'",
//             answer: "force",
//             hint: "It's something strong, often related to power.",
//         },
//         {
//             type: "multiple-choice",
//             question: "Which movie features the quote 'Here's Johnny!'?",
//             options: ["The Shining", "Titanic", "Avatar", "Inception"],
//             correct: 0,
//         },
//     ],
//     Romance: [
//         {
//             type: "fill-in-blank",
//             question: "Complete the movie quote: 'I'll be _______.'",
//             answer: "back",
//             hint: "It's something that returns.", // Adding hint to the question
//         },
//         {
//             type: "fill-in-blank",
//             question: "Complete the movie quote: 'May the _______ be with you.'",
//             answer: "force",
//             hint: "It's something strong, often related to power.",
//         },
//         {
//             type: "multiple-choice",
//             question: "Which movie features the quote 'Here's Johnny!'?",
//             options: ["The Shining", "Titanic", "Avatar", "Inception"],
//             correct: 0,
//         },
//     ],
// };

export const fetchQuizData = async (genre) => {
    console.log("Passed genre", genre)
    const cleanGenre = genre.trim();
    const quizData = {}; // Initialize the quizData object
    const gameData = await getGameData(cleanGenre); // Await the result of getGameData
    // console.log(gameData)
    // Merge the new game data into the quizData object
    Object.assign(quizData, gameData);

    return quizData; // Return the populated quizData object
};

// Example of calling fetchQuizData
const genre = "Thriller"; // Specify the genre you want
fetchQuizData(genre)
    .then(data => {
        // console.log(data); // Output the quizData
    })
    .catch(error => {
        console.error('Error fetching quiz data:', error);
    });
