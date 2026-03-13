document.addEventListener("DOMContentLoaded", function () {
	const briefingForm = document.getElementById("briefingForm");
	if (briefingForm) {
		briefingForm.addEventListener("submit", function (e) {
			e.preventDefault();
			// Coletar dados do formulário
			const nome = document.getElementById("briefing-name").value;
			const email = document.getElementById("briefing-email").value;
			const whatsapp = document.getElementById("briefing-whatsapp").value;
			const empresa = document.getElementById("briefing-company").value;
			const segmento = document.getElementById("briefing-segment").value;
			const hasSite = document.getElementById("briefing-has-site").value;
			const objetivo = document.getElementById("briefing-goal").value;
			const paginas = document.getElementById("briefing-pages").value;
			const referencias = document.getElementById("briefing-references").value;
			const prazo = document.getElementById("briefing-deadline").value;
			const orcamento = document.getElementById("briefing-budget").value;
			const observacoes = document.getElementById("briefing-notes").value;
			// Montar corpo do e-mail
			let corpo =
				`Nome: ${nome}%0D%0A` +
				`Email: ${email}%0D%0A` +
				`WhatsApp: ${whatsapp}%0D%0A` +
				`Empresa: ${empresa}%0D%0A` +
				`Segmento: ${segmento}%0D%0A` +
				`Já possui site?: ${hasSite}%0D%0A` +
				`Objetivo do site: ${objetivo}%0D%0A` +
				`Páginas desejadas: ${paginas}%0D%0A` +
				`Sites de referência: ${referencias}%0D%0A` +
				`Prazo desejado: ${prazo}%0D%0A` +
				`Orçamento estimado: ${orcamento}%0D%0A` +
				`Observações: ${observacoes}`;
			// Abrir mailto
			const mailto = `mailto:devsix.landingpages@gmail.com?subject=Briefing%20Landing%20Page%20-%20${encodeURIComponent(nome)}&body=${corpo}`;
			window.location.href = mailto;
		});
	}
});

const modelos = [
	{
		title: "Landing de Alta Conversao",
		description: "Template estrategico com foco em captura de leads, carregamento rapido e secoes claras para guiar o visitante ate a acao principal.",
		type: "image",
		src: "./img/modelo1.jpg",
		alt: "Modelo de landing page para vendas"
	},
	{
		title: "Institucional Premium",
		description: "Layout equilibrado para apresentar marca, servicos e diferenciais com visual elegante e leitura fluida em desktop e mobile.",
		type: "image",
		src: "./img/modelo2.jpg",
		alt: "Modelo institucional premium"
	},
	{
		title: "E-commerce Start",
		description: "Estrutura inicial para produtos digitais e fisicos, destacando oferta, prova social e bloco de CTA para facilitar a conversao.",
		type: "image",
		src: "./img/modelo3.jpg",
		alt: "Modelo e-commerce start"
	},
	{
		title: "Modelo em Video",
		description: "Versao animada para apresentar experiencia real do projeto e demonstrar navegacao com mais impacto visual.",
		type: "video",
		src: "./img/logincaue.mp4",
		poster: "./img/logincaue-img.png"
	}
];

const mediaContainer = document.getElementById("modelo-media");
const titleElement = document.getElementById("modelo-titulo");
const descriptionElement = document.getElementById("modelo-descricao");
const headerPanel = document.getElementById("modelo-header-panel");
const infoPanel = document.getElementById("modelo-info-panel");
const prevMediaContainer = document.getElementById("modelo-prev-media");
const nextMediaContainer = document.getElementById("modelo-next-media");
const enterLeftMediaContainer = document.getElementById("modelo-enter-left-media");
const enterRightMediaContainer = document.getElementById("modelo-enter-right-media");
const dotsContainer = document.getElementById("modelos-dots");
const prevButton = document.getElementById("modelos-prev");
const nextButton = document.getElementById("modelos-next");
const carouselRoot = document.querySelector(".modelos-carousel");
const stageElement = document.getElementById("modelos-stage");

if (
	mediaContainer &&
	titleElement &&
	descriptionElement &&
	headerPanel &&
	infoPanel &&
	prevMediaContainer &&
	nextMediaContainer &&
	enterLeftMediaContainer &&
	enterRightMediaContainer &&
	dotsContainer &&
	prevButton &&
	nextButton &&
	stageElement
) {
	let modeloAtual = 0;
	let autoPlayTimer = null;
	let isAnimating = false;
	const AUTO_PLAY_DELAY = 5000;
	const TRANSITION_DURATION = 560;
	const MOBILE_TRANSITION_OUT_MS = 220;
	const SWIPE_MIN_DISTANCE = 42;
	const SWIPE_MAX_VERTICAL = 34;
	let touchStartX = null;
	let touchStartY = null;
	let mobileTransitionDirection = "next";

	function getIndiceCircular(index) {
		return (index + modelos.length) % modelos.length;
	}

	function montarMidia(modelo, isPreview = false) {
		if (modelo.type === "video" && !isPreview) {
			return `
				<video autoplay loop muted playsinline poster="${modelo.poster}" aria-label="${modelo.title}">
					<source src="${modelo.src}" type="video/mp4">
					Seu navegador nao suporta video HTML5.
				</video>
			`;
		}

		const source = modelo.type === "video" ? modelo.poster : modelo.src;
		const alt = isPreview ? `Previa: ${modelo.title}` : modelo.alt;
		return `<img src="${source}" alt="${alt}">`;
	}

	function atualizarDots(index) {
		const dots = dotsContainer.querySelectorAll("button");
		dots.forEach((dot, dotIndex) => {
			dot.classList.toggle("active", dotIndex === index);
			dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
		});
	}

	function animarTextoModelo() {
		headerPanel.classList.remove("is-entering");
		infoPanel.classList.remove("is-entering");

		void headerPanel.offsetWidth;
		void infoPanel.offsetWidth;

		headerPanel.classList.add("is-entering");
		infoPanel.classList.add("is-entering");
	}

	function animarEntradaMobile() {
		if (!window.matchMedia("(max-width: 620px)").matches) {
			return;
		}

		stageElement.classList.remove("is-mobile-entering");
		stageElement.classList.remove("is-mobile-entering-next");
		stageElement.classList.remove("is-mobile-entering-prev");
		void stageElement.offsetWidth;
		stageElement.classList.add("is-mobile-entering");
		stageElement.classList.add(mobileTransitionDirection === "prev" ? "is-mobile-entering-prev" : "is-mobile-entering-next");
	}

	function renderModelo(index) {
		const modelo = modelos[getIndiceCircular(index)];
		const modeloPrevio = modelos[getIndiceCircular(index - 1)];
		const modeloSeguinte = modelos[getIndiceCircular(index + 1)];
		const modeloEntradaEsquerda = modelos[getIndiceCircular(index - 2)];
		const modeloEntradaDireita = modelos[getIndiceCircular(index + 2)];

		titleElement.textContent = modelo.title;
		descriptionElement.textContent = modelo.description;
		mediaContainer.innerHTML = montarMidia(modelo);

		prevMediaContainer.innerHTML = montarMidia(modeloPrevio, true);
		nextMediaContainer.innerHTML = montarMidia(modeloSeguinte, true);
		enterLeftMediaContainer.innerHTML = montarMidia(modeloEntradaEsquerda, true);
		enterRightMediaContainer.innerHTML = montarMidia(modeloEntradaDireita, true);

		atualizarDots(getIndiceCircular(index));
		animarTextoModelo();
		animarEntradaMobile();
	}

	function suportaAnimacao3D() {
		return window.matchMedia("(min-width: 621px)").matches;
	}

	function irParaModelo(index) {
		modeloAtual = getIndiceCircular(index);
		renderModelo(modeloAtual);
	}

	function animarTransicao(direction) {
		if (isAnimating) {
			return;
		}

		mobileTransitionDirection = direction;

		if (!suportaAnimacao3D()) {
			isAnimating = true;
			const classeAnimacao = direction === "next" ? "is-animating-next" : "is-animating-prev";
			stageElement.classList.add(classeAnimacao);

			window.setTimeout(() => {
				const passo = direction === "next" ? 1 : -1;
				irParaModelo(modeloAtual + passo);
				stageElement.classList.remove(classeAnimacao);
				isAnimating = false;
			}, MOBILE_TRANSITION_OUT_MS);

			return;
		}

		isAnimating = true;
		const classeAnimacao = direction === "next" ? "is-animating-next" : "is-animating-prev";
		stageElement.classList.add(classeAnimacao);

		window.setTimeout(() => {
			const passo = direction === "next" ? 1 : -1;
			irParaModelo(modeloAtual + passo);
			stageElement.classList.remove(classeAnimacao);
			isAnimating = false;
		}, TRANSITION_DURATION);
	}

	function registrarInicioToque(event) {
		const touch = event.changedTouches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		pararAutoPlay();
	}

	function registrarFimToque(event) {
		const touch = event.changedTouches[0];
		if (touchStartX === null || touchStartY === null) {
			iniciarAutoPlay();
			return;
		}

		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		const swipeHorizontal = Math.abs(deltaX) >= SWIPE_MIN_DISTANCE && Math.abs(deltaY) <= SWIPE_MAX_VERTICAL;

		if (swipeHorizontal && !isAnimating) {
			if (deltaX < 0) {
				animarTransicao("next");
			} else {
				animarTransicao("prev");
			}
			reiniciarAutoPlay();
		} else {
			iniciarAutoPlay();
		}

		touchStartX = null;
		touchStartY = null;
	}

	function iniciarAutoPlay() {
		if (autoPlayTimer || document.hidden) {
			return;
		}

		autoPlayTimer = setInterval(() => {
			animarTransicao("next");
		}, AUTO_PLAY_DELAY);
	}

	function pararAutoPlay() {
		if (!autoPlayTimer) {
			return;
		}

		clearInterval(autoPlayTimer);
		autoPlayTimer = null;
	}

	function reiniciarAutoPlay() {
		pararAutoPlay();
		iniciarAutoPlay();
	}

	modelos.forEach((modelo, index) => {
		const dot = document.createElement("button");
		dot.type = "button";
		dot.setAttribute("aria-label", `Ir para ${modelo.title}`);
		dot.addEventListener("click", () => {
			if (index === modeloAtual || isAnimating) {
				return;
			}

			const nextDelta = getIndiceCircular(index - modeloAtual);
			if (nextDelta === 1) {
				animarTransicao("next");
			} else if (nextDelta === modelos.length - 1) {
				animarTransicao("prev");
			} else {
				irParaModelo(index);
			}

			reiniciarAutoPlay();
		});
		dotsContainer.appendChild(dot);
	});

	prevButton.addEventListener("click", () => {
		animarTransicao("prev");
		reiniciarAutoPlay();
	});

	nextButton.addEventListener("click", () => {
		animarTransicao("next");
		reiniciarAutoPlay();
	});

	document.addEventListener("keydown", (event) => {
		if (isAnimating) {
			return;
		}

		if (event.key === "ArrowLeft") {
			animarTransicao("prev");
			reiniciarAutoPlay();
		}
		if (event.key === "ArrowRight") {
			animarTransicao("next");
			reiniciarAutoPlay();
		}
	});

	if (carouselRoot) {
		carouselRoot.addEventListener("mouseenter", pararAutoPlay);
		carouselRoot.addEventListener("mouseleave", iniciarAutoPlay);
		carouselRoot.addEventListener("touchstart", registrarInicioToque, { passive: true });
		carouselRoot.addEventListener("touchend", registrarFimToque, { passive: true });
		carouselRoot.addEventListener("touchcancel", () => {
			touchStartX = null;
			touchStartY = null;
			iniciarAutoPlay();
		}, { passive: true });
		carouselRoot.addEventListener("focusin", pararAutoPlay);
		carouselRoot.addEventListener("focusout", iniciarAutoPlay);
	}

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			pararAutoPlay();
		} else {
			iniciarAutoPlay();
		}
	});

	renderModelo(modeloAtual);
	iniciarAutoPlay();
}
