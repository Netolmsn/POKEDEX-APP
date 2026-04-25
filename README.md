# 🔴 POKÉDEX-APP

Este projeto é um aplicativo mobile desenvolvido em **React Native com Expo** como parte de um desafio técnico. O objetivo é criar uma ferramenta funcional para consulta de Pokémons, integração com mapas nativos e gerenciamento de favoritos com persistência de dados.

## 📱 Funcionalidades

O aplicativo é estruturado em três abas principais:

### 1. Lista de Pokémons
- **Consumo de API:** Dados obtidos via [PokeAPI](https://pokeapi.co/).
- **Busca e Filtro:** Pesquisa dinâmica por nome dos Pokémons carregados.
- **Paginação (Infinite Scroll):** Carregamento sob demanda para otimização de performance.
- **Interação:** Possibilidade de favoritar ou desfavoritar itens diretamente da lista.
- **Feedback visual:** Tratamento de estados de carregamento (*loading*) e erros.

### 2. Mapa Interativo
- **Geolocalização:** Identificação da posição atual do usuário em tempo real.
- **Pins Aleatórios:** Geração automática de 5 marcadores próximos à localização do usuário.
- **Auto-Zoom:** Sempre que a tela recebe foco, o aplicativo executa uma animação de zoom em um marcador aleatório.

### 3. Favoritos
- **Listagem Personalizada:** Exibição apenas dos Pokémons marcados pelo usuário.
- **Persistência Local:** Utilização de armazenamento local para garantir que os dados não sejam perdidos ao fechar o app.
- **Gestão:** Opção para remover itens da lista de favoritos de forma rápida.

## 🚀 Como executar o projeto

Certifique-se de ter o **Node.js** e o **npm** instalados. Você também precisará do aplicativo **Expo Go** no seu celular.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Netolmsn/POKEDEX-APP.git
    ```
2.  **Acesse a pasta do projeto:**
    ```bash
    cd POKEDEX-APP
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npx expo start
    ```
5.  **Teste no dispositivo:**
    Abra o aplicativo da câmera no seu iPhone 17 Pro Max e escaneie o QR Code exibido no terminal.

## 🛠️ Decisões Técnicas

* **Arquitetura:** Organização em pastas (`src/screens`, `src/contexts`, `src/services`) para separação clara de responsabilidades e facilidade de manutenção.
* **Gerenciamento de Estado:** Uso da **Context API** para gerenciar os favoritos globalmente, permitindo que as alterações na lista de Pokémons sejam refletidas instantaneamente na aba de Favoritos.
* **Persistência de Dados:** Implementação do `@react-native-async-storage/async-storage` para salvar os dados localmente no dispositivo.
* **Consumo de API:** Uso da biblioteca **Axios** com uma instância centralizada para facilitar a comunicação com a PokeAPI.
* **Navegação:** Utilização do `@react-navigation/bottom-tabs` por ser a solução mais intuitiva e performática para navegação baseada em abas.

## 👤 Autor

**Leandro Mattos Santos Neto**
Software Developer
