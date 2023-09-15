import { Button } from "./components/ui/button"
import { Github, Wand2 } from "lucide-react"
import { Separator } from "./components/ui/separator"
import { Textarea } from "./components/ui/textarea"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Slider } from "./components/ui/slider"
import { VideoInputForm } from './components/video-input-form'
import { PromptSelect } from "./components/prompt-select"
import { useState } from "react"
import { useCompletion } from 'ai/react'

export function App() {

  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)


  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body:{
      videoId,
      temperature,
    },
    headers: {
      "Content-type":"application/json"
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.ia</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido no NLW-IA da Rocketseat 
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            GItHub
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
         <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 flex-1 gap-4">
            <Textarea
              className="resize-none  p-4 leading-relaxed"
              placeholder="Inclua um prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea 
              className="resize-none  p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..." 
              readOnly
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: Você pode ultilizar a variável <code className="text-pink-700">{"{transcripition}"}</code> no seu pront
            para adiciionar o conteúdo da transcrição do video selecionado.
          </p>
         </div>

         <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId}/>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>



            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar esta opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
             <Slider
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={value => setTemperature(value[0])}

             />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais alto tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>

              <Separator />

              <Button disabled={isLoading} type="submit" className="w-full">
                Executar
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
         </aside>
      </main>
    </div>
  )
}

export default App
