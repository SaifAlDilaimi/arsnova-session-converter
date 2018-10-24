const Answer = require('./answer.js')
const randomstring = require("randomstring");

class Question{
    constructor(type, variant, subject, text, possibleAnswers, hint, solution, imageURL, imageName){
        this.type = type;
        this.variant = variant;
        this.subject = subject;
        this.text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        this.possibleAnswers = this.generateAnswers(possibleAnswers);
        this.hint = hint;
        this.solution = solution;
        this.imageURL = imageURL
        this.imageName = imageName;
    }

    generateAnswers(possibleAnswers){
        const answers = possibleAnswers
            .map((possibleAnswerRecord) => {
                var answer = new Answer(
                    possibleAnswerRecord.id,
                    possibleAnswerRecord.text.replace(/(\r\n\t|\n|\r\t)/gm, ""),
                    possibleAnswerRecord.correct,
                    possibleAnswerRecord.value
                );

                return answer;
            });

        return answers;
    }
}

module.exports = Question;