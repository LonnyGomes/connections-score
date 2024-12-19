const express = require('express');
const router = express.Router();

const colorValues = {
    129000: 1, 
    129001: 2, 
    128998: 3, 
    129002: 4
}

router.get('/', async (req, res) => {    

    try {
        const share = req.query.text.split('\n')

        // Grab the lines before the first guess
        const firstLines = share.slice(0, share.findIndex(line => colorValues[line.codePointAt(0)]))
    
        // Filter the share down to just the guesses
        const guesses = share.filter(line => colorValues[line.codePointAt(0)])

        // Validate that there's the correct number of guesses
        if (guesses.length < 4 || guesses.length > 7 ) {
            throw new Error('Invalid Share')
        }
    
        // Iterate through them and assign score values 
        const scores = guesses.map((guess, i) => {
            
            // Limit the guess ot just the colored squares
            guess = guess.slice(0, 8)
    
            // Calculate the line multipler
            const lineMultiplier = Math.max(4 - i, 0); 
    
            // Convert the guess into an array
            // You'd think using split and then map would work for this but it adds a bunch of extra characters
            let squares = [
                guess.codePointAt(0), guess.codePointAt(2), guess.codePointAt(4), guess.codePointAt(6)
            ]
    
            // See if all the squares are the same 
            const same = squares.every(square => square == squares[0])
    
            // Calculate the color mulitplier 
            let colorMultiplier = same ? colorValues[squares[0]] : 0
    
            // Calculat the line score
            let lineScore = colorMultiplier * lineMultiplier
    
            return { 
                guess,
                colorMultiplier,
                lineMultiplier,
                lineScore
            }
    
        })

        // Recreate the guess with the scores added

        const grid = scores.map(scoreData => {
            return `${scoreData.guess} ${scoreData.colorMultiplier}x${scoreData.lineMultiplier}=${scoreData.lineScore}`
        }).join('\n')

        const score = `${scores.reduce((total, line) => total += line.lineScore, 0)}/30`    

        const scoredGuess = [
            firstLines.join('\n'),
            grid,
            score
        ].join('\n')

        const response = {
            valid: true,
            scoredGuess: scoredGuess
        }
        
        console.log(response);
    
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.set('Content-Type', 'application/json')
        res.send(response);
    } catch(e) {

        const response = {
            valid: false
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.set('Content-Type', 'application/json')
        res.send(response);


    }

    
})

module.exports = {router};