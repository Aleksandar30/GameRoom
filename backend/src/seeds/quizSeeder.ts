import { AppDataSource } from "../data-source"
import { Question } from "../entities/Question"

const sampleQuestions: Partial<Question>[] = [
    {
        question: "What is the capital of France?",
        optionA: "Paris",
        optionB: "Madrid",
        optionC: "Berlin",
        optionD: "Rome",
        correctOption: "A"
    },
    {
        question: "Which planet is known as the Red Planet?",
        optionA: "Earth",
        optionB: "Venus",
        optionC: "Mars",
        optionD: "Jupiter",
        correctOption: "C"
    },
    {
        question: "What is the boiling point of water?",
        optionA: "50°C",
        optionB: "90°C",
        optionC: "100°C",
        optionD: "120°C",
        correctOption: "C"
    },
    {
        question: "Which language is primarily spoken in Brazil?",
        optionA: "Spanish",
        optionB: "Portuguese",
        optionC: "French",
        optionD: "English",
        correctOption: "B"
    },
    {
        question: "Who painted the Mona Lisa?",
        optionA: "Van Gogh",
        optionB: "Picasso",
        optionC: "Da Vinci",
        optionD: "Michelangelo",
        correctOption: "C"
    },
    {
        question: "What is the square root of 64?",
        optionA: "6",
        optionB: "8",
        optionC: "10",
        optionD: "12",
        correctOption: "B"
    },
    {
        question: "How many continents are there?",
        optionA: "5",
        optionB: "6",
        optionC: "7",
        optionD: "8",
        correctOption: "C"
    },
    {
        question: "Which element has the symbol O?",
        optionA: "Osmium",
        optionB: "Oxygen",
        optionC: "Opal",
        optionD: "Ozone",
        correctOption: "B"
    },
    {
        question: "What year did WW2 end?",
        optionA: "1943",
        optionB: "1944",
        optionC: "1945",
        optionD: "1946",
        correctOption: "C"
    },
    {
        question: "Who discovered gravity?",
        optionA: "Einstein",
        optionB: "Galileo",
        optionC: "Newton",
        optionD: "Tesla",
        correctOption: "C"
    },
    {
        question: "Which animal is the largest?",
        optionA: "Elephant",
        optionB: "Blue Whale",
        optionC: "Giraffe",
        optionD: "Shark",
        correctOption: "B"
    },
    {
        question: "What does HTTP stand for?",
        optionA: "HyperText Transfer Protocol",
        optionB: "HighText Transfer Protocol",
        optionC: "HyperTransfer Text Protocol",
        optionD: "High Transfer Text Package",
        correctOption: "A"
    },
    {
        question: "What is 5 x 6?",
        optionA: "30",
        optionB: "25",
        optionC: "35",
        optionD: "20",
        correctOption: "A"
    },
    {
        question: "What color do you get when you mix red and white?",
        optionA: "Orange",
        optionB: "Pink",
        optionC: "Purple",
        optionD: "Brown",
        correctOption: "B"
    },
    {
        question: "Which gas do plants breathe in?",
        optionA: "Oxygen",
        optionB: "Hydrogen",
        optionC: "Carbon Dioxide",
        optionD: "Nitrogen",
        correctOption: "C"
    },
    {
        question: "What is the freezing point of water?",
        optionA: "0°C",
        optionB: "10°C",
        optionC: "-10°C",
        optionD: "32°C",
        correctOption: "A"
    },
    {
        question: "Which country is known for sushi?",
        optionA: "Korea",
        optionB: "Japan",
        optionC: "China",
        optionD: "Thailand",
        correctOption: "B"
    },
    {
        question: "What is the chemical symbol for gold?",
        optionA: "Ag",
        optionB: "Au",
        optionC: "Gd",
        optionD: "Go",
        correctOption: "B"
    },
    {
        question: "What is the tallest mountain?",
        optionA: "K2",
        optionB: "Makalu",
        optionC: "Everest",
        optionD: "Kangchenjunga",
        correctOption: "C"
    },
    {
        question: "What does CPU stand for?",
        optionA: "Central Processing Unit",
        optionB: "Computer Power Unit",
        optionC: "Central Peripheral Unit",
        optionD: "Core Processing Utility",
        correctOption: "A"
    }
]

async function seedQuestions() {
    await AppDataSource.initialize()
    const repo = AppDataSource.getRepository(Question)
    await repo.clear() // Optional: remove old data
    await repo.save(sampleQuestions)
    console.log("✅ 20 questions inserted!")
    process.exit(0)
}

seedQuestions().catch(err => {
    console.error("Seeder error:", err)
    process.exit(1)
})
