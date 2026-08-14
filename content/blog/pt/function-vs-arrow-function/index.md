---
title: "Function vs Arrow Function: A Diferença Que Vai Muito Além da Sintaxe"
date: "2026-08-14"
excerpt: "Trocar `function` por `() =>` parece só uma questão de estilo, mas muda completamente como o `this`, o `arguments` e até o `new` se comportam. Entenda o mecanismo por trás disso antes que ele quebre seu código em produção."
tags: ["JavaScript", "Funções", "This", "Fundamentos"]
author: "José Sanches"
---

Se você já copiou um método de uma classe, trocou `function` por uma arrow function "porque é mais moderno" e viu o código quebrar sem motivo aparente, você não está sozinho. Essa é uma das armadilhas mais comuns do JavaScript moderno: arrow functions e funções tradicionais parecem intercambiáveis, mas não são. A diferença não é estética — é estrutural, e mexe diretamente com como o motor do JavaScript resolve o `this`, o `arguments` e até o próprio conceito de "criar um objeto".

Entender essa diferença é a linha que separa quem usa arrow functions por hábito de quem sabe exatamente quando (e por que) usá-las.

## 1. `this`: o divisor de águas

A diferença mais importante — e a que causa mais bugs — é como cada uma resolve o `this`.

Uma **função tradicional** (declaração ou expressão) tem seu próprio binding de `this`, e esse valor é decidido **dinamicamente, no momento da chamada**, dependendo de *como* a função foi invocada (como método, como função solta, com `call`/`apply`/`bind`, etc.).

Uma **arrow function não tem `this` próprio**. Ela simplesmente captura o `this` do escopo léxico onde foi *criada* — ou seja, o `this` "de fora". Não importa como você a chame depois; isso nunca muda.

```js
const contador = {
  valor: 0,

  // function tradicional: 'this' depende de COMO é chamada
  incrementarTradicional: function () {
    setTimeout(function () {
      this.valor++; // 'this' aqui é o objeto global (ou undefined em strict mode)
      console.log(this.valor); // NaN ou erro
    }, 100);
  },

  // arrow function: 'this' é herdado do escopo onde foi definida
  incrementarArrow: function () {
    setTimeout(() => {
      this.valor++; // 'this' aqui é o mesmo 'this' de incrementarArrow: o objeto 'contador'
      console.log(this.valor); // 1
    }, 100);
  },
};

contador.incrementarTradicional();
contador.incrementarArrow();
```

Antes das arrow functions (ES2015), a solução para esse problema era guardar uma referência (`const self = this` ou `var that = this`) ou usar `.bind(this)`. A arrow function resolveu isso "de graça", porque ela nunca teve a intenção de ter seu próprio `this` — ela empresta o do contexto ao redor.

> **Nota:** Isso também significa que `call()`, `apply()` e `bind()` **não conseguem alterar** o `this` de uma arrow function. Eles até aceitam ser chamados, mas o primeiro argumento (o novo `this`) é simplesmente ignorado.

## 2. `arguments`, hoisting e a natureza da declaração

Além do `this`, existem outras três diferenças estruturais que fazem toda a diferença na prática.

**a) O objeto `arguments`**

Funções tradicionais têm acesso ao objeto array-like `arguments`, com todos os argumentos passados na chamada. Arrow functions **não têm `arguments` próprio** — se você usar `arguments` dentro de uma arrow function, o JavaScript vai procurar esse identificador no escopo externo (igual ao que acontece com o `this`).

```js
function tradicional() {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
}
tradicional(1, 2, 3);

const arrow = () => {
  console.log(arguments); // ReferenceError (ou o 'arguments' do escopo pai, se existir)
};
arrow(1, 2, 3);

// A alternativa moderna, que funciona nos dois casos:
const arrowComRest = (...args) => {
  console.log(args); // [1, 2, 3]
};
arrowComRest(1, 2, 3);
```

**b) Hoisting**

*Declarações* de função (`function nome() {}`) sofrem hoisting completo: o motor do JavaScript registra a função inteira durante a fase de compilação, então ela pode ser chamada antes de aparecer no código-fonte. Arrow functions são sempre atribuídas a uma variável (`const soma = (a, b) => a + b`), então seguem as regras de hoisting de `const`/`let`: a variável existe, mas fica na *temporal dead zone* até a linha de atribuição ser executada.

```js
saudacao(); // funciona: "Olá!" — function declaration tem hoisting completo

function saudacao() {
  console.log("Olá!");
}

despedida(); // ReferenceError: Cannot access 'despedida' before initialization

const despedida = () => {
  console.log("Tchau!");
};
```

**c) Uso como construtor**

Funções tradicionais podem ser usadas com `new` porque têm uma propriedade interna `[[Construct]]` e uma propriedade `prototype`. Arrow functions não têm nenhum dos dois — tentar usar `new` em uma arrow function lança `TypeError` imediatamente.

```js
function Pessoa(nome) {
  this.nome = nome;
}
const joao = new Pessoa("João"); // funciona

const PessoaArrow = (nome) => {
  this.nome = nome;
};
const maria = new PessoaArrow("Maria"); // TypeError: PessoaArrow is not a constructor
```

## 3. Por que isso não é "menos poderoso", é *diferente por design*

É tentador achar que arrow functions são uma versão "mais fraca" das funções tradicionais, mas a intenção da especificação ECMAScript (ECMA-262) foi resolver dois problemas específicos: sintaxe mais enxuta para funções curtas e eliminar a re-binding acidental de `this` em callbacks. Não foi criar um substituto universal.

Isso fica claro quando olhamos casos onde arrow functions **não servem**:

- **Métodos de objeto**, quando você precisa que `this` aponte para o próprio objeto.
- **Métodos de protótipo/classe** que dependem de `this` dinâmico.
- **Event listeners** no DOM onde `this` deveria ser o elemento que disparou o evento.
- **Geradores** — arrow functions não podem usar `function*`, não existe "arrow generator".

E onde elas brilham:

- **Callbacks curtos** (`array.map(x => x * 2)`), onde a concisão importa e não há `this` em jogo.
- **Preservar o `this` léxico** em métodos de classes React ou handlers assíncronos, sem precisar de `.bind(this)`.
- **Funções puramente utilitárias**, sem estado, sem contexto.

```js
class Botao {
  constructor(elemento) {
    this.cliques = 0;
    this.elemento = elemento;

    // Arrow function como class field: 'this' sempre será a instância,
    // não importa quem chame o método.
    this.elemento.addEventListener("click", () => {
      this.cliques++;
      console.log(`Cliques: ${this.cliques}`);
    });
  }
}
```

## Resumo Visual

| Característica | Função Tradicional | Arrow Function |
|---|---|---|
| **`this`** | Dinâmico — depende de como é chamada | Léxico — herda do escopo onde foi criada |
| **`arguments`** | Tem objeto `arguments` próprio | Não tem; usa `arguments` do escopo pai (ou `...rest`) |
| **Hoisting** | Declarações têm hoisting completo | Segue regras de `const`/`let` (TDZ) |
| **Uso com `new`** | Pode ser construtor | `TypeError` — nunca pode ser construtor |
| **`prototype`** | Possui | Não possui |
| **`call`/`apply`/`bind`** | Alteram o `this` | Não alteram o `this` (argumento ignorado) |
| **Generators (`function*`)** | Suportado | Não suportado |
| **Sintaxe para retorno implícito** | Não existe | `x => x * 2` retorna sem `return` explícito |

## Conclusão

A diferença entre `function` e arrow function não é uma questão de gosto ou de "código mais moderno" — é uma diferença de **mecanismo interno**. Uma decide o `this` na hora da chamada; a outra herda o `this` de onde foi escrita. Uma tem `arguments` e pode virar um construtor; a outra depende inteiramente do contexto ao redor.

Saber disso evita duas armadilhas comuns: usar arrow function onde você precisava de um `this` dinâmico (como em métodos de objeto) e usar função tradicional onde um `.bind(this)` manual só estava disfarçando a necessidade real de uma arrow function. Como destaca Kyle Simpson em *You Don't Know JS: this & Object Prototypes*, o `this` em JavaScript nunca foi sobre onde a função foi definida, mas sobre como ela foi chamada — e a arrow function é a exceção deliberada a essa regra. Entender essa exceção é entender metade dos bugs de contexto que você vai encontrar pela frente.

---

**Fontes:**
- SIMPSON, Kyle. *You Don't Know JS: this & Object Prototypes*. O'Reilly Media. [github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)
- MDN Web Docs. *Arrow function expressions*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- MDN Web Docs. *this*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- MDN Web Docs. *Functions*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- PAVLUTIN, Dmitri. *5 Differences Between Arrow and Regular Functions*. [dmitripavlutin.com](https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/)
