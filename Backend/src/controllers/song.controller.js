const songModel = require("../models/song.models")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

async function uploadSong(req, res){
    if (!req.file) {
        return res.status(400).json({
            message: "No song file provided. Please upload a file using the field name 'song'."
        })
    }

    const songBuffer = req.file.buffer
    const { mood } = req.body

    if (!mood) {
        return res.status(400).json({
            message: "Mood parameter is required."
        })
    }

    let tags = {}
    try {
        tags = id3.read(songBuffer) || {}
    } catch (err) {
        console.error("Error reading ID3 tags:", err)
    }

    const title = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "")
    const hasImage = tags.image && tags.image.imageBuffer

    try {
        const songFilePromise = storageService.uploadFile({
            buffer: songBuffer,
            filename: title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        })

        let posterUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500"
        const uploadPromises = [songFilePromise]

        if (hasImage) {
            const posterFilePromise = storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: title + ".jpeg",
                folder: "/cohort-2/moodify/posters"
            })
            uploadPromises.push(posterFilePromise)
        }

        const results = await Promise.all(uploadPromises)
        const songFile = results[0]
        
        if (hasImage) {
            const posterFile = results[1]
            posterUrl = posterFile.url
        }

        const song = await songModel.create({
            title,
            url: songFile.url,
            posterUrl,
            mood
        })

        return res.status(201).json({
            message: "Song uploaded and created successfully",
            song
        })
    } catch (err) {
        console.error("Upload error:", err)
        return res.status(500).json({
            message: "An error occurred during file upload or storage processing",
            error: err.message
        })
    }
}

async function getSong(req,res){

    const { mood } = req.query

    const song = await songModel.findOne({
        mood
    })

    res.status(200).json({
        message: "song fetched successfully",
        song
    })
}

module.exports = { uploadSong, getSong }