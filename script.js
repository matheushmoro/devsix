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
		poster: "./img/modelo1.jpg"
	}
];

const mediaContainer = document.getElementById("modelo-media");
const titleElement = document.getElementById("modelo-titulo");
const descriptionElement = document.getElementById("modelo-descricao");
const prevMediaContainer = document.getElementById("modelo-prev-media");
const nextMediaContainer = document.getElementById("modelo-next-media");
const prevTitleElement = document.getElementById("modelo-prev-titulo");
const nextTitleElement = document.getElementById("modelo-next-titulo");
const dotsContainer = document.getElementById("modelos-dots");
const prevButton = document.getElementById("modelos-prev");
const nextButton = document.getElementById("modelos-next");
const carouselRoot = document.querySelector(".modelos-carousel");
const stageElement = document.getElementById("modelos-stage");

if (
	mediaContainer &&
	titleElement &&
	descriptionElement &&
	prevMediaContainer &&
	nextMediaContainer &&
	prevTitleElement &&
	nextTitleElement &&
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

	function renderModelo(index) {
		const modelo = modelos[getIndiceCircular(index)];
		const modeloPrevio = modelos[getIndiceCircular(index - 1)];
		const modeloSeguinte = modelos[getIndiceCircular(index + 1)];

		titleElement.textContent = modelo.title;
		descriptionElement.textContent = modelo.description;
		mediaContainer.innerHTML = montarMidia(modelo);

		prevMediaContainer.innerHTML = montarMidia(modeloPrevio, true);
		nextMediaContainer.innerHTML = montarMidia(modeloSeguinte, true);
		prevTitleElement.textContent = modeloPrevio.title;
		nextTitleElement.textContent = modeloSeguinte.title;

		atualizarDots(getIndiceCircular(index));
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

		if (!suportaAnimacao3D()) {
			const passo = direction === "next" ? 1 : -1;
			irParaModelo(modeloAtual + passo);
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
		carouselRoot.addEventListener("touchstart", pararAutoPlay, { passive: true });
		carouselRoot.addEventListener("touchend", iniciarAutoPlay);
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
