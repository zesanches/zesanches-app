---
title: "Como validei a migração de um painel Next.js, dos testes à cor de uma tabela"
date: "2026-11-16"
excerpt: "Em três dias úteis, o yarn audit passou de 405 vulnerabilidades para 21. Já para descobrir por que o cabeçalho de uma tabela tinha escurecido, precisei colocar duas versões da aplicação lado a lado."
tags: ["Next.js", "React", "Tailwind CSS", "Cypress"]
author: "José Sanches"
---

A tabela continuava exibindo os mesmos dados, na mesma ordem. Só o cabeçalho parecia um pouco mais escuro. Se você escrevesse um teste no Cypress para conferir o conteúdo de cada célula, ele passaria nas duas versões. Então como descobrir qual regra de CSS mudou a cor?

Essa pergunta apareceu enquanto eu atualizava um painel de agendamento de cargas e checklists. O `yarn audit` tinha encontrado **405 vulnerabilidades, das quais 8 eram críticas e 208 eram altas**. Boa parte vinha de pacotes instalados por outras bibliotecas. Entre 12 e 16 de novembro, dividi a migração em sete commits. Rodar o build e os testes a cada etapa me dava um ponto de comparação quando algo mudava.

## 1. Em que ordem atualizar?

Comecei atualizando o Node de 20 para 24 LTS no Docker e no CI. Para levar o Cypress de 14 para 16, eu precisava de um runtime mais recente. Fazia sentido preparar o ambiente antes de atualizar a suíte que ia validar o restante. O projeto também tinha dois arquivos descrevendo a árvore de dependências. Como a instalação usava Yarn, removi o `package-lock.json` e mantive o `yarn.lock` como referência.

O próximo passo foi o Next.js 15 → 16. Com o Turbopack, um import que o webpack tolerava passou a impedir o build. Seguir esse import me levou à página pública de termos de uso e privacidade. Ela consultava a API errada desde maio. A troca de compilador acabou revelando um bug que já estava em produção.

O React 18 → 19 tinha outro pré-requisito. O painel usava `react-input-mask`, incompatível com a nova versão, e uma das máscaras vinha do backend. Trocar a biblioteca exigia preservar a sintaxe que o servidor já enviava. Encapsulei a conversão em um componente `MaskedInput` com `use-mask-input` e acrescentei oito testes para a troca. Com isso, os formulários puderam continuar recebendo as mesmas máscaras.

## 2. Quem ganha quando duas regras de CSS disputam o mesmo campo?

O Tailwind 3 → 4 e o Mantine 5 → 9 precisavam ser pensados juntos. O Mantine 5 gerava estilos em tempo de execução com o Emotion. Já o CSS estático do Mantine 9 e as classes do Tailwind 4 podiam ser organizados em **camadas da cascata** (`@layer`). Entre regras normais de uma mesma folha de estilos, o navegador compara a prioridade das camadas antes da especificidade dos seletores.

Isso apareceu nos formulários. Os estilos de `@tailwindcss/forms` acabavam em `utilities` e sobrescreviam campos que já tínhamos personalizado. Removi o plugin e trouxe seu CSS para a camada `components`. Assim, o estilo padrão do campo voltava a poder ser ajustado por uma classe utilitária aplicada àquele input.

A ferramenta de migração do Tailwind atualizou 51 componentes. No arquivo central, porém, havia 753 linhas e cerca de 150 usos de `@apply`. A conversão gerou seletores inválidos. Migrei esse arquivo à mão e, nas tabelas, troquei os seletores que dependiam dos hashes do Emotion pelas classes estáveis `mantine-datatable-*`.

## 3. O que os pixels mostraram?

Usei dois **Git worktrees** para rodar a versão de referência e a migração em diretórios separados. A cada etapa, comparei capturas das mesmas telas com `pixelmatch`. A amostra cobria 23 telas, com verificações em tema claro, tema escuro e viewport mobile.

Na tabela do início do artigo, a diferença ocupava toda a faixa do cabeçalho. A cor translúcida da célula (`th`) estava sendo pintada sobre outro fundo na linha (`tr`). A sobreposição escurecia o resultado. O ajuste coube em uma regra.

```css
thead tr {
  background: inherit;
}
```

Com a linha herdando o fundo do cabeçalho, as telas administrativas com tabela chegaram a **0,00% de diferença**. Na amostra inteira, a maior diferença final foi de 0,22% dos pixels, restrita à suavização das letras e às barras de rolagem.

## 4. Como ler o resultado dos testes?

| Verificação | Antes | Depois |
| --- | --- | --- |
| Vulnerabilidades no `yarn audit` | 405 | 21 (18 moderadas e 3 baixas) |
| Testes de componente passando | 118 de 118 | 126 de 126 |
| Testes de ponta a ponta passando | 69 de 75 | 70 de 75 |

As oito verificações novas eram da máscara. As cinco falhas restantes de ponta a ponta já existiam na referência. Uma delas esperava encontrar um link de redefinição de senha que tinha mudado. Outras usavam dados de teste incompletos e expunham um acesso a `null` ao responder um checklist.

Também restabeleci a análise do SonarQube no CI depois de 13 meses. O job precisava aguardar o Cypress para encontrar o artefato de testes. Com a análise rodando, corrigi os 11 apontamentos. O **Quality Gate** continuava reprovando por duplicação, cobertura ausente no código novo e itens de segurança pendentes de revisão.

## Conclusão

Ao fim dos três dias úteis, a auditoria registrava **95% menos vulnerabilidades**, com zero críticas e zero altas. Antes do merge, ainda faltavam a homologação e a confirmação dos navegadores usados pelos clientes. Uma captura em viewport mobile diz bastante sobre o layout, mas quem acessa o painel por um iPad antigo também depende da versão do Safari instalada nele.

O hábito que levo dessa migração é guardar uma referência antes do primeiro upgrade. Quando o Cypress falhava nas duas versões, eu conseguia reproduzir o problema no código antigo. Quando só o cabeçalho mudava de cor, eu sabia até qual linha da tabela inspecionar.

---

**Fontes**

- Relatório técnico da migração, 16 de novembro de 2026. Origem das medições e dos resultados deste estudo de caso.
- Tailwind CSS. [Guia de migração para a versão 4](https://tailwindcss.com/docs/upgrade-guide).
- W3C. [CSS Cascading and Inheritance Level 5 — Cascade Layers](https://www.w3.org/TR/css-cascade-5/#layering).
