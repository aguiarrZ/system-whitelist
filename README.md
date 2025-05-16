# 🫧 Whitelist System

## 👋 Boas-vindas

**-** Olá, tudo bem? Me chamo **Aguiar** e apresento a vocês este repositório GitHub com uma **source em Node.js** para integração entre seu servidor **SA-MP** e o **Discord**.

---

## 📄 Sobre o Projeto

Este bot foi desenvolvido com **Node.js** utilizando a **Discord.js v14** e a dependência `samp-query` para gerenciar um sistema de **whitelist automatizada**.

> 🛡️ **Somente jogadores autorizados no Discord podem acessar o servidor SA-MP!**
> O sistema permite uma liberação prática e segura diretamente via Discord, garantindo controle total sobre quem entra no servidor.

---

## ⚙️ Configuração

### 📁 Arquivo `config.json`

**-** Preencha o arquivo com suas credenciais conforme o exemplo abaixo:

```json
{
  "APPToken": "TOKEN_DO_BOT",
  "IDClient": "ID_BOT",
  "IDGuild": "ID_SERVIDOR"
}
```

---

### 📦 Instalação das Dependências

**-** Execute os comandos abaixo para instalar todas as dependências necessárias:

```bash
npm install discord.js samp-query mysql2 colors
```

---

### 🔧 Integração com SA-MP (GAMEMODE)

### 📁 Arquivo `pawn.pwn`

**-** Preencha a informações dentro das aspas do define para fazer a conexão com o MySQL:

```c
#define MYSQL_HOST       "COLOQUE_AQUI" // {#} IP do banco de dados ou localhost
#define MYSQL_USER       "COLOQUE_AQUI" // {#} Usuário do MySQL
#define MYSQL_PASSWORD   "COLOQUE_AQUI" // {#} Senha do MySQL
#define MYSQL_DATABASE   "COLOQUE_AQUI" // {#} Nome do banco de dados
```

---

### 🔧 Configurar cargos/canal discord

### 📁 Arquivo `interactionAllowlist.js`

**-** Altere os ids dos cargos e canal de logs:

```js
const J_CHANNEL_LOGGER = "COLOQUE_AQUI"; // {#} Canal de logs de whitelits
const J_RULES_ID = "COLOQUE_AQUI"; // {#} Cargo que o jogador irá receber após realizar sua whitelist
const J_RULES_OLD_ID = "COLOQUE_AQUI"; // {#} Cargo que será removido do jogador após realizar sua whitelist
```

---

## 🧠 Registro de Comandos no Discord

**-** Após configurar o `config.json`, registre os comandos com o seguinte comando no terminal:

```bash
node deploy-commands.js
```
