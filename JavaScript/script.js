const sabores = [
  {
    id: 1,
    nome: "Ninho com Nutella",
    preco: 10,
    img: "Images/boloNinhoNutella.jpg",
  },
  {
    id: 2,
    nome: "Ninho com frutas vermelhas",
    preco: 10,
    img: "Images/boloNinhofrutas.jpg",
  },
  {
    id: 3,
    nome: "Ninho",
    preco: 8,
    img: "Images/boloNinho.jpg",
  },
  {
    id: 4,
    nome: "Ninho com Brigadeiro",
    preco: 8,
    img: "Images/boloNinhobrigadeiro.jpg",
  },
  {
    id: 5,
    nome: "Brigadeiro",
    preco: 8,
    img: "Images/boloBrigadeiro.jpg",
  },
  {
    id: 6,
    nome: "Dois Amores",
    preco: 8,
    img: "Images/boloDoisamores.jpg",
  },
];

// Carrinho
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function atualizarContador() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const badgeDesktop = document.getElementById("cart-count");
  const badgeMobile = document.getElementById("cart-badge");

  if (badgeDesktop) badgeDesktop.textContent = totalItens;
  if (badgeMobile) badgeMobile.textContent = totalItens;
}

// Renderizar sabores
function renderizarSabores() {
  const container = document.getElementById("flavors-container");
  container.innerHTML = "";

  sabores.forEach((sabor) => {
    const isPremium = sabor.preco > 8;

    const card = `
            <div class="col">
                <div class="card flavor-card h-100 position-relative ${
                  isPremium ? "premium-card" : ""
                }">
                    
                    <!-- Badge de preço (dourado se premium) -->
                    <span class="badge badge-flavor ${
                      isPremium ? "premium-badge" : ""
                    }">
                        R$ ${sabor.preco.toFixed(2)}
                    </span>


                    <img src="${
                      sabor.img
                    }" class="card-img-top flavor-img" alt="${sabor.nome}">
                    
                    <div class="card-body d-flex flex-column">
                        <!-- Título com coroa se premium -->
                        <h5 class="card-title d-flex align-items-center gap-2">
                            ${
                              isPremium
                                ? '<i class="fas fa-crown text-warning"></i>'
                                : ""
                            }
                            ${sabor.nome}
                        </h5>

                        <!-- Texto "Sabor Premium" -->
                        ${
                          isPremium
                            ? '<p class="premium-label mb-2">Sabor Premium</p>'
                            : ""
                        }

                        <button class="btn btn-outline-primary mt-auto add-to-cart-btn ${
                          isPremium ? "premium-btn" : ""
                        }" 
                                data-id="${sabor.id}">
                            <i class="fas fa-cart-plus"></i> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    container.innerHTML += card;
  });

  // Adicionar evento aos botões
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => abrirModalAdicionar(btn.dataset.id));
  });
}

// Abrir modal com sabor selecionado
function abrirModalAdicionar(id) {
  const sabor = sabores.find((s) => s.id == id);
  document.getElementById("modal-img").src = sabor.img;
  document.getElementById("modal-name").textContent = sabor.nome;
  document.getElementById("modal-desc").textContent = sabor.descricao;
  document.getElementById(
    "modal-price"
  ).textContent = `R$ ${sabor.preco.toFixed(2)}`;
  document.getElementById("modal-quantity").value = 1;

  const modal = new bootstrap.Modal(document.getElementById("addToCartModal"));
  modal.show();

  document.getElementById("confirm-add-cart").onclick = () => {
    const qtd = parseInt(document.getElementById("modal-quantity").value);
    if (qtd < 1) return alert("Quantidade inválida");
    const existente = carrinho.find((item) => item.id === sabor.id);
    if (existente) {
      existente.quantidade += qtd;
    } else {
      carrinho.push({ ...sabor, quantidade: qtd });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador();
    modal.hide();
    alert(`${qtd} ${sabor.nome}(s) adicionado(s) ao carrinho!`);
  };
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("home-page")) {
    renderizarSabores();
    atualizarContador();
  }
});
