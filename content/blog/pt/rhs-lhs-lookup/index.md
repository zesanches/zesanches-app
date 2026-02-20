---
title: "RHS e LHS Lookup: Como o JavaScript Realmente Encontra Suas Variáveis"
date: "2026-02-19"
excerpt: "Você já se perguntou o que acontece nos bastidores quando o JavaScript encontra uma variável no seu código? As buscas LHS e RHS são o mecanismo invisível que decide entre atribuir um valor ou recuperá-lo — e entender isso muda a forma como você lê erros."
tags: ["JavaScript", "Scope", "Engine", "YDKJS"]
author: "José Sanches"
---

Quando escrevemos `var a = 2`, parece uma única operação. Mas por baixo do capô, o motor JavaScript executa **duas operações distintas**: uma de atribuição e outra de busca. Essa distinção é o coração do que Kyle Simpson chama de **LHS Lookup** e **RHS Lookup** no livro *You Don't Know JS: Scope & Closures*.

Entender esse mecanismo é fundamental para decifrar erros como `ReferenceError` e `TypeError`, e para realmente compreender como o escopo funciona em JavaScript.

## O que significam LHS e RHS?

Os termos vêm de **Left-Hand Side** (lado esquerdo) e **Right-Hand Side** (lado direito) de uma operação de atribuição, mas o conceito vai além da posição literal no código.

**LHS Lookup (Left-Hand Side):** ocorre quando o motor precisa encontrar o **contêiner** da variável para **atribuir** um valor a ela. A pergunta que a engine faz é: *"Quem é o alvo desta atribuição?"*

**RHS Lookup (Right-Hand Side):** ocorre quando o motor precisa **recuperar o valor** de uma variável. A pergunta é: *"Qual é o valor armazenado aqui?"*

Como Simpson coloca de forma mais precisa, pense em LHS como **"quem é o alvo da atribuição"** e RHS como **"quem é a fonte do valor"**.

## Exemplo prático: dissecando uma linha de código

Considere o seguinte:

```js
var a = 2;
```

Aqui acontecem duas coisas em fases diferentes:

1. **Fase de Compilação:** o compilador declara a variável `a` no escopo atual (se ela ainda não existir).
2. **Fase de Execução:** o motor faz uma **busca LHS** por `a` para atribuir o valor `2` a ela.

Não existe busca RHS nessa linha porque ninguém está tentando *ler* o valor de `a` — apenas *escrever* nela.

Agora veja este exemplo mais completo:

```js
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo(2);
```

Vamos mapear todas as buscas:

**Buscas LHS (atribuições):**
- `c = ...` → LHS para `c`
- `a = 2` → LHS para `a` (atribuição implícita do parâmetro)
- `b = ...` → LHS para `b`

**Buscas RHS (recuperação de valores):**
- `foo(2)` → RHS para `foo` (precisa do valor/referência da função)
- `= a` → RHS para `a` (precisa do valor de `a` para atribuir a `b`)
- `a + b` → RHS para `a` e RHS para `b`

No total: **3 buscas LHS** e **4 buscas RHS**.

## Por que isso importa? O comportamento dos erros

A distinção entre LHS e RHS não é apenas teórica. Ela determina **que tipo de erro** o JavaScript lança quando algo dá errado.

### RHS que falha: ReferenceError

Quando uma busca RHS não encontra a variável em nenhum escopo aninhado, o motor lança um `ReferenceError`:

```js
function bar() {
  console.log(x); // RHS por 'x'
}
bar(); // ReferenceError: x is not defined
```

O motor procurou o **valor** de `x`, subiu por todos os escopos até o global e não encontrou. Resultado: erro.

### LHS que falha: comportamento traiçoeiro (modo não-estrito)

Quando uma busca LHS falha em modo não-estrito, o JavaScript **não lança um erro**. Em vez disso, o escopo global "gentilmente" cria a variável para você:

```js
function bar() {
  x = 10; // LHS por 'x' — não declarada em lugar nenhum
}
bar();
console.log(x); // 10 — variável global criada automaticamente!
```

Esse é um dos comportamentos mais perigosos do JavaScript. Uma simples falta de `var`, `let` ou `const` pode poluir o escopo global silenciosamente.

### Strict Mode ao resgate

No modo estrito (`"use strict"`), tanto LHS quanto RHS lançam `ReferenceError` quando a variável não é encontrada:

```js
"use strict";
function bar() {
  x = 10; // ReferenceError: x is not defined
}
bar();
```

### RHS encontra, mas a operação é inválida: TypeError

Existe ainda o caso em que a busca RHS **encontra** a variável, mas você tenta fazer algo impossível com o valor:

```js
var a = 2;
a(); // TypeError: a is not a function
```

A busca RHS por `a` foi bem-sucedida (encontrou o valor `2`), mas tentar executar um número como função resulta em `TypeError`. A diferença é sutil e importante: `ReferenceError` está ligado à **resolução de escopo**, enquanto `TypeError` está ligado a uma **operação ilegal sobre o valor encontrado**.

## O papel do Escopo nessas buscas

As buscas LHS e RHS não acontecem no vácuo. Elas seguem a **cadeia de escopos** (scope chain):

1. O motor começa procurando no escopo local da função.
2. Se não encontra, sobe para o escopo da função que a contém.
3. Continua subindo até chegar ao escopo global.
4. Se chega ao global e não encontra, o comportamento depende do tipo de busca (LHS ou RHS) e do modo (estrito ou não).

```js
function outer() {
  var x = 10;

  function inner() {
    console.log(x); // RHS por 'x' → não acha em 'inner', sobe para 'outer', encontra!
  }

  inner();
}
outer(); // 10
```

Essa mecânica de "subir" pelos escopos é exatamente o que torna closures possíveis, mas isso é assunto para outro artigo.

## Resumo visual

| Cenário | Tipo de Busca | Falha (não-estrito) | Falha (estrito) |
|---|---|---|---|
| `a = 2` | LHS | Cria global | ReferenceError |
| `console.log(a)` | RHS | ReferenceError | ReferenceError |
| `a()` (onde `a` não é função) | RHS (sucesso) + operação inválida | TypeError | TypeError |

## Conclusão

A distinção entre LHS e RHS é um daqueles conceitos que separam quem **usa** JavaScript de quem **entende** JavaScript. Saber que o motor trata atribuição e leitura como operações fundamentalmente diferentes te dá poder para:

- Diagnosticar `ReferenceError` vs `TypeError` com precisão.
- Entender por que variáveis "vazam" para o escopo global.
- Justificar o uso de `"use strict"` com argumentos técnicos.

Como Kyle Simpson enfatiza em *You Don't Know JS*, essas são as engrenagens invisíveis que movem a linguagem. E quando você consegue enxergá-las, o JavaScript para de parecer mágico — e começa a fazer sentido.

---

**Fontes:**
- SIMPSON, Kyle. *You Don't Know JS: Scope & Closures*. O'Reilly Media. [github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)
- MDN Web Docs. *Strict mode*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- MDN Web Docs. *ReferenceError*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
