const Answer = require('./answer.js')
const randomstring = require("randomstring");

class Question{
    constructor(type, variant, subject, text, possibleAnswers, hint, solution, imageURL){
        this.type = type;
        this.variant = variant;
        this.subject = subject;
        this.text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        this.hint = hint;
        this.solution = solution;
        this.imageURL = imageURL
        this.possibleAnswers = this.generateAnswers(possibleAnswers);
        this.imageName = randomstring.generate()+".png";

    }

    generateAnswers(possibleAnswers){
        var answers = [];

        var index;
        for(index = 0; index < possibleAnswers.length; index++){
            var a = possibleAnswers[index];
            var new_a = new Answer(a.id,
                a.text.replace(/(\r\n\t|\n|\r\t)/gm,""),
                a.correct,
                a.value);
            answers.push(new_a);
        }

        return answers;
    }
}

module.exports = Question;