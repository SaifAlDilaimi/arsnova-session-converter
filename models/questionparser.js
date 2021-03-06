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
                var questionHasImagesInText = (matchesInText && matchesInText.length > 0) ? true : false;
                if(questionHasImagesInText){
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
                    imageDownloadOptions.push([this.generateDownloadOption(questionRecord.image)]);
                }
                
                console.log(imageDownloadOptions)
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

        var status = await Promise.all(imageDownloadPromises.map(async (entity) => {
            return await Promise.all(entity)
        }));
        console.log(status)

        return questions;
    }

}

module.exports = QuestionParser;