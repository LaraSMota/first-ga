function configuraSala(numCol, numLin, inicio, destino){
    let config = [numCol, numLin, inicio, destino];
    return config;
}

function geraGene(maxI, minI, maxJ, minJ){
    let gene = new Array(2);
    //floor vs. round -> ver o que seria melhor com Otacilio;
    gene[0] = Math.floor(Math.random() * (maxI - minI + 1)) + minI;
    gene[1] = Math.floor(Math.random() * (maxJ - minJ + 1)) + minJ;

    return gene;
}

function geraIndividuo(config){
    let individuo = [];
    const numCol = config[0];
    const numLin = config[1];
    const inicio = config[2];
    const destino = config[3];
    const tamGrid = numCol * numLin;
    let verificaDestino; 
    let verificaInicio;

    do{
        individuo.length = 0;
        verificaDestino = false;
        verificaInicio = false;
        //Crio o meu primeiro gene, a posição onde o robô começa;
        //Proxima versão -> colocar para se de 0 a variaveis com numero de linhas e colunas da grid.
        individuo.push(geraGene((numCol - 1), 0, (numLin - 1), 0));
        //Cria os genes seguintes levando o primeiro gene como ponto de partida
        //Proxima versão -> colocar para ser de 1 ao tamanho total da grid
        for(let count = 1; count < tamGrid; count++){
            let Imin;
            let Imax;
            let Jmax;
            let Jmin;
           
            //Seçõo para estabelecer os valores que podem gerar o proximo gene
            //Como o robô pode se locomover apenas uma casa em qualquer direção, os valores podem ser uma unidade acima ou 
            //      abaixo das coordenadas do gene anterior. Lembrando de que deve respeitar as bordas.
            if(individuo[count-1][0] === 0){
                Imin = Number(individuo[count-1][0]);
            } else {
                Imin = Number(individuo[count-1][0]) - 1;
            } 
            if(individuo[count-1][0] === (numCol - 1)){
                Imax = Number(individuo[count-1][0]);
            } else {
                Imax = Number(individuo[count-1][0]) + 1;
            }
            if(individuo[count-1][1] === 0){
                Jmin = Number(individuo[count-1][1]); 
            } else {
                Jmin = Number(individuo[count-1][1]) - 1;
            }
            if(individuo[count-1][1] === (numLin - 1)){
                Jmax = Number(individuo[count-1][1]);
            } else {
                Jmax = Number(individuo[count-1][1]) + 1;
            }

            //Salvando o novo gene criado ao final do array
            individuo.push(geraGene(Imax, Imin, Jmax, Jmin));
        }
        for(count = 0; count < individuo.length; count++){
            if(individuo[count][0]===destino[0] && individuo[count][1]===destino[1]){
                verificaDestino = true;
            } 
            if(individuo[count][0]===inicio[0] && individuo[count][1]===inicio[1]){
                verificaInicio = true;
            }
        }
    }while(verificaIndividuo(verificaDestino, verificaInicio) === false);
    return individuo;
}

function verificaIndividuo(verificaDestino, verificaInicio){
    if(verificaDestino && verificaInicio){
        return true;
    } else {
        return false;
    }
}

function geraPopulacao(config, popTamanho){
    let populacao = [];

    for(let count = 0; count < popTamanho; count++){
        populacao.push(geraIndividuo(config));
    }
    return populacao;
}

function calculaFitness(config, populacao){
    let popFitness = [];
    const inicio = config[2];
    const destino = config[3];
    
    for(let count = 0; count <populacao.length; count++){
        let individuo = populacao[count];
        let pontoFinal;
        let pontoInicial;
        let distancia;
        let fitness;

        for(let a = 0; a < individuo.length; a++){
            if(individuo[a][0]===destino[0] && individuo[a][1]===destino[1]){
                pontoFinal = a;
            }
            if(individuo[a][0]===inicio[0] && individuo[a][1]===inicio[1]){
                pontoInicial = a;
            }
        }
        //Calcula o fitness -> distancia entre o ponto inicial e o destino
        distancia = pontoFinal - pontoInicial;
        fitness = 100/distancia;//podia ser 1 ao inves de 100, mas os numeros ficariam muito proximos e quebrados
        popFitness.push([fitness, count]); 

        //verifica se o destino veio antes do inicio e corrige
        if(popFitness[count][0] < 0){
            populacao[count].reverse();//inverte o individuo para corrigir
            popFitness[count][0] = popFitness[count][0] * (-1);//deixa o fitness positivo
        }
    }
    //Implementar o "reorganizar array" para ficar em ordem crescente de fitness
    return popFitness;
}
//function organizaPopulacao(populacao, popFitness){
//    let transicao = populacao;
//    for(let count = 0; count < populacao.length; count++){
//        let ind = popFitness[count][1];
        
//    }
//}
//Seleção pelo metodo da roleta
function selecao(populacao, popFitness){
    let somaFitness = 0;
    let selecionados = [];

    //organizaPopulacao(populacao, popFitness);

    for(let count = 0; count < popFitness.length; count++){
        somaFitness += popFitness[count][0];
    }

    for (count = 0; count < popFitness.length; count++){
        let posicaoSelecionado = Math.floor(Math.random() * (somaFitness + 1));
        let aux = 0; 
        let posicao = 0;

        while(aux < posicaoSelecionado){
            selecionados[count] = populacao[posicao];
            aux += popFitness[posicao][0];
            posicao++;
        }
    }
    return selecionados;    
}
let config = configuraSala(5, 5, [0,0], [4,4]);
let populacao = geraPopulacao(config, 10);
let fitness = calculaFitness(config, populacao);
console.log(fitness);

