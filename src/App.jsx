import { useEffect, useRef, useState } from "react";

const TELEFONE = "5577999024800";
const wa = (texto) => `https://wa.me/${TELEFONE}?text=${encodeURIComponent(texto)}`;
const MSG_CLIENTE = "Olá! Quero simular minha economia na conta de energia com a Solares.";
const MSG_PARCEIRO = "Olá! Tenho uma usina de 30 a 75 kWp e quero saber como locar para a Solares.";

const limitar = (v, a, b) => (v < a ? a : v > b ? b : v);
const trecho = (p, a, b) => limitar((p - a) / (b - a), 0, 1);
const suave = (t) => 1 - Math.pow(1 - t, 3);
const brl = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Imagem gerada por IA (public/media). Sem o arquivo, entra um fundo de painel solar. */
function Media({ arquivo, proporcao, alt = "", className = "" }) {
  const [falhou, setFalhou] = useState(false);
  return (
    <div className={`media ${className}`} style={{ aspectRatio: proporcao }}>
      {falhou ? (
        <div className="media__painel" role="img" aria-label={alt} />
      ) : (
        <img src={`/media/${arquivo}`} alt={alt} loading="lazy" onError={() => setFalhou(true)} />
      )}
    </div>
  );
}

/* Vídeo em loop, sem som. Com movimento reduzido fica parado no quadro de capa. */
function VideoLoop({ arquivo, poster, proporcao, alt = "" }) {
  const ref = useRef(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (!reduzido()) v.play().catch(() => {});
  }, []);

  if (falhou) return <Media arquivo={poster} proporcao={proporcao} alt={alt} />;
  return (
    <div className="media" style={{ aspectRatio: proporcao }}>
      <video
        ref={ref}
        src={`/media/${arquivo}`}
        poster={`/media/${poster}`}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={alt}
        onError={() => setFalhou(true)}
      />
    </div>
  );
}

/* ---------- movimento-assinatura: a fatura que encolhe a cada cena ---------- */

const LINHAS_FATURA = ["Tarifa cheia", "Sem créditos", "Sem desconto", "Sem suporte"];
const FATURA_RISCADAS = [0, 0, 1, 2, 2, 3, 3, 4];
const FATURA_TOTAL = [100, 100, 92, 86, 80, 76, 76, 70];

function FaturaLateral() {
  const [cena, setCena] = useState(0);

  useEffect(() => {
    const alvos = [...document.querySelectorAll("[data-cena]")];
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) setCena(Number(e.target.dataset.cena));
        }),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);

  const riscadas = FATURA_RISCADAS[cena];
  const total = FATURA_TOTAL[cena];

  return (
    <aside className={`fatura-lado ${cena === 1 ? "fatura-lado--oculta" : ""}`} aria-hidden="true">
      <p className="fatura-lado__titulo">Sua conta · exemplo</p>
      <ul>
        {LINHAS_FATURA.map((l, i) => (
          <li key={l} className={i < riscadas ? "is-riscada" : ""}>
            {l}
          </li>
        ))}
      </ul>
      <div className="fatura-lado__barra">
        <span style={{ transform: `scaleX(${total / 100})` }} />
      </div>
      <p className="fatura-lado__total">{total === 70 ? "até −30%" : `${total}%`}</p>
    </aside>
  );
}

/* ---------- botão flutuante de WhatsApp ---------- */

function ZapFlutuante() {
  return (
    <a
      href={wa(MSG_CLIENTE)}
      className="zap"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Solares pelo WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.2 1.6 6.03L4 29l8.14-1.56a12.03 12.03 0 0 0 3.9.65C22.68 28.1 28 22.7 28 16.07 28 9.4 22.68 3 16.04 3Zm0 22.1c-1.2 0-2.38-.3-3.42-.88l-.5-.28-4.83.93.96-4.7-.3-.5a9.1 9.1 0 0 1-1.4-4.84c0-5.03 4.1-9.1 9.15-9.1 5.04 0 9.1 4.07 9.1 9.1 0 5.04-4.06 9.27-8.76 9.27Zm5-6.8c-.27-.14-1.62-.8-1.87-.9-.25-.09-.43-.13-.6.14-.19.27-.7.9-.86 1.08-.16.18-.32.2-.6.07-.27-.14-1.15-.42-2.2-1.35-.8-.72-1.35-1.6-1.5-1.87-.17-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.46-.83-2-.22-.52-.44-.45-.6-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.35.98 2.66 1.12 2.84.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.2 1.26.18 1.73.1.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.2-.52-.34Z" />
      </svg>
      <span>Fale conosco</span>
    </a>
  );
}

/* ---------- cabeçalho ---------- */

function Cabecalho() {
  return (
    <header className="cab">
      <a href="#topo" className="cab__logo" aria-label="Solares Energia Corporativa">
        <img src="/logo.png" alt="Solares Energia Corporativa" />
      </a>
      <nav className="cab__nav" aria-label="Principal">
        <a href="#parceiro" className="cab__link">Seja parceiro</a>
        <a href="#simular" className="botao botao--pequeno">Simular economia</a>
      </nav>
    </header>
  );
}

/* ---------- cena 1 · abertura ---------- */

function Abertura() {
  return (
    <section id="topo" className="abertura" data-cena="0" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="abertura__sol" aria-hidden="true">
        <div className="sol" data-fx-mouse="16" />
      </div>
      <div className="abertura__texto">
        <p className="rotulo" data-fx="surgir">Desconto de até 30% na conta de energia</p>
        <h1 data-fx="palavras">Sua energia pode custar menos.</h1>
        <p className="lead" data-fx="subir" data-fx-atraso="500">
          Economize sem precisar comprar sua própria usina solar. Créditos em energia e locação de usina, com
          planejamento para o seu consumo, monitoramento e manutenção especializada.
        </p>
        <div className="abertura__acoes" data-fx="subir" data-fx-atraso="700">
          <a href="#simular" className="botao">Quero simular minha economia</a>
          <a href={wa(MSG_CLIENTE)} className="link-simples" target="_blank" rel="noreferrer">
            Atendimento pelo WhatsApp
          </a>
        </div>
        <p className="nota" data-fx="surgir" data-fx-atraso="900">
          Sem investimento na compra da usina. Sujeito à análise de consumo, disponibilidade de créditos e
          condições contratuais.
        </p>
      </div>
      <div className="abertura__faixa" data-fx-paralaxe="0.06">
        <VideoLoop arquivo="hero-loop.mp4" poster="hero-usina.jpg" proporcao="21 / 9" alt="Usina solar ao entardecer" />
      </div>
    </section>
  );
}

/* ---------- cena 2 · PICO: a conta encolhe ---------- */

function Pico() {
  const secao = useRef(null);

  useEffect(() => {
    const s = secao.current;
    const q = (nome) => s.querySelector(`[data-ref="${nome}"]`);
    const el = {
      fatura: q("fatura"), riscoLinha: q("risco"), linhaAntiga: q("antiga"), linhaNova: q("nova"),
      total: q("total"), selo: q("selo"), c1: q("c1"), c2: q("c2"), c3: q("c3"), nota: q("nota"),
    };

    function desenhar(p) {
      const entra = suave(trecho(p, 0, 0.12));
      el.fatura.style.opacity = entra;
      el.fatura.style.transform = `translateY(${(1 - entra) * 40}px) scale(${0.94 + 0.06 * entra})`;

      el.riscoLinha.style.transform = `scaleX(${suave(trecho(p, 0.2, 0.45))})`;
      el.linhaAntiga.style.opacity = 1 - 0.65 * trecho(p, 0.3, 0.5);

      const nova = suave(trecho(p, 0.4, 0.6));
      el.linhaNova.style.opacity = nova;
      el.linhaNova.style.transform = `translateY(${(1 - nova) * 24}px)`;

      const valor = 1000 - 300 * suave(trecho(p, 0.4, 0.8));
      el.total.textContent = `R$ ${brl(valor)}`;
      el.total.classList.toggle("is-ouro", p > 0.4);

      const selo = suave(trecho(p, 0.55, 0.9));
      el.selo.style.opacity = trecho(p, 0.55, 0.7);
      el.selo.style.transform = `rotate(-6deg) scale(${0.7 + 0.3 * selo})`;

      el.c1.style.opacity = 1 - trecho(p, 0.25, 0.32);
      el.c2.style.opacity = trecho(p, 0.3, 0.38) * (1 - trecho(p, 0.66, 0.72));
      el.c3.style.opacity = trecho(p, 0.7, 0.78);
      el.nota.style.opacity = trecho(p, 0.82, 0.92);
    }

    if (reduzido()) {
      desenhar(1);
      return;
    }

    let agendado = false;
    function ler() {
      agendado = false;
      const percurso = s.offsetHeight - window.innerHeight;
      desenhar(percurso > 0 ? limitar(-s.getBoundingClientRect().top / percurso, 0, 1) : 0);
    }
    function aoRolar() {
      if (!agendado) {
        agendado = true;
        requestAnimationFrame(ler);
      }
    }
    desenhar(0);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    aoRolar();
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <section ref={secao} className="pico" data-cena="1" data-fx-fixa data-fx-altura="5" data-fx-fundo="#16191D" data-fx-tinta="#F6F1E7">
      <div className="fx-palco pico__palco">
        <div className="pico__texto">
          <div className="pico__legendas">
            <h2 data-ref="c1">Esta é a sua conta de energia hoje.</h2>
            <h2 data-ref="c2">A Solares corta o que pesa nela.</h2>
            <h2 data-ref="c3">A mesma energia. Até 30% menos.</h2>
          </div>
          <p className="nota nota--clara" data-ref="nota">
            Sem investimento na compra da usina. Sujeito à análise de consumo, disponibilidade de créditos e
            condições contratuais.
          </p>
        </div>

        <div className="pico__fatura-area">
          <div className="pico__fatura" data-ref="fatura">
            <p className="pico__cabeca">Fatura de energia · exemplo ilustrativo</p>
            <div className="pico__linha" data-ref="antiga">
              <span>Energia da distribuidora</span>
              <span className="mono">R$ 1.000,00</span>
              <i className="pico__risco" data-ref="risco" />
            </div>
            <div className="pico__linha pico__linha--nova" data-ref="nova">
              <span>Com a Solares</span>
              <span className="mono">R$ 700,00</span>
            </div>
            <div className="pico__total">
              <span>Total do mês</span>
              <strong className="mono" data-ref="total">R$ 1.000,00</strong>
            </div>
            <p className="pico__rodape">Valores ilustrativos. A economia real depende da análise da unidade consumidora.</p>
          </div>
          <div className="pico__selo" data-ref="selo" aria-label="até 30% de desconto">
            <span>até</span>
            <strong>30%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- cena 2b · a solução ---------- */

function Solucao() {
  return (
    <section className="solucao" data-cena="2" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="solucao__titulo">
        <p className="rotulo" data-fx="surgir">Créditos em Energia · Locação de Usina</p>
        <h2 data-fx="subir">Energia solar sem precisar comprar uma usina.</h2>
        <p className="lead" data-fx="subir" data-fx-atraso="150">
          Com a solução adequada ao seu perfil, sua empresa pode aproveitar os benefícios da geração de energia
          solar por meio de um modelo de compensação de créditos, quando elegível.
        </p>
      </div>
      <ul className="solucao__lista">
        {[
          "Sem necessidade de comprar uma usina própria.",
          "Análise personalizada do consumo de energia.",
          "Possibilidade de reduzir os gastos com eletricidade.",
          "Acompanhamento e suporte especializado.",
          "Uma alternativa sustentável para empresas e estabelecimentos comerciais.",
        ].map((t, i) => (
          <li key={t} data-fx="direita" data-fx-atraso={i * 110}>{t}</li>
        ))}
      </ul>
      <p className="nota solucao__nota" data-fx="surgir">
        As condições de adesão, a economia estimada e a disponibilidade dependem da análise da unidade consumidora,
        da distribuidora e das regras aplicáveis.
      </p>
      <div className="solucao__cta" data-fx="subir">
        <a href="#simular" className="botao">Simule sua economia</a>
        <a href={wa(MSG_CLIENTE)} className="link-simples" target="_blank" rel="noreferrer">Atendimento pelo WhatsApp</a>
      </div>
    </section>
  );
}

/* ---------- cena 3 · para quem é ---------- */

const PERFIS = [
  { arq: "perfil-comercio.jpg", nome: "Comércio e varejo", txt: "Supermercados, lojas, oficinas e centros comerciais." },
  { arq: "perfil-escritorio.jpg", nome: "Empresas e escritórios", txt: "Clínicas, consultórios, imobiliárias e prestadores de serviços." },
  { arq: "perfil-industria.jpg", nome: "Pequenas indústrias", txt: "Negócios com consumo de energia compatível com a modalidade oferecida." },
  { arq: "perfil-rural.jpg", nome: "Produtores rurais", txt: "Propriedades com perfil de consumo elegível e possibilidade de compensação." },
];

function ParaQuem() {
  return (
    <section className="quem" data-cena="3" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="quem__cab">
        <h2 data-fx="esquerda">Para quem é essa solução?</h2>
      </div>
      <div className="quem__grade">
        {PERFIS.map((p, i) => (
          <article key={p.nome} className={`perfil perfil--${i + 1}`} data-fx="subir" data-fx-atraso={(i % 2) * 160}>
            <Media arquivo={p.arq} proporcao="4 / 5" alt={p.nome} className="media--neutro" />
            <h3>{p.nome}</h3>
            <p>{p.txt}</p>
          </article>
        ))}
      </div>
      <div className="quem__cta" data-fx="subir">
        <p className="lead">Seu negócio se encaixa em algum desses perfis?</p>
        <a href="#simular" className="botao">Quero simular minha economia</a>
      </div>
    </section>
  );
}

/* ---------- cena 4 · como funciona ---------- */

const PASSOS = [
  ["Você informa seus dados.", "Envie sua conta de energia para uma avaliação inicial."],
  ["A Solares analisa seu consumo.", "Verificamos o perfil de utilização, a distribuidora e as condições para atendimento."],
  ["Você recebe uma proposta.", "Apresentamos as condições comerciais e a economia estimada, com os custos que permanecerão sob sua responsabilidade."],
  ["Após a contratação, começa o acompanhamento.", "A adesão e a compensação dependem das aprovações, dos cadastros e dos procedimentos aplicáveis."],
];

function ComoFunciona() {
  return (
    <section className="como" data-cena="4" data-fx-fixa data-fx-altura="4" data-fx-etapas="4" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="fx-palco como__palco">
        <p className="rotulo como__rotulo">Como funciona?</p>
        <div className="como__etapas">
          {PASSOS.map(([titulo, txt], i) => (
            <div className="fx-etapa como__etapa" key={titulo}>
              <span className="como__num">{i + 1}</span>
              <div>
                <h2>{titulo}</h2>
                <p className="lead">{txt}</p>
              </div>
            </div>
          ))}
        </div>
        <ol className="como__trilho" aria-hidden="true">
          <li /><li /><li /><li />
        </ol>
        <a href="#simular" className="botao como__cta">Enviar minha conta de energia</a>
      </div>
    </section>
  );
}

/* ---------- cena 5 · manutenção e monitoramento ---------- */

function Monitoramento() {
  const secao = useRef(null);
  const curva = useRef(null);
  const sol = useRef(null);
  const video = useRef(null);
  const painel = useRef(null);
  const [semVideo, setSemVideo] = useState(false);

  useEffect(() => {
    const c = curva.current;
    const v = video.current;
    const comprimento = c.getTotalLength();
    c.style.strokeDasharray = comprimento;

    function pintar(t) {
      c.style.strokeDashoffset = comprimento * (1 - t);
      const ponto = c.getPointAtLength(comprimento * t);
      sol.current.setAttribute("cx", ponto.x);
      sol.current.setAttribute("cy", ponto.y);
    }

    if (v) v.pause();

    if (reduzido()) {
      pintar(1);
      // sem movimento: o vídeo fica parado no último quadro
      if (v) v.addEventListener("loadedmetadata", () => { v.currentTime = Math.max(v.duration - 0.05, 0); });
      return;
    }
    pintar(0);

    // A animação roda uma vez, só quando o painel está bem à vista.
    // O vídeo toca do início ao fim e a curva se desenha junto com ele.
    let raf;
    function rodar() {
      let modo = v ? "aguarda" : "tempo";
      let inicio = performance.now();
      if (v) {
        v.currentTime = 0;
        v.play()
          .then(() => { modo = "video"; })
          .catch(() => { modo = "tempo"; inicio = performance.now(); });
      }
      function quadro(agora) {
        let t = 0;
        if (modo === "video") t = v.duration ? v.currentTime / v.duration : 0;
        if (modo === "tempo") t = (agora - inicio) / 6000; // sem vídeo: 6 s
        t = limitar(t, 0, 1);
        pintar(t);
        if (t < 1 && !(modo === "video" && v.ended)) raf = requestAnimationFrame(quadro);
        else pintar(1);
      }
      raf = requestAnimationFrame(quadro);
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0].isIntersecting) return;
        obs.disconnect();
        rodar();
      },
      // só dispara com o painel inteiro à vista (vídeo em cima e curva embaixo);
      // em telas baixas, onde ele não cabe, basta a maior parte dele
      { threshold: Math.min(0.95, (window.innerHeight * 0.85) / painel.current.offsetHeight) }
    );
    obs.observe(painel.current);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      if (v) v.pause();
    };
  }, []);

  return (
    <section ref={secao} className="monitor" data-cena="5" data-fx-fundo="#16191D" data-fx-tinta="#F6F1E7">
      <div className="monitor__texto">
        <p className="rotulo rotulo--claro" data-fx="surgir">Manutenção e monitoramento</p>
        <h2 data-fx="subir">A Solares cuida da usina. Você cuida do seu negócio.</h2>
        <ul className="monitor__lista">
          {[
            ["Administramos a operação", "A gestão da usina e dos créditos fica com a Solares."],
            ["Acompanhamos a geração", "Monitoramento da produção de energia da usina."],
            ["Fazemos a manutenção", "Realizada conforme o contrato."],
          ].map(([t, d], i) => (
            <li key={t} data-fx="subir" data-fx-atraso={i * 150}>
              <strong>{t}</strong>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <a href={wa(MSG_CLIENTE)} className="botao" target="_blank" rel="noreferrer" data-fx="subir" data-fx-atraso="450">
          Falar com a equipe da Solares
        </a>
      </div>
      <figure ref={painel} className="monitor__painel" data-fx="crescer" data-fx-atraso="200">
        {!semVideo && (
          <video
            ref={video}
            className="monitor__video"
            src="/media/geracao-timelapse.mp4"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setSemVideo(true)}
          />
        )}
        <figcaption>Curva ilustrativa de geração solar ao longo do dia</figcaption>
        <svg viewBox="0 0 600 320" role="img" aria-label="Gráfico ilustrativo: a geração solar sobe até o meio-dia e cai ao entardecer">
          {[60, 120, 180, 240].map((y) => (
            <line key={y} x1="20" x2="580" y1={y} y2={y} className="grade" />
          ))}
          <path d="M20 280 C 130 280, 170 50, 300 50 S 470 280, 580 280" className="curva-fundo" />
          <path ref={curva} d="M20 280 C 130 280, 170 50, 300 50 S 470 280, 580 280" className="curva" />
          <circle ref={sol} r="12" cx="20" cy="280" className="ponto" />
          <text x="20" y="312" className="eixo">6h</text>
          <text x="292" y="312" className="eixo">12h</text>
          <text x="560" y="312" className="eixo">18h</text>
        </svg>
      </figure>
    </section>
  );
}

/* ---------- cena 6 · seja parceiro ---------- */

function Parceiro() {
  return (
    <section id="parceiro" className="parceiro" data-cena="6" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="parceiro__img" data-fx="esquerda">
        <Media arquivo="parceiro-usina.jpg" proporcao="4 / 3" alt="Usina solar de pequeno porte" />
      </div>
      <div className="parceiro__texto">
        <p className="rotulo" data-fx="surgir">Seja parceiro da Solares</p>
        <h2 data-fx="subir">Tem uma usina de 30 a 75 kWp?</h2>
        <p className="lead" data-fx="subir" data-fx-atraso="120">
          Se você é proprietário de usina e tem interesse em locar seu ativo para a Solares, fale com a nossa equipe.
        </p>
        <a href={wa(MSG_PARCEIRO)} className="botao botao--escuro" target="_blank" rel="noreferrer" data-fx="subir" data-fx-atraso="240">
          Quero locar minha usina
        </a>
      </div>
    </section>
  );
}

/* ---------- cena 7 · fechamento ---------- */

function Fechamento() {
  const [campos, setCampos] = useState({ nome: "", cidade: "", valor: "", distribuidora: "", telefone: "" });
  const mudar = (e) => setCampos({ ...campos, [e.target.name]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    const texto =
      `Olá! Quero simular minha economia com a Solares.\n` +
      `Nome ou razão social: ${campos.nome}\n` +
      `Cidade e estado: ${campos.cidade}\n` +
      `Valor médio mensal da conta de energia: R$ ${campos.valor}\n` +
      `Distribuidora de energia: ${campos.distribuidora}\n` +
      `Telefone para contato: ${campos.telefone}`;
    window.open(wa(texto), "_blank", "noopener");
  }

  const campo = (name, rotulo, extra = {}) => (
    <label className="campo">
      <span>{rotulo}</span>
      <input name={name} value={campos[name]} onChange={mudar} required {...extra} />
    </label>
  );

  return (
    <section id="simular" className="fim" data-cena="7" data-fx-fundo="#16191D" data-fx-tinta="#F6F1E7">
      <div className="fim__texto">
        <p className="rotulo rotulo--claro" data-fx="surgir">Solares Energia Corporativa</p>
        <h2 data-fx="crescer">Sua empresa pode ir mais longe.</h2>
        <p className="lead" data-fx="subir" data-fx-atraso="150">
          Quer saber se sua empresa pode economizar? Preencha o formulário e envie as informações para a nossa equipe.
          A simulação é sem compromisso.
        </p>
        <p className="nota nota--clara" data-fx="surgir" data-fx-atraso="250">
          A Solares analisa seu perfil de consumo e apresenta uma proposta personalizada, com acompanhamento comercial
          e suporte especializado.
        </p>
      </div>
      <form className="fim__form" onSubmit={enviar} data-fx="subir" data-fx-atraso="200">
        {campo("nome", "Nome ou razão social", { autoComplete: "organization" })}
        {campo("cidade", "Cidade e estado", { placeholder: "Ex.: Brumado, BA" })}
        {campo("valor", "Valor médio mensal da conta (R$)", { inputMode: "decimal" })}
        {campo("distribuidora", "Distribuidora de energia")}
        {campo("telefone", "Telefone para contato", { type: "tel", autoComplete: "tel" })}
        <button type="submit" className="botao botao--bloco">Quero simular minha economia</button>
        <p className="nota nota--clara">Ao enviar, abrimos o WhatsApp com as suas informações preenchidas.</p>
      </form>

      <footer className="rodape">
        <div className="rodape__logo"><img src="/logo.png" alt="Solares Energia Corporativa" /></div>
        <div>
          <p>Energia renovável, planejamento e atendimento especializado.</p>
          <p>Atendemos toda a Bahia.</p>
        </div>
        <div>
          <p><a href="tel:+5577999024800">(77) 99902-4800</a></p>
          <p>Rua Maranhão, 200, Jardim Brasil, Brumado/BA</p>
        </div>
        <p className="rodape__copy">www.solarescorporativa.com.br © 2026. Todos os direitos reservados.</p>
      </footer>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Cabecalho />
      <FaturaLateral />
      <ZapFlutuante />
      <main>
        <Abertura />
        <Pico />
        <Solucao />
        <ParaQuem />
        <ComoFunciona />
        <Monitoramento />
        <Parceiro />
        <Fechamento />
      </main>
    </>
  );
}
