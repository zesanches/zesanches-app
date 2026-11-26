---
title: "O checklist que sumia sem internet"
date: "2026-11-26"
excerpt: "A última etapa estava salva no aparelho, mas a tela esperava a API para mostrar a pendência. O que esse bug ensinou sobre filas locais, tentativas de envio e testes em modo avião."
tags: ["React Native", "Mobile", "Offline", "Sincronização"]
author: "José Sanches"
---

O operador preencheu duas das três etapas de um checklist de inspeção com internet. Desligou o Wi-Fi e os dados móveis, respondeu à terceira etapa e tocou em **Finalizar etapa**. O app voltou para a lista de agendamentos sem aviso. O cartão continuava disponível para abrir e, quando ele voltou ao checklist, a última etapa apareceu em branco. A conexão voltou e o checklist continuou sem ser enviado.

Naquele roteiro, o problema se repetia toda vez. A regra do produto era que a falta de internet jamais poderia fazer o operador perder uma inspeção. Fomos olhar a fila gravada no aparelho. A terceira etapa estava lá, com as respostas. A tela dava ao operador bons motivos para começar de novo, mesmo depois de o app já ter guardado seu trabalho.

Num pátio, num galpão metálico ou numa doca, ficar sem rede faz parte do turno. Refazer vinte minutos de inspeção custa tempo e pode deixar lacunas no registro de uma operação. Para um app de campo, preservar o trabalho inclui mostrar onde ele ficou e o que falta para chegar ao servidor.

## Quanto do app precisa funcionar offline?

A resposta depende do que o usuário precisa terminar no local. Consultar a última lista baixada já resolve alguns fluxos. Uma inspeção exige registrar respostas, fotos e, às vezes, assinaturas. Dá para pensar nesses níveis como uma escala de decisões de produto.

| Suporte | O que funciona sem rede |
| --- | --- |
| Online-only | Operações que exigem comunicação em tempo real ficam indisponíveis. |
| Cache de leitura | O usuário consulta a última cópia baixada. |
| Tolerante a offline | O usuário faz alterações, e uma fila persistida guarda o que precisa ser enviado. |
| Offline-first | A aplicação lê do banco local, e a sincronização atualiza essa fonte de dados. |
| Local-first | O usuário mantém controle sobre os dados e pode trabalhar em suas cópias locais. Estratégias como CRDTs podem ajudar a reconciliar edições colaborativas. |

Nosso app estava no terceiro nível. O operador conseguia registrar uma etapa sem rede quando já estava no fluxo. A correção trouxe um princípio do quarto nível para a tela de agendamentos. O estado de envio passou a acompanhar a fila no aparelho. [Guia offline-first do Android](https://developer.android.com/topic/architecture/data-layer/offline-first) · [Local-first software, Ink & Switch](https://www.inkandswitch.com/essay/local-first/)

## O caminho entre a etapa finalizada e o servidor

Cada etapa finalizada entrava numa fila de saída (*outbox*) no Redux. O redux-persist gravava a fila no AsyncStorage. O operador iniciava o envio pelo botão **Realizar upload**, e o app percorria os itens um a um. Cada falha era tratada no próprio item, que continuava disponível para outra tentativa enquanto o restante da fila seguia. [Documentação do redux-persist](https://github.com/endograph/redux-persist)

```text
Finalizar etapa → fila Redux → AsyncStorage
                                  ↓
                      Operador toca em “Realizar upload”
                                  ↓
                          Enviar respostas
                                  ↓
                     Gravar checkpoint no aparelho
                                  ↓
                        Enviar fotos em lotes
                                  ↓
                     Servidor confirma a conclusão
                                  ↓
                            Remover da fila
```

Para uma fila pequena, guardar dados estruturados como JSON em um armazenamento chave-valor é uma opção simples. O volume serializado importa porque, nesse desenho, atualizar a fila significa regravar seu JSON. Quando a aplicação precisa consultar muitos registros, usar índices ou sincronizar só o que mudou, SQLite passa a fazer mais sentido. A equipe também assume o trabalho de migrar o esquema entre versões do app.

No checklist, as fotos ficavam em arquivos no aparelho e a fila guardava só os caminhos. A compressão e o envio em lotes via multipart aconteciam na hora do upload. Os arquivos precisam continuar disponíveis enquanto houver uma tentativa pendente. As credenciais de sessão tinham proteção fornecida pelo Android Keystore. Em iOS, o Keychain cumpre esse papel para segredos da aplicação. Respostas, fotos e assinaturas também precisam ser avaliadas pela sensibilidade dos dados que ficam no dispositivo. [OWASP MASVS, armazenamento seguro](https://mas.owasp.org/MASVS/controls/MASVS-STORAGE-1/)

### Quando as respostas chegam e as fotos falham

Se a rede cair durante o envio das fotos, a próxima tentativa pode começar por elas. O checkpoint indica que as respostas já foram confirmadas. Num bug anterior, o app consultava esse checkpoint em vários lugares, mas o fluxo de envio nunca o gravava. Cada tentativa reenviava as mesmas respostas, recebia um HTTP 422 e falhava antes de chegar às fotos.

Ainda existe uma janela entre o servidor aceitar uma operação e o aparelho receber a confirmação. Se a confirmação se perder, o checkpoint local sozinho deixa o app sem saber se é seguro repetir. Quando a API oferece idempotência, o cliente pode reutilizar a mesma chave para a mesma operação, e o servidor pode reconhecer a repetição. Já um conflito real precisa de uma decisão explícita. Se o servidor confirmar que aquele item já foi concluído, a fila pode avançar. Se houver uma edição incompatível, a interface precisa mostrar a recusa e preservar o que for necessário para resolver o conflito. Um `422` genérico, por si só, não diz em qual caso você está. [Requisições idempotentes, Stripe](https://docs.stripe.com/api/idempotent_requests)

## Por que a lista mostrava uma etapa em branco?

A janela **Checklists pendentes**, o marcador **Aguardando sincronização** e o bloqueio do cartão liam uma cópia da fila mantida na tela. Para atualizar essa cópia, a tela dependia de a lista de agendamentos da API mudar. No modo avião, a etapa entrava na fila e nada disparava a atualização do cartão.

| Momento | O que o operador via | O que estava no aparelho |
| --- | --- | --- |
| Finalizou a terceira etapa | A lista de agendamentos, sem aviso | A etapa estava registrada na fila. |
| Abriu o cartão de novo | A terceira etapa em branco | As respostas seguiam guardadas. |
| Recuperou a conexão | Nenhuma indicação de que precisava enviar | A etapa aguardava o upload manual. |

Outros detalhes mantinham o erro em pé. O fallback da lista procurava `schedule`, enquanto a gravação usava `Schedule`. Quando a rotina chegava a ler a fila, ela decidia se abria a janela usando o estado anterior a `setState`. Na abertura sem rede, a rotina também podia rodar antes de os filtros da tela estarem prontos. Com internet, a chegada dos agendamentos disparava outra leitura e podia mascarar esses problemas.

O modo avião revelou ainda uma falha em outro ponto do fluxo. Nas etapas que exigiam assinatura, a WebView baixava `signature_pad` de uma CDN. Sem o script, o quadro não desenhava e tocar em **Assinar** não fazia nada. O caso da etapa salva mostrava um problema na projeção da fila. O da assinatura mostrava que, em algumas etapas, o operador sequer conseguia terminar de preencher o checklist.

## O que mudou no hotfix

### A atualização passou a acompanhar a fila

A rotina que cruza pendências e agendamentos passou a reagir à fila persistida, à lista disponível e aos filtros da tela. O cartão acompanha a etapa finalizada assim que ela entra no Redux, e a rotina pode rodar de novo quando os filtros ficam prontos. Neste exemplo simplificado, a janela e o cartão derivam da mesma fila.

```ts
const pending = useAppSelector(selectAnsweredSchedules)
const hasPending = (pending?.length ?? 0) > 0
const awaitingSync =
  pending?.some(item => item.scheduleId === scheduleId) ?? false
```

### A janela passou a usar a fila recém-lida

O fallback só lê do disco se o Redux ainda não tem a fila. A mesma leitura também serve para decidir se há pendências. Assim, a decisão independe de quando o React vai aplicar a atualização de estado.

```ts
const resolved = answeredSchedules ?? (await readPendingFromDisk())
setPendingSchedules(resolved ?? [])
setPendingModalOpen((resolved?.length ?? 0) > 0)
```

No Redux, **`null` significa “ainda não lido do disco”** e **`[]` significa “lido e vazio”**. Quando o último envio é confirmado, `[]` é uma resposta válida. Tratar fila vazia como falta de dados pode fazer uma leitura do disco recuperar uma cópia antiga de um item já enviado.

### A falha de rede ganhou uma mensagem

Se a busca de agendamentos falha sem resposta HTTP e há trabalho na fila, o app avisa que o checklist ficou salvo no aparelho. Uma requisição sem resposta pode indicar modo avião, portal cativo, timeout ou servidor inacessível. A mensagem usada no hotfix fala em falta de internet. A aplicação consegue afirmar que ficou sem resposta do servidor e que a etapa continua guardada. [Tratamento de erros no Axios](https://axios.rest/pages/advanced/error-handling)

```ts
const toastId = 'schedules-offline-pending'

if (!hasHttpResponse(error) && hasPending && !toast.isOpen(toastId)) {
  toast.show(
    'Sem conexão com a internet. O checklist foi salvo no aparelho e poderá ser enviado quando a conexão voltar.',
    { id: toastId, type: 'warning' },
  )
}
```

Na biblioteca usada pelo app, repetir `show` com o mesmo `id` abria outro aviso. A verificação com `isOpen` evita a duplicação enquanto o primeiro toast está visível. Depois que ele fecha, é o marcador no cartão que continua informando a pendência. Em um fluxo de sincronização completo, vale distinguir também **enviando**, **enviado** e **falhou, tente novamente**.

### A assinatura passou a carregar do próprio app

Embutimos no HTML da WebView o mesmo `signature_pad` 1.5.3 que já era usado, com o cabeçalho da licença MIT preservado. Conferimos o `sha512` do pacote oficial no npm e comparamos o script com o que a CDN servia, byte a byte. Como o conteúdo iria dentro de uma template string e de uma tag `<script>`, também verificamos sequências como `</script`, crases e `${`. O bundle ganhou cerca de 6 KB, e atualizar a biblioteca passou a exigir uma alteração explícita no app. [Repositório do Signature Pad](https://github.com/szimek/signature_pad)

```diff
- <script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.5.3/signature_pad.min.js"></script>
+ <script>${SIGNATURE_PAD_SCRIPT}</script>
```

## O que o modo avião verificou

Escrevemos cinco cenários automatizados para a lista. Três falhavam antes da correção porque a janela de pendências ou o toast não apareciam. Os outros cobriam os caminhos online e offline com fila vazia. Para a assinatura, um teste verifica se o HTML gerado traz algum `src` ou `href` com `http(s)`. Outro executa o script embutido com `vm.runInNewContext` e verifica se ele define o construtor `SignaturePad`.

No emulador em modo avião, preenchemos um checklist com as assinaturas do fiscal e do motorista. Depois de reconectar, iniciamos o upload e conferimos as duas assinaturas no PDF gerado pelo servidor. Esse teste passou pelo desenho na WebView, pela finalização offline e pelo envio posterior da etapa.

Em um build de desenvolvimento do React Native, desligar a rede também pode cortar a conexão com o Metro. No Android, usamos `adb reverse tcp:8081 tcp:8081` e apontamos o app para `localhost:8081`. O ADB encaminha a porta pelo próprio transporte, como USB ou a conexão local do emulador. O app pôde carregar o bundle com a rede do aparelho desligada. [React Native, execução no dispositivo](https://reactnative.dev/docs/running-on-device#method-1-using-adb-reverse-recommended)

## O que ficou para depois

O hotfix coube no app, sem dependência nova ou alteração no contrato da API. O envio continuou manual. Ao voltar à tela ou atualizar a lista, o operador encontra a pendência e pode iniciar o upload. Um listener do NetInfo poderia disparar uma tentativa na reconexão. Para trabalho persistente em segundo plano, há o WorkManager no Android e o BackgroundTasks no iOS, com execução sujeita às condições do sistema. Em qualquer dessas opções, o resultado da requisição ainda determina se o envio foi confirmado. [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo) · [WorkManager](https://developer.android.com/develop/background-work/background-tasks/persistent) · [BackgroundTasks](https://developer.apple.com/documentation/backgroundtasks)

A lista inicial de plantas ainda precisa da rede. Se alguém reabrir o app offline, a fila continua no aparelho, mas essa tela pode impedir que o operador chegue aos agendamentos. A divergência entre `schedule` e `Schedule` ficou registrada como dívida, e os dados de inspeção continuam no armazenamento comum, sem criptografia pela aplicação. O que resolvemos foi a visibilidade da etapa já salva e a assinatura dentro do fluxo de inspeção.

## Checklist para testar no seu app

- [ ] O usuário consegue abrir e completar o fluxo necessário em modo avião, inclusive depois de fechar e reabrir o app?
- [ ] A interface mostra a pendência a partir do estado local e diferencia fila ainda não carregada de fila vazia?
- [ ] Uma confirmação do servidor é necessária para remover um item concluído da fila?
- [ ] O checkpoint permite retomar um envio interrompido? O servidor reconhece uma repetição se a confirmação se perder?
- [ ] Um item com falha deixa o restante do lote seguir? Recusas definitivas saem do ciclo de tentativas e ficam visíveis para resolução?
- [ ] O estado guarda só o caminho da mídia, e os arquivos sobrevivem até o fim do envio?
- [ ] WebViews, fontes, mapas e imagens essenciais funcionam sem requisições externas? Há um teste que detecta a volta de uma dependência remota?
- [ ] As credenciais usam armazenamento seguro, e respostas, fotos e assinaturas recebem a proteção adequada?
- [ ] A mensagem explica o que aconteceu, o que foi preservado e como concluir o envio?

**Salvar o dado offline é a parte fácil. O difícil é o app continuar dizendo a verdade sobre esse dado enquanto está sem rede.**
