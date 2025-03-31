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
    const trianglesRow = container.append("div").attr("class", "row triangles-row");

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

function addInteractivity() {
    console.log("Adicionando interatividade");
    // ... (mantenha o resto da função como está)
}



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
      .on("click", function() {
          d3.select(this).transition()
            .duration(500)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1);
      });

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