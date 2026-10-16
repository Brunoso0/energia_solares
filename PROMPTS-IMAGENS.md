# Prompts para gerar as imagens e vídeos (IA)

Estilo comum (cole em todos): *warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera.*

Salve os arquivos com os nomes indicados, na pasta `public/media/`.

**Regra de ouro das imagens:** a Solares vende a ENERGIA gerada pela usina dela, não painéis. Painéis solares só aparecem onde a usina é da Solares (ou do parceiro que a loca para ela). As imagens dos clientes (comércio, escritório, indústria, campo) NÃO podem ter painéis no telhado ou no terreno: o cliente usa a energia que chega pela rede elétrica.

## Imagens

**1. hero-usina.jpg — proporção 16:9 (2560×1440)**
Aerial view of a large utility-scale solar power plant (the company's own plant) with rows of panels at golden hour, long shadows, a few low clouds, warm sky near the horizon, power lines running from the plant toward a distant small town. Wide cinematic frame, empty space on the left third for headline text. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**2. perfil-comercio.jpg — proporção 4:5 (1200×1500)**
Small neighborhood supermarket in a Brazilian town, exterior in late afternoon sun, lights on inside, an electric utility pole and wires beside the street, plain roof with NO solar panels anywhere, warm light. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**3. perfil-escritorio.jpg — proporção 4:5 (1200×1500)**
Modern small clinic or office reception, large windows with warm afternoon light, lights and a computer on, clean interior, plants, no people facing camera, no solar panels. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**4. perfil-industria.jpg — proporção 4:5 (1200×1500)**
Small workshop or light industrial shed in a Brazilian countryside town, roller door open, machines running, warm sunlight, tools tidy, electric meter box on the wall, plain metal roof with NO solar panels. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**5. perfil-rural.jpg — proporção 4:5 (1200×1500)**
Farm in the Bahia semi-arid region at sunrise, barn with an irrigation pivot in the distance, dry golden landscape, an electric pole with wires in the foreground, NO solar panels anywhere in the scene. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**6. manutencao.jpg — proporção 3:2 (1800×1200)**
Technician in work uniform and helmet, seen from behind, inspecting the rows of a large solar power plant with a tablet at golden hour, shallow depth of field. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**7. parceiro-usina.jpg — proporção 4:3 (1600×1200)**
Small ground-mounted solar plant (around 50 kWp) owned by a private landowner, on a modest property, tidy installation, warm evening light, a simple house in the background. This is the partner's plant that Solares leases. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**8. textura-painel.jpg — proporção 1:1 (1600×1600)**
Extreme close-up of solar panel cells with a golden sun reflection and thin steel-blue grid lines, abstract, high detail. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

## Vídeos

**9. hero-loop.mp4 — proporção 16:9 (1920×1080), 6–8 s, loop suave, sem áudio**
Slow aerial drift over a solar farm at golden hour, panels catching the light, gentle camera movement forward, subtle cloud shadows passing. Seamless loop. + estilo comum.
warm golden-hour light like a summer film, cinematic, natural color grading with gold and soft steel-blue shadows, clean modern composition, photorealistic, no text, no logos, no watermark, no people looking at camera

**10. geracao-timelapse.mp4 — proporção 16:9 (1920×1080), 10 a 12 s, sem áudio**
(Este prompt NÃO usa o "estilo comum": o estilo comum fixa a luz de fim de tarde, e aqui a luz muda ao longo do dia. O gráfico da página vai de 6h a 18h, então o vídeo precisa ir da manhã ao anoitecer.)

Prompt:
Single continuous full-day timelapse of a large utility-scale solar power plant, seen from a fixed elevated viewpoint, camera completely static with the exact same framing from start to finish. The light evolves smoothly through the whole day in this order: pre-dawn with a soft blue-pink sky and dark cold panels; sunrise with warm orange light at the horizon and the first golden reflections on the panels; bright morning; midday with a clear sky, high sun and strong white-blue reflections; afternoon with long shadows; golden hour; sunset with the sun touching the horizon, a deep orange-red sky and the panels mirroring the sky colors; and finally dusk with a deep blue twilight sky and the panels going dark again. The sun travels in a visible arc across the sky from left to right, clouds drift quickly, shadows sweep across the ground. The final frame must clearly be evening/dusk, not afternoon. Photorealistic, cinematic, natural colors, no text, no logos, no watermark, no people.

Se a ferramenta limitar a duração (ex.: 5 a 8 s) e o vídeo só chegar à tarde:
- gere em 2 partes com o mesmo enquadramento: parte 1 "pre-dawn to midday" e parte 2 "midday to dusk, ending in deep blue twilight". Se a ferramenta aceitar "primeiro/último quadro", use o último quadro da parte 1 como primeiro da parte 2. Depois eu junto as duas com o ffmpeg; ou
- se a ferramenta aceitar primeiro e último quadro, use como primeiro quadro a usina ao amanhecer e como último a mesma cena ao anoitecer.

Depois de gerar, converta os vídeos com:
`ffmpeg -i entrada.mp4 -an -g 8 -vf scale=1600:-2 -crf 23 saida.mp4`
