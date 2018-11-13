const Answer = require('./answer.js')
const randomstring = require("randomstring");
const removeMd = require('remove-markdown');
var md = require( "markdown" ).markdown

class Question{
    constructor(type, variant, subject, text, possibleAnswers, hint, solution, downloadOptions){
        this.type = type;
        this.variant = variant;
        console.log(JSON.stringify(md.parse(text)));
        this.subject = removeMd(subject);
        this.subject = this.subject.replace(/(\r\n\t|\n|\r\t)/gm,"");
        this.subject = this.subject.replace(/%/g,"\\%");
        
        this.text = JSON.stringify(md.parse(text))[1][1]
        this.text = this.text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        this.text = this.text.replace(/%/g,"\\%");

        this.possibleAnswers = this.generateAnswers(possibleAnswers);
        this.hint = hint;
        this.solution = solution;
        this.downloadOptions = downloadOptions;
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