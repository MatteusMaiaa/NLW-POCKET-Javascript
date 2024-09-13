const { select, input , checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao ep de Metas!"

let metas 

const carregarMetas = async () => {
    try{
        const dados = await FileSystem.redFile("Metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json",JSON.stringify(metas, null,2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return 
    } 

    metas.push({
        value: meta ,
        checked: false
    })

    mensagem = "Meta cadastrada com sucesso!"

}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "não exitem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices:[...metas],
        instructions:false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "nenhuma meta selecionada!"
        return 
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {  //ele vai procurar a primeira meta de metas , se for diferente ele vai para a segunda meta e assim por diante
            return m.value == resposta    // se a meta m.value for igual o checked eh valido.
        })
        
        meta.checked = true
    })

   mensagem = 'Metas Marcadas como concluidas'
}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "não exitem metas!"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0){
        mensagem = "não existe metas realizadas! :( "
        return
    }

    await select({
        message: "Metas realizadas",
        choices: [...realizadas]
    })

}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "não exitem metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    if(abertas.length == 0) {
        mensagem = "não existem metas abertas! :) "
        return
    }

    await select({
        message: "Metas abertas",
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "não exitem metas!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    const itemsADeletar = await checkbox({
        message: "Selecione um item para deletar",
        choices:[...metasDesmarcadas],
        instructions:false,
    })

    if(itemsADeletar.length == 0) {
        mensagem = "nenhum item para deletar!"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

       mensagem = "Meta(s) deletada(s) com sucesso! "
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start =  async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()
        

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas Abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }

            ]
        })




        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()    
                break
            case "abertas":
                await metasAbertas()    
                break 
            case "deletar":
                await deletarMetas()    
                break       
            case "sair":
                console.log("Ate a proxima !")
                return

        }
    }
}

    start()