console.log("main.js carregado");

const svgFiles = [
    '1bola.svg', '1triangulo.svg', '2bola.svg', '2triangulo.svg', '3bola.svg', 
    '3triangulo.svg', '4bola.svg', '4triangulo.svg', '5bola.svg', '5triangulo.svg', 
    '6bola.svg', '6triangulo.svg', '7bola.svg', '7triangulo.svg'
];

function loadSVGs() {
    console.log("Iniciando carregamento dos SVGs");
    const container = d3.select("#container");
    
    if (container.empty()) {
        console.error("Elemento #container não encontrado");
        return;
    }

    const ballsRow = container.append("div").attr("class", "row balls-row");
    const trianglesRow = container.append("div").attr("class", "row triangles-row").style("margin-top", "-350px");

    svgFiles.forEach((file, index) => {
        const isBall = file.includes("bola"); 
        const row = isBall ? ballsRow : trianglesRow;        
        
        console.log(`Tentando carregar: svg/${file}`);
        d3.xml(`svg/${file}`).then(data => {
            console.log(`SVG carregado com sucesso: ${file}`);
            const importedNode = document.importNode(data.documentElement, true);
            const wrapper = row.append("div")
                .attr("class", "svg-wrapper")
                .attr("id", `svg-${index}`);
            
            wrapper.node().appendChild(importedNode);
            
           /* d3.select(`#svg-${index} svg`)
                .attr("width", "100%")
                .attr("height", "100%")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0");*/
        }).catch(error => {
            console.error(`Erro ao carregar ${file}:`, error);
        });
    });
}

// Chama a função para carregar os SVGs
document.addEventListener("DOMContentLoaded", loadSVGs);

function animateTriangles() {
    console.log("Iniciando animação dos triângulos");

    // Variável para armazenar os estados dos triângulos (controla cancelamentos)
    const triangleStates = {};

    // Seleciona todos os triângulos e bolas
    const triangles = d3.selectAll(".triangles-row .svg-wrapper");
    const balls = d3.selectAll(".balls-row .svg-wrapper");

    // Verifique se o número de triângulos e bolas corresponde
    if (triangles.size() !== balls.size()) {
        console.error("O número de triângulos não corresponde ao número de bolas!");
        return;
    }

    // Função para animar a descida de um triângulo
    function descendTriangle(triangle, ball, index) {
        // Cancela a descida se o estado de cancelamento estiver ativo
        if (triangleStates[index]?.canceled) {
            triangle
                .transition()
                .duration(500)
                .style("transform", "translateY(0px)")
                .on("end", () => {
                    console.log(`Triângulo ${index} voltou à posição original`);
                    triangleStates[index].canceled = false; // Reseta o estado após o retorno
                    loopAnimation(index); // Reinsere o triângulo no loop normal
                });
            return;
        }

        // Calcula a posição vertical ajustada para parar na borda da bolinha
        const ballY = ball.getBoundingClientRect().top;
        const triangleY = triangle.node().getBoundingClientRect().top;

        const triangleHeight = triangle.node().getBoundingClientRect().height;
        const ballHeight = ball.getBoundingClientRect().height;
        const deltaY = ballY - triangleY - (ballHeight / 2) + (triangleHeight / 2);

        // Adiciona um atraso aleatório para criar variação
        const randomDelay = Math.random() * 2000;

        // Desce o triângulo com D3.js
        triangle
            .transition()
            .delay(randomDelay)
            .duration(1000) // Duração da descida
            .style("transform", `translateY(${deltaY}px)`)
            .on("end", () => {
                console.log(`Triângulo ${index} completou a descida.`);
                if (!triangleStates[index]?.canceled) {
                    // Recomeça o loop apenas se o triângulo não foi cancelado
                    loopAnimation(index);
                }
            });
    }

    // Função para iniciar/repetir a animação em loop para um triângulo específico
    function loopAnimation(index) {
        const triangle = d3.select(triangles.nodes()[index]);
        const ball = balls.nodes()[index];
        descendTriangle(triangle, ball, index);
    }

    // Configurar interação para as bolas para cancelar temporariamente a descida
    balls.each(function (_, index) {
        const ball = d3.select(this);
        const triangle = d3.select(triangles.nodes()[index]);

        // Inicializa o estado dos triângulos
        triangleStates[index] = { canceled: false };

        // Adiciona evento de clique para cancelar o movimento do triângulo
        ball.on("click", () => {
            console.log(`Cancelando descida do triângulo ${index}`);
            triangleStates[index].canceled = true; // Marca o triângulo para interrupção
        });
    });

    // Inicializa o loop para todos os triângulos
    triangles.each(function (_, index) {
        loopAnimation(index);
    });
}

// Chama a função para iniciar a movimentação dos triângulos
setTimeout(animateTriangles, 50);

function animateTriangles() {
    console.log("Iniciando animação dos triângulos");

    // Variável para armazenar os estados dos triângulos (controla cancelamentos)
    const triangleStates = {};

    // Seleciona todos os triângulos e bolas
    const triangles = d3.selectAll(".triangles-row .svg-wrapper");
    const balls = d3.selectAll(".balls-row .svg-wrapper");

    // Verifica se o número de triângulos e bolas corresponde
    if (triangles.size() !== balls.size()) {
        console.error("O número de triângulos não corresponde ao número de bolas!");
        return;
    }

    // Função para animar a descida de um triângulo
    function descendTriangle(triangle, ball, index) {
        // Cancela a descida se o estado de cancelamento estiver ativo
        if (triangleStates[index]?.canceled) {
            return; // Se está cancelado, não executa a descida
        }

        // Calcula a posição vertical ajustada para parar na borda da bolinha
        const ballY = ball.getBoundingClientRect().top;
        const triangleY = triangle.node().getBoundingClientRect().top;

        const triangleHeight = triangle.node().getBoundingClientRect().height;
        const ballHeight = ball.getBoundingClientRect().height;
        const deltaY = ballY - triangleY - (ballHeight / 2) + (triangleHeight / 2);

        // Adiciona um atraso aleatório para criar variação
        const randomDelay = Math.random() * 2000;

        // Desce o triângulo com D3.js
        triangle
            .transition()
            .delay(randomDelay) // Aplica atraso
            .duration(1000) // Duração da descida
            .style("transform", `translateY(${deltaY}px)`)
            .on("end", () => {
                console.log(`Triângulo ${index} completou a descida.`);

                if (!triangleStates[index]?.canceled) {
                    // Recomeça o loop apenas se o triângulo não foi cancelado
                    loopAnimation(index);
                }
            });
    }

    // Função para iniciar/repetir a animação em loop para um triângulo específico
    function loopAnimation(index) {
        const triangle = d3.select(triangles.nodes()[index]);
        const ball = balls.nodes()[index];
        descendTriangle(triangle, ball, index);
    }

    // Configurar interação para as bolas para cancelar temporariamente a descida
balls.each(function (_, index) {
    const ball = d3.select(this);
    const triangle = d3.select(triangles.nodes()[index]);

    // Inicializa o estado dos triângulos
    triangleStates[index] = { canceled: false };

    // Adiciona evento de clique à bolinha
    ball.on("click", () => {
        console.log(`Cancelando descida do triângulo ${index}`);
        triangleStates[index].canceled = true; // Marca o triângulo para interrupção
        
        // Anima o triângulo de volta à posição original
        triangle
            .transition()
            .duration(500) // Duração para o retorno ao topo
            .style("transform", "translateY(0px)")
            .on("end", () => {
                console.log(`Triângulo ${index} retornou ao topo`);
                
                // Reabilita o triângulo para reentrar no loop
                triangleStates[index].canceled = false;

                // Reinicia o loop do triângulo
                loopAnimation(index);
            });
    });
});

    // Inicializa o loop para todos os triângulos
    triangles.each(function (_, index) {
        loopAnimation(index);
    });
}

// Chama a função para iniciar a movimentação dos triângulos
setTimeout(animateTriangles, 500);



function addInteractivity() {
    console.log("Adicionando interatividade");
    d3.selectAll(".svg-wrapper")
      .on("mouseover", function() {
          d3.select(this).transition()
            .duration(300)
            .style("transform", "scale(1.1)");
      })
      .on("mouseout", function() {
          d3.select(this).transition()
            .duration(300)
            .style("transform", "scale(1)");
      })

    // Adiciona zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 5])
        .on("zoom", zoomed);

    d3.selectAll(".svg-wrapper")
      .call(zoom);

    function zoomed(event) {
        d3.select(this).select("svg")
          .attr("transform", event.transform);
    }
}


// Chama a função para adicionar interatividade após carregar os SVGs
setTimeout(addInteractivity, 1000);

function addBrush() {
    console.log("Adicionando funcionalidade de brush");

    const svgBrush = d3.select("#container")
        .append("svg")
        .attr("class", "brush-area")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("z-index", "10")
        .style("pointer-events", "none"); // Inicialmente desabilitamos os eventos

    // Define o comportamento do brush
    const brush = d3.brush()
        .extent([[0, 0], [window.innerWidth, window.innerHeight]]) // Área cobrindo toda a tela
        .on("start brush end", brushed);

    const brushLayer = svgBrush.append("g")
        .attr("class", "brush")
        .call(brush);

    // Habilita "pointer-events" apenas quando o usuário está interagindo com o brush
    brushLayer
        .select(".overlay")
        .style("pointer-events", "all") // Ativa o brush
        .style("cursor", "crosshair");

    // Função que lida com os elementos selecionados
    function brushed(event) {
        const selection = event.selection;

        if (selection) {
            const [[x0, y0], [x1, y1]] = selection;

            // Seleciona os triângulos e bolinhas
            d3.selectAll(".triangles-row .svg-wrapper, .balls-row .svg-wrapper")
                .classed("highlighted", function () {
                    const element = this.getBoundingClientRect();
                    const isInside =
                        element.left >= x0 &&
                        element.right <= x1 &&
                        element.top >= y0 &&
                        element.bottom <= y1;

                    // Adiciona/remova a classe "highlighted" dependendo da área selecionada
                    return isInside;
                });
        } else {
            // Limpa a seleção caso o brush seja reiniciado
            d3.selectAll(".svg-wrapper").classed("highlighted", false);
        }
    }
}