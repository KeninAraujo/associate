# Bot de Rastreamento de Produtos da Amazon

Este bot é um script JavaScript que utiliza Puppeteer para automatizar a navegação na Amazon. Ele faz login na Amazon, navega até a página de ofertas do dia e coleta links para produtos aleatórios. Em seguida, ele visita cada um desses links de produtos, gera um link curto para o produto e coleta esses links curtos.

## Como usar

1. Clone este repositório para sua máquina local.
2. Instale as dependências com `npm install`.
3. Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais da Amazon:

EMAIL=seu_email@exemplo.com 
PASSWORD=sua_senha


4. Execute o script com `node bot.js`.

## Funcionalidades

- Faz login na Amazon com suas credenciais.
- Navega até a página de ofertas do dia.
- Coleta links para produtos aleatórios.
- Visita cada link de produto e gera um link curto para o produto.
- Coleta e retorna todos os links curtos gerados.

## Limitações

Este bot foi criado para fins educacionais e não deve ser usado para atividades que violem os Termos de Serviço da Amazon.

## Contribuições

Contribuições são bem-vindas! Por favor, faça um fork deste repositório e crie um Pull Request com suas alterações.

## Licença

Este projeto está licenciado sob a licença MIT.