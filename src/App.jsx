import { useEffect, useRef, useState } from "react";
import logosParceiros from "virtual:logos-parceiros"; // tudo que está em public/logos-parceiros

const TELEFONE = "5577999629654";
const wa = (texto) => `https://wa.me/${TELEFONE}?text=${encodeURIComponent(texto)}`;
const MSG_CLIENTE = "Olá! Quero simular minha economia na conta de energia com a Solares.";
const MSG_PARCEIRO = "Olá! Tenho uma usina de 10 a 75 kWp e quero saber como locar para a Solares.";

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

/* Mascote da Solares (public/media/mascote-*.jpg, 4:5, fundo branco: o CSS usa multiply para sumir com o branco). Sem o arquivo, não aparece. */
function Mascote({ pose, className = "", atraso = 0, alt = "" }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;
  return (
    <img
      className={`mascote ${className}`}
      src={`/media/mascote-${pose}.jpg`}
      width="1200"
      height="1500"
      alt={alt}
      aria-hidden={alt ? undefined : "true"}
      loading="lazy"
      data-fx="surgir"
      data-fx-atraso={atraso}
      onError={() => setFalhou(true)}
    />
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

const MENU = [
  ["calculadora", "Calculadora"],
  ["solucao", "Solução"],
  ["para-quem", "Para quem"],
  ["como-funciona", "Como funciona"],
  ["monitoramento", "Monitoramento"],
  ["parceiro", "Seja parceiro"],
];

function Cabecalho() {
  const [ativo, setAtivo] = useState("");
  const [aberto, setAberto] = useState(false); // menu hambúrguer (celular e tablet)
  const cab = useRef(null);

  // fecha com Esc ou com um toque fora do cabeçalho
  useEffect(() => {
    if (!aberto) return;
    const esc = (e) => e.key === "Escape" && setAberto(false);
    const fora = (e) => cab.current && !cab.current.contains(e.target) && setAberto(false);
    window.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", fora);
    return () => { window.removeEventListener("keydown", esc); document.removeEventListener("pointerdown", fora); };
  }, [aberto]);

  // destaca no menu a seção que está no meio da tela
  useEffect(() => {
    // observa todas as cenas: as que não estão no menu (abertura, pico, formulário) limpam o destaque
    const alvos = [...document.querySelectorAll("[data-cena]")];
    const noMenu = new Set(MENU.map(([id]) => id));
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) setAtivo(noMenu.has(e.target.id) ? e.target.id : "");
        }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);

  return (
    <header className="cab" ref={cab}>
      <a href="#topo" className="cab__logo" aria-label="Solares Energia Corporativa">
        <img src="/logo.png" alt="Solares Energia Corporativa" />
      </a>
      <nav className="cab__nav" aria-label="Principal">
        {MENU.map(([id, rotulo]) => (
          <a key={id} href={`#${id}`} className={`cab__link ${ativo === id ? "is-ativo" : ""}`}>
            {rotulo}
          </a>
        ))}
        <a href="#simular" className="botao botao--pequeno" onClick={() => setAberto(false)}>Simular economia</a>
      </nav>
      <button
        type="button"
        className={`cab__burger ${aberto ? "is-aberto" : ""}`}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => setAberto((v) => !v)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav id="menu-mobile" className={`cab__menu ${aberto ? "is-aberto" : ""}`} aria-label="Seções do site" hidden={!aberto}>
        {MENU.map(([id, rotulo]) => (
          <a key={id} href={`#${id}`} className={ativo === id ? "is-ativo" : ""} onClick={() => setAberto(false)}>
            {rotulo}
          </a>
        ))}
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
        <p className="rotulo" data-fx="surgir">Sua energia pode custar menos</p>
        <h1 data-fx="palavras">Desconto de até 30% na sua conta de energia.</h1>
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

/* ---------- cena 2b · a solução ---------- */

/* ---------- cena 2a · calculadora de economia ----------
   O único número real da Solares é o desconto de "até 30%". A conta usa esse teto
   e todos os valores aparecem como "de até", nunca como promessa. */

const DESCONTO_MAX = 0.3;
const reais = (v) => `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
const FAIXA = { min: 150, max: 10000 };

function Calculadora() {
  const [valor, setValor] = useState(1000);

  const mudarTexto = (e) => {
    const n = Number(e.target.value.replace(/\D/g, ""));
    setValor(Math.min(n, 1000000));
  };

  const economiaMes = valor * DESCONTO_MAX;
  const nova = valor - economiaMes;
  const progresso = limitar((valor - FAIXA.min) / (FAIXA.max - FAIXA.min), 0, 1) * 100;

  // leva o valor calculado para o campo do formulário de simulação
  const pedir = () => window.dispatchEvent(new CustomEvent("solares:valor", { detail: valor }));

  return (
    <section id="calculadora" className="calc" data-cena="1" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
      <div className="calc__cab">
        <p className="rotulo" data-fx="surgir">Calculadora de economia</p>
        <h2 data-fx="subir">Descubra quanto você pode economizar.</h2>
        <p className="lead" data-fx="subir" data-fx-atraso="120">
          Arraste a barra ou digite o valor médio da sua conta de energia e veja uma estimativa com o desconto de até
          30% da Solares.
        </p>
      </div>

      <Mascote pose="apontando" className="mascote--calc" atraso={200} />

      <div className="calc__grade">
        <div className="calc__entrada" data-fx="esquerda">
          <label className="calc__rotulo" htmlFor="calc-valor">Sua conta de luz atual (por mês)</label>
          <div className="calc__valor">
            <span aria-hidden="true">R$</span>
            <input
              id="calc-valor"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={valor ? valor.toLocaleString("pt-BR") : ""}
              placeholder="0"
              onChange={mudarTexto}
            />
          </div>
          <input
            className="calc__barra"
            type="range"
            min={FAIXA.min}
            max={FAIXA.max}
            step="10"
            value={limitar(valor, FAIXA.min, FAIXA.max)}
            onChange={(e) => setValor(Number(e.target.value))}
            style={{ "--p": `${progresso}%` }}
            aria-label="Valor médio da sua conta de energia"
          />
          <div className="calc__escala" aria-hidden="true">
            <span>R$ 150</span>
            <span>R$ 5.000</span>
            <span>R$ 10.000+</span>
          </div>
          <ul className="calc__pontos calc__pontos--claro">
            <li><strong>Sem comprar usina</strong><span>Sem investimento na compra da usina.</span></li>
            <li><strong>Análise do consumo</strong><span>Proposta personalizada para o seu perfil.</span></li>
            <li><strong>Suporte especializado</strong><span>Acompanhamento comercial e monitoramento.</span></li>
          </ul>
        </div>

        <div className="calc__resultado" data-fx="direita" aria-live="polite">
          <p className="calc__selo">Estimativa com desconto de até 30%</p>
          <p className="calc__rot">Nova conta estimada, a partir de</p>
          <p className="calc__nova mono">
            <span>R$</span>
            <strong>{nova.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </p>
          <div className="calc__duas">
            <div>
              <p className="calc__rot">Economia mensal de até</p>
              <p className="calc__num mono">{reais(economiaMes)}</p>
            </div>
            <div>
              <p className="calc__rot">Economia anual de até</p>
              <p className="calc__num mono">{reais(economiaMes * 12)}</p>
            </div>
          </div>
          <a href="#simular" className="botao calc__cta" onClick={pedir}>Quero esse desconto</a>
          <ul className="calc__pontos calc__pontos--escuro">
            <li><strong>Sem comprar usina</strong><span>Sem investimento na compra da usina.</span></li>
            <li><strong>Análise do consumo</strong><span>Proposta personalizada para o seu perfil.</span></li>
            <li><strong>Suporte especializado</strong><span>Acompanhamento comercial e monitoramento.</span></li>
          </ul>
        </div>
      </div>

      <p className="lead calc__nota">Com a Solares, você economiza até 30% no custo da energia!</p>
    </section>
  );
}

/* ---------- faixa de empresas que já usam a energia da Solares ----------
   Em loop contínuo. As imagens vêm sozinhas da pasta public/logos-parceiros (ver vite.config.js). */

const LARGURA_ITEM = 184; // largura média do cartão + espaço, só para dimensionar a faixa
const PX_POR_SEGUNDO = 60;

function FaixaEmpresas() {
  const n = logosParceiros.length;
  if (!n) return null;
  // repete a lista até um grupo ser mais largo que qualquer tela; o segundo grupo é cópia para o loop
  const copias = Math.max(1, Math.ceil(5200 / (n * LARGURA_ITEM)));
  const duracao = Math.round((n * copias * LARGURA_ITEM) / PX_POR_SEGUNDO);
  const grupo = (g) =>
    Array.from({ length: copias }, (_, c) =>
      logosParceiros.map((src, i) => {
        const copia = g > 0 || c > 0;
        return (
          <li key={g + "-" + c + "-" + i} className={"faixa__item" + (copia ? " faixa__item--copia" : "")} aria-hidden={copia ? "true" : undefined}>
            <img src={src} alt="" loading="lazy" decoding="async" draggable="false" />
          </li>
        );
      })
    );
  return (
    <section id="clientes" className="faixa" aria-label="Empresas que já usam a energia da Solares">
      <div className="faixa__cab">
        <p className="rotulo" data-fx="surgir">Quem já usa</p>
        <h2 data-fx="subir">Empresas que já usam a energia da Solares.</h2>
      </div>
      <div className="faixa__pista">
        <ul className="faixa__trilho" style={{ "--duracao": duracao + "s" }}>
          {grupo(0)}
          {grupo(1)}
        </ul>
      </div>
    </section>
  );
}

function Solucao() {
  return (
    <section id="solucao" className="solucao" data-cena="2" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
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
    <section id="para-quem" className="quem" data-cena="3" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
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
    <section id="como-funciona" className="como" data-cena="4" data-fx-fixa data-fx-altura="4" data-fx-etapas="4" data-fx-fundo="#F6F1E7" data-fx-tinta="#16191D">
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
              <Mascote pose="fatura" className="mascote--etapa" />
            </div>
          ))}
        </div>
        <ol className="como__trilho" aria-hidden="true">
          <li /><li /><li /><li />
        </ol>
        <a href="#simular" className="botao como__cta">Enviar minha conta de energia</a>
        <Mascote pose="fatura" className="mascote--como" />
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
    <section id="monitoramento" ref={secao} className="monitor" data-cena="5" data-fx-fundo="#16191D" data-fx-tinta="#F6F1E7">
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
        <h2 data-fx="subir">Tem uma usina de 10 a 75 kWp?</h2>
        <p className="lead" data-fx="subir" data-fx-atraso="120">
          Se você é proprietário de usina e tem interesse em locar seu ativo para a Solares, fale com a nossa equipe.
        </p>
        <a href={wa(MSG_PARCEIRO)} className="botao botao--escuro" target="_blank" rel="noreferrer" data-fx="subir" data-fx-atraso="240">
          Quero locar minha usina
        </a>
        <Mascote pose="contrato" className="mascote--parceiro" atraso={300} />
      </div>
    </section>
  );
}

/* ---------- cena 7 · fechamento ---------- */

function Fechamento() {
  const [campos, setCampos] = useState({ nome: "", cidade: "", valor: "", distribuidora: "", telefone: "" });
  const mudar = (e) => setCampos({ ...campos, [e.target.name]: e.target.value });

  // a calculadora envia o valor da conta para este campo
  useEffect(() => {
    const receber = (e) => setCampos((c) => ({ ...c, valor: String(e.detail) }));
    window.addEventListener("solares:valor", receber);
    return () => window.removeEventListener("solares:valor", receber);
  }, []);

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
    </section>
  );
}

/* ---------- rodapé ----------
   Padrão: faixa clara com as logos originais (transparentes, sem placa).
   Para comparar com o cliente: abrir com ?logos=claras mostra o rodapé escuro
   com as versões em off-white. */

function Rodape() {
  const claras = new URLSearchParams(window.location.search).get("logos") === "claras";
  return (
    <footer className={`rodape ${claras ? "rodape--escuro" : ""}`}>
      <div className="rodape__logos">
        <img
          className="rodape__logo-energia"
          src={claras ? "/logo-claro.png" : "/logo.png"}
          width="611"
          height="400"
          alt="Solares Energia Corporativa"
        />
        <img
          className="rodape__logo-incorp"
          src={claras ? "/logo-completo-claro.png" : "/logo-completo.png"}
          width="1236"
          height="960"
          alt="Solares Incorporadora"
        />
      </div>
      <div>
        <p>Energia renovável, planejamento e atendimento especializado.</p>
        <p>Atendemos toda a Bahia.</p>
      </div>
      <div>
        <p><a href="tel:+5577999629654">(77) 99962-9654</a></p>
        <p>Rua Maranhão, 200, Jardim Brasil, Brumado/BA</p>
      </div>
      <p className="rodape__copy">www.solarescorporativa.com.br © 2026. Todos os direitos reservados.</p>
    </footer>
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
        <Calculadora />
        <FaixaEmpresas />
        <Solucao />
        <ParaQuem />
        <ComoFunciona />
        <Monitoramento />
        <Parceiro />
        <Fechamento />
        <Rodape />
      </main>
    </>
  );
}
