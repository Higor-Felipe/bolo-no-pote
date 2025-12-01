let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const saboresData = [
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

// ============================================
// RENDERIZAÇÃO DO CARRINHO
// ============================================
function renderizarCarrinho() {
  const itensDiv = document.getElementById("carrinho-itens");
  const vazio = document.getElementById("carrinho-vazio");
  const form = document.getElementById("form-dados");

  if (carrinho.length === 0) {
    vazio.classList.remove("d-none");
    form.classList.add("d-none");
    return;
  }

  vazio.classList.add("d-none");
  form.classList.remove("d-none");

  itensDiv.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const div = `
                    <div class="cart-item d-flex align-items-center">
                        <img src="${
                          item.img || "https://via.placeholder.com/80"
                        }" class="cart-item-img me-3" alt="${item.nome}">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.nome}</h6>
                            <small class="text-muted">R$ ${item.preco.toFixed(
                              2
                            )} unid.</small>
                        </div>
                        <div class="text-center">
                            <small>Qtd:</small><br>
                            <strong>${item.quantidade}</strong>
                        </div>
                        <div class="text-end ms-4">
                            <strong>R$ ${subtotal.toFixed(2)}</strong>
                        </div>
                        <button class="btn btn-sm btn-danger ms-3" onclick="removerItem(${index}); recarregarPagina()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
    itensDiv.innerHTML += div;
  });

  document.getElementById("total-valor").textContent = total.toFixed(2);

  // ============================================
  // EVENTOS DE SELEÇÃO DE PAGAMENTO
  // ============================================
  document.querySelectorAll('input[name="pagamento"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const qrcodeDiv = document.getElementById("msg-pagamento");
      qrcodeDiv.innerHTML = "";
      const metodo = radio.value;

      let total = 0;
      carrinho.forEach((item) => {
        total += item.preco * item.quantidade;
      });

      if (metodo === "pix") {
        qrcodeDiv.innerHTML = `
                            <div class="text-center p-4 bg-light rounded border shadow-sm">
                                <h6 class="text-success mb-3">
                                    <i class="fas fa-qrcode"></i> Pague via PIX
                                </h6>

                                <!-- QR CODE FIXO -->
                                <img src="Images/qrcode-pix.jpg" class="img-fluid mb-3"
                                    style="max-width: 220px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" 
                                    alt="QR Code PIX">

                                <!-- VALOR TOTAL -->
                                <p class="mb-2">
                                    <strong class="text-success h5">Valor: R$ ${total.toFixed(
                                      2
                                    )}</strong>
                                </p>

                                <!-- CHAVE PIX + BOTÃO COPIAR -->
                                <div class="d-flex align-items-center justify-content-center gap-2 mb-3">
                                    <p id="dado" class="chavePix mb-0 fw-bold text-primary">545.354.448-11</p>
                                    <button class="btn btn-sm btn-outline-primary botaoCopiar" onclick="copyToClickBoard(this)">
                                        <i class="fas fa-copy"></i> Copiar
                                    </button>
                                </div>

                                <!-- AVISO COMPROVANTE -->
                                <div class="bg-warning text-dark p-3 rounded small">
                                    <p class="mb-0 fw-bold">
                                        <i class="fas fa-exclamation-triangle"></i> 
                                        O COMPROVANTE DEVE SER ENVIADO PELO WHATSAPP DO PEDIDO
                                    </p>
                                </div>

                                <p class="small text-muted mt-3">
                                    Escaneie o QR ou copie a chave e pague no app do banco.
                                </p>
                            </div>
                        `;
        qrcodeDiv.scrollIntoView({ behavior: "smooth" });
      } else if (metodo === "dinheiro") {
        qrcodeDiv.innerHTML = `<div class="payment-info text-center p-4">Pagamento em dinheiro será feito na hora da retirada.</div>`;
      } else if (metodo === "cartao") {
        qrcodeDiv.innerHTML = `<div class="payment-info text-center p-4">Pagamento com cartão (débito ou crédito) será na retirada ou combinado.</div>`;
      }
    });
  });

  // ============================================
  // BOTÃO CONCLUIR PEDIDO
  // ============================================
  document.getElementById("btn-concluir").onclick = () => {
    const nome = document.getElementById("nome-cliente").value.trim();
    const metodo = document.querySelector(
      'input[name="pagamento"]:checked'
    )?.value;

    if (!nome || !metodo) {
      alert("Preencha seu nome e escolha o método de pagamento!");
      return;
    }

    let mensagem = `*NOVO PEDIDO - DOCES NO POTE*%0A%0A`;
    mensagem += `👤 *Cliente:* ${nome}%0A`;
    mensagem += `💳 *Pagamento:* ${metodo.toUpperCase()}%0A%0A`;
    mensagem += `*ITENS:*%0A`;

    carrinho.forEach((item) => {
      mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(
        item.preco * item.quantidade
      ).toFixed(2)}%0A`;
    });

    mensagem += `%0A💰 *Total: R$ ${total.toFixed(2)}*%0A\n`;
    if (metodo === "pix") {
      mensagem += `%0A✅ *CHAVE PIX:* 545.354.448-11%0A\n`;
      mensagem += `%0A‼️ *O COMPROVANTE DEVE SER ENVIADO AQUI*%0A`;
    }
    // Abre WhatsApp
    const whatsappUrl = `https://wa.me/5518997369593?text=${mensagem}`;
    window.open(whatsappUrl, "_blank");
  };
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
  if (window.opener) window.opener.atualizarContador();
}

function recarregarPagina() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", renderizarCarrinho);

function copyToClickBoard(button) {
  const chaveElement = button.previousElementSibling;
  const chaveTexto = chaveElement.textContent.trim();

  navigator.clipboard
    .writeText(chaveTexto)
    .then(() => {
      const original = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-success");
      setTimeout(() => {
        button.innerHTML = original;
        button.classList.remove("btn-success");
        button.classList.add("btn-outline-primary");
      }, 2000);
    })
    .catch(() => {
      alert("Erro ao copiar. Copie manualmente: " + chaveTexto);
    });
}
