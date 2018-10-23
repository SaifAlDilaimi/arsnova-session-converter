const download = require('image-downloader')

class ImageDownloader{
    constructor(){}

    async download(options){
        try {
            const { filename, image } = await download.image(options)
            console.log(filename) // => /path/to/dest/image.jpg 
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = ImageDownloader