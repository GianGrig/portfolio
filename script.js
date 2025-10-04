// --- LANGUAGE SWAP (PT / EN if available)
(function () {
  const lang = (navigator.language || navigator.userLanguage || "pt").toLowerCase();
  const useEn = lang.startsWith("en");
  document.querySelectorAll("[data-lang-pt]").forEach((el) => {
    const pt = el.getAttribute("data-lang-pt") || "";
    const en = el.getAttribute("data-lang-en") || pt;
    el.textContent = useEn ? en : pt;
  });
})();

// --- GALLERY DATA (Para o Lightbox, se você decidir usá-lo com um botão futuro)
// Esta função e o lightbox podem ser mantidos caso você decida adicionar um "Abrir Galeria"
// para o slider da pizzaria ou traqair, ou no futuro para os projetos com vídeo.
function collectGalleryItems(galleryId){const items=[];document.querySelectorAll(`[data-gallery="${galleryId}"]`).forEach(container=>{container.querySelectorAll("img, video").forEach(el=>{if(el.tagName.toLowerCase()==="img"){items.push({type:"img",src:el.getAttribute("src"),alt:el.getAttribute("alt")||""})}else if(el.tagName.toLowerCase()==="video"){const t=el.querySelector("source"),e=t?t.getAttribute("src"):el.getAttribute("src")||null;e&&items.push({type:"video",src:e,alt:"",poster:el.getAttribute("poster")||null})}})});return items}

// --- LIGHTBOX (single instance reused)
const LB={el:document.getElementById("lb"),mediaWrap:document.querySelector("#lb .lb-media"),thumbsWrap:document.querySelector("#lb .lb-thumbs"),items:[],index:0,open(t,e=0){if(!t||!t.length)return;this.items=t,this.index=e,this.renderThumbs(),this.show()},show(){this.mediaWrap.innerHTML="";const t=this.items[this.index];if(t.type==="img"){const e=document.createElement("img");e.src=t.src,e.alt=t.alt||"",this.mediaWrap.appendChild(e)}else if(t.type==="video"){const e=document.createElement("video");e.src=t.src,e.controls=!0,e.autoplay=!1,e.preload="metadata",t.poster&&e.setAttribute("poster",t.poster),e.setAttribute("playsinline",""),this.mediaWrap.appendChild(e)}Array.from(this.thumbsWrap.children).forEach((t,e)=>t.classList.toggle("active",e===this.index)),this.el.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"},renderThumbs(){this.thumbsWrap.innerHTML="",this.items.forEach((t,e)=>{const i=document.createElement("div");if(i.className="thumb-mini",t.type==="img"){const s=document.createElement("img");s.src=t.src,s.alt=t.alt||"",i.appendChild(s)}else{const s=document.createElement("video");s.src=t.src,s.muted=!0,s.preload="metadata",s.setAttribute("playsinline",""),i.appendChild(s)}e===this.index&&i.classList.add("active"),i.addEventListener("click",()=>{LB.index=e,LB.show()}),this.thumbsWrap.appendChild(i)})},close(){const t=this.mediaWrap.querySelector("video");t&&(t.pause(),t.currentTime=0),this.el.setAttribute("aria-hidden","true"),document.body.style.overflow="",this.items=[],this.thumbsWrap.innerHTML="",this.mediaWrap.innerHTML=""},next(){this.index=(this.index+1)%this.items.length,this.show()},prev(){this.index=(this.index-1+this.items.length)%this.items.length,this.show()}};
// Removed event listeners for .open-gallery or .thumb for now, since we only have sliders
// If you want to use the lightbox for the sliders, you would re-add these listeners
// and add data-gallery="pizzaria" to the slider-container div.


document.querySelector("#lb .lb-next")?.addEventListener("click",()=>LB.next());
document.querySelector("#lb .lb-prev")?.addEventListener("click",()=>LB.prev());
document.querySelector("#lb .lb-close")?.addEventListener("click",()=>LB.close());
document.getElementById("lb")?.addEventListener("click",e=>{e.target.id==="lb"&&LB.close()});
document.addEventListener("keydown",e=>{if(document.getElementById("lb")?.getAttribute("aria-hidden")==="false"){if(e.key==="ArrowLeft")LB.prev();if(e.key==="ArrowRight")LB.next();if(e.key==="Escape")LB.close()}});

// --- LÓGICA DO MENU LATERAL ---
const navElement = document.querySelector('.side-nav');
const navLinks = document.querySelectorAll('.side-nav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('section--dark')) {
        navElement.classList.add('theme-dark');
        navElement.classList.remove('theme-light');
      } else {
        navElement.classList.add('theme-light');
        navElement.classList.remove('theme-dark');
      }
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      const activeLink = document.querySelector(`.side-nav a[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, {
  threshold: 0.6
});
document.querySelectorAll('.snap-section').forEach(sec => {
  navObserver.observe(sec);
});


// --- LÓGICA REUTILIZÁVEL DO SLIDER DE IMAGENS ---
function createSlider(containerId, imageList) {
  const sliderContainer = document.getElementById(containerId);
  if (!sliderContainer || imageList.length <= 1) {
    // Esconde os botões se houver apenas 1 imagem ou o container não existir
    if (sliderContainer) {
        const prevBtn = sliderContainer.querySelector(".slider-btn.prev");
        const nextBtn = sliderContainer.querySelector(".slider-btn.next");
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
    return;
  }

  let currentIndex = 0;
  const imageElement = sliderContainer.querySelector(".slider-img");
  const prevBtn = sliderContainer.querySelector(".slider-btn.prev");
  const nextBtn = sliderContainer.querySelector(".slider-btn.next");

  function showImage(index) {
    if (index >= imageList.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = imageList.length - 1;
    } else {
      currentIndex = index;
    }
    imageElement.src = imageList[currentIndex];
  }

  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  showImage(currentIndex);
}


// --- INICIALIZAÇÃO DOS SLIDERS (APENAS ONDE HÁ IMAGENS SUFICIENTES) ---

const curriculoImages = [
  "img/tela_curriculo.png"
];
createSlider('curriculo-slider', curriculoImages);

// Para "Pizzaria", assumindo que você tem as imagens:
const pizzariaImages = [
  "img/1_tela_Pizzaria.png",
  "img/2_tela_Pizzaria.png",
  "img/3_tela_Pizzaria.png",
  "img/4_tela_Pizzaria.png"
];
createSlider('pizzaria-slider', pizzariaImages);


// Para "Traqair", assumindo que você tem as imagens:
const traqairImages = [
  "img/tela_1_loja.png",
  "img/tela_2_loja.png",
  "img/tela_3_loja.png",
  "img/tela_4_loja.png",
  "img/tela_5_loja.png",
  "img/tela_6_loja.png",
  "img/tela_7_loja.png",
  "img/tela_8_loja.png",
  "img/tela_9_loja.png"
  // ... adicione mais se houver
];
createSlider('traqair-slider', traqairImages);


// Os sliders para Curriculo, EPIs e IoT foram removidos daqui, pois agora têm o aviso "IMAGEM EM BREVE"
// Quando você tiver as imagens/vídeos para esses projetos, você pode:
// 1. Remover a div "coming-soon" do HTML.
// 2. Adicionar de volta a estrutura "slider-container" no HTML (como em Pizzaria/Traqair).
// 3. Adicionar as listas de imagens (ex: curriculoImages, episImages, iotImages) aqui no JS.
// 4. Chamar createSlider() para eles novamente (ex: createSlider('curriculo-slider', curriculoImages);)