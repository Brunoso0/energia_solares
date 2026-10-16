/*!
 * Sites Incríveis — motor de rolagem
 * © 2026 Enzo Barbatto — Sparo Automações. Uso conforme LICENCA.md.
 *
 * A página declara efeitos com atributos data-fx-*; o motor observa a
 * rolagem e anima. Nada aqui conhece o conteúdo da página: comportamento
 * sob medida deve viver em <script> da própria página, nunca neste arquivo.
 */
(function () {
  "use strict";

  var doc = document;
  var raiz = doc.documentElement;
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzido) raiz.classList.add("fx-reduzido");

  /* ---------- utilidades ---------- */

  function limitar(v, min, max) { return v < min ? min : v > max ? max : v; }

  function interpolar(a, b, t) { return a + (b - a) * t; }

  // "0,-200" -> [0, -200]; "0.4" -> [0.4, 0.4]
  function lerPar(texto, padraoA, padraoB) {
    if (!texto) return [padraoA, padraoB];
    var partes = String(texto).split(",");
    var a = parseFloat(partes[0]);
    var b = partes.length > 1 ? parseFloat(partes[1]) : a;
    if (isNaN(a)) a = padraoA;
    if (isNaN(b)) b = padraoB;
    return [a, b];
  }

  function formatarNumero(valor, decimais) {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: decimais,
      maximumFractionDigits: decimais
    });
  }

  /* ---------- 1. Revelações ao entrar na tela ---------- */
  // data-fx="surgir | subir | esquerda | direita | crescer | palavras | digitar | contar"
  // extras: data-fx-atraso="200" (ms)  data-fx-duracao="900" (ms)

  var REVELACOES = ["surgir", "subir", "esquerda", "direita", "crescer", "palavras", "digitar", "contar"];

  function prepararPalavras(el) {
    var texto = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", texto);
    texto.split(/(\s+)/).forEach(function (pedaco) {
      if (/^\s+$/.test(pedaco)) {
        el.appendChild(doc.createTextNode(pedaco));
      } else if (pedaco) {
        var s = doc.createElement("span");
        s.className = "fx-palavra";
        s.setAttribute("aria-hidden", "true");
        s.textContent = pedaco;
        el.appendChild(s);
      }
    });
  }

  function animarPalavras(el) {
    var palavras = el.querySelectorAll(".fx-palavra");
    var passo = parseFloat(el.dataset.fxDuracao || 700) / Math.max(palavras.length, 1);
    palavras.forEach(function (p, i) {
      p.style.transitionDelay = Math.round(i * passo) + "ms";
    });
  }

  function animarDigitar(el) {
    var texto = el.dataset.fxTexto;
    var duracao = parseFloat(el.dataset.fxDuracao || 1400);
    var inicio = null;
    el.classList.add("fx-digitando");
    function quadro(t) {
      if (inicio === null) inicio = t;
      var prog = limitar((t - inicio) / duracao, 0, 1);
      el.textContent = texto.slice(0, Math.round(texto.length * prog));
      if (prog < 1) requestAnimationFrame(quadro);
      else el.classList.remove("fx-digitando");
    }
    requestAnimationFrame(quadro);
  }

  function animarContar(el) {
    var fim = parseFloat(el.dataset.fxFim || el.dataset.fxValor || "0");
    var comeco = parseFloat(el.dataset.fxInicio || "0");
    var decimais = parseInt(el.dataset.fxDecimais || "0", 10);
    var prefixo = el.dataset.fxPrefixo || "";
    var sufixo = el.dataset.fxSufixo || "";
    var duracao = parseFloat(el.dataset.fxDuracao || 1600);
    var inicio = null;
    function quadro(t) {
      if (inicio === null) inicio = t;
      var prog = limitar((t - inicio) / duracao, 0, 1);
      var suave = 1 - Math.pow(1 - prog, 3); // desacelera no final
      el.textContent = prefixo + formatarNumero(interpolar(comeco, fim, suave), decimais) + sufixo;
      if (prog < 1) requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
  }

  function armarRevelacoes() {
    var alvos = [];
    REVELACOES.forEach(function (nome) {
      doc.querySelectorAll('[data-fx="' + nome + '"]').forEach(function (el) {
        alvos.push(el);
      });
    });

    alvos.forEach(function (el) {
      var tipo = el.dataset.fx;
      if (tipo === "palavras") prepararPalavras(el);
      if (tipo === "digitar" && el.dataset.fxTexto === undefined) {
        el.dataset.fxTexto = el.textContent;
        el.textContent = "";
        el.style.minHeight = "1em";
      }
      if (el.dataset.fxAtraso) el.style.transitionDelay = el.dataset.fxAtraso + "ms";
      if (el.dataset.fxDuracao && tipo !== "palavras" && tipo !== "digitar" && tipo !== "contar") {
        el.style.transitionDuration = el.dataset.fxDuracao + "ms";
      }
    });

    if (reduzido) {
      alvos.forEach(function (el) {
        el.classList.add("fx-em-cena");
        var tipo = el.dataset.fx;
        if (tipo === "digitar") el.textContent = el.dataset.fxTexto;
        if (tipo === "contar") {
          el.textContent = (el.dataset.fxPrefixo || "") +
            formatarNumero(parseFloat(el.dataset.fxFim || el.dataset.fxValor || "0"),
              parseInt(el.dataset.fxDecimais || "0", 10)) +
            (el.dataset.fxSufixo || "");
        }
      });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        observador.unobserve(el);
        var tipo = el.dataset.fx;
        if (tipo === "palavras") animarPalavras(el);
        el.classList.add("fx-em-cena");
        if (tipo === "digitar") animarDigitar(el);
        if (tipo === "contar") animarContar(el);
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

    alvos.forEach(function (el) { observador.observe(el); });
  }

  /* ---------- 2. Cenas fixas com progresso ---------- */
  // <section data-fx-fixa data-fx-altura="3">
  //   <div class="fx-palco"> ...conteúdo que fica preso na tela... </div>
  // </section>
  //
  // Enquanto a cena está presa, o motor publica --progresso (0 a 1) na seção.
  // Filhos reagem com:
  //   data-fx-x="inicio,fim"          translateX em px
  //   data-fx-y="inicio,fim"          translateY em px
  //   data-fx-escala="inicio,fim"     scale
  //   data-fx-giro="inicio,fim"       rotate em graus
  //   data-fx-opacidade="inicio,fim"
  //   data-fx-faixa="0.2,0.7"         só anima dentro desse trecho do progresso
  //   data-fx="rolar-video"           <video> avança com a rolagem
  //   data-fx="trilho"                fileira horizontal desliza inteira
  //   data-fx-etapas="4"              seção ganha data-etapa="1..4" (CSS decide o resto)

  var cenas = [];

  function armarCenas() {
    doc.querySelectorAll("[data-fx-fixa]").forEach(function (secao) {
      var altura = parseFloat(secao.dataset.fxAltura || "3");
      secao.style.height = (altura * 100) + "vh";

      var atores = [];
      secao.querySelectorAll("[data-fx-x],[data-fx-y],[data-fx-escala],[data-fx-giro],[data-fx-opacidade]").forEach(function (el) {
        atores.push({
          el: el,
          x: el.dataset.fxX !== undefined ? lerPar(el.dataset.fxX, 0, 0) : null,
          y: el.dataset.fxY !== undefined ? lerPar(el.dataset.fxY, 0, 0) : null,
          escala: el.dataset.fxEscala !== undefined ? lerPar(el.dataset.fxEscala, 1, 1) : null,
          giro: el.dataset.fxGiro !== undefined ? lerPar(el.dataset.fxGiro, 0, 0) : null,
          opacidade: el.dataset.fxOpacidade !== undefined ? lerPar(el.dataset.fxOpacidade, 1, 1) : null,
          faixa: lerPar(el.dataset.fxFaixa, 0, 1)
        });
      });

      var video = secao.querySelector('[data-fx="rolar-video"]');
      if (video) {
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.pause();
      }

      var trilho = secao.querySelector('[data-fx="trilho"]');
      var etapas = parseInt(secao.dataset.fxEtapas || "0", 10);

      cenas.push({
        secao: secao,
        atores: atores,
        video: video,
        videoAlvo: 0,
        trilho: trilho,
        etapas: etapas
      });

      if (reduzido) {
        secao.style.height = "auto";
        if (etapas) secao.setAttribute("data-etapa", String(etapas));
      }
    });
  }

  function progressoNaFaixa(prog, faixa) {
    if (prog <= faixa[0]) return 0;
    if (prog >= faixa[1]) return 1;
    return (prog - faixa[0]) / (faixa[1] - faixa[0]);
  }

  function atualizarCena(cena) {
    var ret = cena.secao.getBoundingClientRect();
    var percurso = cena.secao.offsetHeight - window.innerHeight;
    if (percurso <= 0) return;
    var prog = limitar(-ret.top / percurso, 0, 1);
    cena.secao.style.setProperty("--progresso", prog.toFixed(4));

    cena.atores.forEach(function (ator) {
      var p = progressoNaFaixa(prog, ator.faixa);
      var transformar = "";
      if (ator.x) transformar += "translateX(" + interpolar(ator.x[0], ator.x[1], p).toFixed(2) + "px) ";
      if (ator.y) transformar += "translateY(" + interpolar(ator.y[0], ator.y[1], p).toFixed(2) + "px) ";
      if (ator.escala) transformar += "scale(" + interpolar(ator.escala[0], ator.escala[1], p).toFixed(4) + ") ";
      if (ator.giro) transformar += "rotate(" + interpolar(ator.giro[0], ator.giro[1], p).toFixed(2) + "deg) ";
      if (transformar) ator.el.style.transform = transformar.trim();
      if (ator.opacidade) ator.el.style.opacity = interpolar(ator.opacidade[0], ator.opacidade[1], p).toFixed(3);
    });

    if (cena.video && cena.video.duration) {
      cena.videoAlvo = prog * cena.video.duration;
    }

    if (cena.trilho) {
      var alcance = cena.trilho.scrollWidth - cena.trilho.clientWidth;
      if (alcance > 0) {
        cena.trilho.style.transform = "translateX(" + (-prog * alcance).toFixed(1) + "px)";
      }
    }

    if (cena.etapas) {
      var etapa = limitar(Math.floor(prog * cena.etapas) + 1, 1, cena.etapas);
      if (cena.secao.getAttribute("data-etapa") !== String(etapa)) {
        cena.secao.setAttribute("data-etapa", String(etapa));
      }
    }
  }

  // vídeo: aproxima suavemente do alvo pra rolagem não "pular" quadros
  function atualizarVideos() {
    cenas.forEach(function (cena) {
      if (!cena.video || !cena.video.duration) return;
      var atual = cena.video.currentTime;
      var delta = cena.videoAlvo - atual;
      if (Math.abs(delta) > 0.01) {
        cena.video.currentTime = atual + delta * 0.35;
      }
    });
  }

  /* ---------- 3. Fundo que viaja ---------- */
  // Qualquer seção com data-fx-fundo="#111" (e opcional data-fx-tinta="#eee"):
  // quando ela domina a tela, o fundo da página faz a transição para essa cor.

  function armarFundos() {
    var secoes = doc.querySelectorAll("[data-fx-fundo]");
    if (!secoes.length) return;
    raiz.classList.add("fx-fundo-ativo");
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        raiz.style.setProperty("--fx-fundo", entrada.target.dataset.fxFundo);
        if (entrada.target.dataset.fxTinta) {
          raiz.style.setProperty("--fx-tinta", entrada.target.dataset.fxTinta);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    secoes.forEach(function (s) { observador.observe(s); });
  }

  /* ---------- 4. Paralaxe leve (fora das cenas fixas) ---------- */
  // data-fx-paralaxe="0.2"  → desloca contra a rolagem (0.1 sutil, 0.4 forte)

  var paralaxes = [];

  function armarParalaxes() {
    doc.querySelectorAll("[data-fx-paralaxe]").forEach(function (el) {
      if (el.closest("[data-fx-fixa]")) return; // dentro de cena fixa use data-fx-y
      paralaxes.push({ el: el, forca: parseFloat(el.dataset.fxParalaxe) || 0.2 });
    });
  }

  function atualizarParalaxes() {
    var centroTela = window.innerHeight / 2;
    paralaxes.forEach(function (p) {
      var ret = p.el.getBoundingClientRect();
      var desvio = (ret.top + ret.height / 2 - centroTela) * -p.forca;
      p.el.style.transform = "translateY(" + desvio.toFixed(1) + "px)";
    });
  }

  /* ---------- 5. Reação ao ponteiro ---------- */
  // data-fx-mouse="12" → o elemento acompanha de leve o ponteiro (px máximos)

  function armarMouse() {
    var alvos = doc.querySelectorAll("[data-fx-mouse]");
    if (!alvos.length || reduzido || !window.matchMedia("(pointer: fine)").matches) return;
    window.addEventListener("pointermove", function (e) {
      var nx = (e.clientX / window.innerWidth) * 2 - 1;
      var ny = (e.clientY / window.innerHeight) * 2 - 1;
      alvos.forEach(function (el) {
        var forca = parseFloat(el.dataset.fxMouse) || 10;
        el.style.transform = "translate(" + (nx * forca).toFixed(1) + "px," + (ny * forca).toFixed(1) + "px)";
      });
    }, { passive: true });
  }

  /* ---------- ciclo principal ---------- */

  var agendado = false;

  function atualizar() {
    agendado = false;
    cenas.forEach(atualizarCena);
    atualizarParalaxes();
  }

  function aoRolar() {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(atualizar);
    }
  }

  function iniciar() {
    armarRevelacoes();
    armarCenas();
    armarFundos();
    armarParalaxes();
    armarMouse();

    if (!reduzido) {
      window.addEventListener("scroll", aoRolar, { passive: true });
      window.addEventListener("resize", aoRolar);
      aoRolar();
      // laço só para suavizar vídeo (barato; dorme se não há vídeo)
      if (cenas.some(function (c) { return c.video; })) {
        (function laco() {
          atualizarVideos();
          requestAnimationFrame(laco);
        })();
      }
    }
    raiz.classList.add("fx-pronto");
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
