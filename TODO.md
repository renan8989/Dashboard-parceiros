# Gestor de parcerias — entregas

- [ ] A dashboard deve controlar a base de 98 parceiros da investida Pré-venda Lessence.
- [ ] A base da investida deve ser dividida em 34 parceiros Elite e 64 parceiros Geral.
- [ ] Na primeira fase, o contato foi enviado somente aos parceiros Elite; novos parceiros cadastrados devem assumir Elite como categoria padrão.
- [ ] O usuário deve cadastrar manualmente somente os parceiros que responderam; quem não for listado deve ser considerado automaticamente sem resposta.
- [ ] A navegação deve ser organizada por investidas, com cada nova investida representada por uma aba própria; a primeira aba deve ser Pré-venda Lessence.
- [ ] A visão geral de cada investida deve mostrar o total da base, quantos responderam, quantos ficaram sem resposta e quantos reagiram bem.
- [ ] A lista deve exibir somente os parceiros que responderam, com as colunas nome do parceiro, data do envio e como reagiu.
- [ ] A lista deve exibir a coluna Categoria imediatamente após o nome do parceiro, identificando cada contato como Elite ou Geral.
- [ ] A reação deve ser classificada manualmente apenas como Normal ou Bem, com destaque visual para Bem.
- [ ] Deve ser possível buscar, ordenar, filtrar por reação, cadastrar e editar respostas.
- [ ] Deve existir uma visualização detalhada do histórico de acompanhamento de cada parceiro.

## Nova investida — Orygem Cassiano

- [ ] Criar uma aba própria chamada Orygem Cassiano ao lado da Pré-venda Lessence, sem renomear ou excluir a investida anterior.
- [ ] Reutilizar o layout dos seis indicadores e a base atual de 98 parceiros (34 Elite e 64 Geral), com respostas, interessados e percentuais calculados somente a partir da investida selecionada.
- [ ] A nova investida começa sem respostas cadastradas e sem uma data de início presumida; não copiar respostas, históricos nem a observação de envio exclusivo aos Elite da Lessence.
- [ ] Manter Nome do parceiro e região de atuação, Categoria, Data de resposta, Como reagiu (Normal ou Interessado), busca e setas de ordenação/agrupamento, cadastro, edição e histórico nos mesmos moldes da investida anterior.
- [ ] Preservar os registros existentes no armazenamento local da Lessence; salvar separadamente os cadastros da Orygem Cassiano para que a troca de abas não misture os dados.
- [ ] Publicar a atualização no GitHub Pages já utilizado para a dashboard.
