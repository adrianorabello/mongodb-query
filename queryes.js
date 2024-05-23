




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
    )
  }



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