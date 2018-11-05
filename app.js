function geraGene(maxI, minI, maxJ, minJ){
    let gene = new Array(2);
    //floor vs. round -> ver o que seria melhor com Otacilio;
    gene[0] = Math.floor(Math.random() * (maxI - minI + 1)) + minI;
    gene[1] = Math.floor(Math.random() * (maxJ - minJ + 1)) + minJ;

    return gene;
}

function geraIndividuo(){
    let individuo = [];

    //Crio o meu primeiro gene, a posição onde o robô começa;
    //Proxima versão -> colocar para se de 0 a variaveis com numero de linhas e colunas da grid.
    individuo.push(geraGene(2, 0, 2, 0));

    //Cria os genes seguintes levando o primeiro gene como ponto de partida
    //Proxima versão -> colocar para ser de 1 ao tamanho total da grid
    for(let count = 1; count < 9; count++){
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
        if(individuo[count-1][0] === 2){
            Imax = Number(individuo[count-1][0]);
        } else {
            Imax = Number(individuo[count-1][0]) + 1;
        }
        if(individuo[count-1][1] === 0){
            Jmin = Number(individuo[count-1][1]); 
        } else {
            Jmin = Number(individuo[count-1][1]) - 1;
        }
        if(individuo[count-1][1] === 2){
            Jmax = Number(individuo[count-1][1]);
        } else {
            Jmax = Number(individuo[count-1][1]) + 1;
        }

        //Salvando o novo gene criado ao final do array
        individuo.push(geraGene(Imax, Imin, Jmax, Jmin));
    }
    return individuo;
}

function geraPopulacao(popTamanho){
    let populacao = [];

    for(let count = 0; count < popTamanho; count++){
        populacao.push(geraIndividuo());
    }
    return populacao;
}

function calculaFitness(inicio, destino, populacao){
    let popFitness = [];
    
    for(let count = 0; count <populacao.length; count++){
        let individuo = populacao[count];

        //DEVERIA RETORNAR A POSIÇÃO NO ARRAY ONDE O INICIO E O FIM APARECEM
        let pontoInicial = (individuo).indexOf(inicio);//NÃO TÁ FUNCIONANDO
        let pontoFinal = (individuo).indexOf(destino);//NÃO TÁ FUNCIONANDO

        if(pontoInicial === (-1) || pontoFinal === (-1)){//indexOf retorna -1 quanndo o elemento não existe
            popFitness[count] = -100;
        } else {
            //Calcula o fitness -> distancia entre o ponto inicial e o destino
            popFitness[count] = 100/(pontoFinal - pontoInicial);//podia ser 1 ao inves de 100, mas os numeros ficariam muito proximos e quebrados

            //verifica se o destino veio antes do inicio e corrige
            if(popFitness[count] < 0){
                populacao[count].reverse();//inverte o individuo para corrigir
                popFitness[count] = popFitness[count] * (-1);//deixa o fitness positivo
            }
        }
    }
    //Implementar o "reorganizar array" para ficar em ordem crescente de fitness
    return popFitness;
}
//Seleção pelo metodo da roleta
function selecao(populacao, popFitness){
    let somaFitness = 0;
    let selecionados = [];

    for(let count = 0; count < popFitness.length; count++){
        somaFitness += popFitness[count];
    }

    for (count = 0; count < popFitness.length; count++){
        let posicaoSelecionado = Math.floor(Math.random() * (somaFitness + 1));
        let aux = 0; 
        let posicao = 0;

        while(aux < posicaoSelecionado){
            selecionados[count] = populacao[posicao];
            aux += popFitness[posicao];
            posicao++;
        }
    }
    return selecionados;    
}

//let inicio = [0,0];
//let destino = [2,2];
let populacao = geraPopulacao(10);
let popFitness = [1,1,1,2,3,3,4,4,5,10];//Para Testar se a seleção está funcionando
console.log(selecao(populacao, popFitness));



