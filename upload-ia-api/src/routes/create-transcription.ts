import { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs'
import { openai } from '../lib/openai'
import { z } from 'zod'
import { prisma } from "../lib/prisma";

export async function createTranscriptionRoutes (app:FastifyInstance) {

    app.post('/video/:videoId/transcription', async (request)=>{
        const paramsSchema = z.object({
            videoId: z.string().uuid()
        })
        const { videoId } = paramsSchema.parse(request.params)

       const bodySchema = z.object({
            prompt: z.string()
       })
       const { prompt } = bodySchema.parse(request.body)

       const video = await prisma.video.findFirstOrThrow({
        where: {
            id: videoId
        }
       })

       const videoPath = video.path
       const audioReadStream = createReadStream(videoPath)

       const response = await openai.audio.transcriptions.create({
            file:audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt:prompt
       })

       const transcription = response.text

       await prisma.video.update({
        where: {
            id: videoId,
        },
        data: {
            transcription
        }
       })


       return { transcription }
    })

}