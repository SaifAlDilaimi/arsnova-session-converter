const Answer = require('./answer.js')
const randomstring = require("randomstring");
const download = require('image-downloader')

var http = require('http');
var fs = require('fs');

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

        var options = {
            url: this.imageURL,
            dest: './tmp/'+this.imageName
        }
           
        if (this.imageURL != null){               
            downloadIMG(options)
        }
    }

    async downloadIMG(options) {
        try {
          const { filename, image } = await download.image(options)
          console.log(filename) // => /path/to/dest/image.jpg 
        } catch (e) {
          console.error(e)
        }
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