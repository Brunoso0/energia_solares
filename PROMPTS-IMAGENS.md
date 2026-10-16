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

## Mascote (bonequinha com a farda da Solares)

Personagem que aparece em 5 pontos do site. **Todas as imagens têm a mesma proporção: 4:5 (1200×1500), corpo inteiro, PNG com fundo transparente**, para encaixar em qualquer seção (clara ou escura).

**Cada prompt abaixo já está completo (personagem + pose + fundo): é só copiar e colar, um por imagem.**

**Como manter a mesma personagem nas 5 imagens:** gere a primeira (apontando), aprove, e nas outras 4 envie a primeira como imagem de referência (character reference / "same character as the reference image") e troque só a linha **POSE**. Se a ferramenta não gerar fundo transparente, peça fundo liso e uniforme (`plain flat solid white background, no shadows on the background`) e remova depois; me passe os arquivos que eu recorto.

**11. mascote-apontando.jpg — proporção 4:5 (1200×1500)** — vai na Calculadora
Cute stylized 3D cartoon doll character, a friendly young Brazilian woman, full body, standing, slightly large head and soft rounded proportions like a premium vinyl figurine, warm brown skin, dark hair in a neat ponytail, big warm smile, expressive eyes. She wears the company uniform: a charcoal-grey (#16191D) short-sleeve polo shirt with a golden-yellow (#E3A918) collar trim and a small embroidered round golden sun logo with a dark stylized wordmark on the left chest, dark work trousers and clean sneakers. No helmet, no solar panels. Soft studio lighting with a gentle warm golden rim light, subtle gloss, smooth clean 3D render, Pixar-like quality, no text other than the small chest logo, no watermark. POSE: body turned slightly to the side, one arm extended and pointing with her index finger down and to her left (toward something below), the other hand relaxed on her hip, confident and inviting expression, looking at the viewer. Transparent background (PNG). If transparency is not possible: plain flat solid white background, no shadows on the background.

**12. mascote-positivo.jpg — proporção 4:5 (1200×1500)** — vai em "Para quem é essa solução?"
Cute stylized 3D cartoon doll character, a friendly young Brazilian woman, full body, standing, slightly large head and soft rounded proportions like a premium vinyl figurine, warm brown skin, dark hair in a neat ponytail, big warm smile, expressive eyes. She wears the company uniform: a charcoal-grey (#16191D) short-sleeve polo shirt with a golden-yellow (#E3A918) collar trim and a small embroidered round golden sun logo with a dark stylized wordmark on the left chest, dark work trousers and clean sneakers. No helmet, no solar panels. Soft studio lighting with a gentle warm golden rim light, subtle gloss, smooth clean 3D render, Pixar-like quality, no text other than the small chest logo, no watermark. POSE: facing the viewer, one hand giving a clear thumbs-up at chest height, the other arm relaxed at her side, big reassuring smile, slight head tilt. Transparent background (PNG). If transparency is not possible: plain flat solid white background, no shadows on the background.

**13. mascote-fatura.jpg — proporção 4:5 (1200×1500)** — vai em "Como funciona?"
Cute stylized 3D cartoon doll character, a friendly young Brazilian woman, full body, standing, slightly large head and soft rounded proportions like a premium vinyl figurine, warm brown skin, dark hair in a neat ponytail, big warm smile, expressive eyes. She wears the company uniform: a charcoal-grey (#16191D) short-sleeve polo shirt with a golden-yellow (#E3A918) collar trim and a small embroidered round golden sun logo with a dark stylized wordmark on the left chest, dark work trousers and clean sneakers. No helmet, no solar panels. Soft studio lighting with a gentle warm golden rim light, subtle gloss, smooth clean 3D render, Pixar-like quality, no text other than the small chest logo, no watermark. POSE: facing the viewer, holding a plain blank paper electricity bill (white sheet with a few abstract grey lines, NO readable text and no logos) in both hands in front of her chest, presenting it, friendly attentive expression. Transparent background (PNG). If transparency is not possible: plain flat solid white background, no shadows on the background.

**14. mascote-contrato.jpg — proporção 4:5 (1200×1500)** — vai em "Seja parceiro"
Cute stylized 3D cartoon doll character, a friendly young Brazilian woman, full body, standing, slightly large head and soft rounded proportions like a premium vinyl figurine, warm brown skin, dark hair in a neat ponytail, big warm smile, expressive eyes. She wears the company uniform: a charcoal-grey (#16191D) short-sleeve polo shirt with a golden-yellow (#E3A918) collar trim and a small embroidered round golden sun logo with a dark stylized wordmark on the left chest, dark work trousers and clean sneakers. No helmet, no solar panels. Soft studio lighting with a gentle warm golden rim light, subtle gloss, smooth clean 3D render, Pixar-like quality, no text other than the small chest logo, no watermark. POSE: facing the viewer, holding a clipboard with a blank document and a golden check mark (NO readable text) in one arm against her side, the other hand extended forward offering a handshake, welcoming expression. Transparent background (PNG). If transparency is not possible: plain flat solid white background, no shadows on the background.

**15. mascote-acenando.jpg — proporção 4:5 (1200×1500)** — vai no fechamento (formulário)
Cute stylized 3D cartoon doll character, a friendly young Brazilian woman, full body, standing, slightly large head and soft rounded proportions like a premium vinyl figurine, warm brown skin, dark hair in a neat ponytail, big warm smile, expressive eyes. She wears the company uniform: a charcoal-grey (#16191D) short-sleeve polo shirt with a golden-yellow (#E3A918) collar trim and a small embroidered round golden sun logo with a dark stylized wordmark on the left chest, dark work trousers and clean sneakers. No helmet, no solar panels. Soft studio lighting with a gentle warm golden rim light, subtle gloss, smooth clean 3D render, Pixar-like quality, no text other than the small chest logo, no watermark. POSE: facing the viewer, one hand raised waving hello, the other hand holding a modern smartphone showing a plain green chat screen (no logos, no text), cheerful open-mouth smile. Transparent background (PNG). If transparency is not possible: plain flat solid white background, no shadows on the background.

As imagens já foram geradas e estão em `public/media/` (JPG com fundo branco; o site remove o branco por CSS, e os originais ficam como `mascote-*-original.jpg`). O site já está preparado: enquanto o arquivo não existir, a mascote simplesmente não aparece (não quebra nada).
p