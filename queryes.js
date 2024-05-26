




/** 
 * @TODO utlizando in
 * 
 * O operador in funciona como or
 * O operador retorna os elementos que tenham ou um ou outro atributo informado
 * */

db.pokemon.find({
  types: {
    $in: ["Fire"]
  }
})



/** 
 * @TODO $all
 * 
 * Obtem todos os elementos que possuiem todos os critérios do array informado
 */

db.pokemon.find({
  types: {
    $all: ["Flying", "Rock"]
  }
})





/**
 * @TODO multiplos parametros de busca com OR 
 * 
 * Quando utilizarmos mais de um critério na mesma sentença
 * Por padrão o mongo utiliza AND no mesmo atributo pesquisado
 * Exemplo: Defesa menor ou igual a 100 E  maior ou igual a 50
 * 
*/
db.pokemon.find({
  $or: [
    {
      defense: {
        $lte: 100,
        $gte: 50
      }
    },
    {
      hp: {
        $gte: 55
      }
    }
  ]
})




/**
 * @TODO Query para obter registrom com os seguintes critérios
 * 
 * hp 
 * defense 
 * 
 * atack
 * speed  
*/


db.pokemon.find({
  $or: [
    {
      defense: {
        $gte: 120
      },
      hp: {
        $gte: 120
      }
    },
    {
      atack: {
        $gte: 120
      },
      speed: {
        $gte: 120
      }
    }
  ]
})




/** 
 * @TODO Ordenando com sort
 * O sort utiliza o primeiro parametro para ordenar
 * caso seja igual os calores ele vai para o segundo critério informado
 * 
 * // para ordenar crecente, nome da propriedade : 1, decerescente -1 
 */

db.pokemon.find({
  $or: [
    {
      defense: {
        $gte: 120
      },
      hp: {
        $gte: 120
      }
    },
    {
      atack: {
        $gte: 120
      },
      speed: {
        $gte: 120
      }
    }
  ]
}).sort({ atack: 1, defense: -1 })


/**
 * @TODO Utilizando paginação 
 * 
 * Utilizamos o Skip para poder passar os elementos iniciais
 * Utilizamo o limit para poder informar a quantidade máxima de registros
 * 
 */

db.pokemon().find({ types: "Fire" }).sort({ attack: -1 }).skip(10).limit(10)




/**
 * @TODO Verificando se existe campo no documento
 * 
 * 
 */

db.pokemon.find({ batle_points: { $exists: true } })


/**
 * @TODO verificando dados aninhado 
 * 
 * 
 */

db.pokemon.find({ "batle_points.hp": { $exists: true } })




/**
 * @TODO Inserindo vários dados  
 * 
 * 
 */

db.pokemon().insertMany(
  [
    {
      types: ['Fire'],
      name: 'Pokemon 01 ',
      legendary: false,
      batle_points: {
        hp: 105,
        attack: 140,
        defense: 55,
        speed: 95,
        generation: 5
      }
    },
    {
      types: ['Fire'],
      name: 'Pokemon 02',
      legendary: false,
      batle_points: {
        hp: 105,
        attack: 140,
        defense: 55,
        speed: 95,
        generation: 5
      }
    }
  ]
);


/**                                                                                           @UPDATE                                                                                             */

/**
 * @TODO 
 * 
 * 
 * 
*/

db.pokemon.updateOne({ name: /^0/ }, { $set: { startsWith0: true } })

db.pokemon.updateMany({ name: /^a/ }, { $set: { startsWith0: true } })

db.pokemon.updateMany({ name: /^a/ }, { $unset: { startsWith0: true } })


/**
 * @TODO Removendo campo do documento 
 * 
 * Não importa o que eu passar como paramentro no unset, o campo sera removido
 */

db.pokemon.updateMany({ name: /^a/ }, { $unset: { startsWith0: true } })



/**
 * @TODO  Operadores incrementais
 * 
 * $inc -> incrementa
 * $mul -> multiplicar 
 * 
 */

db.pokemon.updateMany({ types: "Fire" }, { $inc: { attack: 10 } })



/**
 * @TODO  Operadores incrementais
 * 
 * $inc -> incrementa
 * $mul -> multiplicar 
 * $min -> limita o valor maximo (isso mesmo valor máximo)
 * $max -> Limita o valor minimo (isso mesmoa valor minimo)
 */

db.pokemon.updateMany({ types: "Fire" }, { $min: { attack: 1 } })


/**
 * @TODO  Data no documento
 * 
 * 
 */

db.pokemon.updateMany({ types: "Fire" }, { $currentDate: { updateAt: true } })



/**
 * @TODO Upset
 * 
 * Fazendo atualização ou inclusão na base de dados
 * SE não existir o objeto procurado o DB vai criar um novo ibjeto 
 */


db.pokemon.updateOne({ name: "Charmander" }, { $set: { attack: 190 } }, { upsert: true })


// Se o objeto não existir vai vai criar um novo objeto com os valores informados
db.pokemon.updateOne({ name: "Charmander Novo" },
  {
    $set: { attack: 190 },
    $setOnInsert: {
      defense: 400,
      hp: 500,
      speed: 300
    }
  },
  { upsert: true })



/**
 * @TODO Atualizar um elemento especifico de um array 
 * 
 * A query tem que passar o nome do campo que se deseja alterar
 * No exemplo 1 a queri altera o valor de poison para Teste
 */

db.pokemon.updateOne({ _id: 20, types: "Poison" }, { $set: { "types.$": "Teste" } });


/** Atualiza todos os elementos do array */
db.pokemon.updateOne({ _id: 20, types: "Poison" }, { $set: { "types.$[]": "Teste" } });



/** @TODO Adicionanod mais uma elemento no array */


db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: "mais uma campo"
    }
  }
)

/** Adiciona a lista de arrays dentro do elementos types do documento no final do array*/

db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: {
        $each: ["Teste 01", "Teste02", "Teste 03"]
      }
    }
  }
)

/**
 * @TODO Adicionado elemento em posição especifica dentro do array
 * 
 */

db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: {
        $each: ["Teste 01"],
        $position: 0
      }
    }
  }
)


db.pokemon.updateOne(
  {
    $set: { "grades.$[elem].mean": 100 }
  },
  {
    arrayFilters: [{ "elem.grade": { $gte: 85 } }]
  });



/**
 * @TODO  Adicionado elemento em um array caso não exista o elemento solicitado para inserir
 * 
 */

db.pokemon.updateOne(
  { _id: 20 },
  {
    $addToSet: {
      types: "Mais um campo"
    }
  }
)


/**
 * @TODO  Realizando ordenação de array de um objeto
 * 
 */

db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: {
        $each: [],
        $sort: 1
      }
    }
  }
)

/**
 * @TODO Outras formas de atualizar objeto
 * 
 */
// para atualizar o documento e devolver o documento sem a modificação realizada 
db.pokemon.findOneAndUpdate({ _id: 20 }, { $set: { using_find_one_update: true } })

// para atualizar o documento e devolver o documento com a modificação realizada 
db.pokemon.findOneAndUpdate({ _id: 20 }, { $set: { using_find_one_update: true } }, { returnNewDocument: true })

// outra forma de atualizar os dados e retornar os objeto atualizado
db.pokemon.findAndModify({ query: { _id: 20 }, update: { $set: { using_find_and_modify: false } }, new: true })


// O findAndMOdify também pode ser utilizado para remover documentos 
db.pokemon.findAndModify({ query: { _id: 2 }, remove: true })


/**
 * @TODO Slice você indica a quantidade de elementos que você quer manter no seu array 
 * Os demais elementos serão removidos
 * 
 */

db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: {
        $each: [],
        $slice: 2
      }
    }
  }
)

/** Passando com o valor negativo o slice começa de trás para frente */
db.pokemon.updateOne(
  { _id: 20 },
  {
    $push: {
      types: {
        $each: [],
        $slice: 2
      }
    }
  })



/**
 *  @TODO  Removendo elementos do array
 * O valor 1 remove o último, o valor -1 remove o primeiro 
 */

db.pokemon.updateOne({ _id: 20 }, { $pop: { types: 1 } });




/**
 *  @TODO  Removendo elementos do array
 *  Remove o que você definir atraves de uma query
 */

db.pokemon.updateOne({ _id: 20 }, { $pull: { types: "Error" } });

db.pokemon.updateOne({ _id: 20 }, { $pull: { types: { $in: ["Fly", "Poison"] } } });

// remover todos do arrays que estão em types

db.pokemon.updateOne({ _id: 20 }, { $pullAll: { types: ["Fly", "Poison"] } });



/**
 * @TODO Alterando objeto dentro do array
 * 
 * 
 */

db.pokemon.updateOne(
  { _id: 20 },
  {
    $set: {
      types: [

        { name: "Fire", bonus_point: 45, wakness: "Water" },
        { name: "Fly", bonus_point: 50, wakness: "Rock" },
        { name: "Bug", bonus_point: 14, wakness: "Chinelo" }
      ]
    }
  })

// altera um campo especifico do array encontrasto no filtro 
db.pokemon.updateOne({ _id: 20, "types.name": "Fire" }, { $set: { "types.$.bonus_point": 42 } })

db.pokemon.updateOne({ _id: 20, "types.name": "Fire" }, { $set: { "types.$.strong_against": ["Ice", "Bug", "Paison"] } })

db.pokemon.updateOne({ _id: 20, "types.name": "Fire" }, { $set: { "types.$.strong_against": ["Ice", "Paison"] } })



/**
* @TODO Ordenando objetos dentro do array 
* 
* 
*/

db.pokemon.updateOne({ _id: 20 }, { $push: { types: { $each: [], $sort: { "bonuns_point": 1 } } } })






/** 
 * @TODO explain  
 * 
 * 
 * 
 * */

// devolve os dados sobre a execução da query
db.pokemon.find({ attack: { $gte: 85 } }).explain()

db.pokemon.find({ attack: { $gte: 85 } }).explain('executionStats')



/**
 * @TODO Criando index 
 * 
 * Quando criamos um index o mongodb cria uma tabela auxiliar para obter os dados pela orndenação
 * criada no index mais rapidamente
 * 
 */

db.pokemon.createIndex({ name: 1 })

db.pokemon.createIndex({ name: 1, attack: -1 })

db.pokemon.createIndex({ attack: -1, name: 1 })

// informando o MongoDB para utilizar o index criado 

db.pokemon.find({ attack: { $gte: 85 } }).hint({ attack: 1, name: 1 }).explain('executionStats')

// dropando indexes. Informar o nome do index

db.pokemon.dropIndex("name_1_attack_-1")

// obtendo dados de arrays que possuem determinados valores, mesmo que estejam invertidos

db.domino.find({ piece: { $all: [2, 3] } })

// retorna algumas informações sobre o banco de dados selecionado
db.stats()




/**
 * @TODO Entendo a pesquisa de queires indexadas
 * 
 * @COVEREDQIERY -> é quando o mongo db consegue obter os dados do documento 
 * sem precisar acesssar o documento, pois os dados pesquisados estão no index criado
 */



/**
 * @AGRAGATE
 * 
 */

db.combats.aggregate([
  {
    $lookup: {
      from: "pokemon",
      localField: "First_pokemon",
      foreignField: "_id",
      as: "pokemon1_arr"
    },
  }, {
    $lookup: {
      from: "pokemon",
      localField: "Second_pokemon",
      foreignField: "_id",
      as: "pokemon2_arr"
    }
  },
  {
    $project: {
      _id: 0,
      Winnner: 1,
      pokemon1: {
        $arrayElementAt: ["$pokemon1_arr", 0]
      },
      pokemon2: {
        $arrayElementAt: ["$pokemon2_arr", 0]
      }
    }
  },
  {
    $project: {
      winner: {
        $cond: {
          if: { $eq: ["$Winner", "$pokemon1._id"] },
          then: "$pokemon1.name",
          else: "$pokemon2.name"
        }
      }
    }
  }
])


/**
 * @MODELO_ENTIDADE_RELACIONAMENTO
 * 
 */

/**
 * @MODELAGEM_1_X_1
 */
/**
 * Modelagem Estudante
 * Recomandado usar embebedesd document no mongodb
 */

{
  cpf: "12345678";
  nome: "João";
  cidade: "São Paulo";
  carteirinha: {
    turma: "22A";
    ra: 1245
  }
}

/**
 * @MODELAGEM_1_X_MUITOS
 * 
 */

/** @SETOR */
{
  _id: 1
  meta: 4000;
  nome: "Administrativo"
};

/** @FUNCIONARIO */

{
  _id: 1;
  salario: 9000;
  h_entrada: 8;
  cargo: "desenvolvedor";
  setor_d: 1
}


/**
 *  @RELACIONAMENTO_MUITOS_PARA_MUITOS 
 * 
 * 
 * 
*/

/** @FORNECEDOR  */
{
  _id: "f04";
  cnpj: "165486984";
  nome: "Fornecedor Legal";
  cep: "1098465";
  produto_ids: ["p16", "p21"]

}


{
  _id: "f07";
  cnpj: "98498151";
  nome: "Fornecedor Maneiro";
  cep: "198498";
  produto_ids: ["p21", "p47"]
}


/** @PRODUTO */
{
  _id: "p16";
  descricao: "Panela";
  preco: 45.50;
  fornecedor_ids: ["f04"]
}

{
  _id: "p21";
  descricao: "Prato";
  preco: 14;
  fornecedor_ids: ["f04", "f07"]
}

{
  _id: "p47";
  descricao: "Faqueiro";
  preco: 127.46;
  fornecedor_ids: ["f07"]
}


/**
 * @MUITOS_PARA_MUITOS_ATRIBUTO_NO_RELACIONAMENTO_HIBRIDO
 * 
 * 
 * 
 */

{
  _id: "f04";
  cnpj: "165486984";
  nome: "Fornecedor Legal";
  cep: "1098465";
  produtos: [
    {
      _id: "p16",
      preco: 46.5
    },
    {
      _id: "p21",
      preco: 12
    }
  ]
}

{
  _id: "f07";
  cnpj: "98498151";
  nome: "Fornecedor Maneiro";
  cep: "198498";
  produtos: [
    {
      _id: p21,
      preco: 16
    },
    {
      _id: "p47",
      preco: 127.46
    }
  ]
}


// Collection Produtos
{
  _id: p16;
  descricao: "Panela";
  fornecedores: [
    {
      _id: "f04",
      preco: 46.50
    }
  ]
}

{
  _id: "p21";
  descricao: "Prato";
  fornecedores: [
    {
      _id: "f04",
      preco: 12
    },
    {
      _id: "f07",
      preco: 16
    }
  ]
}

{
  _id: "p47";
  descricao: "Faqueiro";
  fornecedores: [
    {
      _id: "f07",
      preco: 127.46
    }
  ]
}




/**
 * @AGGREGATION_NETFLIX
 * 
 */

db.netflix.aggregate([
  {
    $match: {
      date_added: {
        $lte: ISODate("2010-01-01"),
        $gte: ISODate("2009-01-01")
      }
    }
  }
])


/**
 * @TREINANDO_AGRGREGATE
 */

db.orders.insertMany( [
  { _id: 1, cust_id: "abc1", ord_date: ISODate("2012-11-02T17:04:11.102Z"), status: "A", amount: 50 },
  { _id: 2, cust_id: "xyz1", ord_date: ISODate("2013-10-01T17:04:11.102Z"), status: "A", amount: 100 },
  { _id: 3, cust_id: "xyz1", ord_date: ISODate("2013-10-12T17:04:11.102Z"), status: "D", amount: 25 },
  { _id: 4, cust_id: "xyz1", ord_date: ISODate("2013-10-11T17:04:11.102Z"), status: "D", amount: 125 },
  { _id: 5, cust_id: "abc1", ord_date: ISODate("2013-11-12T17:04:11.102Z"), status: "A", amount: 25 }
] )


db.orders.aggregate( [
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
] )

db.orders.aggregate( [
  { $group: { _id: "$status", total: { $sum: "$amount" } } },
  { $sort: { total: 1 } }
] )