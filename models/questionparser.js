const download = require('image-downloader')
const Question = require('./question')
const randomstring = require("randomstring");
const fse = require('fs-extra')
var https = require('https')

class QuestionParser {

    generateDownloadOption(url) {
        const imageName = randomstring.generate()+".png";
        const destinationPath = `./tmp/${imageName}`;
        const imageDownloadOption = {
            url: url,
            dest: destinationPath,
            imageName: imageName
        }
        return imageDownloadOption;
    }

    async parseQuestions(sessionJson) {

        var questionJson = sessionJson.exportData.questions;

        const imageDownloadPromises = questionJson
            .filter((questionRecord) => {
                const questionHasImageUrl = questionRecord.image != null;

                var matchesInText = questionRecord.text.match(/\bhttps?:\/\/\S+/gi)
                var questionHasImagesInText = false;
                if(questionHasImagesInText){
                    questionHasImagesInText = (matchesInText && matchesInText.length > 0) ? true : false;
                    questionRecord.imagesInText = questionRecord.text.match(/\bhttps?:\/\/\S+/gi)
                }

                return (questionHasImageUrl || questionHasImagesInText);
            })
            .map((questionRecord) => {
                var imageDownloadOptions = []
                if(questionRecord.imagesInText){
                    imageDownloadOptions.push(questionRecord.imagesInText.map(this.generateDownloadOption));
                }
                
                if(questionRecord.image != null){
                    imageDownloadOptions.push(questionRecord.image);
                }
                
                console.log(imageDownloadOptions[0])
                questionRecord.downloadOptions = imageDownloadOptions[0]
                return imageDownloadOptions[0];
            })
            .map((imageDownloadOptions) => {
                const imagePromise = imageDownloadOptions.map((option) => {
                    console.log("Option to download: ", option)
                    return download.image(option)
                });

                return imagePromise;
            });

        const questions = questionJson.map((questionRecord) => {
            const question = new Question(
                questionRecord.type,
                questionRecord.questionVariant,
                questionRecord.subject,
                questionRecord.text,
                questionRecord.possibleAnswers,
                questionRecord.hint,
                questionRecord.solution,
                questionRecord.downloadOptions
            );

            return question;
        });

        await Promise.all(imageDownloadPromises);

        return questions;
    }

}

module.exports = QuestionParser;